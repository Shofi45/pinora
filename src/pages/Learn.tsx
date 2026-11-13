import { useNavigate } from "react-router";
import { Icon } from "@/components/Icon";
import { useLessons } from "@/hooks/useLessons";
import { useGo } from "@/lib/nav";
import type { Lesson } from "@/lib/types";

export default function Learn() {
  const go = useGo();
  const navigate = useNavigate();
  const { lessons, loading } = useLessons();
  const visible = lessons.filter((l) => l.published);

  const open = (lesson: Lesson) => {
    if (lesson.target === "sc-btn") return go("sc-btn");
    if (lesson.target === "calculate") return go("calculate");
    navigate(`/learn/${lesson.slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="learn" className="section learn-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <div className="section-kicker">MATERI BELAJAR</div>
            <h2>
              Belajar keuangan,
              <br />
              tanpa terasa rumit.
            </h2>
          </div>
          <p>
            Pilih topik yang kamu butuhkan. Materi singkat, bahasa sederhana,
            dan langsung bisa dipraktikkan.
          </p>
        </div>
        {loading && visible.length === 0 && (
          <p className="lesson-empty">Memuat materi…</p>
        )}
        <div className="lesson-grid">
          {visible.map((lesson, index) => (
            <article
              className={`lesson-card accent-${lesson.accent}`}
              key={lesson.id}
            >
              <div className="lesson-top">
                <span className="lesson-icon">
                  <Icon name={lesson.icon} size={25} />
                </span>
                <span className="lesson-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div>
                <h3>{lesson.title}</h3>
                <p>{lesson.summary}</p>
              </div>
              <button className="card-link" onClick={() => open(lesson)}>
                <span>{lesson.tag || "Buka materi"}</span>
                <span className="circle-arrow">
                  <Icon name="arrow" size={17} />
                </span>
              </button>
            </article>
          ))}
        </div>
        {!loading && visible.length === 0 && (
          <p className="lesson-empty">Belum ada materi yang diterbitkan.</p>
        )}
      </div>
    </section>
  );
}
