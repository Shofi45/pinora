import { useRef } from "react";
import { ImageUploadButton } from "@/components/ImageUploadButton";
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
        <button type="button" onClick={() => replaceSelection("**")} aria-label="Tebalkan">
          <b>B</b>
        </button>
        <ImageUploadButton onUploaded={addImage} label="Sisipkan gambar" />
      </div>
      <textarea
        ref={textareaRef}
        rows={rows}
        maxLength={maxLength}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      <small>Gunakan **teks** untuk tebal, ## untuk subjudul, dan tombol gambar untuk menyisipkan gambar.</small>
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
