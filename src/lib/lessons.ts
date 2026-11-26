import type { IconName } from "@/components/Icon"

import type { Lesson, LessonAccent, LessonTarget } from "@/lib/types"

export const LESSON_ICONS: IconName[] = [
  "piggy",

  "chart",

  "home",

  "building",

  "document",

  "wallet",

  "book",

  "briefcase",

  "calculator",

  "shield",

  "spark",

  "bot",

  "check",

  "arrow",
]

export const LESSON_ACCENTS: LessonAccent[] = [
  "mint",

  "blue",

  "coral",

  "yellow",

  "purple",

  "navy",
]

export const LESSON_TARGETS: { value: LessonTarget; label: string }[] = [
  { value: "page", label: "Halaman belajar (tema, bab, dan materi)" },

  { value: "sc-btn", label: "Buka halaman SC BTN bawaan" },

  { value: "calculate", label: "Buka halaman Kalkulator" },
]

/** Dipakai bila Supabase belum dikonfigurasi atau tabel lessons belum dibuat. */

export const FALLBACK_LESSONS: Lesson[] = [
  {
    id: "f1",

    slug: "menabung-di-btn",

    title: "Menabung di BTN",

    summary:
      "Kenali produk tabungan, alat pembayaran, dan manfaatnya untuk tujuanmu.",

    tag: "3 bab",

    icon: "piggy",

    accent: "mint",

    target: "page",

    content: "",

    sort_order: 1,

    published: true,
  },

  {
    id: "f2",

    slug: "belajar-investasi",

    title: "Belajar Investasi",

    summary:
      "Pelajari investasi dalam empat bab, dari dasar hingga instrumen pasar modal.",

    tag: "4 bab",

    icon: "chart",

    accent: "blue",

    target: "page",

    content: "",

    sort_order: 2,

    published: true,
  },

  {
    id: "f3",

    slug: "kpr-di-btn",

    title: "KPR di BTN",

    summary: "Pelajari jenis KPR, mekanisme akad, hingga proses pengajuannya.",

    tag: "2 materi",

    icon: "home",

    accent: "coral",

    target: "page",

    content: "",

    sort_order: 3,

    published: true,
  },

  {
    id: "f4",

    slug: "sc-btn",

    title: "SC BTN",

    summary: "Persiapkan keuangan dan hitung kemampuan anggaran rumah impian.",

    tag: "4 bab",

    icon: "building",

    accent: "yellow",

    target: "sc-btn",

    content: "",

    sort_order: 4,

    published: true,
  },

  {
    id: "f5",

    slug: "dokumen-kredit",

    title: "Dokumen Kredit",

    summary: "Checklist dokumen pribadi, penghasilan, dan pengajuan kredit.",

    tag: "9 dokumen",

    icon: "document",

    accent: "purple",

    target: "page",

    content: "",

    sort_order: 5,

    published: true,
  },

  {
    id: "f6",

    slug: "keuangan-pribadi",

    title: "Keuangan Pribadi",

    summary:
      "Catat transaksi, lihat ringkasan, dan evaluasi kondisi keuanganmu.",

    tag: "3 bab",

    icon: "wallet",

    accent: "navy",

    target: "calculate",

    content: "",

    sort_order: 6,

    published: true,
  },
]
