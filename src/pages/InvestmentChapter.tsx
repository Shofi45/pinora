import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { Icon } from "@/components/Icon";
import { RichText } from "@/components/RichText";
import {
  INVESTMENT_CHAPTERS,
  type RelatedMaterial,
} from "@/lib/material-syllabus";
import { useGo } from "@/lib/nav";

export default function InvestmentChapter() {
  const { chapterSlug } = useParams();
  const navigate = useNavigate();
  const go = useGo();
  const chapter = INVESTMENT_CHAPTERS.find((item) => item.slug === chapterSlug);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectSubchapter = (index: number) => {
    setActiveIndex(index);
    document
      .getElementById("lesson-reader-content")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    setActiveIndex(0);
    window.scrollTo({ top: 0 });
  }, [chapterSlug]);

  if (!chapter) return <Navigate to="/learn" replace />;

  const activeSubchapter = chapter.subchapters[activeIndex];
  const openRelatedMaterial = (material: RelatedMaterial) => {
    if (material.target === "calculate") return go("calculate");
    if (material.target === "sc-btn") return go("sc-btn");
    navigate(`/learn/${material.slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="lesson-detail min-h-screen py-10 sm:py-14">
      <div className="lesson-reader-container mx-auto">
        <button
          className="back-link inline-flex items-center gap-2 font-semibold text-[#064a91] transition hover:gap-3"
          onClick={() => navigate("/learn")}
          type="button"
        >
          <Icon name="back" size={17} />
          Semua bab
        </button>

        <header className="lesson-detail-head">
          <div className="lesson-detail-badge">
            <Icon name="book" size={15} />
            Bab {INVESTMENT_CHAPTERS.indexOf(chapter) + 1} dari{" "}
            {INVESTMENT_CHAPTERS.length}
          </div>
          <h1 className="lesson-title">{chapter.title}</h1>
          <p className="lesson-lead">{chapter.summary}</p>
          <div className="lesson-reading-meta">
            <span>
              <Icon name="document" size={15} />
              {chapter.subchapters.length} subbab
            </span>
            <span>
              <Icon name="check" size={15} />
              Pilih subbab untuk mulai belajar
            </span>
          </div>
        </header>

        <div className="lesson-detail-body">
          <div className="lesson-reader-layout">
            <aside
              className="lesson-reader-sidebar"
              aria-label="Daftar subbab materi"
            >
              <div className="lesson-reader-label">
                <Icon name="book" size={16} />
                Daftar subbab
              </div>
              <nav>
                {chapter.subchapters.map((subchapter, index) => (
                  <button
                    aria-current={activeIndex === index ? "step" : undefined}
                    className={activeIndex === index ? "active" : ""}
                    key={subchapter.title}
                    onClick={() => selectSubchapter(index)}
                    type="button"
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <b>{subchapter.title}</b>
                    <Icon name="chevron" size={15} />
                  </button>
                ))}
              </nav>
              <div className="lesson-reader-progress">
                <span>
                  Subbab {activeIndex + 1} dari {chapter.subchapters.length}
                </span>
                <i
                  style={{
                    width: `${((activeIndex + 1) / chapter.subchapters.length) * 100}%`,
                  }}
                />
              </div>
            </aside>

            <main
              className="lesson-reader-content"
              id="lesson-reader-content"
              aria-live="polite"
            >
              <section className="lesson-chapter">
                <div className="lesson-chapter-heading">
                  <span>{String(activeIndex + 1).padStart(2, "0")}</span>
                  <h2>{activeSubchapter.title}</h2>
                </div>
                {activeSubchapter.blocks.map((block, index) =>
                  block.type === "text" ? (
                    <RichText key={`text-${index}`} text={block.content} />
                  ) : (
                    <figure className="material-inline-figure" key={block.src}>
                      <img
                        src={block.src}
                        alt={block.alt}
                        loading="lazy"
                        decoding="async"
                      />
                      <figcaption>{block.caption}</figcaption>
                    </figure>
                  ),
                )}

                {activeSubchapter.related?.length ? (
                  <div className="mt-8 border-t border-slate-200 pt-6">
                    <h3 className="mb-4 font-[Plus_Jakarta_Sans] text-xl font-bold text-[#064a91]">
                      Materi terkait
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {activeSubchapter.related.map((material) => (
                        <button
                          className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-[#064a91]/40 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#064a91]"
                          key={material.title}
                          onClick={() => openRelatedMaterial(material)}
                          type="button"
                        >
                          <span>
                            <b className="block text-base text-[#064a91]">
                              {material.title}
                            </b>
                            <span className="mt-1 block text-sm leading-6 text-slate-600">
                              {material.summary}
                            </span>
                          </span>
                          <Icon name="arrow" size={17} />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>

              <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-200 pt-6">
                <button
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#064a91] transition hover:border-[#064a91]/40 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={activeIndex === 0}
                  onClick={() => selectSubchapter(activeIndex - 1)}
                  type="button"
                >
                  <Icon name="back" size={16} />
                  Sebelumnya
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-xl bg-[#064a91] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#04396f] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={activeIndex === chapter.subchapters.length - 1}
                  onClick={() => selectSubchapter(activeIndex + 1)}
                  type="button"
                >
                  Selanjutnya
                  <Icon name="arrow" size={16} />
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}
