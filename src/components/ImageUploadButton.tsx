import { useRef, useState } from "react";
import { Button } from "@/components/Button";
import { uploadContentImage } from "@/lib/media";

export function ImageUploadButton({
  onUploaded,
  label = "Unggah gambar",
}: {
  onUploaded: (url: string, file: File) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file?: File) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const url = await uploadContentImage(file);
      onUploaded(url, file);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Gagal mengunggah gambar.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <span className="image-upload-control">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        hidden
        onChange={(event) => void upload(event.target.files?.[0])}
      />
      <Button
        type="button"
        variant="secondary"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? "Mengunggah…" : label}
      </Button>
      {error && <small className="admin-error">{error}</small>}
    </span>
  );
}
