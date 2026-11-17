import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { useLessonQuiz } from "@/hooks/useLessonQuiz";
import { useLessons } from "@/hooks/useLessons";
import { supabase } from "@/lib/supabase";
import type { LessonQuiz } from "@/lib/types";

type Draft = Omit<LessonQuiz, "id"> & { id: string | null };
const blank = (lessonId: string, order: number): Draft => ({ id: null, lesson_id: lessonId, question: "", options: ["", "", "", ""], answer_index: 0, explanation: "", sort_order: order, published: true });

export default function AdminQuiz() {
  const { lessons } = useLessons();
  const [lessonId, setLessonId] = useState("");
  const { quiz, loading, reload } = useLessonQuiz(lessonId, true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const lesson = useMemo(() => lessons.find((item) => item.id === lessonId), [lessonId, lessons]);

  useEffect(() => {
    if (!lessonId && lessons[0]) setLessonId(lessons[0].id);
  }, [lessonId, lessons]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || !draft) return;
    const options = draft.options.map((value) => value.trim()).filter(Boolean);
    if (options.length < 2 || draft.answer_index >= options.length) {
      setMsg({ ok: false, text: "Isi minimal dua pilihan dan pastikan jawaban benar tersedia." });
      return;
    }
    setSaving(true);
    const payload = { lesson_id: draft.lesson_id, question: draft.question.trim(), options, answer_index: draft.answer_index, explanation: draft.explanation.trim(), sort_order: Number(draft.sort_order) || 1, published: draft.published, updated_at: new Date().toISOString() };
    const result = draft.id ? await supabase.from("lesson_quizzes").update(payload).eq("id", draft.id) : await supabase.from("lesson_quizzes").insert(payload);
    setSaving(false);
    if (result.error) { setMsg({ ok: false, text: result.error.message }); return; }
    setMsg({ ok: true, text: "Pertanyaan tersimpan." });
    setDraft(null);
    await reload();
  };

  const remove = async (id: string) => {
    if (!supabase || !window.confirm("Hapus pertanyaan ini?")) return;
    const { error } = await supabase.from("lesson_quizzes").delete().eq("id", id);
    setMsg(error ? { ok: false, text: error.message } : { ok: true, text: "Pertanyaan dihapus." });
    await reload();
  };

  if (draft) return <form className="admin-panel admin-form" onSubmit={save}>
    <h3>{draft.id ? "Ubah pertanyaan" : "Pertanyaan baru"}</h3>
    <label>Pertanyaan<textarea required rows={3} maxLength={500} value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} /></label>
    <div className="quiz-admin-options">{draft.options.map((option, index) => <label key={index}>Pilihan {String.fromCharCode(65 + index)}<input value={option} onChange={(e) => setDraft({ ...draft, options: draft.options.map((item, i) => i === index ? e.target.value : item) })} /></label>)}</div>
    <div className="form-row"><label>Jawaban benar<select value={draft.answer_index} onChange={(e) => setDraft({ ...draft, answer_index: Number(e.target.value) })}>{draft.options.map((_, index) => <option key={index} value={index}>Pilihan {String.fromCharCode(65 + index)}</option>)}</select></label><label>Urutan<input type="number" min={1} value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} /></label></div>
    <label>Pembahasan<textarea rows={3} maxLength={1000} value={draft.explanation} onChange={(e) => setDraft({ ...draft, explanation: e.target.value })} /></label>
    <label className="check"><input type="checkbox" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> Terbitkan pertanyaan</label>
    {msg && !msg.ok && <div className="admin-error">{msg.text}</div>}
    <div className="form-actions"><Button type="submit" disabled={saving}>{saving ? "Menyimpan…" : "Simpan"}</Button><Button variant="secondary" onClick={() => setDraft(null)}>Batal</Button></div>
  </form>;

  return <div className="admin-panel">
    <div className="admin-toolbar"><div><h3>Kelola kuis</h3><p className="admin-muted">Buat kuis singkat di akhir setiap materi.</p></div><Button disabled={!lessonId} onClick={() => setDraft(blank(lessonId, (quiz.at(-1)?.sort_order ?? 0) + 1))}>+ Pertanyaan</Button></div>
    <label className="quiz-admin-select">Pilih materi<select value={lessonId} onChange={(e) => { setLessonId(e.target.value); setMsg(null); }}>{lessons.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
    {msg && <div className={msg.ok ? "admin-ok" : "admin-error"}>{msg.text}</div>}
    {loading ? <p className="lesson-empty">Memuat pertanyaan…</p> : quiz.length === 0 ? <div className="quiz-admin-empty">Belum ada pertanyaan untuk materi ini.</div> : <div className="quiz-admin-list">{quiz.map((item) => <article className="quiz-admin-item" key={item.id}><div><span className="quiz-admin-number">{String(item.sort_order).padStart(2, "0")}</span><div><b>{item.question}</b><small>{item.options.length} pilihan · {item.published ? "Terbit" : "Draf"}</small></div></div><div className="actions"><button onClick={() => setDraft({ ...item, options: [...item.options] })}>Ubah</button><button className="danger" onClick={() => void remove(item.id)}>Hapus</button></div></article>)}</div>}
  </div>;
}
