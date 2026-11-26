import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { RichText } from "@/components/RichText";

type Chapter = { id: string; title: string; content: string };

const makeId = (title: string, index: number) =>
  `bab-${index + 1}-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

const displayChapterTitle = (title: string) =>
  title.replace(/^\d+\.\s*/, "").trim();

function splitChapters(text: string) {
  const parts = text.replace(/\r\n/g, "\n").split(/\n(?=## )/);
  const intro = parts[0].startsWith("## ") ? "" : (parts.shift() ?? "");
  const chapters = parts.map((part, index) => {
    const match = part.match(/^## ([^\n]+)/);
    const rawTitle = match?.[1]?.trim() || `Bab ${index + 1}`;
    const title = displayChapterTitle(rawTitle);
    return {
      id: makeId(title, index),
      title,
      content: part.replace(/^## [^\n]+\n?/, "").trim(),
    };
  });
  return { intro: intro.trim(), chapters };
}

type LessonReaderProps = {
  text: string;
  navigationMode?: "scroll" | "single";
  extraChapter?: {
    id: string;
    title: string;
    content: ReactNode;
  };
};

export function LessonReader({
  text,
  navigationMode = "scroll",
  extraChapter,
}: LessonReaderProps) {
  const { intro, chapters: textChapters } = useMemo(() => splitChapters(text), [text]);
  const chapters = useMemo(
    () =>
      extraChapter
        ? [
            ...textChapters,
            {
              id: extraChapter.id,
              title: extraChapter.title,
              content: "",
              node: extraChapter.content,
            },
          ]
        : textChapters,
    [extraChapter, textChapters],
  );
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "");
  const activeIndex = Math.max(
    0,
    chapters.findIndex((chapter) => chapter.id === activeId),
  );

  useEffect(() => {
    setActiveId(chapters[0]?.id ?? "");
    if (navigationMode === "single" || !chapters.length) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (entry) => entry.isIntersecting && setActiveId(entry.target.id),
        ),
      { rootMargin: "-122px 0px -62% 0px", threshold: 0 },
    );
    chapters.forEach((chapter) => {
      const element = document.getElementById(chapter.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [chapters, navigationMode]);

  const jumpTo = (id: string) => {
    if (navigationMode === "single") {
      setActiveId(id);
      document
        .getElementById("lesson-reader-layout")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!chapters.length) return <RichText text={text} />;
  const visibleChapters =
    navigationMode === "single" ? [chapters[activeIndex]] : chapters;
  return (
    <div
      className={`lesson-reader-layout${navigationMode === "single" ? " single" : ""}`}
      id="lesson-reader-layout"
    >
      <aside className="lesson-reader-sidebar" aria-label="Daftar bab materi">
        <div className="lesson-reader-label">
          <Icon name="book" size={16} /> Daftar bab
        </div>
        <nav>
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              className={activeId === chapter.id ? "active" : ""}
              onClick={() => jumpTo(chapter.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{chapter.title}</b>
              <Icon name="chevron" size={15} />
            </button>
          ))}
        </nav>
        <div className="lesson-reader-progress">
          <span>
            {chapters.findIndex((item) => item.id === activeId) + 1} dari{" "}
            {chapters.length} bab
          </span>
          <i
            style={{
              width: `${((chapters.findIndex((item) => item.id === activeId) + 1) / chapters.length) * 100}%`,
            }}
          />
        </div>
      </aside>
      <main className="lesson-reader-content">
        {intro && <RichText text={intro} />}
        {intro && (navigationMode !== "single" || activeIndex === 0) && (
          <RichText text={intro} />
        )}
        {visibleChapters.map((chapter) => {
          const index = chapters.findIndex((item) => item.id === chapter.id);
          return (
          <section className="lesson-chapter" id={chapter.id} key={chapter.id}>
            <div className="lesson-chapter-heading">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{chapter.title}</h2>
            </div>
            {"node" in chapter ? chapter.node : <RichText text={chapter.content} />}
            {navigationMode === "single" && (
              <div className="chapter-pager">
                {index > 0 ? (
                  <button onClick={() => jumpTo(chapters[index - 1].id)}>
                    <small>Sebelumnya</small>
                    <b>{chapters[index - 1].title}</b>
                  </button>
                ) : (
                  <span />
                )}
                {index < chapters.length - 1 ? (
                  <button
                    className="next"
                    onClick={() => jumpTo(chapters[index + 1].id)}
                  >
                    <small>Selanjutnya</small>
                    <b>{chapters[index + 1].title}</b>
                  </button>
                ) : (
                  <span />
                )}
              </div>
            )}
          </section>
          );
        })}
      </main>
    </div>
  );
}
