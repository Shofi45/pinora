import { useCallback, useEffect, useState } from "react";
import { CHAT_IMAGE_BUCKET } from "@/lib/media";
import { supabase } from "@/lib/supabase";

interface Row {
  id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  image_path: string | null;
  created_at: string;
}

export default function AdminChats() {
  const [rows, setRows] = useState<Row[]>([]);
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("");
  const [images, setImages] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const client = supabase;
    if (!client) return;
    setLoading(true);
    const { data, error: e } = await client
      .from("chat_messages")
      .select("id,user_id,role,content,image_path,created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (e) {
      setError(
        "Gagal memuat chat. Pastikan supabase/content-media.sql sudah dijalankan.",
      );
      setLoading(false);
      return;
    }
    const list = (data ?? []) as Row[];
    setRows(list);
    const imageEntries = await Promise.all(
      list.filter((row) => row.image_path).map(async (row) => {
        const { data: signed, error: signedError } = await client.storage
          .from(CHAT_IMAGE_BUCKET)
          .createSignedUrl(row.image_path!, 1800);
        if (signedError) {
          console.error("Gagal memuat lampiran chat untuk admin.", signedError);
          return [row.id, ""] as const;
        }
        return [row.id, signed.signedUrl] as const;
      }),
    );
    setImages(Object.fromEntries(imageEntries));
    const ids = [...new Set(list.map((r) => r.user_id))];
    if (ids.length) {
      const { data: ps } = await client
        .from("profiles")
        .select("user_id,email")
        .in("user_id", ids);
      setEmails(
        Object.fromEntries(
          ((ps ?? []) as { user_id: string; email: string | null }[]).map(
            (p) => [p.user_id, p.email ?? p.user_id.slice(0, 8)],
          ),
        ),
      );
    }
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = async (id: string) => {
    if (!supabase || !window.confirm("Hapus pesan ini?")) return;
    const row = rows.find((item) => item.id === id);
    const { error: e } = await supabase
      .from("chat_messages")
      .delete()
      .eq("id", id);
    if (e) setError(e.message);
    else {
      setRows((r) => r.filter((x) => x.id !== id));
      if (row?.image_path) {
        const { error: storageError } = await supabase.storage
          .from(CHAT_IMAGE_BUCKET)
          .remove([row.image_path]);
        if (storageError) setError(`Pesan terhapus, tetapi lampiran gagal dihapus. ${storageError.message}`);
      }
    }
  };

  const shown = rows.filter((r) =>
    (emails[r.user_id] ?? "")
      .toLowerCase()
      .includes(filter.trim().toLowerCase()),
  );

  return (
    <div className="admin-panel">
      <div className="admin-toolbar">
        <h3>Percakapan Fin AI (200 terbaru)</h3>
        <input
          type="search"
          placeholder="Filter email…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      {error && <div className="admin-error">{error}</div>}
      {loading && <p className="lesson-empty">Memuat…</p>}
      <div className="chat-log">
        {shown.map((r) => (
          <div key={r.id} className={`chat-row ${r.role}`}>
            <div className="chat-meta">
              <b>
                {r.role === "user"
                  ? (emails[r.user_id] ?? "Pengguna")
                  : "Fin AI"}
              </b>
              <span>{new Date(r.created_at).toLocaleString("id-ID")}</span>
              <button onClick={() => void remove(r.id)}>Hapus</button>
            </div>
            <p>{r.content}</p>
            {images[r.id] && <img className="chat-admin-attachment" src={images[r.id]} alt="Lampiran gambar chat" loading="lazy" />}
          </div>
        ))}
        {!loading && shown.length === 0 && (
          <p className="admin-muted">Belum ada percakapan.</p>
        )}
      </div>
    </div>
  );
}
