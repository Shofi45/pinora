import { Link } from "react-router"

import { Icon } from "@/components/Icon"

import { FALLBACK_LESSONS } from "@/lib/lessons"

const topicRoutes: Record<string, string> = {
  "menabung-di-btn": "/learn/menabung-di-btn",

  "belajar-investasi": "/learn/investasi",

  "kpr-di-btn": "/learn/kpr",

  "sc-btn": "/learn/sc-btn",

  "dokumen-kredit": "/learn/dokumen-kredit",

  "keuangan-pribadi": "/learn/keuangan-pribadi",
}

const topicDetails: Record<string, { count: string; label: string }> = {
  "menabung-di-btn": { count: "Produk & layanan", label: "MENABUNG" },

  "belajar-investasi": { count: "4 bab belajar", label: "INVESTASI" },

  "kpr-di-btn": { count: "2 materi utama", label: "PEMBIAYAAN RUMAH" },

  "sc-btn": { count: "4 bagian belajar", label: "SALES CENTER BTN" },

  "dokumen-kredit": { count: "9 dokumen penting", label: "KREDIT" },

  "keuangan-pribadi": { count: "Catat & evaluasi", label: "KEUANGAN PRIBADI" },
}

const accents = [
  {
    surface: "from-emerald-50 via-white to-white",
    icon: "bg-emerald-100 text-emerald-800",
    orb: "bg-emerald-200/50",
  },

  {
    surface: "from-blue-50 via-white to-white",
    icon: "bg-blue-100 text-[#064a91]",
    orb: "bg-blue-200/50",
  },

  {
    surface: "from-amber-50 via-white to-white",
    icon: "bg-amber-100 text-amber-800",
    orb: "bg-amber-200/60",
  },

  {
    surface: "from-violet-50 via-white to-white",
    icon: "bg-violet-100 text-violet-800",
    orb: "bg-violet-200/50",
  },

  {
    surface: "from-sky-50 via-white to-white",
    icon: "bg-sky-100 text-sky-800",
    orb: "bg-sky-200/50",
  },

  {
    surface: "from-rose-50 via-white to-white",
    icon: "bg-rose-100 text-rose-800",
    orb: "bg-rose-200/50",
  },
]

export default function Learn() {
  return (
    <section
      id="learn"
      className="relative isolate overflow-hidden bg-[#f4f8fc] py-12 sm:py-16 lg:py-20"
    >
      <div className="pointer-events-none absolute -right-40 top-20 size-96 rounded-full bg-sky-100/70 blur-3xl" />
      <div className="container relative">
        <header className="mb-9 overflow-hidden rounded-[30px] bg-gradient-to-br from-[#064a91] via-[#064a91] to-[#04396f] p-7 text-white shadow-[0_24px_70px_rgba(6,74,145,0.18)] sm:p-10 lg:mb-12 lg:flex lg:items-end lg:justify-between lg:gap-10 lg:p-14">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-extrabold tracking-[0.2em] text-[#ffc400]">
              FINWISE LEARNING SPACE
            </p>
            <h1 className="text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] font-extrabold tracking-[-0.05em] !text-white">
              Belajar finansial,
              <br />
              <span className="!text-[#ffc400]">
                mulai dari yang kamu perlu.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
              Pilih tema, lalu pelajari materinya bertahap dari bab hingga
              subbab. Semua disusun agar lebih mudah dipahami dan dipraktikkan.
            </p>
          </div>
          <div className="mt-8 flex shrink-0 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 lg:mb-1">
            <span className="grid size-11 place-items-center rounded-xl bg-[#ffc400] text-[#064a91]">
              <Icon name="book" size={23} />
            </span>
            <span>
              <b className="block font-[Plus_Jakarta_Sans] text-2xl font-extrabold">
                06
              </b>
              <span className="text-xs text-blue-100">tema belajar</span>
            </span>
          </div>
        </header>

        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-extrabold tracking-[0.2em] text-[#064a91]">
              PILIH TEMA
            </p>
            <h2 className="font-[Plus_Jakarta_Sans] text-3xl leading-tight font-extrabold tracking-[-0.04em] text-[#064a91] sm:text-4xl">
              Materi untuk perjalananmu.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-600 sm:text-base">
            Buka satu tema untuk melihat rangkaian materinya.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {FALLBACK_LESSONS.map((topic, index) => {
            const details = topicDetails[topic.slug]

            const artwork = accents[index] ?? accents[0]

            const href = topicRoutes[topic.slug] ?? "/learn"

            return (
              <Link
                to={href}
                className="group flex min-h-64 flex-col overflow-hidden rounded-[25px] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(6,74,145,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#064a91] motion-reduce:transition-none"
                key={topic.slug}
              >
                <div
                  className={`relative isolate flex min-h-28 items-start justify-between overflow-hidden bg-gradient-to-br p-5 ${artwork.surface}`}
                >
                  <div
                    className={`absolute -top-10 -right-7 size-32 rounded-full ${artwork.orb}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`relative grid size-14 place-items-center rounded-[18px] shadow-sm ${artwork.icon}`}
                  >
                    <Icon name={topic.icon} size={27} />
                  </span>
                  <span className="relative rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 font-[Plus_Jakarta_Sans] text-xs font-extrabold tracking-wide text-[#064a91]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <span className="text-[10px] font-extrabold tracking-[0.16em] text-slate-500">
                    {details?.label ?? "MATERI BELAJAR"}
                  </span>
                  <h3 className="mt-2 font-[Plus_Jakarta_Sans] text-xl leading-snug font-extrabold tracking-[-0.035em] text-[#064a91]">
                    {topic.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                    {topic.summary}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs font-semibold text-slate-500">
                      {details?.count}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-[#064a91] transition group-hover:gap-3">
                      Lihat materi
                      <Icon name="arrow" size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
