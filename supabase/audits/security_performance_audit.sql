-- Read-only production audit. Safe to run in Supabase SQL Editor.

-- 1. Every exposed table must have RLS enabled. Client grants are shown beside it.
select
  n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced,
  has_table_privilege('anon', c.oid, 'select') as anon_select,
  has_table_privilege('anon', c.oid, 'insert') as anon_insert,
  has_table_privilege('anon', c.oid, 'update') as anon_update,
  has_table_privilege('anon', c.oid, 'delete') as anon_delete,
  has_table_privilege('authenticated', c.oid, 'select') as authenticated_select,
  has_table_privilege('authenticated', c.oid, 'insert') as authenticated_insert,
  has_table_privilege('authenticated', c.oid, 'update') as authenticated_update,
  has_table_privilege('authenticated', c.oid, 'delete') as authenticated_delete
from pg_class as c
join pg_namespace as n on n.oid = c.relnamespace
where c.relkind in ('r', 'p')
  and n.nspname = 'public'
order by c.relname;

-- 2. Review every effective public-table policy and its role/operation.
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
order by tablename, cmd, policyname;

-- 3. SECURITY DEFINER functions must have a fixed search_path and explicit grants.
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  p.prosecdef as security_definer,
  p.proconfig as function_settings,
  p.proacl as acl,
  has_function_privilege('anon', p.oid, 'execute') as anon_execute,
  has_function_privilege('authenticated', p.oid, 'execute') as authenticated_execute
from pg_proc as p
join pg_namespace as n on n.oid = p.pronamespace
where n.nspname = 'public'
order by p.proname, arguments;

-- 4. Confirm the indexes used by RLS, ordering, and rolling rate limits.
select
  schemaname,
  tablename,
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in ('profiles', 'messages', 'message_replies', 'login_events')
order by tablename, indexname;

-- 5. Connection pressure by service/role and state.
select
  usename,
  application_name,
  state,
  count(*) as connection_count,
  max(now() - state_change) as longest_state_age
from pg_stat_activity
where pid <> pg_backend_pid()
group by usename, application_name, state
order by connection_count desc, usename, application_name;

-- 6. Table/index activity; high seq_scan with growing rows deserves investigation.
select
  relname as table_name,
  n_live_tup as estimated_rows,
  seq_scan,
  idx_scan,
  n_tup_ins,
  n_tup_upd,
  n_tup_del,
  last_analyze,
  last_autoanalyze
from pg_stat_user_tables
where schemaname = 'public'
order by n_live_tup desc, relname;

-- 7. Realtime should include only tables that genuinely need change events.
select
  pubname,
  schemaname,
  tablename
from pg_publication_tables
where pubname = 'supabase_realtime'
order by schemaname, tablename;
