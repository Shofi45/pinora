import { Fragment } from "react";

/** Teks sederhana: paragraf dipisah baris kosong, "## " = subjudul, baris berawalan "- " = daftar. */
export function RichText({ text }: { text: string }) {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
  return (
    <div className="rich-text">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) return <h3 key={i}>{block.slice(3)}</h3>;
        const lines = block.split("\n");
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{l.trim().slice(2)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {l}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
