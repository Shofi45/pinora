-- Run after supabase/schema.sql in Supabase SQL Editor.
-- Adds CMS content, public media, and private image attachments for Fin AI.

begin;

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

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(question) between 1 and 300),
  answer text not null check (char_length(answer) between 1 and 12000),
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documentation_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{2,80}$'),
  title text not null check (char_length(title) between 1 and 120),
  summary text not null default '' check (char_length(summary) <= 500),
  content text not null default '' check (char_length(content) <= 100000),
  cover_image text not null default '',
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists faq_items_published_order_idx
  on public.faq_items (sort_order, created_at);
create index if not exists documentation_pages_published_order_idx
  on public.documentation_pages (sort_order, created_at);

alter table public.faq_items enable row level security;
alter table public.documentation_pages enable row level security;
alter table public.chat_messages add column if not exists image_path text;

drop policy if exists "faq_public_or_admin_select" on public.faq_items;
drop policy if exists "faq_admin_insert" on public.faq_items;
drop policy if exists "faq_admin_update" on public.faq_items;
drop policy if exists "faq_admin_delete" on public.faq_items;
create policy "faq_public_or_admin_select" on public.faq_items
  for select to anon, authenticated
  using (published or public.is_finora_admin());
create policy "faq_admin_insert" on public.faq_items
  for insert to authenticated with check (public.is_finora_admin());
create policy "faq_admin_update" on public.faq_items
  for update to authenticated using (public.is_finora_admin())
  with check (public.is_finora_admin());
create policy "faq_admin_delete" on public.faq_items
  for delete to authenticated using (public.is_finora_admin());

drop policy if exists "documentation_public_or_admin_select" on public.documentation_pages;
drop policy if exists "documentation_admin_insert" on public.documentation_pages;
drop policy if exists "documentation_admin_update" on public.documentation_pages;
drop policy if exists "documentation_admin_delete" on public.documentation_pages;
create policy "documentation_public_or_admin_select" on public.documentation_pages
  for select to anon, authenticated
  using (published or public.is_finora_admin());
create policy "documentation_admin_insert" on public.documentation_pages
  for insert to authenticated with check (public.is_finora_admin());
create policy "documentation_admin_update" on public.documentation_pages
  for update to authenticated using (public.is_finora_admin())
  with check (public.is_finora_admin());
create policy "documentation_admin_delete" on public.documentation_pages
  for delete to authenticated using (public.is_finora_admin());

drop policy if exists "chat_admin_select" on public.chat_messages;
drop policy if exists "chat_admin_delete" on public.chat_messages;
create policy "chat_admin_select" on public.chat_messages
  for select to authenticated using (public.is_finora_admin());
create policy "chat_admin_delete" on public.chat_messages
  for delete to authenticated using (public.is_finora_admin());

grant select on public.faq_items, public.documentation_pages to anon, authenticated;
grant insert, update, delete on public.faq_items, public.documentation_pages to authenticated;
grant all on public.faq_items, public.documentation_pages to service_role;
grant select, delete on public.chat_messages to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('site-media', 'site-media', true, 5242880,
   array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('chat-attachments', 'chat-attachments', false, 5242880,
   array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "site_media_public_read" on storage.objects;
drop policy if exists "site_media_admin_insert" on storage.objects;
drop policy if exists "site_media_admin_update" on storage.objects;
drop policy if exists "site_media_admin_delete" on storage.objects;
create policy "site_media_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'site-media');
create policy "site_media_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'site-media' and public.is_finora_admin());
create policy "site_media_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'site-media' and public.is_finora_admin())
  with check (bucket_id = 'site-media' and public.is_finora_admin());
create policy "site_media_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'site-media' and public.is_finora_admin());

drop policy if exists "chat_images_owner_read" on storage.objects;
drop policy if exists "chat_images_owner_insert" on storage.objects;
drop policy if exists "chat_images_owner_delete" on storage.objects;
drop policy if exists "chat_images_admin_read" on storage.objects;
drop policy if exists "chat_images_admin_delete" on storage.objects;
create policy "chat_images_owner_read" on storage.objects
  for select to authenticated
  using (bucket_id = 'chat-attachments' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "chat_images_owner_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'chat-attachments' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "chat_images_owner_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'chat-attachments' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "chat_images_admin_read" on storage.objects
  for select to authenticated
  using (bucket_id = 'chat-attachments' and public.is_finora_admin());
create policy "chat_images_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'chat-attachments' and public.is_finora_admin());

commit;
