-- Admin-only user activity view.
-- Auth data stays behind a SECURITY DEFINER RPC and is never exposed as a table.

create or replace function public.get_admin_user_activity()
returns table (
  user_id uuid,
  email text,
  full_name text,
  role text,
  inbox_key text,
  created_at timestamptz,
  email_confirmed_at timestamptz,
  last_sign_in_at timestamptz,
  last_login_ip inet,
  last_login_country text,
  last_device_type text,
  last_browser_name text,
  last_operating_system text,
  last_login_recorded_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Bu işlem için yönetici yetkisi gerekiyor.'
      using errcode = '42501';
  end if;

  return query
  select
    u.id as user_id,
    u.email::text as email,
    coalesce(
      nullif(trim(p.full_name), ''),
      nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''),
      split_part(coalesce(u.email, ''), '@', 1)
    )::text as full_name,
    coalesce(p.role, 'member')::text as role,
    p.inbox_key::text as inbox_key,
    u.created_at,
    u.email_confirmed_at,
    u.last_sign_in_at,
    latest_event.ip_address as last_login_ip,
    latest_event.country_code::text as last_login_country,
    latest_event.device_type::text as last_device_type,
    latest_event.browser_name::text as last_browser_name,
    latest_event.operating_system::text as last_operating_system,
    latest_event.last_seen_at as last_login_recorded_at
  from auth.users as u
  left join public.profiles as p on p.id = u.id
  left join lateral (
    select
      le.ip_address,
      le.country_code,
      le.device_type,
      le.browser_name,
      le.operating_system,
      le.last_seen_at
    from public.login_events as le
    where le.user_id = u.id
    order by le.last_seen_at desc
    limit 1
  ) as latest_event on true
  order by u.last_sign_in_at desc nulls last, u.created_at desc;
end;
$$;

revoke all on function public.get_admin_user_activity() from public;
revoke all on function public.get_admin_user_activity() from anon;
grant execute on function public.get_admin_user_activity() to authenticated;

comment on function public.get_admin_user_activity() is
  'Returns authentication and latest audit activity for admins only; never returns credentials or tokens.';
