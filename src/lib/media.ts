import { supabase } from "@/lib/supabase";

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const MAX_IMAGE_SIZE = 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1920;
const STORAGE_BUCKET = "site-media";

export function getMediaUrl(value: string) {
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  const base = import.meta.env.BASE_URL;
  const path = value.startsWith(base)
    ? value.slice(base.length)
    : value.replace(/^\/+/, "");
  const isSiteImage = path.startsWith("images/") || path.startsWith("materi/");
  if (!isSiteImage) return value;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (import.meta.env.VITE_MEDIA_STORAGE_ENABLED === "true" && supabaseUrl) {
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    return `${supabaseUrl.replace(/\/+$/, "")}/storage/v1/object/public/${STORAGE_BUCKET}/${encodedPath}`;
  }
  return `${base}${path}`;
}

export async function compressImageForUpload(file: File) {
  if (!IMAGE_TYPES[file.type]) {
    throw new Error("Gunakan gambar JPG, PNG, WebP, atau GIF.");
  }
  if (file.size <= MAX_IMAGE_SIZE) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Gambar tidak dapat dibaca untuk dikompres.");
  }

  try {
    let scale = Math.min(
      1,
      MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height),
    );
    let quality = 0.86;

    for (let attempt = 0; attempt < 16; attempt++) {
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Browser tidak dapat mengompres gambar.");
      context.drawImage(bitmap, 0, 0, width, height);

      const compressed = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/webp", quality),
      );
      if (!compressed || compressed.type !== "image/webp") {
        throw new Error("Browser tidak mendukung kompres gambar WebP.");
      }

      if (compressed.size <= MAX_IMAGE_SIZE) {
        const name = file.name.replace(/\.[^.]+$/, "") || "gambar";
        return new File([compressed], `${name}.webp`, {
          type: compressed.type,
          lastModified: file.lastModified,
        });
      }

      if (quality > 0.5) {
        quality = Math.max(0.5, quality - 0.12);
      } else {
        scale *= 0.78;
        quality = 0.82;
      }
    }

    throw new Error("Gambar tidak dapat dikompres hingga 1 MB. Pilih gambar yang lebih kecil.");
  } finally {
    bitmap.close();
  }
}

export async function uploadContentImage(file: File) {
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
  const optimizedFile = await compressImageForUpload(file);
  const extension = IMAGE_TYPES[optimizedFile.type];
  if (!extension) throw new Error("Gunakan gambar JPG, PNG, WebP, atau GIF.");

  const path = `uploads/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, optimizedFile, {
      cacheControl: "3600",
      contentType: optimizedFile.type,
    });
  if (error) throw new Error(`Gagal mengunggah gambar. ${error.message}`);

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return {
    url: data.publicUrl,
    file: optimizedFile,
    compressed: optimizedFile !== file,
  };
}

export const CHAT_IMAGE_MAX_SIZE = MAX_IMAGE_SIZE;
export const CHAT_IMAGE_TYPES = Object.keys(IMAGE_TYPES).join(",");
export const CHAT_IMAGE_BUCKET = "chat-attachments";
