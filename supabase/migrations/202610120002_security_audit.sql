-- Eskişehir MBA Senatosu: başarılı oturum denetimi ve admin güvenlik görünümü

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create table if not exists public.login_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  email text not null,
  session_id text not null,
  ip_address inet,
  country_code text check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  user_agent text,
  device_type text not null default 'unknown' check (device_type in ('desktop', 'mobile', 'tablet', 'bot', 'unknown')),
  browser_name text,
  operating_system text,
  auth_provider text,
  assurance_level text,
  risk_flags text[] not null default '{}',
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint login_events_user_session_unique unique (user_id, session_id)
);

create index if not exists login_events_user_last_seen_idx
  on public.login_events (user_id, last_seen_at desc);
create index if not exists login_events_last_seen_idx
  on public.login_events (last_seen_at desc);
create index if not exists login_events_ip_idx
  on public.login_events (ip_address, last_seen_at desc);
create index if not exists login_events_risk_idx
  on public.login_events using gin (risk_flags);

alter table public.login_events enable row level security;

drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin"
on public.profiles for select
to authenticated
using (public.is_admin());

drop policy if exists "login_events_select_admin" on public.login_events;
create policy "login_events_select_admin"
on public.login_events for select
to authenticated
using (public.is_admin());

revoke all on public.login_events from anon, authenticated;
grant select on public.login_events to authenticated;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Admin panelinde özet metrikler için güvenli RPC.
create or replace function public.get_security_summary(lookback_days integer default 30)
returns table (
  successful_sessions bigint,
  unique_accounts bigint,
  unique_ips bigint,
  flagged_sessions bigint,
  last_event_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'Bu raporu görüntüleme yetkiniz yok.';
  end if;

  return query
  select
    count(*)::bigint,
    count(distinct user_id)::bigint,
    count(distinct ip_address)::bigint,
    count(*) filter (where cardinality(risk_flags) > 0)::bigint,
    max(last_seen_at)
  from public.login_events
  where last_seen_at >= now() - make_interval(days => greatest(1, least(lookback_days, 365)));
end;
$$;

revoke all on function public.get_security_summary(integer) from public;
grant execute on function public.get_security_summary(integer) to authenticated;

-- Hassas IP kayıtlarını süresiz saklamayın. Bu fonksiyon aylık olarak çalıştırılabilir.
create or replace function public.purge_old_login_events(retention_days integer default 90)
returns bigint
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  deleted_count bigint;
begin
  if not public.is_admin() then
    raise exception 'Bu işlemi gerçekleştirme yetkiniz yok.';
  end if;

  delete from public.login_events
  where last_seen_at < now() - make_interval(days => greatest(30, least(retention_days, 365)));

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.purge_old_login_events(integer) from public;
grant execute on function public.purge_old_login_events(integer) to authenticated;

comment on table public.login_events is
  'Başarılı oturumların admin-only denetim özeti. Parola, access token veya refresh token içermez.';

