import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { RichText } from "@/components/RichText";
import { getMediaUrl } from "@/lib/media";
import { supabase } from "@/lib/supabase";
import type { DocumentationItem } from "@/lib/types";

export default function Documentation() {
  const { slug } = useParams();
  const [items, setItems] = useState<DocumentationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!supabase) {
        setError("Dokumentasi belum tersedia karena Supabase belum dikonfigurasi.");
        setLoading(false);
        return;
      }
      const { data, error: resultError } = await supabase
        .from("documentation_pages")
        .select("id,slug,title,summary,content,cover_image,sort_order,published")
        .eq("published", true)
        .order("sort_order")
        .order("created_at");
      if (!active) return;
      if (resultError) setError(`Gagal memuat dokumentasi. ${resultError.message}`);
      else setItems((data ?? []) as DocumentationItem[]);
      setLoading(false);
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const page = slug ? items.find((item) => item.slug === slug) : null;
  if (!loading && !error && slug && !page) return <Navigate to="/dokumentasi" replace />;

  return (
    <section className="section">
      <div className="container content-page">
        <p className="section-kicker">PANDUAN FINWISE</p>
        {page ? (
          <article className="documentation-article">
            <Link className="inline-link" to="/dokumentasi">← Semua dokumentasi</Link>
            <h1 className="content-page-title">{page.title}</h1>
            {page.summary && <p className="content-page-lead">{page.summary}</p>}
            {page.cover_image && <img className="documentation-cover" src={getMediaUrl(page.cover_image)} alt="" />}
            <RichText text={page.content} />
          </article>
        ) : (
          <>
            <h1 className="content-page-title">Dokumentasi</h1>
            <p className="content-page-lead">Panduan dan informasi penggunaan Finwise.</p>
            {loading && <p className="lesson-empty">Memuat dokumentasi…</p>}
            {error && <p className="content-state error" role="alert">{error}</p>}
            {!loading && !error && items.length === 0 && (
              <p className="content-state">Belum ada dokumentasi yang diterbitkan.</p>
            )}
            <div className="documentation-grid">
              {items.map((item) => (
                <Link className="documentation-card" to={`/dokumentasi/${item.slug}`} key={item.id}>
                  {item.cover_image && <img src={getMediaUrl(item.cover_image)} alt="" loading="lazy" />}
                  <h2>{item.title}</h2>
                  {item.summary && <p>{item.summary}</p>}
                  <span>Baca dokumentasi →</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
