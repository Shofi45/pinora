import { useEffect, useState } from "react";
import { RichText } from "@/components/RichText";
import { supabase } from "@/lib/supabase";
import type { FaqItem } from "@/lib/types";

export default function Faq() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!supabase) {
        setError("FAQ belum tersedia karena Supabase belum dikonfigurasi.");
        setLoading(false);
        return;
      }
      const { data, error: resultError } = await supabase
        .from("faq_items")
        .select("id,question,answer,sort_order,published")
        .eq("published", true)
        .order("sort_order")
        .order("created_at");
      if (!active) return;
      if (resultError) setError(`Gagal memuat FAQ. ${resultError.message}`);
      else setItems((data ?? []) as FaqItem[]);
      setLoading(false);
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="section">
      <div className="container content-page">
        <p className="section-kicker">PUSAT BANTUAN</p>
        <h1 className="content-page-title">Pertanyaan yang sering ditanyakan</h1>
        <p className="content-page-lead">Temukan jawaban singkat seputar Finwise dan fitur-fiturnya.</p>
        {loading && <p className="lesson-empty">Memuat FAQ…</p>}
        {error && <p className="content-state error" role="alert">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="content-state">Belum ada pertanyaan yang diterbitkan.</p>
        )}
        <div className="faq-list">
          {items.map((item) => (
            <details className="faq-item" key={item.id}>
              <summary>{item.question}</summary>
              <RichText text={item.answer} />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
