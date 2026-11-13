import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

export default function AdminUsers() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Profile[]>([]);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error)
      setMsg({
        ok: false,
        text: "Gagal memuat pengguna. Pastikan supabase/admin.sql sudah dijalankan.",
      });
    else setRows((data ?? []) as Profile[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const changeRole = async (p: Profile) => {
    if (!supabase) return;
    const next = p.role === "admin" ? "user" : "admin";
    if (
      !window.confirm(
        `${next === "admin" ? "Jadikan" : "Cabut admin dari"} ${p.email}?`,
      )
    )
      return;
    setBusy(p.user_id);
    const { error } = await supabase.rpc("admin_set_role", {
      target: p.user_id,
      new_role: next,
    });
    setMsg(
      error
        ? { ok: false, text: error.message }
        : { ok: true, text: "Role diperbarui." },
    );
    setBusy(null);
    await load();
  };

  const toggleDisabled = async (p: Profile) => {
    if (!supabase) return;
    if (
      !window.confirm(
        `${p.disabled ? "Aktifkan kembali" : "Nonaktifkan"} akun ${p.email}?`,
      )
    )
      return;
    setBusy(p.user_id);
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { user_id: p.user_id, disabled: !p.disabled },
    });
    const failed = error || (data && (data as { error?: string }).error);
    setMsg(
      failed
        ? {
            ok: false,
            text:
              (data as { error?: string } | null)?.error ??
              "Gagal mengubah status. Pastikan fungsi admin-users sudah di-deploy.",
          }
        : { ok: true, text: "Status akun diperbarui." },
    );
    setBusy(null);
    await load();
  };

  const shown = rows.filter((r) =>
    (r.email ?? "").toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="admin-panel">
      <div className="admin-toolbar">
        <h3>Pengguna ({rows.length})</h3>
        <input
          type="search"
          placeholder="Cari email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {msg && (
        <div className={msg.ok ? "admin-ok" : "admin-error"}>{msg.text}</div>
      )}
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Daftar</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {shown.map((p) => {
              const self = p.user_id === user?.id;
              return (
                <tr key={p.user_id}>
                  <td>
                    {p.email ?? "-"}
                    {self && <span className="pill">kamu</span>}
                  </td>
                  <td>
                    <span className={`pill ${p.role}`}>
                      {p.role === "admin" ? "Admin" : "Pengguna"}
                    </span>
                  </td>
                  <td>
                    {p.disabled ? (
                      <span className="pill off">Nonaktif</span>
                    ) : (
                      "Aktif"
                    )}
                  </td>
                  <td>{new Date(p.created_at).toLocaleDateString("id-ID")}</td>
                  <td className="actions">
                    <button
                      disabled={self || busy === p.user_id}
                      onClick={() => void changeRole(p)}
                    >
                      {p.role === "admin" ? "Cabut admin" : "Jadikan admin"}
                    </button>
                    <button
                      className="danger"
                      disabled={self || busy === p.user_id}
                      onClick={() => void toggleDisabled(p)}
                    >
                      {p.disabled ? "Aktifkan" : "Nonaktifkan"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {shown.length === 0 && (
              <tr>
                <td colSpan={5} className="admin-muted">
                  Tidak ada pengguna.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
