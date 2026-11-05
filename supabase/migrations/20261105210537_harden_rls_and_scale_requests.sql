-- RLS hardening and request-volume controls.
-- Keeps the public API surface small while reducing per-row policy work.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

create or replace function public.is_senate_member_for(target_inbox_key text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and (
        role = 'admin'
        or (role = 'senator' and inbox_key = target_inbox_key)
      )
  );
$$;

create or replace function public.can_access_message(target_message_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.messages
    where id = target_message_id
      and (
        sender_id = (select auth.uid())
        or public.is_senate_member_for(recipient_key)
      )
  );
$$;

revoke all on function public.is_admin() from public, anon;
revoke all on function public.is_senate_member_for(text) from public, anon;
revoke all on function public.can_access_message(uuid) from public, anon;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_senate_member_for(text) to authenticated;
grant execute on function public.can_access_message(uuid) to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (id = (select auth.uid()));

drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin"
on public.profiles for select
to authenticated
using ((select public.is_admin()));

drop policy if exists "messages_select_participants" on public.messages;
create policy "messages_select_participants"
on public.messages for select
to authenticated
using (
  sender_id = (select auth.uid())
  or public.is_senate_member_for(recipient_key)
);

drop policy if exists "messages_insert_own" on public.messages;
create policy "messages_insert_own"
on public.messages for insert
to authenticated
with check (sender_id = (select auth.uid()));

drop policy if exists "messages_update_senate" on public.messages;
create policy "messages_update_senate"
on public.messages for update
to authenticated
using (public.is_senate_member_for(recipient_key))
with check (public.is_senate_member_for(recipient_key));

drop policy if exists "replies_select_participants" on public.message_replies;
create policy "replies_select_participants"
on public.message_replies for select
to authenticated
using (public.can_access_message(message_id));

drop policy if exists "replies_insert_participants" on public.message_replies;
create policy "replies_insert_participants"
on public.message_replies for insert
to authenticated
with check (
  author_id = (select auth.uid())
  and public.can_access_message(message_id)
);

drop policy if exists "login_events_select_admin" on public.login_events;
create policy "login_events_select_admin"
on public.login_events for select
to authenticated
using ((select public.is_admin()));

-- Admin lists are ordered globally; replies are rate-checked by author and time.
create index if not exists messages_created_at_idx
  on public.messages (created_at desc);
create index if not exists message_replies_author_created_idx
  on public.message_replies (author_id, created_at desc);

-- Avoid rewriting the profile row on every message/reply RPC. This matters
-- because the updated_at trigger otherwise turns every send into an extra write.
create or replace function public.ensure_my_profile()
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_profile public.profiles;
  current_email text;
  current_name text;
begin
  if (select auth.uid()) is null then
    raise exception 'Oturum açmanız gerekiyor.' using errcode = '28000';
  end if;

  select
    u.email,
    coalesce(
      nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''),
      split_part(u.email, '@', 1)
    )
  into current_email, current_name
  from auth.users as u
  where u.id = (select auth.uid());

  if current_email is null then
    raise exception 'Kullanıcı hesabı bulunamadı.' using errcode = 'P0002';
  end if;

  insert into public.profiles (id, full_name)
  values ((select auth.uid()), current_name)
  on conflict (id) do nothing;

  update public.profiles
  set full_name = current_name
  where id = (select auth.uid())
    and trim(full_name) = '';

  select *
  into current_profile
  from public.profiles
  where id = (select auth.uid());

  return current_profile;
end;
$$;

revoke all on function public.ensure_my_profile() from public, anon;
grant execute on function public.ensure_my_profile() to authenticated;

-- Message creation remains RPC-only and is protected against accidental loops
-- and abuse. The limits are deliberately generous for a school message center.
create or replace function public.send_message(
  p_recipient_key text,
  p_subject text,
  p_body text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_message_id uuid;
  current_profile public.profiles;
  current_email text;
  recent_message_count integer;
begin
  current_profile := public.ensure_my_profile();

  -- Serialize only this user's send operations so concurrent requests cannot
  -- race past the rolling-window limit.
  perform pg_advisory_xact_lock(
    hashtextextended((select auth.uid())::text, 71101)
  );

  select count(*)::integer
  into recent_message_count
  from public.messages
  where sender_id = (select auth.uid())
    and created_at >= now() - interval '10 minutes';

  if recent_message_count >= 10 then
    raise sqlstate 'PGRST' using
      message = json_build_object(
        'code', 'message_rate_limit',
        'message', '10 dakika içinde en fazla 10 yeni mesaj gönderebilirsiniz.'
      )::text,
      detail = json_build_object(
        'status', 429,
        'headers', json_build_object('Retry-After', '600')
      )::text;
  end if;

  if p_recipient_key not in (
    'senato-baskani',
    'teknoloji-baskani',
    'medya-iletisim-baskani',
    'proje-strateji-baskani',
    'kultur-sanat-baskani',
    'mali-isler-baskani',
    'sosyal-girisim-baskani'
  ) then
    raise exception 'Geçersiz alıcı başkanlık.' using errcode = '22023';
  end if;

  if char_length(trim(coalesce(p_subject, ''))) not between 3 and 120 then
    raise exception 'Konu 3 ile 120 karakter arasında olmalıdır.' using errcode = '22023';
  end if;

  if char_length(trim(coalesce(p_body, ''))) not between 10 and 4000 then
    raise exception 'Mesaj 10 ile 4000 karakter arasında olmalıdır.' using errcode = '22023';
  end if;

  select email
  into current_email
  from auth.users
  where id = (select auth.uid());

  insert into public.messages (
    sender_id,
    sender_name,
    sender_email,
    recipient_key,
    subject,
    body,
    status
  ) values (
    (select auth.uid()),
    current_profile.full_name,
    current_email,
    p_recipient_key,
    trim(p_subject),
    trim(p_body),
    'new'
  )
  returning id into new_message_id;

  return new_message_id;
end;
$$;

create or replace function public.send_message_reply(
  p_message_id uuid,
  p_body text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_reply_id uuid;
  current_profile public.profiles;
  current_status text;
  target_inbox text;
  recent_reply_count integer;
begin
  current_profile := public.ensure_my_profile();

  perform pg_advisory_xact_lock(
    hashtextextended((select auth.uid())::text, 71102)
  );

  if not public.can_access_message(p_message_id) then
    raise exception 'Bu konuşmayı görüntüleme yetkiniz yok.' using errcode = '42501';
  end if;

  select count(*)::integer
  into recent_reply_count
  from public.message_replies
  where author_id = (select auth.uid())
    and created_at >= now() - interval '10 minutes';

  if recent_reply_count >= 30 then
    raise sqlstate 'PGRST' using
      message = json_build_object(
        'code', 'reply_rate_limit',
        'message', '10 dakika içinde en fazla 30 yanıt gönderebilirsiniz.'
      )::text,
      detail = json_build_object(
        'status', 429,
        'headers', json_build_object('Retry-After', '600')
      )::text;
  end if;

  if char_length(trim(coalesce(p_body, ''))) not between 1 and 4000 then
    raise exception 'Yanıt boş olamaz ve 4000 karakteri geçemez.' using errcode = '22023';
  end if;

  select status, recipient_key
  into current_status, target_inbox
  from public.messages
  where id = p_message_id
  for update;

  if current_status is null then
    raise exception 'Konuşma bulunamadı.' using errcode = 'P0002';
  end if;

  if current_status = 'closed' then
    raise exception 'Kapatılmış bir konuşmaya yanıt verilemez.' using errcode = '22023';
  end if;

  insert into public.message_replies (
    message_id,
    author_id,
    author_name,
    author_role,
    body
  ) values (
    p_message_id,
    (select auth.uid()),
    current_profile.full_name,
    current_profile.role,
    trim(p_body)
  )
  returning id into new_reply_id;

  if public.is_senate_member_for(target_inbox) then
    update public.messages
    set status = 'answered'
    where id = p_message_id;
  end if;

  return new_reply_id;
end;
$$;

revoke all on function public.send_message(text, text, text) from public, anon;
revoke all on function public.send_message_reply(uuid, text) from public, anon;
grant execute on function public.send_message(text, text, text) to authenticated;
grant execute on function public.send_message_reply(uuid, text) to authenticated;

-- Trigger functions do not need to be directly callable through the Data API.
revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.prepare_message() from public, anon, authenticated;
revoke all on function public.prepare_reply() from public, anon, authenticated;

comment on function public.send_message(text, text, text) is
  'Creates a validated message and limits each account to 10 new messages per 10 minutes.';
comment on function public.send_message_reply(uuid, text) is
  'Creates an authorized reply and limits each account to 30 replies per 10 minutes.';
