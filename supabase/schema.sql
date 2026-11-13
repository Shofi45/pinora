-- ============================================================
-- Finora: skema database Supabase
-- Jalankan seluruh file ini di Supabase Dashboard > SQL Editor.
-- Aman dijalankan ulang (memakai IF NOT EXISTS / DROP POLICY IF EXISTS).
-- Semua tabel memakai Row Level Security: pengguna hanya bisa
-- melihat dan mengubah baris miliknya sendiri.
-- ============================================================

-- ---------- 1. Transaksi (catatan keuangan pribadi) ----------
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 120),
  amount      bigint not null check (amount > 0 and amount <= 100000000000),
  type        text not null check (type in ('income', 'expense', 'saving')),
  category    text check (category in ('kebutuhan', 'kemauan')),
  occurred_on date not null default current_date,
  created_at  timestamptz not null default now(),
  constraint category_only_for_expense check (type = 'expense' or category is null)
);
create index if not exists transactions_user_date_idx
  on public.transactions (user_id, occurred_on desc);

-- ---------- 2. Simulasi kalkulator anggaran (satu baris per pengguna) ----------
create table if not exists public.budget_simulations (
  user_id          uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  income           bigint not null default 0 check (income >= 0),
  needs            bigint not null default 0 check (needs >= 0),
  debt             bigint not null default 0 check (debt >= 0),
  home_installment bigint not null default 0 check (home_installment >= 0),
  saving           bigint not null default 0 check (saving >= 0),
  updated_at       timestamptz not null default now()
);

-- ---------- 3. Progres tantangan 7 hari (5 butir checklist) ----------
create table if not exists public.challenge_progress (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  item_index smallint not null check (item_index between 1 and 5),
  done       boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, item_index)
);

-- ---------- 4. Riwayat chat Fin AI ----------
-- Pesan ditulis oleh Edge Function `fin-ai` (service role), bukan oleh browser.
create table if not exists public.chat_messages (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null check (char_length(content) between 1 and 8000),
  created_at timestamptz not null default now()
);
create index if not exists chat_messages_user_created_idx
  on public.chat_messages (user_id, created_at desc);

-- ---------- Row Level Security ----------
alter table public.transactions       enable row level security;
alter table public.budget_simulations enable row level security;
alter table public.challenge_progress enable row level security;
alter table public.chat_messages      enable row level security;

-- transactions
drop policy if exists "transactions_select_own" on public.transactions;
drop policy if exists "transactions_insert_own" on public.transactions;
drop policy if exists "transactions_update_own" on public.transactions;
drop policy if exists "transactions_delete_own" on public.transactions;
create policy "transactions_select_own" on public.transactions for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "transactions_insert_own" on public.transactions for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "transactions_update_own" on public.transactions for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "transactions_delete_own" on public.transactions for delete to authenticated
  using ((select auth.uid()) = user_id);

-- budget_simulations
drop policy if exists "simulations_select_own" on public.budget_simulations;
drop policy if exists "simulations_insert_own" on public.budget_simulations;
drop policy if exists "simulations_update_own" on public.budget_simulations;
drop policy if exists "simulations_delete_own" on public.budget_simulations;
create policy "simulations_select_own" on public.budget_simulations for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "simulations_insert_own" on public.budget_simulations for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "simulations_update_own" on public.budget_simulations for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "simulations_delete_own" on public.budget_simulations for delete to authenticated
  using ((select auth.uid()) = user_id);

-- challenge_progress
drop policy if exists "challenge_select_own" on public.challenge_progress;
drop policy if exists "challenge_insert_own" on public.challenge_progress;
drop policy if exists "challenge_update_own" on public.challenge_progress;
drop policy if exists "challenge_delete_own" on public.challenge_progress;
create policy "challenge_select_own" on public.challenge_progress for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "challenge_insert_own" on public.challenge_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "challenge_update_own" on public.challenge_progress for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "challenge_delete_own" on public.challenge_progress for delete to authenticated
  using ((select auth.uid()) = user_id);

-- chat_messages: pengguna hanya boleh membaca dan menghapus riwayatnya sendiri
drop policy if exists "chat_select_own" on public.chat_messages;
drop policy if exists "chat_delete_own" on public.chat_messages;
create policy "chat_select_own" on public.chat_messages for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "chat_delete_own" on public.chat_messages for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ---------- Hak akses API ----------
grant select, insert, update, delete on public.transactions       to authenticated;
grant select, insert, update, delete on public.budget_simulations to authenticated;
grant select, insert, update, delete on public.challenge_progress to authenticated;
grant select, delete                 on public.chat_messages      to authenticated;
grant all on public.transactions, public.budget_simulations,
             public.challenge_progress, public.chat_messages to service_role;
