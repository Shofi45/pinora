import { useState } from "react";
import { Icon } from "@/components/Icon";
import { getMediaUrl } from "@/lib/media";

const VISUALS: Record<string, { src: string; alt: string }[]> = {
  "investasi-dan-deposito": Array.from({ length: 10 }, (_, i) => ({
    src: getMediaUrl(`/materi/investasi-deposito/${String(i + 1).padStart(2, "0")}.png`),
    alt: `Ilustrasi investasi dan deposito ${i + 1}`,
  })),
  "tabungan-btn-dan-customer-service": [
    {
      src: getMediaUrl("/materi/tabungan-btn/01.png"),
      alt: "Ilustrasi produk tabungan BTN",
    },
    {
      src: getMediaUrl("/materi/tabungan-btn/02.jpeg"),
      alt: "Ilustrasi layanan Customer Service BTN",
    },
    {
      src: getMediaUrl("/materi/tabungan-btn/03.jpeg"),
      alt: "Ilustrasi layanan nasabah BTN",
    },
    {
      src: getMediaUrl("/materi/tabungan-btn/04.jpeg"),
      alt: "Ilustrasi pelayanan administrasi BTN",
    },
  ],
};

export function LessonVisuals({ slug }: { slug: string }) {
  const images = VISUALS[slug];
  const [selected, setSelected] = useState<string | null>(null);
  if (!images?.length) return null;
  return (
    <section className="lesson-visuals" aria-label="Gambar materi">
      <div className="lesson-visuals-head">
        <div>
          <div className="section-kicker">ILUSTRASI MATERI</div>
          <h2>Supaya lebih mudah dibayangkan.</h2>
        </div>
        <span>{images.length} gambar</span>
      </div>
      <div className="lesson-visual-grid">
        {images.map((image, index) => (
          <button
            className="lesson-visual"
            key={image.src}
            onClick={() => setSelected(image.src)}
            aria-label={`Perbesar gambar ${index + 1}`}
          >
            <img src={image.src} alt={image.alt} loading="lazy" />
            <span>
              {String(index + 1).padStart(2, "0")} <Icon name="eye" size={14} />
            </span>
          </button>
        ))}
      </div>
      {selected && (
        <div
          className="lesson-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelected(null)}
        >
          <button aria-label="Tutup gambar" onClick={() => setSelected(null)}>
            <Icon name="close" size={20} />
          </button>
          <img
            src={selected}
            alt="Tampilan gambar materi"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
