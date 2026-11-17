import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { useLessonQuiz } from "@/hooks/useLessonQuiz";

export function LessonQuiz({ lessonId }: { lessonId: string }) {
  const { quiz, loading } = useLessonQuiz(lessonId);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const current = quiz[step];
  const finished = quiz.length > 0 && step >= quiz.length;
  const percentage = useMemo(() => quiz.length ? Math.round((score / quiz.length) * 100) : 0, [quiz.length, score]);

  if (loading) return <div className="quiz-shell quiz-loading">Menyiapkan kuis…</div>;
  if (!quiz.length) return null;

  const checkAnswer = () => {
    if (selected === null || checked) return;
    setChecked(true);
    if (selected === current.answer_index) setScore((value) => value + 1);
  };

  const next = () => {
    setStep((value) => value + 1);
    setSelected(null);
    setChecked(false);
  };

  const restart = () => {
    setStep(0);
    setSelected(null);
    setChecked(false);
    setScore(0);
  };

  if (finished) {
    return (
      <section className="quiz-shell quiz-result" aria-label="Hasil kuis">
        <div className="quiz-result-icon"><Icon name={percentage >= 70 ? "check" : "book"} size={28} /></div>
        <div className="section-kicker">SELESAI</div>
        <h2>{percentage >= 70 ? "Keren, kamu sudah paham!" : "Tidak apa-apa, coba lagi pelan-pelan."}</h2>
        <p>Kamu menjawab <b>{score} dari {quiz.length}</b> pertanyaan dengan benar.</p>
        <div className="quiz-score"><strong>{percentage}%</strong><span>skor kamu</span></div>
        <Button variant="secondary" onClick={restart}>Ulangi kuis</Button>
      </section>
    );
  }

  const isCorrect = selected === current.answer_index;
  return (
    <section className="quiz-shell" aria-label="Kuis materi">
      <div className="quiz-heading">
        <div>
          <div className="section-kicker">CEK PEMAHAMAN</div>
          <h2>Kuis singkat</h2>
        </div>
        <span className="quiz-count">{step + 1} / {quiz.length}</span>
      </div>
      <div className="quiz-progress"><i style={{ width: `${((step + (checked ? 1 : 0)) / quiz.length) * 100}%` }} /></div>
      <h3 className="quiz-question">{current.question}</h3>
      <div className="quiz-options">
        {current.options.map((option, index) => {
          const state = checked && index === current.answer_index ? " correct" : checked && index === selected ? " wrong" : selected === index ? " selected" : "";
          return <button key={option} className={`quiz-option${state}`} onClick={() => !checked && setSelected(index)} disabled={checked}>
            <span>{String.fromCharCode(65 + index)}</span>{option}
          </button>;
        })}
      </div>
      {checked && <div className={`quiz-feedback ${isCorrect ? "success" : "error"}`}><b>{isCorrect ? "Jawaban benar." : "Belum tepat."}</b><p>{current.explanation}</p></div>}
      <div className="quiz-actions">
        {!checked ? <Button onClick={checkAnswer} disabled={selected === null}>Periksa jawaban</Button> : <Button onClick={next}>{step === quiz.length - 1 ? "Lihat hasil" : "Pertanyaan berikutnya"} <Icon name="arrow" size={17} /></Button>}
      </div>
    </section>
  );
}
