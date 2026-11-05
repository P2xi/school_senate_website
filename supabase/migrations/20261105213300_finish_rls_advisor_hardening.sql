-- Finish the non-destructive advisor hardening left outside the earlier
-- request-scaling migration. Client-facing SELECT access remains protected by
-- RLS, and validated RPCs remain available to authenticated users.

alter function public.set_updated_at() set search_path = '';

revoke all on function public.change_message_status(uuid, text) from public, anon;
revoke all on function public.get_security_summary(integer) from public, anon;
revoke all on function public.purge_old_login_events(integer) from public, anon;

grant execute on function public.change_message_status(uuid, text) to authenticated;
grant execute on function public.get_security_summary(integer) to authenticated;
grant execute on function public.purge_old_login_events(integer) to authenticated;

-- One equivalent SELECT policy avoids evaluating two permissive policies for
-- every profile row while preserving own-profile and admin access.
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_select_admin" on public.profiles;

create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using (
  id = (select auth.uid())
  or (select public.is_admin())
);
