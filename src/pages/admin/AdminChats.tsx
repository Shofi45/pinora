import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Row {
  id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export default function AdminChats() {
  const [rows, setRows] = useState<Row[]>([]);
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error: e } = await supabase
      .from("chat_messages")
      .select("id,user_id,role,content,created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (e) {
      setError(
        "Gagal memuat chat. Pastikan supabase/admin.sql sudah dijalankan.",
      );
      setLoading(false);
      return;
    }
    const list = (data ?? []) as Row[];
    setRows(list);
    const ids = [...new Set(list.map((r) => r.user_id))];
    if (ids.length) {
      const { data: ps } = await supabase
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
    const { error: e } = await supabase
      .from("chat_messages")
      .delete()
      .eq("id", id);
    if (e) setError(e.message);
    else setRows((r) => r.filter((x) => x.id !== id));
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
          </div>
        ))}
        {!loading && shown.length === 0 && (
          <p className="admin-muted">Belum ada percakapan.</p>
        )}
      </div>
    </div>
  );
}
