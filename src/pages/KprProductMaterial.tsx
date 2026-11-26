import { Link } from "react-router"

import { Icon } from "@/components/Icon"

import { LessonReader } from "@/components/LessonReader"
import { KprMiniQuiz } from "@/components/KprMiniQuiz"

import material from "@/data/materials/kpr-produk-btn.json"

export default function KprProductMaterial() {
  return (
    <section className="lesson-detail min-h-screen py-10 sm:py-14">
      <div className="lesson-reader-container mx-auto">
        <Link
          className="back-link inline-flex items-center gap-2 font-semibold text-[#064a91] transition hover:gap-3"
          to="/learn/kpr"
        >
          <Icon name="back" size={17} />
          Materi KPR di BTN
        </Link>

        <header className="lesson-detail-head">
          <div className="lesson-detail-badge">
            <Icon name="home" size={15} />8 BAGIAN MATERI
          </div>
          <h1 className="lesson-title">{material.title}</h1>
          <p className="lesson-lead">
            Kenali pilihan pembiayaan BTN, bandingkan produk, dan pahami
            gambaran proses pengajuannya.
          </p>
          <div className="lesson-reading-meta">
            <span>
              <Icon name="document" size={15} />
              Bab dan subbab
            </span>
            <span>
              <Icon name="check" size={15} />
              Materi dibaca berurutan
            </span>
          </div>
        </header>

        <div className="lesson-detail-body">
          <LessonReader
            text={material.content}
            navigationMode="single"
            extraChapter={{
              id: "bab-8-kuis-mini-dan-penutup",
              title: "Kuis Mini dan Penutup",
              content: <KprMiniQuiz />,
            }}
          />
        </div>
      </div>
    </section>
  )
}
