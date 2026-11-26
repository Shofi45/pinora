import { supabase } from "@/lib/supabase";

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
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

export async function uploadContentImage(file: File) {
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
  const extension = IMAGE_TYPES[file.type];
  if (!extension) throw new Error("Gunakan gambar JPG, PNG, WebP, atau GIF.");
  if (file.size > MAX_IMAGE_SIZE) throw new Error("Ukuran gambar maksimal 5 MB.");

  const path = `uploads/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: "3600", contentType: file.type });
  if (error) throw new Error(`Gagal mengunggah gambar. ${error.message}`);

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export const CHAT_IMAGE_MAX_SIZE = MAX_IMAGE_SIZE;
export const CHAT_IMAGE_TYPES = Object.keys(IMAGE_TYPES).join(",");
export const CHAT_IMAGE_BUCKET = "chat-attachments";
