import { useRef, useState } from "react";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { uploadContentImage } from "@/lib/media";

export function ImageUploadButton({
  onUploaded,
  label = "Unggah gambar",
  iconOnly = false,
}: {
  onUploaded: (url: string, file: File) => void;
  label?: string;
  iconOnly?: boolean;
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
        ariaLabel={iconOnly ? label : undefined}
        title={iconOnly ? label : undefined}
        className={iconOnly ? "image-upload-icon-button" : ""}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          "..."
        ) : iconOnly ? (
          <Icon name="image" size={17} />
        ) : (
          label
        )}
      </Button>
      {error && <small className="admin-error">{error}</small>}
    </span>
  );
}
