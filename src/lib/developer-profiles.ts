import { getMediaUrl } from "@/lib/media"

export type DeveloperProfile = {
  slug: string
  full_name: string
  title: string
  internship_unit: string
  bio: string
  purpose: string
  focus_areas: string[]
  quote: string
  email: string | null
  instagram: string | null
  photo_path: string
  sort_order: number
}

export function getDeveloperPhotoUrl(photoPath: string) {
  if (/^(https?:|data:|blob:)/i.test(photoPath)) return photoPath

  const path = photoPath.replace(/^\/+/, "")
  return getMediaUrl(
    path.startsWith("images/developers/")
      ? path
      : `images/developers/${path}`,
  )
}

export const DEVELOPER_PROFILES: DeveloperProfile[] = [
  {
    slug: "ellen-solagracia-sihite",
    full_name: "Ellen Solagracia Sihite",
    title: "Mahasiswa Pendidikan Akuntansi",
    internship_unit: "Customer Service",
    bio: "Tertarik pada akuntansi, keuangan, dan edukasi digital. Mengembangkan website edukasi keuangan sebagai media belajar pengelolaan keuangan pribadi setelah pengalaman magang di BTN Kantor Cabang Surabaya.",
    purpose:
      "Menghadirkan edukasi keuangan yang informatif, menarik, dan mudah dipahami agar setiap orang dapat mengelola keuangan dengan lebih bijak.",
    focus_areas: [
      "Edukasi keuangan",
      "Pengelolaan keuangan pribadi",
      "Pembelajaran digital",
    ],
    quote: "Learning, Serving, and Growing Through Every Experience",
    email: "ellensolagracia3@gmail.com",
    instagram: "solagraciaellen",
    photo_path: "ellen-solagracia-sihite.webp",
    sort_order: 1,
  },
  {
    slug: "kisya-putri-oktavia",
    full_name: "Kisya Putri Oktavia",
    title: "Mahasiswa Pendidikan Akuntansi",
    internship_unit: "Priority Banking Unit",
    bio: "Tertarik pada akuntansi, keuangan, dan edukasi digital. Mengembangkan website edukasi keuangan sebagai media belajar pengelolaan keuangan pribadi setelah pengalaman magang di BTN Kantor Cabang Surabaya.",
    purpose:
      "Menghadirkan edukasi keuangan yang informatif, menarik, dan mudah dipahami agar setiap orang dapat mengelola keuangan dengan lebih bijak.",
    focus_areas: [
      "Edukasi keuangan",
      "Pengelolaan keuangan pribadi",
      "Pembelajaran digital",
    ],
    quote: "Building Financial Awareness, Creating Better Futures",
    email: "kisyavia@gmail.com",
    instagram: "kisya.via",
    photo_path: "kisya-putri-oktavia.webp",
    sort_order: 2,
  },
  {
    slug: "ayunda-martalina",
    full_name: "Ayunda Martalina",
    title: "Mahasiswa Pendidikan Akuntansi",
    internship_unit: "Consumer Lending Unit",
    bio: "Tertarik pada akuntansi, keuangan, dan edukasi digital. Mengembangkan website edukasi keuangan sebagai media belajar pengelolaan keuangan pribadi setelah pengalaman magang di BTN Kantor Cabang Surabaya.",
    purpose:
      "Menghadirkan edukasi keuangan yang informatif, menarik, dan mudah dipahami agar setiap orang dapat mengelola keuangan dengan lebih bijak.",
    focus_areas: [
      "Edukasi keuangan",
      "Pengelolaan keuangan pribadi",
      "Pembelajaran digital",
    ],
    quote: "Empowering Financial Knowledge, Building a Better Future",
    email: "amarhila44@gmail.com",
    instagram: "ayndaam_",
    photo_path: "ayunda-martalina.webp",
    sort_order: 3,
  },
  {
    slug: "nadia-zalfa-rahmatul-ulla",
    full_name: "Nadia Zalfa Rahmatul Ulla",
    title: "Mahasiswa Pendidikan Akuntansi",
    internship_unit: "Signing Officer (SO)",
    bio: "Tertarik pada akuntansi, perbankan, dan edukasi keuangan. Menyusun materi akad kredit untuk membantu calon debitur memahami proses akad sebelum menandatangani perjanjian.",
    purpose:
      "Menjelaskan proses akad kredit dengan bahasa sederhana, termasuk persiapan, dokumen yang ditandatangani, serta hak dan kewajiban debitur.",
    focus_areas: [
      "Proses akad kredit",
      "Peran Signing Officer",
      "Hak dan kewajiban debitur",
    ],
    quote: "Understand Before You Sign.",
    email: "nadiazlf29@gmail.com",
    instagram: "nafazlf",
    photo_path: "nadia-zalfa-rahmatul-ulla.webp",
    sort_order: 4,
  },
  {
    slug: "nisrina-lathif",
    full_name: "Nisrina Lathif",
    title: "Mahasiswa Pendidikan Akuntansi",
    internship_unit: "Sales Center KPR",
    bio: "Tertarik pada akuntansi, keuangan, dan edukasi digital. Mengembangkan website edukasi keuangan sebagai media belajar keuangan dan pengelolaan pribadi setelah pengalaman magang di BTN Kantor Cabang Surabaya.",
    purpose:
      "Menghadirkan edukasi keuangan yang informatif, menarik, dan mudah dipahami agar setiap orang dapat mengelola keuangan dengan lebih bijak.",
    focus_areas: [
      "Edukasi keuangan",
      "Pengelolaan keuangan pribadi",
      "Pembelajaran digital",
    ],
    quote: "Turning Financial Knowledge into Better Decisions",
    email: "nisrinalathif09@gmail.com",
    instagram: "vita.grecia",
    photo_path: "nisrina-lathif.webp",
    sort_order: 5,
  },
  {
    slug: "manisa-eka-sujiarsih",
    full_name: "Manisa Eka Sujiarsih",
    title: "Mahasiswa Pendidikan Akuntansi",
    internship_unit: "Loan Document",
    bio: "Tertarik pada akuntansi, keuangan, dan edukasi digital. Mengembangkan website edukasi keuangan sebagai media belajar keuangan dan pengelolaan pribadi setelah pengalaman magang di BTN Kantor Cabang Surabaya.",
    purpose:
      "Menghadirkan edukasi keuangan yang informatif, menarik, dan mudah dipahami agar setiap orang dapat mengelola keuangan dengan lebih bijak.",
    focus_areas: [
      "Edukasi keuangan",
      "Pengelolaan keuangan pribadi",
      "Pembelajaran digital",
    ],
    quote: "Better Money Habits Start with Better Clarity.",
    email: "manisaekasujiarsig@gmail.com",
    instagram: "manisaaeka",
    photo_path: "manisa-eka-sujiarsih.webp",
    sort_order: 6,
  },
]
