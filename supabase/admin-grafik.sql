-- Run after supabase/admin.sql in Supabase SQL Editor.
-- Adds privacy-preserving page-visit analytics and chart data for the admin dashboard.

begin;

create table if not exists public.site_visits (
  id bigint generated always as identity primary key,
  path text not null check (char_length(path) between 1 and 120),
  visitor_id text not null check (char_length(visitor_id) between 8 and 80),
  visited_at timestamptz not null default now(),
  visit_date date not null default ((now() at time zone 'Asia/Jakarta')::date)
);
create index if not exists site_visits_date_path_idx
  on public.site_visits (visit_date, path);
create index if not exists site_visits_date_visitor_idx
  on public.site_visits (visit_date, visitor_id);

alter table public.site_visits enable row level security;
revoke all on public.site_visits from public, anon, authenticated;
grant all on public.site_visits to service_role;

create or replace function public.track_visit(p_path text, p_visitor text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_path is null or p_visitor is null
    or char_length(p_path) not between 1 and 120
    or p_path !~ '^/'
    or p_path like '/admin%'
    or p_visitor !~ '^[A-Za-z0-9-]{8,80}$'
  then
    return;
  end if;

  if auth.uid() is not null and public.is_finora_admin() then
    return;
  end if;

  insert into public.site_visits (path, visitor_id)
  values (p_path, p_visitor);
end;
$$;
revoke all on function public.track_visit(text, text) from public;
grant execute on function public.track_visit(text, text) to anon, authenticated;

drop function if exists public.admin_stats();
create function public.admin_stats()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_today date := (now() at time zone 'Asia/Jakarta')::date;
  v_stats jsonb;
begin
  if auth.uid() is null or not public.is_finora_admin() then
    raise exception 'Hanya admin aktif yang dapat melihat statistik';
  end if;

  select jsonb_build_object(
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
    ),
    'visits_14d', (
      select count(*) from public.site_visits
      where visit_date between v_today - 13 and v_today
    ),
    'visitors_14d', (
      select count(distinct visitor_id) from public.site_visits
      where visit_date between v_today - 13 and v_today
    ),
    'visits_by_day', (
      select coalesce(
        jsonb_agg(
          jsonb_build_object(
            'day', to_char(day, 'YYYY-MM-DD'),
            'visits', visits,
            'visitors', visitors
          ) order by day
        ),
        '[]'::jsonb
      )
      from (
        select days.day,
          count(visits.id) as visits,
          count(distinct visits.visitor_id) as visitors
        from generate_series(
          v_today::timestamp - interval '13 days',
          v_today::timestamp,
          interval '1 day'
        ) as days(day)
        left join public.site_visits visits on visits.visit_date = days.day::date
        group by days.day
      ) as daily_visits
    ),
    'top_pages', (
      select coalesce(
        jsonb_agg(
          jsonb_build_object('path', path, 'count', count)
          order by count desc, path
        ),
        '[]'::jsonb
      )
      from (
        select path, count(*) as count
        from public.site_visits
        where visit_date between v_today - 13 and v_today
        group by path
        order by count(*) desc, path
        limit 8
      ) as popular_pages
    ),
    'tx_types', (
      select jsonb_build_object(
        'income', coalesce(sum(amount) filter (where type = 'income'), 0),
        'expense', coalesce(sum(amount) filter (where type = 'expense'), 0),
        'saving', coalesce(sum(amount) filter (where type = 'saving'), 0),
        'kebutuhan', coalesce(sum(amount) filter (where category = 'kebutuhan'), 0),
        'kemauan', coalesce(sum(amount) filter (where category = 'kemauan'), 0)
      )
      from public.transactions
    ),
    'signups_by_day', (
      select coalesce(
        jsonb_agg(jsonb_build_object('day', to_char(day, 'YYYY-MM-DD'), 'count', count) order by day),
        '[]'::jsonb
      )
      from (
        select days.day, count(profiles.user_id) as count
        from generate_series(
          v_today::timestamp - interval '13 days',
          v_today::timestamp,
          interval '1 day'
        ) as days(day)
        left join public.profiles profiles
          on (profiles.created_at at time zone 'Asia/Jakarta')::date = days.day::date
        group by days.day
      ) as daily_signups
    ),
    'tx_by_day', (
      select coalesce(
        jsonb_agg(jsonb_build_object('day', to_char(day, 'YYYY-MM-DD'), 'count', count) order by day),
        '[]'::jsonb
      )
      from (
        select days.day, count(transactions.id) as count
        from generate_series(
          v_today::timestamp - interval '13 days',
          v_today::timestamp,
          interval '1 day'
        ) as days(day)
        left join public.transactions transactions
          on (transactions.created_at at time zone 'Asia/Jakarta')::date = days.day::date
        group by days.day
      ) as daily_transactions
    ),
    'chat_by_day', (
      select coalesce(
        jsonb_agg(jsonb_build_object('day', to_char(day, 'YYYY-MM-DD'), 'count', count) order by day),
        '[]'::jsonb
      )
      from (
        select days.day, count(messages.id) as count
        from generate_series(
          v_today::timestamp - interval '13 days',
          v_today::timestamp,
          interval '1 day'
        ) as days(day)
        left join public.chat_messages messages
          on messages.role = 'user'
          and (messages.created_at at time zone 'Asia/Jakarta')::date = days.day::date
        group by days.day
      ) as daily_chat
    )
  ) into v_stats;

  return v_stats;
end;
$$;
revoke all on function public.admin_stats() from public, anon;
grant execute on function public.admin_stats() to authenticated;

commit;
