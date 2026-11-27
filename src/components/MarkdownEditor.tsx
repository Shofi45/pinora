import { useRef } from "react";
import { ImageUploadButton } from "@/components/ImageUploadButton";
import { Icon } from "@/components/Icon";
import { getMediaUrl } from "@/lib/media";

export function MarkdownEditor({
  value,
  onChange,
  rows = 12,
  maxLength = 100000,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  maxLength?: number;
  placeholder?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imagePattern = /!\[([^\]]*)\]\(([^)\r\n]+)\)/g;
  const images = Array.from(value.matchAll(imagePattern)).map((match, index) => ({
    id: `${index}-${match[2]}`,
    alt: match[1] || "",
    src: match[2],
  }));

  const replaceSelection = (before: string, after = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);
    const isWrapped =
      selected.length > 0 &&
      value.slice(Math.max(0, start - before.length), start) === before &&
      value.slice(end, end + after.length) === after;
    const next = isWrapped
      ? `${value.slice(0, start - before.length)}${selected}${value.slice(end + after.length)}`
      : `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;
    const nextStart = isWrapped ? start - before.length : start + before.length;
    const nextEnd = isWrapped
      ? end - before.length
      : end + before.length;
    onChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextStart, nextEnd);
    });
  };

  const applyLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = value.lastIndexOf("\n", textarea.selectionStart - 1) + 1;
    const lineBreak = value.indexOf("\n", textarea.selectionEnd);
    const end = lineBreak < 0 ? value.length : lineBreak;
    const selected = value.slice(start, end);
    const lines = selected.split("\n");
    const isNumbered = prefix === "1. ";
    const isHeading = prefix.startsWith("#");
    const headingLevel = (line: string) => (line.match(/^#+/) ?? [""])[0].length;
    const alreadyFormatted = lines.every((line) =>
      isNumbered
        ? /^\d+[.)]\s/.test(line)
        : isHeading
          ? headingLevel(line) === headingLevel(prefix)
          : line.startsWith(prefix),
    );
    const formatted = lines
      .map((line, index) => {
        if (isHeading) {
          const text = line.replace(/^#+\s/, "");
          return alreadyFormatted ? text : `${prefix}${text}`;
        }
        if (alreadyFormatted) {
          return line.replace(
            isNumbered ? /^\d+[.)]\s/ : new RegExp(`^${prefix}`),
            "",
          );
        }
        return `${isNumbered ? `${index + 1}. ` : prefix}${line}`;
      })
      .join("\n");
    const next = `${value.slice(0, start)}${formatted}${value.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + formatted.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const applyAlignment = (
    alignment: "left" | "center" | "right" | "justify",
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const previousBreak = value.lastIndexOf(
      "\n\n",
      Math.max(0, textarea.selectionStart - 1),
    );
    const start = previousBreak < 0 ? 0 : previousBreak + 2;
    const nextBreak = value.indexOf("\n\n", textarea.selectionEnd);
    const end = nextBreak < 0 ? value.length : nextBreak;
    const selected = value.slice(start, end).trim();
    const paragraphs = (selected || "Tulis teks di sini.")
      .split(/\n{2,}/)
      .filter(Boolean);
    const wrapped = paragraphs
      .map((paragraph) => `:::align-${alignment}\n${paragraph}\n:::`)
      .join("\n\n");
    const next = `${value.slice(0, start)}${wrapped}${value.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + wrapped.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const insertLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);
    const label = selected || "teks tautan";
    const markdown = `[${label}](https://alamat-tautan)`;
    const next = `${value.slice(0, start)}${markdown}${value.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      if (selected) {
        const urlStart = start + label.length + 3;
        textarea.setSelectionRange(urlStart, start + markdown.length - 1);
      } else {
        textarea.setSelectionRange(start + 1, start + 1 + label.length);
      }
    });
  };

  const addImage = (url: string, file: File) => {
    const alt = file.name.replace(/\.[^.]+$/, "").replace(/[[\]]/g, " ");
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(`${value}${value ? "\n\n" : ""}![${alt}](${url})`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const markdown = `![${alt}](${url})`;
    const prefix = start > 0 && value[start - 1] !== "\n" ? "\n\n" : "";
    const suffix = end < value.length && value[end] !== "\n" ? "\n\n" : "";
    const next = `${value.slice(0, start)}${prefix}${markdown}${suffix}${value.slice(end)}`;
    const cursor = start + prefix.length + markdown.length + suffix.length;
    onChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <div className="markdown-editor">
      <div className="markdown-toolbar" aria-label="Pemformatan teks">
        <div className="markdown-toolbar-group" role="group" aria-label="Format karakter">
          <button type="button" onClick={() => replaceSelection("**")} aria-label="Tebalkan" title="Tebalkan">
            <Icon name="bold" size={18} />
          </button>
          <button type="button" onClick={() => replaceSelection("*")} aria-label="Miring" title="Miring">
            <Icon name="italic" size={18} />
          </button>
          <button type="button" onClick={() => replaceSelection("~~")} aria-label="Coret" title="Coret">
            <Icon name="strikethrough" size={18} />
          </button>
        </div>
        <span className="markdown-toolbar-divider" />
        <div className="markdown-toolbar-group" role="group" aria-label="Gaya paragraf">
          <button type="button" onClick={() => applyLinePrefix("## ")} aria-label="Judul bagian" title="Judul bagian">
            <Icon name="heading-2" size={19} />
          </button>
          <button type="button" onClick={() => applyLinePrefix("### ")} aria-label="Subjudul" title="Subjudul">
            <Icon name="heading-3" size={19} />
          </button>
        </div>
        <span className="markdown-toolbar-divider" />
        <div className="markdown-toolbar-group" role="group" aria-label="Daftar">
          <button type="button" onClick={() => applyLinePrefix("- ")} aria-label="Daftar berpoin" title="Daftar berpoin">
            <Icon name="list-bulleted" size={18} />
          </button>
          <button type="button" onClick={() => applyLinePrefix("1. ")} aria-label="Daftar bernomor" title="Daftar bernomor">
            <Icon name="list-numbered" size={19} />
          </button>
        </div>
        <span className="markdown-toolbar-divider" />
        <div className="markdown-toolbar-group" role="group" aria-label="Perataan paragraf">
          <button type="button" onClick={() => applyAlignment("left")} aria-label="Rata kiri" title="Rata kiri">
            <Icon name="align-left" size={18} />
          </button>
          <button type="button" onClick={() => applyAlignment("center")} aria-label="Rata tengah" title="Rata tengah">
            <Icon name="align-center" size={18} />
          </button>
          <button type="button" onClick={() => applyAlignment("right")} aria-label="Rata kanan" title="Rata kanan">
            <Icon name="align-right" size={18} />
          </button>
          <button type="button" onClick={() => applyAlignment("justify")} aria-label="Rata kiri kanan" title="Rata kiri kanan">
            <Icon name="align-justify" size={18} />
          </button>
        </div>
        <span className="markdown-toolbar-divider" />
        <div className="markdown-toolbar-group" role="group" aria-label="Sisipkan konten">
          <button type="button" onClick={insertLink} aria-label="Sisipkan tautan" title="Sisipkan tautan">
            <Icon name="link" size={18} />
          </button>
          <ImageUploadButton
            onUploaded={addImage}
            label="Sisipkan gambar"
            iconOnly
          />
        </div>
      </div>
      <textarea
        ref={textareaRef}
        rows={rows}
        maxLength={maxLength}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      <small>Gunakan toolbar untuk format teks, paragraf, daftar, tautan, dan gambar.</small>
      {images.length > 0 && (
        <section className="markdown-image-previews" aria-label="Pratinjau gambar">
          <div className="markdown-image-previews-heading">
            <b>Pratinjau gambar</b>
            <span>{images.length}</span>
          </div>
          <div className="markdown-image-previews-grid">
            {images.map((image) => (
              <figure key={image.id}>
                <img
                  src={getMediaUrl(image.src)}
                  alt={image.alt || "Gambar materi"}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>{image.alt || "Gambar materi"}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
