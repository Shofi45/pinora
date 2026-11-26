import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { supabase } from "@/lib/supabase";
import type { FaqItem } from "@/lib/types";

type Draft = Omit<FaqItem, "id"> & { id: string | null };
const blank = (order: number): Draft => ({
  id: null,
  question: "",
  answer: "",
  sort_order: order,
  published: false,
});

export default function AdminFaq() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const reload = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      setMessage({ ok: false, text: "Supabase belum dikonfigurasi." });
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("faq_items")
      .select("id,question,answer,sort_order,published")
      .order("sort_order")
      .order("created_at");
    if (error) setMessage({ ok: false, text: error.message });
    else setItems((data ?? []) as FaqItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || !draft) return;
    setSaving(true);
    const payload = {
      question: draft.question.trim(),
      answer: draft.answer.trim(),
      sort_order: Number(draft.sort_order) || 0,
      published: draft.published,
      updated_at: new Date().toISOString(),
    };
    const result = draft.id
      ? await supabase.from("faq_items").update(payload).eq("id", draft.id)
      : await supabase.from("faq_items").insert(payload);
    setSaving(false);
    if (result.error) {
      setMessage({ ok: false, text: result.error.message });
      return;
    }
    setDraft(null);
    setMessage({ ok: true, text: "FAQ tersimpan." });
    await reload();
  };

  const remove = async (id: string) => {
    if (!supabase || !window.confirm("Hapus pertanyaan ini?")) return;
    const { error } = await supabase.from("faq_items").delete().eq("id", id);
    setMessage(error ? { ok: false, text: error.message } : { ok: true, text: "FAQ dihapus." });
    await reload();
  };

  if (draft) {
    return (
      <form className="admin-panel admin-form" onSubmit={save}>
        <h3>{draft.id ? "Ubah FAQ" : "FAQ baru"}</h3>
        <label htmlFor="faq-question">Pertanyaan</label>
        <input id="faq-question" required maxLength={300} value={draft.question} onChange={(event) => setDraft({ ...draft, question: event.target.value })} />
        <label htmlFor="faq-answer">Jawaban</label>
        <MarkdownEditor value={draft.answer} onChange={(answer) => setDraft({ ...draft, answer })} rows={8} maxLength={12000} />
        <div className="form-row">
          <label>Urutan<input type="number" value={draft.sort_order} onChange={(event) => setDraft({ ...draft, sort_order: Number(event.target.value) })} /></label>
          <label className="check"><input type="checkbox" checked={draft.published} onChange={(event) => setDraft({ ...draft, published: event.target.checked })} /> Terbitkan</label>
        </div>
        {message && !message.ok && <div className="admin-error">{message.text}</div>}
        <div className="form-actions">
          <Button type="submit" disabled={saving}>{saving ? "Menyimpan…" : "Simpan"}</Button>
          <Button type="button" variant="secondary" onClick={() => setDraft(null)}>Batal</Button>
        </div>
      </form>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-toolbar">
        <div><h3>FAQ ({items.length})</h3><p className="admin-muted">Kelola pertanyaan yang tampil di halaman publik.</p></div>
        <Button onClick={() => { setMessage(null); setDraft(blank((items.at(-1)?.sort_order ?? 0) + 1)); }}>+ FAQ baru</Button>
      </div>
      {message && <div className={message.ok ? "admin-ok" : "admin-error"}>{message.text}</div>}
      {loading ? <p className="lesson-empty">Memuat FAQ…</p> : items.length === 0 ? <p className="admin-muted">Belum ada FAQ.</p> : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>#</th><th>Pertanyaan</th><th>Status</th><th /></tr></thead>
            <tbody>{items.map((item) => (
              <tr key={item.id}>
                <td>{item.sort_order}</td><td><b>{item.question}</b></td>
                <td><span className={`pill ${item.published ? "admin" : "off"}`}>{item.published ? "Terbit" : "Draf"}</span></td>
                <td className="actions">
                  <button onClick={() => { setMessage(null); setDraft({ ...item }); }}>Ubah</button>
                  <button className="danger" onClick={() => void remove(item.id)}>Hapus</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
