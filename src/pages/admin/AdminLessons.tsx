import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { useLessons } from "@/hooks/useLessons";
import { LESSON_ACCENTS, LESSON_ICONS, LESSON_TARGETS } from "@/lib/lessons";
import { supabase } from "@/lib/supabase";
import type { Lesson } from "@/lib/types";

type Draft = Omit<Lesson, "id"> & { id: string | null };

const blank = (order: number): Draft => ({
  id: null,
  slug: "",
  title: "",
  summary: "",
  tag: "",
  icon: "book",
  accent: "blue",
  target: "page",
  content: "",
  sort_order: order,
  published: true,
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export default function AdminLessons() {
  const { lessons, fromDb, loading, reload } = useLessons();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    void reload();
  }, [reload]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase || !draft) return;
    const slug = draft.slug || slugify(draft.title);
    if (!/^[a-z0-9-]{2,60}$/.test(slug)) {
      setMsg({
        ok: false,
        text: "Alamat (slug) hanya boleh huruf kecil, angka, dan tanda minus, minimal 2 karakter.",
      });
      return;
    }
    setSaving(true);
    const payload = {
      slug,
      title: draft.title.trim(),
      summary: draft.summary.trim(),
      tag: draft.tag.trim(),
      icon: draft.icon,
      accent: draft.accent,
      target: draft.target,
      content: draft.content,
      sort_order: Number(draft.sort_order) || 0,
      published: draft.published,
      updated_at: new Date().toISOString(),
    };
    const { error } = draft.id
      ? await supabase.from("lessons").update(payload).eq("id", draft.id)
      : await supabase.from("lessons").insert(payload);
    setSaving(false);
    if (error) {
      setMsg({
        ok: false,
        text:
          error.code === "23505"
            ? "Alamat (slug) sudah dipakai materi lain."
            : error.message,
      });
      return;
    }
    setMsg({ ok: true, text: "Materi tersimpan." });
    setDraft(null);
    await reload();
  };

  const remove = async (id: string) => {
    if (!supabase) return;
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }
    const { error } = await supabase.from("lessons").delete().eq("id", id);
    setConfirmId(null);
    setMsg(
      error
        ? { ok: false, text: error.message }
        : { ok: true, text: "Materi dihapus." },
    );
    await reload();
  };

  const togglePublish = async (l: Lesson) => {
    if (!supabase) return;
    const { error } = await supabase
      .from("lessons")
      .update({ published: !l.published, updated_at: new Date().toISOString() })
      .eq("id", l.id);
    if (error) setMsg({ ok: false, text: error.message });
    await reload();
  };

  if (draft) {
    return (
      <form className="admin-panel admin-form" onSubmit={save}>
        <h3>{draft.id ? "Ubah materi" : "Materi baru"}</h3>
        <label>
          Judul
          <input
            required
            maxLength={80}
            value={draft.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (!draft.id) set("slug", slugify(e.target.value));
            }}
          />
        </label>
        <label>
          Alamat halaman (slug)
          <input
            required
            maxLength={60}
            value={draft.slug}
            onChange={(e) => set("slug", slugify(e.target.value))}
          />
          <small>Muncul sebagai /learn/{draft.slug || "…"}</small>
        </label>
        <label>
          Ringkasan di kartu
          <textarea
            rows={2}
            maxLength={300}
            value={draft.summary}
            onChange={(e) => set("summary", e.target.value)}
          />
        </label>
        <div className="form-row">
          <label>
            Teks tombol kartu
            <input
              maxLength={40}
              placeholder="mis. 4 materi"
              value={draft.tag}
              onChange={(e) => set("tag", e.target.value)}
            />
          </label>
          <label>
            Urutan
            <input
              type="number"
              value={draft.sort_order}
              onChange={(e) => set("sort_order", Number(e.target.value))}
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Ikon
            <select
              value={draft.icon}
              onChange={(e) => set("icon", e.target.value as Draft["icon"])}
            >
              {LESSON_ICONS.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </label>
          <label>
            Warna kartu
            <select
              value={draft.accent}
              onChange={(e) => set("accent", e.target.value as Draft["accent"])}
            >
              {LESSON_ACCENTS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Saat kartu diklik
          <select
            value={draft.target}
            onChange={(e) => set("target", e.target.value as Draft["target"])}
          >
            {LESSON_TARGETS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        {draft.target === "page" && (
          <label>
            Isi materi
            <textarea
              rows={14}
              maxLength={100000}
              value={draft.content}
              onChange={(e) => set("content", e.target.value)}
            />
            <small>
              Pisahkan paragraf dengan baris kosong. Awali baris dengan "## "
              untuk subjudul dan "- " untuk daftar poin.
            </small>
          </label>
        )}
        <label className="check">
          <input
            type="checkbox"
            checked={draft.published}
            onChange={(e) => set("published", e.target.checked)}
          />{" "}
          Terbitkan (terlihat oleh pengunjung)
        </label>
        {msg && !msg.ok && <div className="admin-error">{msg.text}</div>}
        <div className="form-actions">
          <Button type="submit" disabled={saving}>
            {saving ? "Menyimpan…" : "Simpan"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setDraft(null);
              setMsg(null);
            }}
          >
            Batal
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-toolbar">
        <h3>Materi belajar ({lessons.length})</h3>
        <Button
          onClick={() => {
            setMsg(null);
            setDraft(blank((lessons.at(-1)?.sort_order ?? 0) + 1));
          }}
          disabled={!fromDb}
        >
          + Materi baru
        </Button>
      </div>
      {!fromDb && !loading && (
        <div className="admin-error">
          Tabel materi belum tersedia, jadi yang tampil adalah data bawaan.
          Jalankan supabase/admin.sql di SQL Editor lalu muat ulang halaman.
        </div>
      )}
      {msg && (
        <div className={msg.ok ? "admin-ok" : "admin-error"}>{msg.text}</div>
      )}
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Judul</th>
              <th>Alamat</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {lessons.map((l) => (
              <tr key={l.id}>
                <td>{l.sort_order}</td>
                <td>
                  <b>{l.title}</b>
                </td>
                <td>
                  {l.target === "page"
                    ? `/learn/${l.slug}`
                    : l.target === "sc-btn"
                      ? "halaman SC BTN"
                      : "halaman Kalkulator"}
                </td>
                <td>
                  <span className={`pill ${l.published ? "admin" : "off"}`}>
                    {l.published ? "Terbit" : "Draf"}
                  </span>
                </td>
                <td className="actions">
                  <button
                    disabled={!fromDb}
                    onClick={() => {
                      setMsg(null);
                      setDraft({ ...l });
                    }}
                  >
                    Ubah
                  </button>
                  <button
                    disabled={!fromDb}
                    onClick={() => void togglePublish(l)}
                  >
                    {l.published ? "Tarik" : "Terbitkan"}
                  </button>
                  <button
                    className="danger"
                    disabled={!fromDb}
                    onClick={() => void remove(l.id)}
                    onBlur={() => setConfirmId(null)}
                  >
                    {confirmId === l.id ? "Yakin hapus?" : "Hapus"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
