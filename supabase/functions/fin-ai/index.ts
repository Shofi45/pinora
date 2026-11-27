// Supabase Edge Function: fin-ai
// Menjawab pertanyaan pengguna sebagai "Fin", asisten edukasi keuangan Finwise.
//
// Deploy:
//   supabase functions deploy fin-ai
//   supabase secrets set GEMINI_API_KEY=YOUR_GOOGLE_AI_STUDIO_KEY
// Opsional: supabase secrets set GEMINI_MODEL=gemini-3.5-flash-lite

import { createClient } from "npm:@supabase/supabase-js@2";

declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

const BASE_SYSTEM = `Kamu adalah Fin, asisten di situs Finwise.
Gaya: ramah, sederhana, bahasa Indonesia sehari-hari, jawaban singkat (maksimal sekitar 150 kata), boleh memakai daftar poin pendek.
Aturan:
- Kamu memberi informasi edukatif, bukan nasihat keuangan, hukum, atau pajak resmi. Ingatkan singkat jika pertanyaannya mengarah ke keputusan besar.
- Jangan menyebut angka suku bunga, biaya, promo, atau syarat produk bank tertentu, dan jangan menjanjikan persetujuan kredit. Arahkan pengguna ke bank resmi atau Sales Center untuk ketentuan terbaru.
- Rasio cicilan terhadap penghasilan sekitar 30% sering dipakai sebagai acuan umum, bukan aturan pasti.
- Jawab juga pertanyaan umum di luar keuangan secara singkat dan faktual; jangan menolak hanya karena topiknya bukan keuangan.
- Untuk pertanyaan kesehatan, hukum, atau topik berisiko tinggi, berikan informasi umum dan sarankan bantuan profesional bila diperlukan.
- Setelah menjawab pertanyaan di luar keuangan, tutup dengan pengingat singkat bahwa Finwise berfokus pada literasi keuangan, seperti menabung, investasi dasar, KPR, dan pengelolaan keuangan pribadi.`;

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const toBase64 = (bytes: Uint8Array) => {
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const aiKey = Deno.env.get("GEMINI_API_KEY");
  if (!supabaseUrl || !serviceKey)
    return json({ error: "Konfigurasi Supabase tidak lengkap" }, 500);
  if (!aiKey) return json({ error: "GEMINI_API_KEY belum diatur" }, 500);

  const admin = createClient(supabaseUrl, serviceKey);

  // 1. Pastikan pemanggil adalah pengguna yang sudah masuk (bukan hanya anon key)
  const token = (req.headers.get("Authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  const { data: userData, error: userError } = await admin.auth.getUser(token);
  const user = userData?.user;
  if (userError || !user)
    return json({ error: "Silakan masuk terlebih dahulu" }, 401);

  // 1b. Akun yang dinonaktifkan admin tidak boleh memakai Fin AI
  const { data: prof } = await admin
    .from("profiles")
    .select("disabled")
    .eq("user_id", user.id)
    .maybeSingle();
  if (prof?.disabled) return json({ error: "Akun dinonaktifkan" }, 403);

  // 2. Validasi pesan
  let message = "";
  let imagePath = "";
  try {
    const body = await req.json();
    message = typeof body?.message === "string" ? body.message.trim() : "";
    imagePath = typeof body?.image_path === "string" ? body.image_path.trim() : "";
  } catch {
    return json({ error: "Body tidak valid" }, 400);
  }
  if (!message || message.length > 1000)
    return json({ error: "Pesan harus 1 sampai 1000 karakter" }, 400);
  if (
    imagePath &&
    (!imagePath.startsWith(`${user.id}/`) ||
      imagePath.split("/").some((part) => !part || part === "." || part === ".."))
  ) {
    return json({ error: "Lokasi gambar tidak valid" }, 400);
  }

  // 3. Batas pemakaian: 30 pesan per jam per pengguna
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("role", "user")
    .gte("created_at", since);
  if ((count ?? 0) >= 30)
    return json({ error: "Terlalu banyak pesan. Coba lagi nanti." }, 429);

  // 4. Riwayat percakapan terakhir
  const { data: history } = await admin
    .from("chat_messages")
    .select("role,content")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);
  const past = (
    (history ?? []) as { role: "user" | "assistant"; content: string }[]
  ).reverse();

  // 5. Ambil lampiran gambar privat jika pengguna mengirimkannya
  let imagePart:
    | { inlineData: { mimeType: string; data: string } }
    | undefined;
  if (imagePath) {
    const { data: image, error: imageError } = await admin.storage
      .from("chat-attachments")
      .download(imagePath);
    if (imageError || !image)
      return json({ error: "Gambar tidak dapat dibaca" }, 400);
    if (image.size > 1024 * 1024 || !imageTypes.has(image.type))
      return json({ error: "Format gambar tidak didukung atau ukurannya melebihi 1 MB" }, 400);
    imagePart = {
      inlineData: {
        mimeType: image.type,
        data: toBase64(new Uint8Array(await image.arrayBuffer())),
      },
    };
  }

  // 6. Panggil Gemini; hanya isi chat dan gambar yang dikirim ke penyedia AI
  const model = Deno.env.get("GEMINI_MODEL") ?? "gemini-3.5-flash-lite";
  const contents = [
    ...past.map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: item.content }],
    })),
    {
      role: "user",
      parts: [{ text: message }, ...(imagePart ? [imagePart] : [])],
    },
  ];
  const aiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": aiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: BASE_SYSTEM }] },
        contents,
        generationConfig: { maxOutputTokens: 700 },
      }),
    },
  );
  if (!aiRes.ok) {
    console.error("AI error", aiRes.status, await aiRes.text());
    return json({ error: "Fin sedang tidak bisa menjawab" }, 502);
  }
  const aiData = await aiRes.json();
  const reply = ((aiData.candidates?.[0]?.content?.parts ?? []) as {
    text?: string;
  }[])
    .map((part) => part.text ?? "")
    .join("\n")
    .trim();
  if (!reply) return json({ error: "Balasan kosong" }, 502);

  // 7. Simpan percakapan, lalu kirim balasan
  const { error: saveError } = await admin.from("chat_messages").insert([
    { user_id: user.id, role: "user", content: message, image_path: imagePath || null },
    { user_id: user.id, role: "assistant", content: reply.slice(0, 8000) },
  ]);
  if (saveError) {
    console.error("Gagal menyimpan percakapan", saveError);
    return json({ error: "Percakapan tidak dapat disimpan" }, 500);
  }

  return json({ reply });
});
