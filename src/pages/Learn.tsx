import { useNavigate } from "react-router"
import { Icon } from "@/components/Icon"
import { useLessons } from "@/hooks/useLessons"
import { useGo } from "@/lib/nav"
import type { Lesson, LessonAccent } from "@/lib/types"

const lessonArtwork: Record<LessonAccent, {
  background: string
  foreground: string
  icon: string
  orb: string
}> = {
  mint: {
    background: "from-emerald-100 via-teal-50 to-white",
    foreground: "text-emerald-800",
    icon: "bg-white/80 text-emerald-700",
    orb: "bg-emerald-200/70",
  },
  blue: {
    background: "from-sky-100 via-blue-50 to-white",
    foreground: "text-blue-900",
    icon: "bg-white/80 text-blue-700",
    orb: "bg-sky-200/70",
  },
  coral: {
    background: "from-rose-100 via-orange-50 to-white",
    foreground: "text-rose-900",
    icon: "bg-white/80 text-rose-600",
    orb: "bg-rose-200/70",
  },
  yellow: {
    background: "from-amber-100 via-yellow-50 to-white",
    foreground: "text-amber-950",
    icon: "bg-white/80 text-amber-700",
    orb: "bg-amber-200/70",
  },
  purple: {
    background: "from-violet-100 via-purple-50 to-white",
    foreground: "text-violet-900",
    icon: "bg-white/80 text-violet-700",
    orb: "bg-violet-200/70",
  },
  navy: {
    background: "from-[#08294b] via-[#0b467d] to-[#0b5cad]",
    foreground: "text-white",
    icon: "bg-white/15 text-white",
    orb: "bg-white/10",
  },
}

export default function Learn() {
  const go = useGo()
  const navigate = useNavigate()
  const { lessons, loading } = useLessons()
  const visible = lessons.filter((l) => l.published)

  const open = (lesson: Lesson) => {
    if (lesson.target === "sc-btn") return go("sc-btn")
    if (lesson.target === "calculate") return go("calculate")
    navigate(`/learn/${lesson.slug}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <section
      id="learn"
      className="relative isolate overflow-hidden bg-[#f4f8fc] px-5 py-14 sm:py-16 lg:py-20"
    >
      <div className="pointer-events-none absolute -right-40 top-20 size-96 rounded-full bg-sky-100/70 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="scroll-reveal mb-16 grid gap-8 overflow-hidden rounded-[30px] bg-gradient-to-br from-[#08294b] via-[#0b467d] to-[#0b5cad] p-7 text-white shadow-[0_24px_70px_rgba(8,41,75,0.18)] sm:p-10 lg:mb-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-10 lg:p-14">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-extrabold tracking-[0.2em] text-sky-200">
              FINORA LEARNING SPACE
            </p>
            <h1 className="text-[clamp(2.6rem,5vw,4.25rem)] leading-[1.05] font-extrabold tracking-[-0.05em] !text-white">
              Belajar finansial,
              <br />
              <span className="!text-white">lebih terarah.</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
              Materi singkat tentang uang, kredit, tabungan, dan investasi—
              disusun supaya mudah dipahami dan langsung bisa dipraktikkan.
            </p>
            <div className="mt-7 flex flex-wrap gap-6 sm:gap-8">
              {[
                [String(visible.length || 6), "topik belajar"],
                ["100%", "bahasa sederhana"],
                ["5 mnt", "rata-rata baca"],
              ].map(([value, label]) => (
                <div className="border-l-2 border-white/30 pl-3" key={label}>
                  <b className="block font-[Manrope] text-xl font-extrabold">
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
            <div className="absolute size-48 rounded-full border border-emerald-200/30 sm:size-56" />
            <div className="relative w-64 rotate-[-3deg] rounded-3xl border border-white/70 bg-white p-5 text-[#08294b] shadow-2xl sm:w-72 sm:p-6">
              <span className="mb-5 grid size-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Icon name="chart" size={22} />
              </span>
              <span className="text-[10px] font-extrabold tracking-[0.16em] text-slate-500">
                YOUR MONEY MAP
              </span>
              <strong className="mt-2 block font-[Manrope] text-lg leading-tight font-extrabold">
                Pelan-pelan,
                <br />
                yang penting paham.
              </strong>
              <div className="mt-5 flex h-9 items-end gap-1">
                {[50, 78, 60, 94, 73].map((height, index) => (
                  <i
                    className={`flex-1 rounded-t-md ${
                      index === 3 ? "bg-emerald-600" : "bg-emerald-300"
                    }`}
                    key={height}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="absolute top-3 right-0 flex items-center gap-2 rounded-xl border border-white/70 bg-white px-3 py-2 text-xs font-bold text-[#08294b] shadow-lg sm:-right-1">
              <Icon name="check" size={15} />
              Mulai dari tujuanmu
            </div>
            <div className="absolute right-0 bottom-2 flex items-center gap-2 rounded-xl border border-white/70 bg-white px-3 py-2 text-xs font-bold text-[#08294b] shadow-lg sm:right-2">
              <Icon name="spark" size={15} />
              Praktis & mudah
            </div>
          </div>
        </div>
        <div className="scroll-reveal mb-8 flex flex-col gap-3 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-extrabold tracking-[0.2em] text-[#0b5cad]">
              MATERI BELAJAR
            </p>
            <h2 className="font-[Manrope] text-3xl leading-tight font-extrabold tracking-[-0.04em] text-[#08294b] sm:text-4xl">
              Pilih jalur belajarmu.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-600 sm:text-base">
            Mulai dari topik yang paling dekat dengan kebutuhanmu hari ini.
          </p>
        </div>
        {loading && visible.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">
            Memuat materi…
          </p>
        )}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {visible.map((lesson, index) => (
            <article
              className="scroll-reveal group flex h-full flex-col overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(8,41,75,0.12)] focus-within:ring-2 focus-within:ring-[#0b5cad] focus-within:ring-offset-2 motion-reduce:transition-none"
              key={lesson.id}
            >
              <div
                className={`relative isolate flex h-40 items-center justify-between overflow-hidden bg-gradient-to-br p-5 sm:h-44 ${lessonArtwork[lesson.accent].background}`}
              >
                <div
                  className={`absolute -top-9 -right-8 size-36 rounded-full ${lessonArtwork[lesson.accent].orb}`}
                />
                <div
                  className={`absolute -right-4 -bottom-16 size-40 rounded-full opacity-70 ${lessonArtwork[lesson.accent].orb}`}
                />
                <div className="relative">
                  <span
                    className={`mb-4 grid size-[62px] place-items-center rounded-[20px] shadow-sm ${lessonArtwork[lesson.accent].icon}`}
                  >
                    <Icon name={lesson.icon} size={30} />
                  </span>
                  <span
                    className={`text-[10px] font-extrabold tracking-[0.16em] opacity-75 ${lessonArtwork[lesson.accent].foreground}`}
                  >
                    FINORA LEARNING
                  </span>
                </div>
                <span
                  className={`relative self-start font-[Manrope] text-sm font-bold opacity-60 ${lessonArtwork[lesson.accent].foreground}`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="font-[Manrope] text-xl leading-snug font-bold tracking-[-0.035em] text-[#08294b]">
                  {lesson.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                  {lesson.summary}
                </p>
                <button
                  className="group/link mt-5 flex w-full items-center justify-between border-t border-slate-200 pt-4 text-left text-xs font-bold text-slate-600 transition-colors hover:text-[#0b5cad] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b5cad] motion-reduce:transition-none"
                  onClick={() => open(lesson)}
                >
                  <span>{lesson.tag || "Buka materi"}</span>
                  <span className="grid size-9 place-items-center rounded-full bg-[#08294b] text-white transition group-hover/link:translate-x-1 group-hover/link:bg-[#0b5cad] motion-reduce:transition-none">
                    <Icon name="arrow" size={17} />
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
        {!loading && visible.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">
            Belum ada materi yang diterbitkan.
          </p>
        )}
      </div>
    </section>
  )
}
