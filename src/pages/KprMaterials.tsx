import { Link } from "react-router"

import { Icon } from "@/components/Icon"

const materials = [
  {
    number: "01",

    category: "KENALI PILIHAN PRODUK",

    title: "Panduan Seru Kredit Rumah BTN",

    summary:
      "Kenali ragam produk KPR BTN, bandingkan pilihan, pahami alur pengajuan, dan siapkan dokumen.",

    chapters: "8 bagian",

    icon: "home" as const,

    href: "/learn/kpr-produk-btn",

    accent: "bg-[#fff8dc] text-[#8a6500]",

    badge: "bg-[#ffc400] text-[#064a91]",
  },

  {
    number: "02",

    category: "PAHAMI PROSES AKAD",

    title: "Mekanisme & Akad KPR",

    summary:
      "Pelajari persiapan, pihak yang terlibat, hari penandatanganan, hingga hal yang perlu dilakukan setelah akad.",

    chapters: "4 bab",

    icon: "document" as const,

    href: "/learn/kpr-di-btn",

    accent: "bg-blue-50 text-[#064a91]",

    badge: "bg-[#064a91] text-white",
  },
]

export default function KprMaterials() {
  return (
    <section className="lesson-detail min-h-screen py-10 sm:py-14">
      <div className="lesson-reader-container mx-auto">
        <Link
          className="back-link inline-flex items-center gap-2 font-semibold text-[#064a91] transition hover:gap-3"
          to="/learn"
        >
          <Icon name="back" size={17} />
          Semua tema
        </Link>

        <header className="lesson-detail-head">
          <div className="lesson-detail-badge">
            <Icon name="home" size={15} />
            TEMA BELAJAR
          </div>
          <h1 className="lesson-title">KPR di BTN</h1>
          <p className="lesson-lead">
            Ada dua materi yang saling melengkapi: mulai dari memilih produk
            pembiayaan, lalu lanjutkan memahami proses akad kreditnya.
          </p>
          <div className="lesson-reading-meta">
            <span>
              <Icon name="document" size={15} />2 materi
            </span>
            <span>
              <Icon name="check" size={15} />
              Pilih materi untuk melihat bab dan subbab
            </span>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-2">
          {materials.map((material) => (
            <Link
              className="group flex min-h-[340px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(6,74,145,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#064a91] motion-reduce:transition-none"
              key={material.number}
              to={material.href}
            >
              <div
                className={`relative isolate flex min-h-40 items-start justify-between overflow-hidden p-6 ${material.accent}`}
              >
                <div
                  className="pointer-events-none absolute -right-12 -bottom-24 size-56 rounded-full border border-current/10"
                  aria-hidden="true"
                />
                <div className="relative">
                  <span
                    className={`mb-5 grid size-14 place-items-center rounded-[18px] shadow-sm ${material.badge}`}
                  >
                    <Icon name={material.icon} size={26} />
                  </span>
                  <span className="text-[10px] font-extrabold tracking-[0.16em] opacity-70">
                    {material.category}
                  </span>
                </div>
                <span className="relative font-[Plus_Jakarta_Sans] text-sm font-extrabold tracking-widest opacity-60">
                  {material.number}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h2 className="font-[Plus_Jakarta_Sans] text-2xl leading-tight font-extrabold tracking-[-0.04em] text-[#064a91]">
                  {material.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                  {material.summary}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-semibold text-slate-500">
                    {material.chapters}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-[#064a91] transition group-hover:gap-3">
                    Buka materi
                    <Icon name="arrow" size={16} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
