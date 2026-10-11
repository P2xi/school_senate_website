-- Eskişehir MBA Senatosu: üye profilleri ve güvenli mesajlaşma altyapısı

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'member' check (role in ('member', 'senator', 'admin')),
  inbox_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint senator_inbox_assignment check (
    (role = 'member' and inbox_key is null)
    or role = 'admin'
    or (role = 'senator' and inbox_key is not null)
  ),
  constraint valid_inbox_key check (
    inbox_key is null or inbox_key in (
      'senato-baskani',
      'teknoloji-baskani',
      'medya-iletisim-baskani',
      'proje-strateji-baskani',
      'kultur-sanat-baskani',
      'mali-isler-baskani',
      'sosyal-girisim-baskani'
    )
  )
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles (id) on delete cascade,
  sender_name text not null,
  sender_email text not null,
  recipient_key text not null check (recipient_key in (
    'senato-baskani',
    'teknoloji-baskani',
    'medya-iletisim-baskani',
    'proje-strateji-baskani',
    'kultur-sanat-baskani',
    'mali-isler-baskani',
    'sosyal-girisim-baskani'
  )),
  subject text not null check (char_length(subject) between 3 and 120),
  body text not null check (char_length(body) between 10 and 4000),
  status text not null default 'new' check (status in ('new', 'in_progress', 'answered', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.message_replies (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  author_name text not null,
  author_role text not null check (author_role in ('member', 'senator', 'admin')),
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index if not exists messages_sender_created_idx
  on public.messages (sender_id, created_at desc);
create index if not exists messages_recipient_created_idx
  on public.messages (recipient_key, created_at desc);
create index if not exists message_replies_message_created_idx
  on public.message_replies (message_id, created_at asc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists messages_set_updated_at on public.messages;
create trigger messages_set_updated_at
before update on public.messages
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Migration uygulanmadan önce açılmış hesapları da profile tablosuna ekler.
insert into public.profiles (id, full_name)
select
  id,
  coalesce(nullif(trim(raw_user_meta_data ->> 'full_name'), ''), split_part(email, '@', 1))
from auth.users
on conflict (id) do nothing;

create or replace function public.is_senate_member_for(target_inbox_key text)
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and (role = 'admin' or (role = 'senator' and inbox_key = target_inbox_key))
  );
$$;

create or replace function public.can_access_message(target_message_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select exists (
    select 1
    from public.messages
    where id = target_message_id
      and (
        sender_id = auth.uid()
        or public.is_senate_member_for(recipient_key)
      )
  );
$$;

create or replace function public.prepare_message()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  current_name text;
  current_email text;
begin
  if auth.uid() is null then
    raise exception 'Mesaj göndermek için giriş yapmalısınız.';
  end if;

  select
    coalesce(nullif(trim(p.full_name), ''), split_part(u.email, '@', 1)),
    u.email
  into current_name, current_email
  from auth.users u
  join public.profiles p on p.id = u.id
  where u.id = auth.uid();

  new.sender_id = auth.uid();
  new.sender_name = current_name;
  new.sender_email = current_email;
  new.status = 'new';
  return new;
end;
$$;

drop trigger if exists messages_prepare_insert on public.messages;
create trigger messages_prepare_insert
before insert on public.messages
for each row execute function public.prepare_message();

create or replace function public.prepare_reply()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if auth.uid() is null or not public.can_access_message(new.message_id) then
    raise exception 'Bu mesajı yanıtlama yetkiniz yok.';
  end if;

  if exists (
    select 1 from public.messages
    where id = new.message_id and status = 'closed'
  ) then
    raise exception 'Kapatılmış bir konuşma yanıtlanamaz.';
  end if;

  select id, full_name, role
  into new.author_id, new.author_name, new.author_role
  from public.profiles
  where id = auth.uid();

  return new;
end;
$$;

drop trigger if exists message_replies_prepare_insert on public.message_replies;
create trigger message_replies_prepare_insert
before insert on public.message_replies
for each row execute function public.prepare_reply();

alter table public.profiles enable row level security;
alter table public.messages enable row level security;
alter table public.message_replies enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "messages_select_participants" on public.messages;
create policy "messages_select_participants"
on public.messages for select
to authenticated
using (sender_id = auth.uid() or public.is_senate_member_for(recipient_key));

drop policy if exists "messages_insert_own" on public.messages;
create policy "messages_insert_own"
on public.messages for insert
to authenticated
with check (sender_id = auth.uid());

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
with check (author_id = auth.uid() and public.can_access_message(message_id));

revoke all on public.profiles from anon, authenticated;
revoke all on public.messages from anon, authenticated;
revoke all on public.message_replies from anon, authenticated;

grant select on public.profiles to authenticated;
grant select on public.messages to authenticated;
grant insert (recipient_key, subject, body) on public.messages to authenticated;
grant update (status) on public.messages to authenticated;
grant select on public.message_replies to authenticated;
grant insert (message_id, body) on public.message_replies to authenticated;

revoke all on function public.is_senate_member_for(text) from public;
revoke all on function public.can_access_message(uuid) from public;
grant execute on function public.is_senate_member_for(text) to authenticated;
grant execute on function public.can_access_message(uuid) to authenticated;

-- Bir senato hesabını ilgili gelen kutusuna atamak için SQL Editor'da şu kalıbı kullanın:
-- update public.profiles p
-- set role = 'senator', inbox_key = 'senato-baskani'
-- from auth.users u
-- where p.id = u.id and lower(u.email) = lower('senato-uyesi@okul.edu.tr');
