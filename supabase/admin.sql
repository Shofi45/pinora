-- Run after supabase/schema.sql in Supabase SQL Editor.
-- Creates the profile, lesson, quiz, and base admin-statistics APIs.
-- Safe to re-run; existing profiles and content are preserved.

begin;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('user', 'admin')),
  disabled boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists role text not null default 'user';
alter table public.profiles add column if not exists disabled boolean not null default false;
alter table public.profiles add column if not exists created_at timestamptz not null default now();

create or replace function public.is_finora_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where user_id = auth.uid()
      and role = 'admin'
      and disabled = false
  );
$$;
grant execute on function public.is_finora_admin() to anon, authenticated;

create or replace function public.finora_sync_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, role, disabled, created_at)
  values (new.id, new.email, 'user', false, new.created_at)
  on conflict (user_id) do update
    set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists finora_sync_profile on auth.users;
create trigger finora_sync_profile
  after insert or update on auth.users
  for each row execute function public.finora_sync_profile();

insert into public.profiles (user_id, email, role, disabled, created_at)
select id, email, 'user', false, created_at
from auth.users
on conflict (user_id) do update set email = excluded.email;

alter table public.profiles enable row level security;
drop policy if exists "profiles_read_self_or_admin" on public.profiles;
create policy "profiles_read_self_or_admin" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = user_id or public.is_finora_admin());
grant select on public.profiles to authenticated;
grant all on public.profiles to service_role;

create or replace function public.admin_set_role(target uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not public.is_finora_admin() then
    raise exception 'Hanya admin aktif yang dapat mengubah role';
  end if;
  if new_role not in ('user', 'admin') then
    raise exception 'Role tidak valid';
  end if;
  if target = auth.uid() then
    raise exception 'Role akun sendiri tidak dapat diubah';
  end if;

  update public.profiles
  set role = new_role
  where user_id = target;
  if not found then
    raise exception 'Pengguna tidak ditemukan';
  end if;
end;
$$;
revoke all on function public.admin_set_role(uuid, text) from public, anon;
grant execute on function public.admin_set_role(uuid, text) to authenticated;

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{2,60}$'),
  title text not null check (char_length(title) between 1 and 80),
  summary text not null default '' check (char_length(summary) <= 300),
  tag text not null default '' check (char_length(tag) <= 40),
  icon text not null default 'book',
  accent text not null default 'blue',
  target text not null default 'page' check (target in ('page', 'sc-btn', 'calculate')),
  content text not null default '' check (char_length(content) <= 100000),
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  question text not null check (char_length(question) between 1 and 500),
  options jsonb not null default '[]'::jsonb check (jsonb_typeof(options) = 'array'),
  answer_index integer not null default 0 check (answer_index >= 0),
  explanation text not null default '' check (char_length(explanation) <= 1000),
  sort_order integer not null default 1,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lessons_published_order_idx
  on public.lessons (sort_order, created_at);
create index if not exists lesson_quizzes_lesson_order_idx
  on public.lesson_quizzes (lesson_id, sort_order);

alter table public.lessons enable row level security;
alter table public.lesson_quizzes enable row level security;

drop policy if exists "lessons_public_or_admin_select" on public.lessons;
drop policy if exists "lessons_admin_insert" on public.lessons;
drop policy if exists "lessons_admin_update" on public.lessons;
drop policy if exists "lessons_admin_delete" on public.lessons;
create policy "lessons_public_or_admin_select" on public.lessons
  for select to anon, authenticated
  using (published or public.is_finora_admin());
create policy "lessons_admin_insert" on public.lessons
  for insert to authenticated with check (public.is_finora_admin());
create policy "lessons_admin_update" on public.lessons
  for update to authenticated using (public.is_finora_admin())
  with check (public.is_finora_admin());
create policy "lessons_admin_delete" on public.lessons
  for delete to authenticated using (public.is_finora_admin());

drop policy if exists "lesson_quizzes_public_or_admin_select" on public.lesson_quizzes;
drop policy if exists "lesson_quizzes_admin_insert" on public.lesson_quizzes;
drop policy if exists "lesson_quizzes_admin_update" on public.lesson_quizzes;
drop policy if exists "lesson_quizzes_admin_delete" on public.lesson_quizzes;
create policy "lesson_quizzes_public_or_admin_select" on public.lesson_quizzes
  for select to anon, authenticated
  using (
    public.is_finora_admin()
    or (
      published
      and exists (
        select 1 from public.lessons
        where lessons.id = lesson_id and lessons.published
      )
    )
  );
create policy "lesson_quizzes_admin_insert" on public.lesson_quizzes
  for insert to authenticated with check (public.is_finora_admin());
create policy "lesson_quizzes_admin_update" on public.lesson_quizzes
  for update to authenticated using (public.is_finora_admin())
  with check (public.is_finora_admin());
create policy "lesson_quizzes_admin_delete" on public.lesson_quizzes
  for delete to authenticated using (public.is_finora_admin());

grant select on public.lessons, public.lesson_quizzes to anon, authenticated;
grant insert, update, delete on public.lessons, public.lesson_quizzes to authenticated;
grant all on public.lessons, public.lesson_quizzes to service_role;

drop function if exists public.admin_stats();
create function public.admin_stats()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not public.is_finora_admin() then
    raise exception 'Hanya admin aktif yang dapat melihat statistik';
  end if;

  return jsonb_build_object(
    'users', (select count(*) from public.profiles),
    'admins', (select count(*) from public.profiles where role = 'admin'),
    'disabled', (select count(*) from public.profiles where disabled),
    'new_users_7d', (
      select count(*) from public.profiles
      where created_at >= now() - interval '7 days'
    ),
    'transactions', (select count(*) from public.transactions),
    'tx_users', (select count(distinct user_id) from public.transactions),
    'simulations', (select count(*) from public.budget_simulations),
    'chat_messages', (
      select count(*) from public.chat_messages where role = 'user'
    ),
    'active_7d', (
      select count(distinct user_id) from (
        select user_id from public.transactions
        where created_at >= now() - interval '7 days'
        union
        select user_id from public.chat_messages
        where role = 'user' and created_at >= now() - interval '7 days'
        union
        select user_id from public.budget_simulations
        where updated_at >= now() - interval '7 days'
      ) as recent_activity
    ),
    'lessons', jsonb_build_object(
      'published', (select count(*) from public.lessons where published),
      'draft', (select count(*) from public.lessons where not published)
    )
  );
end;
$$;
revoke all on function public.admin_stats() from public, anon;
grant execute on function public.admin_stats() to authenticated;

commit;
