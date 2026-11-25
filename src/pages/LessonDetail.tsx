import { Navigate, useNavigate, useParams } from "react-router";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { LessonQuiz } from "@/components/LessonQuiz";
import { LessonReader } from "@/components/LessonReader";
import { LessonVisuals } from "@/components/LessonVisuals";
import { useLessons } from "@/hooks/useLessons";
import creditMaterial from "@/data/materials/dokumen-kredit.json";
import savingMaterial from "@/data/materials/menabung-di-btn.json";

const sourceContent: Record<string, string> = {
  "menabung-di-btn": savingMaterial.content,
  "tabungan-btn-dan-customer-service": savingMaterial.content,
  "dokumen-kredit": creditMaterial.content,
};

export default function LessonDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lessons, loading } = useLessons();
  const lesson = lessons.find((l) => l.slug === slug);
  const sourceText = sourceContent[lesson?.slug ?? ""];
  const content =
    sourceText?.replace(/\]\(\/materi\//g, `](${import.meta.env.BASE_URL}materi/`) ||
    lesson?.content.trim() ||
    "";

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
      <div className="container lesson-reader-container">
        <button
          className="inline-link back-link"
          onClick={() => navigate("/learn")}
        >
          ← Semua materi
        </button>
        <div className="lesson-detail-head">
          <div className="lesson-detail-badge">
            <Icon name={lesson.icon} size={17} />{" "}
            {lesson.tag || "MATERI BELAJAR"}
          </div>
          <h1 className="lesson-title">{lesson.title}</h1>
          {!lesson.published && (
            <div className="draft-badge">
              Draf: belum terlihat oleh pengunjung
            </div>
          )}
          {lesson.summary && <p className="lesson-lead">{lesson.summary}</p>}
          <div className="lesson-reading-meta">
            <span>
              <Icon name="book" size={15} /> Bacaan praktis
            </span>
            <span>
              <Icon name="check" size={15} /> Bisa dipelajari bertahap
            </span>
          </div>
        </div>
        {!content.includes("![") && <LessonVisuals slug={lesson.slug} />}
        <div className="lesson-detail-body">
          {content ? (
            <LessonReader text={content} />
          ) : (
            <div className="important-note">
              <Icon name="book" />
              <p>
                <b>Segera hadir</b> Isi materi ini sedang disiapkan.
              </p>
            </div>
          )}
        </div>
        <LessonQuiz lessonId={lesson.id} />
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
