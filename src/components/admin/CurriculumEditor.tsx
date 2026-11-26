import { useState } from "react";
import { Button } from "@/components/Button";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { uid } from "@/lib/format";
import {
  parseLessonOutline,
  serializeLessonOutline,
  type LessonChapterDraft,
  type LessonMaterialDraft,
} from "@/lib/lesson-outline";

export function CurriculumEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [outline, setOutline] = useState(() => parseLessonOutline(value));
  const [activeChapterId, setActiveChapterId] = useState(
    () => parseLessonOutline(value).chapters[0]?.id ?? null,
  );
  const activeChapter = outline.chapters.find(
    (chapter) => chapter.id === activeChapterId,
  );

  const update = (next: typeof outline) => {
    setOutline(next);
    onChange(serializeLessonOutline(next));
  };

  const updateChapter = (id: string, patch: Partial<LessonChapterDraft>) =>
    update({
      ...outline,
      chapters: outline.chapters.map((chapter) =>
        chapter.id === id ? { ...chapter, ...patch } : chapter,
      ),
    });

  const updateMaterial = (
    chapterId: string,
    materialId: string,
    patch: Partial<LessonMaterialDraft>,
  ) =>
    update({
      ...outline,
      chapters: outline.chapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              materials: chapter.materials.map((material) =>
                material.id === materialId
                  ? { ...material, ...patch }
                  : material,
              ),
            }
          : chapter,
      ),
    });

  const addChapter = () => {
    const chapter = {
      id: uid(),
      title: "",
      intro: "",
      materials: [],
    };
    update({ ...outline, chapters: [...outline.chapters, chapter] });
    setActiveChapterId(chapter.id);
  };

  const moveChapter = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= outline.chapters.length) return;
    const chapters = [...outline.chapters];
    [chapters[index], chapters[target]] = [chapters[target], chapters[index]];
    update({ ...outline, chapters });
  };

  const moveMaterial = (index: number, direction: -1 | 1) => {
    if (!activeChapter) return;
    const target = index + direction;
    if (target < 0 || target >= activeChapter.materials.length) return;
    const materials = [...activeChapter.materials];
    [materials[index], materials[target]] = [
      materials[target],
      materials[index],
    ];
    updateChapter(activeChapter.id, { materials });
  };

  const removeChapter = (chapterIndex: number) => {
    if (!activeChapter) return;
    if (
      !window.confirm(
        `Hapus bab "${activeChapter.title || "tanpa judul"}" beserta materinya?`,
      )
    )
      return;

    const chapters = outline.chapters.filter(
      (chapter) => chapter.id !== activeChapter.id,
    );
    update({ ...outline, chapters });
    setActiveChapterId(
      chapters[Math.max(0, chapterIndex - 1)]?.id ?? chapters[0]?.id ?? null,
    );
  };

  return (
    <div className="curriculum-editor">
      <section className="curriculum-theme-intro">
        <div>
          <h4>Pengantar tema <span>Opsional</span></h4>
          <p>Pengantar tampil sebelum daftar bab pada halaman belajar.</p>
        </div>
        <MarkdownEditor
          value={outline.intro}
          onChange={(intro) => update({ ...outline, intro })}
          rows={4}
          placeholder="Tulis pengantar singkat untuk tema ini."
        />
      </section>

      <section className="curriculum-chapter-workbench">
        <aside className="curriculum-chapter-sidebar">
          <div className="curriculum-chapter-sidebar-head">
            <div>
              <span className="curriculum-eyebrow">ISI TEMA</span>
              <h4>Daftar bab</h4>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="curriculum-add-chapter"
              onClick={addChapter}
            >
              + Bab
            </Button>
          </div>
          <nav aria-label="Pilih bab">
            {outline.chapters.map((chapter, index) => (
              <button
                type="button"
                key={chapter.id}
                className={
                  chapter.id === activeChapterId ? "active" : ""
                }
                onClick={() => setActiveChapterId(chapter.id)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>{chapter.title || "Bab tanpa judul"}</b>
                <small>{chapter.materials.length} materi</small>
              </button>
            ))}
            {!outline.chapters.length && (
              <p className="curriculum-chapter-sidebar-empty">
                Belum ada bab. Tekan “+ Bab” untuk mulai.
              </p>
            )}
          </nav>
        </aside>

        <div className="curriculum-chapter-detail">
          {activeChapter ? (
            <>
              <header className="curriculum-chapter-detail-head">
                <div>
                  <span className="curriculum-eyebrow">
                    BAB{" "}
                    {String(
                      outline.chapters.findIndex(
                        (chapter) => chapter.id === activeChapter.id,
                      ) + 1,
                    ).padStart(2, "0")}
                  </span>
                  <h4>{activeChapter.title || "Bab tanpa judul"}</h4>
                </div>
                <div className="curriculum-order-actions">
                  <button
                    type="button"
                    aria-label="Naikkan urutan bab"
                    title="Naikkan bab"
                    disabled={
                      outline.chapters.findIndex(
                        (chapter) => chapter.id === activeChapter.id,
                      ) === 0
                    }
                    onClick={() =>
                      moveChapter(
                        outline.chapters.findIndex(
                          (chapter) => chapter.id === activeChapter.id,
                        ),
                        -1,
                      )
                    }
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label="Turunkan urutan bab"
                    title="Turunkan bab"
                    disabled={
                      outline.chapters.findIndex(
                        (chapter) => chapter.id === activeChapter.id,
                      ) ===
                      outline.chapters.length - 1
                    }
                    onClick={() =>
                      moveChapter(
                        outline.chapters.findIndex(
                          (chapter) => chapter.id === activeChapter.id,
                        ),
                        1,
                      )
                    }
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      removeChapter(
                        outline.chapters.findIndex(
                          (chapter) => chapter.id === activeChapter.id,
                        ),
                      )
                    }
                  >
                    Hapus bab
                  </button>
                </div>
              </header>

              <label className="curriculum-field">
                Nama bab
                <input
                  required
                  maxLength={120}
                  value={activeChapter.title}
                  placeholder="Contoh: Dasar pengelolaan uang"
                  onChange={(event) =>
                    updateChapter(activeChapter.id, {
                      title: event.target.value,
                    })
                  }
                />
              </label>

              <div className="curriculum-chapter-intro">
                <label>Pengantar bab <span>Opsional</span></label>
                <MarkdownEditor
                  value={activeChapter.intro}
                  onChange={(intro) =>
                    updateChapter(activeChapter.id, { intro })
                  }
                  rows={3}
                  placeholder="Pengantar singkat sebelum materi bab."
                />
              </div>

              <div className="curriculum-materials-head">
                <div>
                  <h5>Materi dalam bab ini</h5>
                  <p>
                    {activeChapter.materials.length
                      ? `${activeChapter.materials.length} materi`
                      : "Belum ada materi di bab ini."}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    updateChapter(activeChapter.id, {
                      materials: [
                        ...activeChapter.materials,
                        {
                          id: uid(),
                          title: "",
                          content: "",
                          heading: true,
                        },
                      ],
                    })
                  }
                >
                  + Tambah materi
                </Button>
              </div>

              {activeChapter.materials.map((material, materialIndex) => (
                <article className="curriculum-material" key={material.id}>
                  <header>
                    <span>Materi {materialIndex + 1}</span>
                    <div className="curriculum-order-actions">
                      <button
                        type="button"
                        aria-label="Naikkan urutan materi"
                        disabled={materialIndex === 0}
                        onClick={() => moveMaterial(materialIndex, -1)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        aria-label="Turunkan urutan materi"
                        disabled={
                          materialIndex === activeChapter.materials.length - 1
                        }
                        onClick={() => moveMaterial(materialIndex, 1)}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => {
                          if (!window.confirm("Hapus materi ini?")) return;
                          updateChapter(activeChapter.id, {
                            materials: activeChapter.materials.filter(
                              (item) => item.id !== material.id,
                            ),
                          });
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </header>
                  <label className="curriculum-field">
                    Judul materi
                    <input
                      required={material.heading}
                      maxLength={120}
                      placeholder="Contoh: Membuat anggaran bulanan"
                      value={material.title}
                      onChange={(event) =>
                        updateMaterial(activeChapter.id, material.id, {
                          title: event.target.value,
                          heading: true,
                        })
                      }
                    />
                  </label>
                  <label className="curriculum-field">Isi materi</label>
                  <MarkdownEditor
                    value={material.content}
                    onChange={(content) =>
                      updateMaterial(activeChapter.id, material.id, {
                        content,
                      })
                    }
                    rows={8}
                  />
                </article>
              ))}
            </>
          ) : (
            <div className="curriculum-chapter-placeholder">
              <span className="curriculum-step-number">+</span>
              <h4>Pilih atau tambahkan bab</h4>
              <p>Daftar materi akan tampil setelah bab dipilih.</p>
              <Button type="button" onClick={addChapter}>
                + Tambah bab pertama
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
