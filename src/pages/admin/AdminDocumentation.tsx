import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { ImageUploadButton } from "@/components/ImageUploadButton";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { getMediaUrl } from "@/lib/media";
import { supabase } from "@/lib/supabase";
import type { DocumentationItem } from "@/lib/types";

type Draft = Omit<DocumentationItem, "id"> & { id: string | null };
const blank = (order: number): Draft => ({
  id: null,
  slug: "",
  title: "",
  summary: "",
  content: "",
  cover_image: "",
  sort_order: order,
  published: false,
});
const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

export default function AdminDocumentation() {
  const [items, setItems] = useState<DocumentationItem[]>([]);
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
      .from("documentation_pages")
      .select("id,slug,title,summary,content,cover_image,sort_order,published")
      .order("sort_order")
      .order("created_at");
    if (error) setMessage({ ok: false, text: error.message });
    else setItems((data ?? []) as DocumentationItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || !draft) return;
    const slug = draft.slug || slugify(draft.title);
    if (!/^[a-z0-9-]{2,80}$/.test(slug)) {
      setMessage({ ok: false, text: "Slug hanya boleh berisi huruf kecil, angka, dan tanda minus." });
      return;
    }
    setSaving(true);
    const payload = {
      slug,
      title: draft.title.trim(),
      summary: draft.summary.trim(),
      content: draft.content.trim(),
      cover_image: draft.cover_image,
      sort_order: Number(draft.sort_order) || 0,
      published: draft.published,
      updated_at: new Date().toISOString(),
    };
    const result = draft.id
      ? await supabase.from("documentation_pages").update(payload).eq("id", draft.id)
      : await supabase.from("documentation_pages").insert(payload);
    setSaving(false);
    if (result.error) {
      setMessage({ ok: false, text: result.error.code === "23505" ? "Slug sudah dipakai dokumentasi lain." : result.error.message });
      return;
    }
    setDraft(null);
    setMessage({ ok: true, text: "Dokumentasi tersimpan." });
    await reload();
  };

  const remove = async (id: string) => {
    if (!supabase || !window.confirm("Hapus dokumentasi ini?")) return;
    const { error } = await supabase.from("documentation_pages").delete().eq("id", id);
    setMessage(error ? { ok: false, text: error.message } : { ok: true, text: "Dokumentasi dihapus." });
    await reload();
  };

  if (draft) {
    return (
      <form className="admin-panel admin-form" onSubmit={save}>
        <h3>{draft.id ? "Ubah dokumentasi" : "Dokumentasi baru"}</h3>
        <label>Judul<input required maxLength={120} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value, ...(!draft.id ? { slug: slugify(event.target.value) } : {}) })} /></label>
        <label>Slug<input required maxLength={80} value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: slugify(event.target.value) })} /><small>Alamat halaman: /dokumentasi/{draft.slug || "…"}</small></label>
        <label>Ringkasan<textarea rows={2} maxLength={500} value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} /></label>
        <div>
          <label className="admin-field-label">Gambar sampul</label>
          {draft.cover_image && <img className="admin-image-preview" src={getMediaUrl(draft.cover_image)} alt="Pratinjau sampul" />}
          <ImageUploadButton label={draft.cover_image ? "Ganti sampul" : "Unggah sampul"} onUploaded={(url) => setDraft({ ...draft, cover_image: url })} />
          {draft.cover_image && <button className="inline-link" type="button" onClick={() => setDraft({ ...draft, cover_image: "" })}>Hapus sampul</button>}
        </div>
        <label>Isi dokumentasi</label>
        <MarkdownEditor value={draft.content} onChange={(content) => setDraft({ ...draft, content })} rows={16} />
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
        <div><h3>Dokumentasi ({items.length})</h3><p className="admin-muted">Kelola panduan dan informasi yang tampil di website.</p></div>
        <Button onClick={() => { setMessage(null); setDraft(blank((items.at(-1)?.sort_order ?? 0) + 1)); }}>+ Dokumentasi</Button>
      </div>
      {message && <div className={message.ok ? "admin-ok" : "admin-error"}>{message.text}</div>}
      {loading ? <p className="lesson-empty">Memuat dokumentasi…</p> : items.length === 0 ? <p className="admin-muted">Belum ada dokumentasi.</p> : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>#</th><th>Sampul</th><th>Judul</th><th>Alamat</th><th>Status</th><th /></tr></thead>
            <tbody>{items.map((item) => (
              <tr key={item.id}>
                <td>{item.sort_order}</td>
                <td className="documentation-image-cell">
                  {item.cover_image ? (
                    <img
                      className="documentation-list-thumbnail"
                      src={getMediaUrl(item.cover_image)}
                      alt={`Sampul ${item.title}`}
                      loading="lazy"
                    />
                  ) : (
                    <span className="documentation-no-image">—</span>
                  )}
                </td>
                <td><b>{item.title}</b></td><td>/dokumentasi/{item.slug}</td>
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
