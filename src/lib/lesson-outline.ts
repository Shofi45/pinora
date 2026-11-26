export interface LessonMaterialDraft {
  id: string

  title: string

  content: string

  heading: boolean
}

export interface LessonChapterDraft {
  id: string

  title: string

  intro: string

  materials: LessonMaterialDraft[]
}

export interface LessonOutlineDraft {
  intro: string

  chapters: LessonChapterDraft[]
}

export function parseLessonOutline(text: string): LessonOutlineDraft {
  const sections = text.replace(/\r\n/g, "\n").split(/\n(?=## )/)

  const hasChapterAtStart = sections[0]?.startsWith("## ") ?? false

  const intro = hasChapterAtStart ? "" : (sections.shift() ?? "").trim()

  const chapters = sections

    .filter((section) => section.trim())

    .map((section, chapterIndex): LessonChapterDraft => {
      const [heading = "", ...lines] = section.split("\n")

      const body = lines.join("\n").trim()

      const blocks = body.split(/\n(?=### )/)

      const hasMaterialHeadings = blocks.some((block) =>
        block.startsWith("### "),
      )

      const chapterIntro = hasMaterialHeadings
        ? blocks[0]?.startsWith("### ")
          ? ""
          : (blocks.shift() ?? "").trim()
        : ""

      const materials = hasMaterialHeadings
        ? blocks.map((block, materialIndex): LessonMaterialDraft => {
            const [materialHeading = "", ...materialLines] = block.split("\n")

            return {
              id: `material-${chapterIndex}-${materialIndex}`,

              title: materialHeading.replace(/^###\s*/, "").trim(),

              content: materialLines.join("\n").trim(),

              heading: true,
            }
          })
        : body
          ? [
              {
                id: `material-${chapterIndex}-0`,
                title: "",
                content: body,
                heading: false,
              },
            ]
          : []

      return {
        id: `chapter-${chapterIndex}`,

        title: heading.replace(/^##\s*/, "").trim(),

        intro: chapterIntro,

        materials,
      }
    })

  return { intro, chapters }
}

export function serializeLessonOutline(outline: LessonOutlineDraft) {
  const sections: string[] = []

  if (outline.intro.trim()) sections.push(outline.intro.trim())

  for (const chapter of outline.chapters) {
    const body: string[] = []

    if (chapter.intro.trim()) body.push(chapter.intro.trim())

    for (const material of chapter.materials) {
      const title = material.title.trim()

      const content = material.content.trim()

      if (!title && !content) continue

      const heading = material.heading || Boolean(title)

      body.push(
        `${
          heading ? `### ${title || "Materi baru"}\n\n` : ""
        }${content}`.trim(),
      )
    }

    sections.push(
      `## ${chapter.title.trim() || "Bab baru"}${
        body.length ? `\n\n${body.join("\n\n")}` : ""
      }`,
    )
  }

  return sections.join("\n\n")
}
