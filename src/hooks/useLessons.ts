import { useCallback, useEffect, useState } from "react";
import { FALLBACK_LESSONS } from "@/lib/lessons";
import { supabase } from "@/lib/supabase";
import type { Lesson } from "@/lib/types";

/**
 * Materi belajar dari tabel `lessons`. RLS memastikan pengunjung hanya menerima materi terbit,
 * sedangkan admin menerima semuanya. `fromDb` false berarti data bawaan (tabel belum ada / error).
 */
export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>(FALLBACK_LESSONS);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [fromDb, setFromDb] = useState(false);

  const reload = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .order("sort_order")
      .order("created_at");
    if (error || !data) {
      setLessons(FALLBACK_LESSONS);
      setFromDb(false);
    } else {
      setLessons(data as Lesson[]);
      setFromDb(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { lessons, loading, fromDb, reload };
}
