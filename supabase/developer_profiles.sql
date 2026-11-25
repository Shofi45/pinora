-- Run in Supabase Dashboard > SQL Editor.
-- Adds public developer profiles for the Finwise About page.

begin;

create table if not exists public.developer_profiles (
  slug            text primary key,
  full_name       text not null,
  title           text not null,
  internship_unit text not null,
  bio             text not null,
  purpose         text not null,
  focus_areas     text[] not null default '{}',
  quote           text not null,
  email           text,
  instagram       text,
  photo_path      text not null,
  sort_order      integer not null default 0,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now()
);

create index if not exists developer_profiles_published_order_idx
  on public.developer_profiles (sort_order)
  where is_published = true;

alter table public.developer_profiles enable row level security;

drop policy if exists "developer_profiles_public_select"
  on public.developer_profiles;
create policy "developer_profiles_public_select"
  on public.developer_profiles
  for select
  to anon, authenticated
  using (is_published = true);

revoke all on public.developer_profiles from public, anon, authenticated;
grant select on public.developer_profiles to anon, authenticated;
grant all on public.developer_profiles to service_role;

insert into public.developer_profiles (
  slug, full_name, title, internship_unit, bio, purpose, focus_areas,
  quote, email, instagram, photo_path, sort_order, is_published
) values
(
  'ellen-solagracia-sihite',
  'Ellen Solagracia Sihite',
  'Mahasiswa Pendidikan Akuntansi',
  'Customer Service',
  'Tertarik pada akuntansi, keuangan, dan edukasi digital. Mengembangkan website Financial Literacy sebagai media belajar pengelolaan keuangan pribadi setelah pengalaman magang di BTN Kantor Cabang Surabaya.',
  'Menghadirkan edukasi keuangan yang informatif, menarik, dan mudah dipahami agar setiap orang dapat mengelola keuangan dengan lebih bijak.',
  array['Edukasi keuangan', 'Pengelolaan keuangan pribadi', 'Pembelajaran digital'],
  'Learning, Serving, and Growing Through Every Experience',
  'ellensolagracia3@gmail.com',
  'solagraciaellen',
  'ellen-solagracia-sihite.webp',
  1,
  true
),
(
  'kisya-putri-oktavia',
  'Kisya Putri Oktavia',
  'Mahasiswa Pendidikan Akuntansi',
  'Priority Banking Unit',
  'Tertarik pada akuntansi, keuangan, dan edukasi digital. Mengembangkan website Financial Literacy sebagai media belajar pengelolaan keuangan pribadi setelah pengalaman magang di BTN Kantor Cabang Surabaya.',
  'Menghadirkan edukasi keuangan yang informatif, menarik, dan mudah dipahami agar setiap orang dapat mengelola keuangan dengan lebih bijak.',
  array['Edukasi keuangan', 'Pengelolaan keuangan pribadi', 'Pembelajaran digital'],
  'Building Financial Awareness, Creating Better Futures',
  'kisyavia@gmail.com',
  'kisya.via',
  'kisya-putri-oktavia.webp',
  2,
  true
),
(
  'ayunda-martalina',
  'Ayunda Martalina',
  'Mahasiswa Pendidikan Akuntansi',
  'Consumer Lending Unit',
  'Tertarik pada akuntansi, keuangan, dan edukasi digital. Mengembangkan website Financial Literacy sebagai media belajar pengelolaan keuangan pribadi setelah pengalaman magang di BTN Kantor Cabang Surabaya.',
  'Menghadirkan edukasi keuangan yang informatif, menarik, dan mudah dipahami agar setiap orang dapat mengelola keuangan dengan lebih bijak.',
  array['Edukasi keuangan', 'Pengelolaan keuangan pribadi', 'Pembelajaran digital'],
  'Empowering Financial Knowledge, Building a Better Future',
  'amarhila44@gmail.com',
  'ayndaam_',
  'ayunda-martalina.webp',
  3,
  true
),
(
  'nadia-zalfa-rahmatul-ulla',
  'Nadia Zalfa Rahmatul Ulla',
  'Mahasiswa Pendidikan Akuntansi',
  'Signing Officer (SO)',
  'Tertarik pada akuntansi, perbankan, dan edukasi keuangan. Menyusun materi akad kredit untuk membantu calon debitur memahami proses akad sebelum menandatangani perjanjian.',
  'Menjelaskan proses akad kredit dengan bahasa sederhana, termasuk persiapan, dokumen yang ditandatangani, serta hak dan kewajiban debitur.',
  array['Proses akad kredit', 'Peran Signing Officer', 'Hak dan kewajiban debitur'],
  'Understand Before You Sign.',
  'nadiazlf29@gmail.com',
  'nafazlf',
  'nadia-zalfa-rahmatul-ulla.webp',
  4,
  true
),
(
  'nisrina-lathif',
  'Nisrina Lathif',
  'Mahasiswa Pendidikan Akuntansi',
  'Sales Center KPR',
  'Tertarik pada akuntansi, keuangan, dan edukasi digital. Mengembangkan website Financial Literacy sebagai media belajar keuangan dan pengelolaan keuangan pribadi setelah pengalaman magang di BTN Kantor Cabang Surabaya.',
  'Menghadirkan edukasi keuangan yang informatif, menarik, dan mudah dipahami agar setiap orang dapat mengelola keuangan dengan lebih bijak.',
  array['Edukasi keuangan', 'Pengelolaan keuangan pribadi', 'Pembelajaran digital'],
  'Turning Financial Knowledge into Better Decisions',
  'nisrinalathif09@gmail.com',
  'vita.grecia',
  'nisrina-lathif.webp',
  5,
  true
),
(
  'manisa-eka-sujiarsih',
  'Manisa Eka Sujiarsih',
  'Mahasiswa Pendidikan Akuntansi',
  'Loan Document',
  'Tertarik pada akuntansi, keuangan, dan edukasi digital. Mengembangkan website Financial Literacy sebagai media belajar keuangan dan pengelolaan keuangan pribadi setelah pengalaman magang di BTN Kantor Cabang Surabaya.',
  'Menghadirkan edukasi keuangan yang informatif, menarik, dan mudah dipahami agar setiap orang dapat mengelola keuangan dengan lebih bijak.',
  array['Edukasi keuangan', 'Pengelolaan keuangan pribadi', 'Pembelajaran digital'],
  'Better Money Habits Start with Better Clarity.',
  'manisaekasujiarsig@gmail.com',
  'manisaaeka',
  'manisa-eka-sujiarsih.webp',
  6,
  true
)
on conflict (slug) do update set
  full_name = excluded.full_name,
  title = excluded.title,
  internship_unit = excluded.internship_unit,
  bio = excluded.bio,
  purpose = excluded.purpose,
  focus_areas = excluded.focus_areas,
  quote = excluded.quote,
  email = excluded.email,
  instagram = excluded.instagram,
  photo_path = excluded.photo_path,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published;

commit;
