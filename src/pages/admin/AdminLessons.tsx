import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { CurriculumEditor } from "@/components/admin/CurriculumEditor";
import { useLessons } from "@/hooks/useLessons";
import { LESSON_ACCENTS, LESSON_ICONS, LESSON_TARGETS } from "@/lib/lessons";
import { getBuiltInLessonContent } from "@/lib/lesson-content";
import { parseLessonOutline } from "@/lib/lesson-outline";
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

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export default function AdminLessons() {
  const { lessons, fromDb, loading, reload } = useLessons();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    if (draft || loading) return;
    if (!lessons.some((lesson) => lesson.id === selectedId)) {
      setSelectedId(lessons[0]?.id ?? null);
    }
  }, [draft, lessons, loading, selectedId]);

  const selectedTheme = lessons.find((lesson) => lesson.id === selectedId);
  const builtInContent =
    selectedTheme && !selectedTheme.content.trim()
      ? getBuiltInLessonContent(selectedTheme.slug)
      : null;
  const selectedOutline = selectedTheme
    ? parseLessonOutline(
        selectedTheme.content.trim()
          ? selectedTheme.content
          : (builtInContent ?? ""),
      )
    : null;
  const builtInOutline = builtInContent
    ? parseLessonOutline(builtInContent)
    : null;
  const builtInMaterialCount =
    builtInOutline?.chapters.reduce(
      (total, chapter) => total + chapter.materials.length,
      0,
    ) ?? 0;

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) =>
      current ? { ...current, [key]: value } : current,
    );

  const save = async (event: FormEvent) => {
    event.preventDefault();
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

    let error: { code?: string; message: string } | null = null;
    let savedId = draft.id;
    if (draft.id) {
      const result = await supabase
        .from("lessons")
        .update(payload)
        .eq("id", draft.id);
      error = result.error;
    } else {
      const result = await supabase
        .from("lessons")
        .insert(payload)
        .select("id")
        .single();
      error = result.error;
      savedId = result.data?.id ?? null;
    }
    setSaving(false);

    if (error) {
      setMsg({
        ok: false,
        text:
          error.code === "23505"
            ? "Alamat (slug) sudah dipakai tema lain."
            : error.message,
      });
      return;
    }
    if (!savedId) {
      setMsg({
        ok: false,
        text: "Tema tersimpan, tetapi ID-nya tidak diterima. Muat ulang daftar tema.",
      });
      setDraft(null);
      await reload();
      return;
    }

    setMsg({ ok: true, text: "Tema berhasil disimpan." });
    setDraft(null);
    setSelectedId(savedId);
    await reload();
  };

  const remove = async (lesson: Lesson) => {
    if (!supabase) return;
    if (!window.confirm(`Hapus tema "${lesson.title}" beserta seluruh isinya?`))
      return;

    const { error } = await supabase
      .from("lessons")
      .delete()
      .eq("id", lesson.id);
    if (error) {
      setMsg({ ok: false, text: error.message });
      return;
    }

    const nextTheme = lessons.find((item) => item.id !== lesson.id);
    if (selectedId === lesson.id) setSelectedId(nextTheme?.id ?? null);
    setMsg({ ok: true, text: "Tema berhasil dihapus." });
    await reload();
  };

  const togglePublish = async (lesson: Lesson) => {
    if (!supabase) return;
    const { error } = await supabase
      .from("lessons")
      .update({
        published: !lesson.published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", lesson.id);
    if (error) {
      setMsg({ ok: false, text: error.message });
      return;
    }
    setMsg({
      ok: true,
      text: lesson.published ? "Tema ditarik dari publik." : "Tema diterbitkan.",
    });
    await reload();
  };

  const chooseTheme = (id: string) => {
    if (draft && !window.confirm("Batalkan perubahan yang belum disimpan?"))
      return;
    setDraft(null);
    setMsg(null);
    setSelectedId(id);
  };

  const startNewTheme = () => {
    if (draft && !window.confirm("Batalkan perubahan yang belum disimpan?"))
      return;
    const nextOrder = lessons.reduce(
      (max, lesson) => Math.max(max, lesson.sort_order),
      0,
    );
    setSelectedId(null);
    setMsg(null);
    setDraft(blank(nextOrder + 1));
  };

  const filteredLessons = lessons.filter((lesson) =>
    `${lesson.title} ${lesson.slug} ${lesson.summary}`
      .toLowerCase()
      .includes(search.toLowerCase().trim()),
  );

  return (
    <div className="admin-panel curriculum-layout">
      <aside className="curriculum-sidebar">
        <div className="curriculum-sidebar-heading">
          <span className="curriculum-eyebrow">KONTEN BELAJAR</span>
          <h3>Tema</h3>
          <p>Pilih satu tema untuk melihat bab dan materinya.</p>
        </div>
        <Button onClick={startNewTheme} disabled={!fromDb}>
          + Tambah tema
        </Button>
        <input
          className="curriculum-theme-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari tema..."
          aria-label="Cari tema"
        />
        {!fromDb && !loading && (
          <div className="admin-error curriculum-sidebar-error">
            Data masih bawaan. Jalankan <code>supabase/admin.sql</code> untuk
            mengelola tema.
          </div>
        )}
        <nav className="curriculum-theme-nav" aria-label="Pilih tema belajar">
          {filteredLessons.map((lesson) => {
            const outline = parseLessonOutline(lesson.content);
            const materialCount = outline.chapters.reduce(
              (total, chapter) => total + chapter.materials.length,
              0,
            );
            const builtInContent = lesson.content.trim()
              ? null
              : getBuiltInLessonContent(lesson.slug);
            const builtInOutline = builtInContent
              ? parseLessonOutline(builtInContent)
              : null;
            const builtInMaterialCount =
              builtInOutline?.chapters.reduce(
                (total, chapter) => total + chapter.materials.length,
                0,
              ) ?? 0;
            return (
              <button
                type="button"
                key={lesson.id}
                className={selectedId === lesson.id ? "active" : ""}
                onClick={() => chooseTheme(lesson.id)}
              >
                <span className="curriculum-theme-nav-title">
                  <b>{lesson.title}</b>
                  <span
                    className={`curriculum-theme-nav-status ${lesson.published ? "published" : "draft"}`}
                  >
                    {lesson.published ? "Terbit" : "Draf"}
                  </span>
                </span>
                <small>
                  {builtInOutline
                    ? `${builtInOutline.chapters.length} bab · ${builtInMaterialCount} materi bawaan`
                    : `${outline.chapters.length} bab · ${materialCount} materi`}
                </small>
                {builtInOutline && (
                  <small className="curriculum-template-label">
                    Belum tersalin ke Supabase
                  </small>
                )}
              </button>
            );
          })}
          {!filteredLessons.length && (
            <p className="curriculum-chapter-sidebar-empty">
              {search ? "Tema tidak ditemukan." : "Belum ada tema."}
            </p>
          )}
        </nav>
      </aside>

      <main className="curriculum-main">
        {msg && (
          <div className={msg.ok ? "admin-ok" : "admin-error"}>{msg.text}</div>
        )}

        {draft ? (
          <form className="admin-form curriculum-form" onSubmit={save}>
            <header className="curriculum-form-heading">
              <span className="curriculum-eyebrow">
                {draft.id ? "EDIT TEMA" : "TEMA BARU"}
              </span>
              <h2>{draft.title || "Atur tema belajar"}</h2>
              <p>
                Lengkapi informasi tema, lalu pilih bab di panel bab untuk
                mengelola materinya.
              </p>
            </header>

            <section className="curriculum-theme-fields">
              <h3>Informasi tema</h3>
              <label>
                Nama tema
                <input
                  required
                  maxLength={80}
                  value={draft.title}
                  onChange={(event) => {
                    set("title", event.target.value);
                    if (!draft.id) set("slug", slugify(event.target.value));
                  }}
                />
              </label>
              <label>
                Alamat halaman (slug)
                <input
                  required
                  maxLength={60}
                  value={draft.slug}
                  onChange={(event) =>
                    set("slug", slugify(event.target.value))
                  }
                />
                <small>/learn/{draft.slug || "…"}</small>
              </label>
              <label>
                Ringkasan
                <textarea
                  rows={2}
                  maxLength={300}
                  value={draft.summary}
                  onChange={(event) => set("summary", event.target.value)}
                />
              </label>
              <div className="form-row">
                <label>
                  Label kartu
                  <input
                    maxLength={40}
                    placeholder="mis. 4 bab"
                    value={draft.tag}
                    onChange={(event) => set("tag", event.target.value)}
                  />
                </label>
                <label>
                  Urutan tema
                  <input
                    type="number"
                    value={draft.sort_order}
                    onChange={(event) =>
                      set("sort_order", Number(event.target.value))
                    }
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Ikon
                  <select
                    value={draft.icon}
                    onChange={(event) =>
                      set("icon", event.target.value as Draft["icon"])
                    }
                  >
                    {LESSON_ICONS.map((icon) => (
                      <option key={icon}>{icon}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Warna kartu
                  <select
                    value={draft.accent}
                    onChange={(event) =>
                      set("accent", event.target.value as Draft["accent"])
                    }
                  >
                    {LESSON_ACCENTS.map((accent) => (
                      <option key={accent}>{accent}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label>
                Tujuan saat kartu diklik
                <select
                  value={draft.target}
                  onChange={(event) =>
                    set("target", event.target.value as Draft["target"])
                  }
                >
                  {LESSON_TARGETS.map((target) => (
                    <option key={target.value} value={target.value}>
                      {target.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={draft.published}
                  onChange={(event) => set("published", event.target.checked)}
                />
                Terbitkan tema
              </label>
            </section>

            {draft.target === "page" && (
              <section className="curriculum-content-section">
                <div className="curriculum-section-title">
                  <span className="curriculum-step-number">2</span>
                  <div>
                    <h3>Bab dan materi</h3>
                    <p>
                      Pilih bab di sisi kiri bagian ini. Isi bab akan tampil
                      satu per satu agar lebih mudah dikelola.
                    </p>
                  </div>
                </div>
                <CurriculumEditor
                  key={draft.id ?? "new-theme"}
                  value={draft.content}
                  onChange={(content) => set("content", content)}
                />
              </section>
            )}

            <div className="form-actions">
              <Button type="submit" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan tema"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedId(draft.id);
                  setDraft(null);
                  setMsg(null);
                }}
              >
                Batal
              </Button>
            </div>
          </form>
        ) : selectedTheme && selectedOutline ? (
          <section className="curriculum-overview">
            <header className="curriculum-overview-heading">
              <div>
                <span className="curriculum-eyebrow">TEMA BELAJAR</span>
                <h2>{selectedTheme.title}</h2>
                <p>{selectedTheme.summary || "Belum ada ringkasan tema."}</p>
                <div className="curriculum-overview-meta">
                  <span>/learn/{selectedTheme.slug}</span>
                  <span>{selectedOutline.chapters.length} bab</span>
                </div>
              </div>
              <div className="curriculum-overview-actions">
                <span
                  className={`pill ${selectedTheme.published ? "admin" : "off"}`}
                >
                  {selectedTheme.published ? "Terbit" : "Draf"}
                </span>
                <Button
                  variant="secondary"
                  disabled={!fromDb}
                  onClick={() =>
                    setDraft({
                      ...selectedTheme,
                      content: selectedTheme.content.trim()
                        ? selectedTheme.content
                        : (builtInContent ?? selectedTheme.content),
                    })
                  }
                >
                  Kelola tema & bab
                </Button>
                <button
                  type="button"
                  className="curriculum-text-action"
                  disabled={!fromDb}
                  onClick={() => void togglePublish(selectedTheme)}
                >
                  {selectedTheme.published ? "Tarik dari publik" : "Terbitkan"}
                </button>
                <button
                  type="button"
                  className="curriculum-text-action danger"
                  disabled={!fromDb}
                  onClick={() => void remove(selectedTheme)}
                >
                  Hapus tema
                </button>
              </div>
            </header>

            {selectedOutline.intro && (
              <div className="curriculum-overview-intro">
                <b>Pengantar tema</b>
                <p>{selectedOutline.intro}</p>
              </div>
            )}

            {builtInOutline && (
              <div className="curriculum-template-note">
                <div>
                  <b>
                    Materi bawaan tersedia, tetapi belum tersimpan di Supabase.
                  </b>
                  <p>
                    Ada {builtInOutline.chapters.length} bab dan{" "}
                    {builtInMaterialCount} materi. Pilih “Kelola tema & bab”,
                    lalu simpan untuk menyalinnya ke data admin.
                  </p>
                </div>
              </div>
            )}

            <div className="curriculum-overview-section-heading">
              <div>
                <span className="curriculum-eyebrow">ISI TEMA</span>
                <h3>Bab dan materi</h3>
              </div>
              <span>{selectedOutline.chapters.length} bab</span>
            </div>
            <div className="curriculum-overview-chapters">
              {selectedOutline.chapters.map((chapter, index) => (
                <article className="curriculum-overview-chapter" key={chapter.id}>
                  <div className="curriculum-overview-chapter-heading">
                    <span className="curriculum-step-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4>{chapter.title}</h4>
                      <small>{chapter.materials.length} materi</small>
                    </div>
                  </div>
                  {chapter.materials.length ? (
                    <ul>
                      {chapter.materials.map((material, materialIndex) => (
                        <li key={material.id}>
                          <b>
                            {material.title || `Materi ${materialIndex + 1}`}
                          </b>
                          {material.content && (
                            <small>
                              {material.content.replace(/\s+/g, " ").slice(0, 150)}
                            </small>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="curriculum-empty">
                      Bab ini belum memiliki materi.
                    </p>
                  )}
                </article>
              ))}
              {!selectedOutline.chapters.length && (
                <div className="curriculum-empty">
                  Belum ada bab. Tekan “Kelola tema & bab” untuk menambah bab
                  pertama.
                </div>
              )}
            </div>
          </section>
        ) : (
          <div className="curriculum-empty curriculum-main-empty">
            {loading ? "Memuat tema..." : "Pilih tema di sidebar untuk melihat isinya."}
          </div>
        )}
      </main>
    </div>
  );
}
