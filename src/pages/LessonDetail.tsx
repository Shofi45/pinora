import { Navigate, useNavigate, useParams } from "react-router";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { RichText } from "@/components/RichText";
import { useLessons } from "@/hooks/useLessons";

export default function LessonDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lessons, loading } = useLessons();
  const lesson = lessons.find((l) => l.slug === slug);

  if (!lesson && loading)
    return (
      <section className="section">
        <div className="container">
          <p className="lesson-empty">Memuat materi…</p>
        </div>
      </section>
    );
  if (!lesson) return <Navigate to="/learn" replace />;

  return (
    <section className="section lesson-detail">
      <div className="container narrow">
        <button
          className="inline-link back-link"
          onClick={() => navigate("/learn")}
        >
          ← Semua materi
        </button>
        <div className="section-kicker">MATERI BELAJAR</div>
        <h1 className="lesson-title">{lesson.title}</h1>
        {!lesson.published && (
          <div className="draft-badge">
            Draf: belum terlihat oleh pengunjung
          </div>
        )}
        {lesson.summary && <p className="lesson-lead">{lesson.summary}</p>}
        {lesson.content.trim() ? (
          <RichText text={lesson.content} />
        ) : (
          <div className="important-note">
            <Icon name="book" />
            <p>
              <b>Segera hadir</b> Isi materi ini sedang disiapkan.
            </p>
          </div>
        )}
        <div className="lesson-detail-actions">
          <Button variant="secondary" onClick={() => navigate("/learn")}>
            Kembali ke materi
          </Button>
          <Button onClick={() => navigate("/calculate")}>
            Coba kalkulator <Icon name="arrow" />
          </Button>
        </div>
      </div>
    </section>
  );
}
