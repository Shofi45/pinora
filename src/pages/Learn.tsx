import { Link } from "react-router"
import { Icon } from "@/components/Icon"
import { INVESTMENT_CHAPTERS } from "@/lib/material-syllabus"

const lessonArtwork: Record<"blue" | "yellow", {
  background: string
  foreground: string
  icon: string
  orb: string
}> = {
  blue: {
    background: "from-[#064a91]/15 via-blue-50 to-white",
    foreground: "text-[#064a91]",
    icon: "bg-[#064a91] text-white",
    orb: "bg-[#064a91]/10",
  },
  yellow: {
    background: "from-[#ffc400]/35 via-yellow-50 to-white",
    foreground: "text-[#064a91]",
    icon: "bg-[#ffc400] text-[#064a91]",
    orb: "bg-[#ffc400]/25",
  },
}

const chapterAccents = ["blue", "yellow", "blue", "yellow"] as const

export default function Learn() {
  return (
    <section
      id="learn"
      className="relative isolate overflow-hidden bg-[#f4f8fc] px-5 py-14 sm:py-16 lg:py-20"
    >
      <div className="pointer-events-none absolute -right-40 top-20 size-96 rounded-full bg-sky-100/70 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="scroll-reveal mb-16 grid gap-8 overflow-hidden rounded-[30px] bg-gradient-to-br from-[#064a91] via-[#064a91] to-[#064a91] p-7 text-white shadow-[0_24px_70px_rgba(6,74,145,0.18)] sm:p-10 lg:mb-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-10 lg:p-14">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-extrabold tracking-[0.2em] text-[#ffc400]">
              FINWISE LEARNING SPACE
            </p>
            <h1 className="text-[clamp(2.6rem,5vw,4.25rem)] leading-[1.05] font-extrabold tracking-[-0.05em] !text-white">
              Belajar finansial,
              <br />
              <span className="!text-[#ffc400]">lebih terarah.</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
              Kenali investasi, deposito BTN, dan instrumen pasar modal lewat
              empat bab yang tersusun bertahap.
            </p>
            <div className="mt-7 flex flex-wrap gap-6 sm:gap-8">
              {[
                [String(INVESTMENT_CHAPTERS.length), "bab belajar"],
                ["100%", "bahasa sederhana"],
                ["5 mnt", "rata-rata baca"],
              ].map(([value, label]) => (
                <div className="border-l-2 border-white/30 pl-3" key={label}>
                  <b className="block font-[Plus_Jakarta_Sans] text-xl font-extrabold">
                    {value}
                  </b>
                  <span className="text-xs text-blue-100">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="relative mx-auto flex min-h-64 w-full max-w-md items-center justify-center sm:min-h-72"
            aria-hidden="true"
          >
            <div className="absolute size-64 rounded-full border border-white/20 sm:size-72" />
            <div className="absolute size-48 rounded-full border border-[#ffc400]/35 sm:size-56" />
            <div className="relative w-64 rotate-[-3deg] rounded-3xl border border-white/70 bg-white p-5 text-[#064a91] shadow-2xl sm:w-72 sm:p-6">
              <span className="mb-5 grid size-11 place-items-center rounded-2xl bg-[#ffc400] text-[#064a91]">
                <Icon name="chart" size={22} />
              </span>
              <span className="text-[10px] font-extrabold tracking-[0.16em] text-slate-500">
                YOUR MONEY MAP
              </span>
              <strong className="mt-2 block font-[Plus_Jakarta_Sans] text-lg leading-tight font-extrabold">
                Pelan-pelan,
                <br />
                yang penting paham.
              </strong>
              <div className="mt-5 flex h-9 items-end gap-1">
                {[50, 78, 60, 94, 73].map((height, index) => (
                  <i
                    className={`flex-1 rounded-t-md ${
                      index === 3 ? "bg-[#ffc400]" : "bg-[#064a91]/35"
                    }`}
                    key={height}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="absolute top-3 right-0 flex items-center gap-2 rounded-xl border border-white/70 bg-white px-3 py-2 text-xs font-bold text-[#064a91] shadow-lg sm:-right-1">
              <Icon name="check" size={15} />
              Mulai dari tujuanmu
            </div>
            <div className="absolute right-0 bottom-2 flex items-center gap-2 rounded-xl border border-white/70 bg-white px-3 py-2 text-xs font-bold text-[#064a91] shadow-lg sm:right-2">
              <Icon name="spark" size={15} />
              Praktis & mudah
            </div>
          </div>
        </div>
        <div className="scroll-reveal mb-8 flex flex-col gap-3 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-extrabold tracking-[0.2em] text-[#064a91]">
              MATERI BELAJAR
            </p>
            <h2 className="font-[Plus_Jakarta_Sans] text-3xl leading-tight font-extrabold tracking-[-0.04em] text-[#064a91] sm:text-4xl">
              Belajar investasi dalam 4 bab.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-600 sm:text-base">
            Ikuti urutannya dari konsep dasar investasi hingga obligasi dan
            reksa dana.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 lg:gap-6">
          {INVESTMENT_CHAPTERS.map((chapter, index) => {
            const artwork = lessonArtwork[chapterAccents[index] ?? "blue"]

            return (
              <Link
                to={`/learn/investasi/${chapter.slug}`}
                className="scroll-reveal group flex h-full flex-col overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(6,74,145,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#064a91] motion-reduce:transition-none"
                key={chapter.title}
              >
                <div
                  className={`relative isolate flex h-40 items-center justify-between overflow-hidden bg-gradient-to-br p-5 sm:h-44 ${artwork.background}`}
                >
                  <div
                    className={`absolute -top-9 -right-8 size-36 rounded-full ${artwork.orb}`}
                  />
                  <div
                    className={`absolute -right-4 -bottom-16 size-40 rounded-full opacity-70 ${artwork.orb}`}
                  />
                  <div className="relative">
                    <span
                      className={`mb-4 grid size-[62px] place-items-center rounded-[20px] shadow-sm ${artwork.icon}`}
                    >
                      <Icon name="book" size={30} />
                    </span>
                    <span
                      className={`text-[10px] font-extrabold tracking-[0.16em] opacity-75 ${artwork.foreground}`}
                    >
                      MATERI INVESTASI
                    </span>
                </div>
                <span
                  className={`relative self-start font-[Plus_Jakarta_Sans] text-sm font-bold opacity-60 ${artwork.foreground}`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="font-[Plus_Jakarta_Sans] text-xl leading-snug font-bold tracking-[-0.035em] text-[#064a91]">
                  {chapter.title}
                </h3>
                <p className="mt-3 flex-1 border-t border-slate-200 pt-4 text-sm leading-6 text-slate-600">
                  {chapter.summary}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#064a91] transition group-hover:gap-3">
                  Buka bab
                  <Icon name="arrow" size={16} />
                </span>
              </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
