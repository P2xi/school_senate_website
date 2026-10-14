-- Mesaj merkezini mevcut kurulumlarda güvenilir ve tekrar çalıştırılabilir hale getirir.

create or replace function public.ensure_my_profile()
returns public.profiles
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  current_profile public.profiles;
  current_email text;
  current_name text;
begin
  if auth.uid() is null then
    raise exception 'Oturum açmanız gerekiyor.' using errcode = '28000';
  end if;

  select
    u.email,
    coalesce(
      nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''),
      split_part(u.email, '@', 1)
    )
  into current_email, current_name
  from auth.users u
  where u.id = auth.uid();

  if current_email is null then
    raise exception 'Kullanıcı hesabı bulunamadı.' using errcode = 'P0002';
  end if;

  insert into public.profiles (id, full_name)
  values (auth.uid(), current_name)
  on conflict (id) do update
  set full_name = case
    when trim(public.profiles.full_name) = '' then excluded.full_name
    else public.profiles.full_name
  end
  returning * into current_profile;

  return current_profile;
end;
$$;

create or replace function public.send_message(
  p_recipient_key text,
  p_subject text,
  p_body text
)
returns uuid
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  new_message_id uuid;
  current_profile public.profiles;
  current_email text;
begin
  current_profile := public.ensure_my_profile();

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

  select email into current_email from auth.users where id = auth.uid();

  insert into public.messages (
    sender_id,
    sender_name,
    sender_email,
    recipient_key,
    subject,
    body,
    status
  ) values (
    auth.uid(),
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
set search_path = public, auth, pg_temp
as $$
declare
  new_reply_id uuid;
  current_profile public.profiles;
  current_status text;
  target_inbox text;
begin
  current_profile := public.ensure_my_profile();

  if not public.can_access_message(p_message_id) then
    raise exception 'Bu konuşmayı görüntüleme yetkiniz yok.' using errcode = '42501';
  end if;

  if char_length(trim(coalesce(p_body, ''))) not between 1 and 4000 then
    raise exception 'Yanıt boş olamaz ve 4000 karakteri geçemez.' using errcode = '22023';
  end if;

  select status, recipient_key into current_status, target_inbox
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
    auth.uid(),
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

create or replace function public.change_message_status(
  p_message_id uuid,
  p_status text
)
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  target_inbox text;
begin
  if p_status not in ('new', 'in_progress', 'answered', 'closed') then
    raise exception 'Geçersiz mesaj durumu.' using errcode = '22023';
  end if;

  select recipient_key into target_inbox
  from public.messages
  where id = p_message_id;

  if target_inbox is null then
    raise exception 'Konuşma bulunamadı.' using errcode = 'P0002';
  end if;

  if not public.is_senate_member_for(target_inbox) then
    raise exception 'Bu konuşmanın durumunu değiştirme yetkiniz yok.' using errcode = '42501';
  end if;

  update public.messages
  set status = p_status
  where id = p_message_id;
end;
$$;

revoke all on function public.ensure_my_profile() from public;
revoke all on function public.send_message(text, text, text) from public;
revoke all on function public.send_message_reply(uuid, text) from public;
revoke all on function public.change_message_status(uuid, text) from public;

grant execute on function public.ensure_my_profile() to authenticated;
grant execute on function public.send_message(text, text, text) to authenticated;
grant execute on function public.send_message_reply(uuid, text) to authenticated;
grant execute on function public.change_message_status(uuid, text) to authenticated;

-- Yazma işlemleri yalnızca yukarıdaki doğrulamalı RPC'lerden yapılır.
revoke insert on public.messages from authenticated;
revoke update on public.messages from authenticated;
revoke insert on public.message_replies from authenticated;

alter table public.messages replica identity full;
alter table public.message_replies replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.messages;
exception
  when duplicate_object or undefined_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.message_replies;
exception
  when duplicate_object or undefined_object then null;
end;
$$;

comment on function public.send_message(text, text, text) is
  'Oturum sahibinin profilini doğrular ve yeni mesajı atomik olarak oluşturur.';
comment on function public.send_message_reply(uuid, text) is
  'Katılımcı yetkisini doğrular, yanıtı ekler ve senato yanıtında durumu günceller.';
