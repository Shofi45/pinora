import creditMaterial from "@/data/materials/dokumen-kredit.json"

import kprMaterial from "@/data/materials/kpr-produk-btn.json"

import savingMaterial from "@/data/materials/menabung-di-btn.json"

import { INVESTMENT_CHAPTERS } from "@/lib/material-syllabus"

function investmentContent() {
  return INVESTMENT_CHAPTERS.map((chapter) =>
    [
      `## ${chapter.title}`,

      ...chapter.subchapters.map((subchapter) =>
        [
          `### ${subchapter.title}`,

          ...subchapter.blocks.map((block) =>
            block.type === "text"
              ? block.content
              : `![${block.alt}](${block.src})\n\n${block.caption}`,
          ),
        ]

          .filter(Boolean)

          .join("\n\n"),
      ),
    ].join("\n\n"),
  ).join("\n\n")
}

const BUILT_IN_LESSON_CONTENT: Record<string, string> = {
  "belajar-investasi": investmentContent(),

  investasi: investmentContent(),

  "dokumen-kredit": creditMaterial.content,

  "kpr-di-btn": kprMaterial.content,

  "kpr-produk-btn": kprMaterial.content,

  "menabung-di-btn": savingMaterial.content,

  "tabungan-btn-dan-customer-service": savingMaterial.content,
}

export function getBuiltInLessonContent(slug: string) {
  return BUILT_IN_LESSON_CONTENT[slug] ?? null
}
