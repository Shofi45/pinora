-- Run after supabase/admin.sql and supabase/developer_profiles.sql.
-- Adds admin-only write access without reseeding or overwriting profile data.

begin;

alter table public.developer_profiles enable row level security;

drop policy if exists "developer_profiles_admin_manage"
  on public.developer_profiles;
create policy "developer_profiles_admin_manage"
  on public.developer_profiles
  for all
  to authenticated
  using (public.is_finora_admin())
  with check (public.is_finora_admin());

grant select, insert, update, delete
  on public.developer_profiles
  to authenticated;

commit;
