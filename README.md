# Finwise

Situs literasi keuangan: materi belajar (menabung, investasi, KPR, SC BTN), kalkulator kemampuan anggaran,
pencatatan keuangan pribadi, tantangan 7 hari, dan chat Fin AI.

Stack: **React 19 + Vite + Tailwind v4 + React Router + Supabase** (Auth, Postgres, Edge Functions).

## Fitur yang terhubung ke Supabase

| Fitur | Tabel | Keterangan |
|---|---|---|
| Masuk / daftar | `auth.users` | Email dan kata sandi |
| Kalkulator anggaran | `budget_simulations` | Tersimpan otomatis 0,8 detik setelah angka diubah |
| Catatan transaksi | `transactions` | Tambah, hapus, ganti bulan. Jenis: pemasukan, pengeluaran, tabungan |
| Ringkasan keuangan | (dihitung dari `transactions`) | Pemasukan, pengeluaran, sisa, rasio, rincian kebutuhan/kemauan/tabungan |
| Tantangan 7 hari | `challenge_progress` | 5 butir checklist |
| Chat Fin AI | `chat_messages` + Edge Function `fin-ai` | Hanya untuk pengguna yang sudah masuk |

Pengunjung yang belum masuk tetap bisa membuka semua halaman dan memakai kalkulator (tanpa penyimpanan).
Semua tabel memakai Row Level Security, jadi pengguna hanya bisa melihat datanya sendiri.

## Admin, grafik, gambar, FAQ, dan dokumentasi

1. Jalankan SQL di Supabase SQL Editor berurutan: `supabase/schema.sql`, `supabase/admin.sql`, `supabase/admin-grafik.sql`, lalu `supabase/content-media.sql`. `admin.sql` menyiapkan profil, role admin, materi, kuis, dan statistik dasar. `admin-grafik.sql` membuat `track_visit` dan statistik grafik yang dipakai dashboard. `content-media.sql` menyiapkan FAQ/dokumentasi serta bucket `site-media` (publik) dan `chat-attachments` (privat).
2. Jadikan akunmu admin dengan SQL Editor (ganti alamat email):
   ```sql
   update public.profiles set role = 'admin', disabled = false
   where email = 'email-kamu@example.com';
   ```
   Admin yang sudah ada tidak diturunkan rolenya saat skrip dijalankan ulang.
3. Untuk memindahkan seluruh gambar raster lokal dari `public/images/` dan `public/materi/`, tambahkan `SUPABASE_SERVICE_ROLE_KEY` sementara ke `.env`, lalu jalankan `npm run migrate:media`. Skrip mengunggah JPG, JPEG, PNG, WebP, dan GIF ke `site-media` dengan struktur folder yang sama dan dapat dijalankan ulang.
4. Setelah upload berhasil, ubah `VITE_MEDIA_STORAGE_ENABLED=true` di `.env`, lalu mulai ulang aplikasi. Sebelum migrasi selesai biarkan nilainya `false`, supaya aset lokal tetap digunakan. Gambar eksternal (misalnya URL Unsplash), SVG, dan favicon tidak dipindahkan.
5. Hapus `SUPABASE_SERVICE_ROLE_KEY` dari `.env` setelah migrasi; jangan pernah memberi prefix `VITE_` atau mengirimkannya ke browser. Deploy ulang frontend setelah mengubah env.
6. Deploy ulang Edge Function agar Fin AI menerima gambar: `supabase functions deploy fin-ai`. Lampiran chat disimpan di bucket privat per pengguna; kebijakan Storage memberi akses baca hanya kepada pemilik dan admin.

Gambar materi/dokumentasi diunggah lewat editor admin dan disisipkan sebagai Markdown (`![teks alternatif](URL)`). Toolbar **B** membungkus teks terpilih dengan `**...**`. Halaman `/faq` dan `/dokumentasi` mengambil konten yang sudah diterbitkan; seluruh Create, Read, Update, Delete, status draft, dan urutan konten tersedia di panel admin.

## Setup

1. **Buat project** di https://supabase.com/dashboard.
2. **Siapkan database**: buka *SQL Editor* dan jalankan berurutan `supabase/schema.sql`,
   `supabase/admin.sql`, `supabase/admin-grafik.sql`, dan `supabase/content-media.sql`.
   Untuk profil tim di halaman Tentang Kami, jalankan juga `supabase/developer_profiles.sql`.
3. **Isi env**: salin `.env.example` menjadi `.env`, isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
   (*Project Settings > API*). Pakai anon key atau publishable key, **jangan** service role key.
4. **Auth**: di *Authentication > URL Configuration* isi *Site URL* dengan alamat situsmu
   (untuk lokal: `http://localhost:8443`). Untuk uji coba cepat, matikan *Confirm email* di
   *Authentication > Providers > Email*. Jika dibiarkan aktif, pengguna baru harus klik tautan di emailnya dulu.
5. **Jalankan**:
   ```bash
   npm install
   npm run dev
   ```

## Mengaktifkan Fin AI (opsional)

Tanpa langkah ini, semua fitur lain tetap jalan. Chat akan menjawab "Fin sedang tidak bisa menjawab".

```bash
npm i -g supabase            # atau: npx supabase ...
supabase login
supabase link --project-ref <project-ref-kamu>
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase functions deploy fin-ai
```

- Model bawaan `claude-haiku-5-5`. Ganti dengan `supabase secrets set AI_MODEL=<nama-model>`.
- Fungsi ini memeriksa login pengguna, membatasi 30 pesan per jam, dan membaca simulasi serta
  transaksi bulan berjalan milik pengguna dari server sebagai konteks jawaban.
- Kunci API hanya ada di Supabase Secrets, tidak pernah dikirim ke browser.

## Struktur

```
src/
  app/            App.tsx (AuthProvider + router), routes.tsx
  components/     Layout (navbar, chat, modal), AuthModal, ChatPanel, TransactionModal, Icon, Button
  context/        AuthContext.tsx (sesi Supabase)
  hooks/          useTransactions, useSimulation, useChallenge, useChat
  lib/            supabase.ts, format.ts, summary.ts, nav.ts, types.ts
  pages/          Home, Learn, ScBtn, Calculate, Profile
supabase/
  schema.sql                  tabel + RLS
  functions/fin-ai/index.ts   Edge Function chat AI
```

## Catatan

- Rumus **sisa keuangan** = pemasukan − pengeluaran − tabungan.
- Materi di halaman Learn dan SC BTN masih teks statis dari desain. Progres materi ("1 dari 4") belum disimpan.
- Jika proyek ini dipakai di Figma Make: salin folder `src/` dan `supabase/`, tambahkan dependensi
  `@supabase/supabase-js`, dan isi variabel env yang sama.
- Deploy: `npm run build`, lalu unggah folder `dist/` ke hosting statis (Vercel, Netlify, Cloudflare Pages).
  Karena memakai React Router (BrowserRouter), aktifkan fallback SPA ke `index.html` dan isi env yang sama di hosting.
