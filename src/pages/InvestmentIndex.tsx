import { Link } from "react-router"

import { Icon } from "@/components/Icon"

import { INVESTMENT_CHAPTERS } from "@/lib/material-syllabus"

export default function InvestmentIndex() {
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
            <Icon name="chart" size={15} />
            TEMA BELAJAR
          </div>
          <h1 className="lesson-title">Belajar Investasi</h1>
          <p className="lesson-lead">
            Ikuti materi berurutan dari dasar investasi, deposito, produk
            deposito BTN, hingga instrumen pasar modal.
          </p>
          <div className="lesson-reading-meta">
            <span>
              <Icon name="document" size={15} />
              {INVESTMENT_CHAPTERS.length} bab
            </span>
            <span>
              <Icon name="check" size={15} />
              Setiap bab berisi subbab belajar
            </span>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {INVESTMENT_CHAPTERS.map((chapter, index) => (
            <Link
              className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#064a91]/30 hover:shadow-lg sm:p-6"
              key={chapter.slug}
              to={`/learn/investasi/${chapter.slug}`}
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-[#064a91] text-white">
                  <Icon name="book" size={23} />
                </span>
                <span className="font-[Plus_Jakarta_Sans] text-sm font-extrabold tracking-wider text-slate-400">
                  BAB {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h2 className="font-[Plus_Jakarta_Sans] text-lg font-extrabold text-[#064a91]">
                {chapter.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {chapter.summary}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-semibold text-slate-500">
                  {chapter.subchapters.length} subbab
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-[#064a91] transition group-hover:gap-3">
                  Buka bab
                  <Icon name="arrow" size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
