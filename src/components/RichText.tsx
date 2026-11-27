import { Fragment } from "react";
import { getMediaUrl } from "@/lib/media";

function InlineText({ text }: { text: string }) {
  const parts = text.split(
    /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~|\[[^\]]+\]\([^)]+\))/g,
  );
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("***") && part.endsWith("***"))
          return (
            <strong key={i}>
              <em>{part.slice(3, -3)}</em>
            </strong>
          );
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("*") && part.endsWith("*"))
          return <em key={i}>{part.slice(1, -1)}</em>;
        if (part.startsWith("~~") && part.endsWith("~~"))
          return <del key={i}>{part.slice(2, -2)}</del>;
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const href = link[2].trim();
          if (/^(https?:\/\/|mailto:|\/|#)/i.test(href))
            return (
              <a href={href} key={i}>
                {link[1]}
              </a>
            );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

function TableBlock({ lines }: { lines: string[] }) {
  const rows = lines
    .filter((line) => !/^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(line))
    .map((line) =>
      line
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((cell) => cell.trim()),
    );
  return (
    <div className="rich-table-wrap">
      <table className="rich-table">
        <thead>
          <tr>
            {(rows[0] ?? []).map((cell, i) => (
              <th key={i}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((row, r) => (
            <tr key={r}>
              {row.map((cell, i) => (
                <td key={i}>
                  <InlineText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const startsWith = (value: string, words: string[]) =>
  words.some((word) => value.toLowerCase().startsWith(word.toLowerCase()));

function looksLikeSubheading(block: string) {
  const value = block.replace(/^\d+[.)]\s*/, "").trim();
  if (!value || value.length > 92 || value.includes("\n")) return false;
  if (/^[A-Z0-9\s&/()'“”–—-]+$/.test(value) && value.length > 3) return true;
  if (/^\d+[.)]\s/.test(block)) return true;
  if (/[.!?]$/.test(value)) return false;
  if (
    startsWith(value, [
      "contoh:",
      "informasi:",
      "catatan:",
      "jawaban:",
      "misalnya:",
      "yaitu",
      "karena",
      "namun",
      "sehingga",
      "dengan",
      "untuk",
      "jika",
      "pada",
    ])
  )
    return false;
  return value.split(/\s+/).length <= 9;
}

function calloutType(block: string) {
  if (/^(informasi|catatan penting|perlu diketahui|ingat|tips):/i.test(block))
    return "info";
  if (/^(contoh|simulasi):/i.test(block)) return "example";
  return null;
}

/** Renderer materi yang toleran terhadap teks hasil ekstraksi DOCX. */
export function RichText({ text }: { text: string }) {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
  return (
    <div className="rich-text">
      {blocks.map((block, i) => {
        const aligned = block.match(
          /^:::align-(left|center|right|justify)\n([\s\S]*?)\n:::$/,
        );
        if (aligned)
          return (
            <div className={`rich-aligned rich-aligned-${aligned[1]}`} key={i}>
              <RichText text={aligned[2]} />
            </div>
          );
        const image = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (image)
          return (
            <figure className="material-inline-figure" key={i}>
              <img src={getMediaUrl(image[2])} alt={image[1]} loading="lazy" decoding="async" />
            </figure>
          );
        if (block.startsWith("|")) {
          if (i > 0 && blocks[i - 1].startsWith("|")) return null;
          let end = i;
          while (end < blocks.length && blocks[end]?.startsWith("|")) end += 1;
          return (
            <TableBlock
              key={i}
              lines={blocks.slice(i, end).flatMap((item) => item.split("\n"))}
            />
          );
        }
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        if (block.startsWith("## ")) return <h3 key={i}>{block.slice(3)}</h3>;
        if (block.startsWith("### ")) return <h4 key={i}>{block.slice(4)}</h4>;
        if (lines.length >= 2 && lines.every((line) => line.startsWith("|")))
          return <TableBlock key={i} lines={lines} />;
        if (lines.every((line) => line.startsWith("- ")))
          return (
            <ul key={i}>
              {lines.map((line, j) => (
                <li key={j}>
                  <InlineText text={line.slice(2)} />
                </li>
              ))}
            </ul>
          );
        if (lines.every((line) => /^\d+[.)]\s/.test(line)))
          return (
            <ol key={i}>
              {lines.map((line, j) => (
                <li key={j}>
                  <InlineText text={line.replace(/^\d+[.)]\s/, "")} />
                </li>
              ))}
            </ol>
          );
        const callout = calloutType(block);
        if (callout)
          return (
            <aside className={`rich-callout ${callout}`} key={i}>
              <InlineText text={block} />
            </aside>
          );
        if (looksLikeSubheading(block))
          return (
            <h4 className="rich-auto-heading" key={i}>
              <InlineText text={block} />
            </h4>
          );
        return (
          <p key={i}>
            {lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                <InlineText text={line} />
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
