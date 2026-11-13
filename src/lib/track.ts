import { supabase } from "@/lib/supabase";

const KEY = "finora_vid";

function visitorId(): string | null {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `v-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

/** Catat kunjungan halaman (id acak per browser, tanpa IP/email). Gagal diam-diam. */
export function trackVisit(path: string) {
  if (!supabase || path.startsWith("/admin")) return;
  const id = visitorId();
  if (!id) return;
  supabase
    .rpc("track_visit", { p_path: path.slice(0, 120), p_visitor: id })
    .then(
      () => undefined,
      () => undefined,
    );
}
