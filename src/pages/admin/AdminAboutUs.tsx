import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { ImageUploadButton } from "@/components/ImageUploadButton";
import { getDeveloperPhotoUrl, type DeveloperProfile } from "@/lib/developer-profiles";
import { supabase } from "@/lib/supabase";

type ManagedProfile = DeveloperProfile & { is_published: boolean };
type Draft = ManagedProfile & { originalSlug: string | null };

const blank = (sortOrder: number): Draft => ({
  slug: "",
  full_name: "",
  title: "",
  internship_unit: "",
  bio: "",
  purpose: "",
  focus_areas: [],
  quote: "",
  email: null,
  instagram: null,
  photo_path: "",
  sort_order: sortOrder,
  is_published: false,
  originalSlug: null,
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export default function AdminAboutUs() {
  const [profiles, setProfiles] = useState<ManagedProfile[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  const reload = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      setMessage({ ok: false, text: "Supabase belum dikonfigurasi." });
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("developer_profiles")
      .select(
        "slug,full_name,title,internship_unit,bio,purpose,focus_areas,quote,email,instagram,photo_path,sort_order,is_published",
      )
      .order("sort_order")
      .order("full_name");

    if (error) {
      setMessage({
        ok: false,
        text: `${error.message} Pastikan supabase/admin.sql dan supabase/developer_profiles_admin.sql sudah dijalankan. Jika tabel belum ada, jalankan supabase/developer_profiles.sql terlebih dahulu.`,
      });
    } else {
      setProfiles((data ?? []) as ManagedProfile[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || !draft) return;

    const slug = draft.slug || slugify(draft.full_name);
    if (!/^[a-z0-9-]{2,80}$/.test(slug)) {
      setMessage({
        ok: false,
        text: "Slug hanya boleh berisi huruf kecil, angka, dan tanda minus.",
      });
      return;
    }
    if (!draft.photo_path.trim()) {
      setMessage({ ok: false, text: "Tambahkan foto profil terlebih dahulu." });
      return;
    }

    setSaving(true);
    const { originalSlug, ...profile } = draft;
    const payload = {
      ...profile,
      slug,
      full_name: draft.full_name.trim(),
      title: draft.title.trim(),
      internship_unit: draft.internship_unit.trim(),
      bio: draft.bio.trim(),
      purpose: draft.purpose.trim(),
      focus_areas: draft.focus_areas.map((area) => area.trim()).filter(Boolean),
      quote: draft.quote.trim(),
      email: draft.email?.trim() || null,
      instagram: draft.instagram?.replace(/^@/, "").trim() || null,
      photo_path: draft.photo_path.trim(),
      sort_order: Number(draft.sort_order) || 0,
    };

    const result = originalSlug
      ? await supabase
          .from("developer_profiles")
          .update(payload)
          .eq("slug", originalSlug)
      : await supabase.from("developer_profiles").insert(payload);
    setSaving(false);

    if (result.error) {
      setMessage({
        ok: false,
        text:
          result.error.code === "23505"
            ? "Slug sudah dipakai profil lain."
            : result.error.message,
      });
      return;
    }

    setDraft(null);
    setMessage({ ok: true, text: "Profil berhasil disimpan." });
    await reload();
  };

  const remove = async (profile: ManagedProfile) => {
    if (
      !supabase ||
      !window.confirm(`Hapus profil ${profile.full_name}?`)
    ) {
      return;
    }

    const { error } = await supabase
      .from("developer_profiles")
      .delete()
      .eq("slug", profile.slug);
    if (error) {
      setMessage({ ok: false, text: error.message });
      return;
    }

    setMessage({ ok: true, text: "Profil berhasil dihapus." });
    await reload();
  };

  if (draft) {
    const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
      setDraft((current) => (current ? { ...current, [key]: value } : current));

    return (
      <form className="admin-panel admin-form" onSubmit={save}>
        <h3>{draft.originalSlug ? "Ubah profil tim" : "Profil tim baru"}</h3>
        <div className="form-row">
          <label>
            Nama lengkap
            <input
              required
              maxLength={120}
              value={draft.full_name}
              onChange={(event) => {
                const fullName = event.target.value;
                setDraft((current) =>
                  current
                    ? {
                        ...current,
                        full_name: fullName,
                        ...(!current.originalSlug
                          ? { slug: slugify(fullName) }
                          : {}),
                      }
                    : current,
                );
              }}
            />
          </label>
          <label>
            Slug
            <input
              required
              maxLength={80}
              value={draft.slug}
              onChange={(event) => set("slug", slugify(event.target.value))}
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Jabatan / pendidikan
            <input
              required
              maxLength={120}
              value={draft.title}
              onChange={(event) => set("title", event.target.value)}
            />
          </label>
          <label>
            Unit / kontribusi
            <input
              required
              maxLength={120}
              value={draft.internship_unit}
              onChange={(event) => set("internship_unit", event.target.value)}
            />
          </label>
        </div>
        <label>
          Foto profil
          <input
            required
            value={draft.photo_path}
            placeholder="Unggah gambar atau masukkan URL/path"
            onChange={(event) => set("photo_path", event.target.value)}
          />
          {draft.photo_path && (
            <img
              className="about-admin-photo-preview"
              src={getDeveloperPhotoUrl(draft.photo_path)}
              alt={`Pratinjau foto ${draft.full_name || "profil"}`}
            />
          )}
          <ImageUploadButton
            label={draft.photo_path ? "Ganti foto" : "Unggah foto"}
            onUploaded={(url) => set("photo_path", url)}
          />
        </label>
        <label>
          Bio
          <textarea
            required
            rows={4}
            maxLength={2000}
            value={draft.bio}
            onChange={(event) => set("bio", event.target.value)}
          />
        </label>
        <label>
          Tujuan kontribusi
          <textarea
            required
            rows={3}
            maxLength={1500}
            value={draft.purpose}
            onChange={(event) => set("purpose", event.target.value)}
          />
        </label>
        <label>
          Fokus / keahlian
          <textarea
            rows={2}
            placeholder="Pisahkan dengan koma atau baris baru"
            value={draft.focus_areas.join(", ")}
            onChange={(event) =>
              set(
                "focus_areas",
                event.target.value
                  .split(/[,\n]/)
                  .map((area) => area.trim())
                  .filter(Boolean),
              )
            }
          />
        </label>
        <label>
          Kutipan
          <input
            required
            maxLength={300}
            value={draft.quote}
            onChange={(event) => set("quote", event.target.value)}
          />
        </label>
        <div className="form-row">
          <label>
            Email
            <input
              type="email"
              maxLength={254}
              value={draft.email ?? ""}
              onChange={(event) => set("email", event.target.value || null)}
            />
          </label>
          <label>
            Instagram
            <input
              maxLength={80}
              placeholder="username"
              value={draft.instagram ?? ""}
              onChange={(event) =>
                set("instagram", event.target.value || null)
              }
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Urutan tampil
            <input
              type="number"
              value={draft.sort_order}
              onChange={(event) => set("sort_order", Number(event.target.value))}
            />
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={draft.is_published}
              onChange={(event) => set("is_published", event.target.checked)}
            />
            Tampilkan di website
          </label>
        </div>
        {message && !message.ok && (
          <div className="admin-error">{message.text}</div>
        )}
        <div className="form-actions">
          <Button type="submit" disabled={saving}>
            {saving ? "Menyimpan…" : "Simpan profil"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setDraft(null)}
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
        <div>
          <h3>Tim & kontributor ({profiles.length})</h3>
          <p className="admin-muted">
            Kelola profil yang tampil di bagian Tentang Kami.
          </p>
        </div>
        <Button
          disabled={!supabase}
          onClick={() => {
            setMessage(null);
            setDraft(
              blank(
                profiles.reduce(
                  (max, profile) => Math.max(max, profile.sort_order),
                  0,
                ) + 1,
              ),
            );
          }}
        >
          + Tambah profil
        </Button>
      </div>
      {message && (
        <div className={message.ok ? "admin-ok" : "admin-error"}>
          {message.text}
        </div>
      )}
      {loading ? (
        <p className="lesson-empty">Memuat profil…</p>
      ) : profiles.length === 0 ? (
        <p className="admin-muted">Belum ada profil tim.</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Foto</th>
                <th>Nama</th>
                <th>Kontribusi</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.slug}>
                  <td>{profile.sort_order}</td>
                  <td>
                    <img
                      className="about-admin-photo-thumbnail"
                      src={getDeveloperPhotoUrl(profile.photo_path)}
                      alt={`Foto ${profile.full_name}`}
                      loading="lazy"
                    />
                  </td>
                  <td>
                    <b>{profile.full_name}</b>
                    <small className="about-admin-subtitle">
                      {profile.title}
                    </small>
                  </td>
                  <td>{profile.internship_unit}</td>
                  <td>
                    <span
                      className={`pill ${profile.is_published ? "admin" : "off"}`}
                    >
                      {profile.is_published ? "Tampil" : "Disembunyikan"}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      onClick={() => {
                        setMessage(null);
                        setDraft({ ...profile, originalSlug: profile.slug });
                      }}
                    >
                      Ubah
                    </button>
                    <button
                      className="danger"
                      onClick={() => void remove(profile)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
