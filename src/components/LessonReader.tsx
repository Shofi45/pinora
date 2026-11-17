import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { RichText } from "@/components/RichText";

type Chapter = { id: string; title: string; content: string };

const makeId = (title: string, index: number) =>
  `bab-${index + 1}-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

function splitChapters(text: string) {
  const parts = text.replace(/\r\n/g, "\n").split(/\n(?=## )/);
  const intro = parts[0].startsWith("## ") ? "" : (parts.shift() ?? "");
  const chapters = parts.map((part, index) => {
    const match = part.match(/^## ([^\n]+)/);
    const title = match?.[1]?.trim() || `Bab ${index + 1}`;
    return {
      id: makeId(title, index),
      title,
      content: part.replace(/^## [^\n]+\n?/, "").trim(),
    };
  });
  return { intro: intro.trim(), chapters };
}

export function LessonReader({ text }: { text: string }) {
  const { intro, chapters } = useMemo(() => splitChapters(text), [text]);
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "");

  useEffect(() => {
    setActiveId(chapters[0]?.id ?? "");
    if (!chapters.length) return;
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
  }, [chapters]);

  const jumpTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!chapters.length) return <RichText text={text} />;
  return (
    <div className="lesson-reader-layout">
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
        {chapters.map((chapter, index) => (
          <section className="lesson-chapter" id={chapter.id} key={chapter.id}>
            <div className="lesson-chapter-heading">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{chapter.title}</h2>
            </div>
            <RichText text={chapter.content} />
          </section>
        ))}
      </main>
    </div>
  );
}
