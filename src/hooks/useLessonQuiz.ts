import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { LessonQuiz } from "@/lib/types";

export function useLessonQuiz(lessonId: string | undefined, includeDrafts = false) {
  const [quiz, setQuiz] = useState<LessonQuiz[]>([]);
  const [loading, setLoading] = useState(Boolean(supabase && lessonId));
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!supabase || !lessonId) {
      setQuiz([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const query = supabase.from("lesson_quizzes").select("*").eq("lesson_id", lessonId).order("sort_order");
    const { data, error: queryError } = includeDrafts
      ? await query
      : await query.eq("published", true);
    if (queryError) {
      setError(queryError.message);
      setQuiz([]);
    } else {
      setError(null);
      setQuiz((data ?? []) as LessonQuiz[]);
    }
    setLoading(false);
  }, [includeDrafts, lessonId]);

  useEffect(() => { void reload(); }, [reload]);
  return { quiz, loading, error, reload };
}
