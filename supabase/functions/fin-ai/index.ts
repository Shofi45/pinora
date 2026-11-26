// Supabase Edge Function: fin-ai
// Menjawab pertanyaan pengguna sebagai "Fin", asisten edukasi keuangan Finwise.
//
// Deploy:
//   supabase functions deploy fin-ai
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
// Opsional: supabase secrets set AI_MODEL=claude-haiku-5-5

import { createClient } from "@supabase/supabase-js";

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

const BASE_SYSTEM = `Kamu adalah Fin, asisten edukasi keuangan di situs Finwise.
Gaya: ramah, sederhana, bahasa Indonesia sehari-hari, jawaban singkat (maksimal sekitar 150 kata), boleh memakai daftar poin pendek.
Topik: menabung, dasar investasi, KPR dan persiapan membeli rumah, dokumen kredit, pencatatan dan evaluasi keuangan pribadi.
Aturan:
- Kamu memberi informasi edukatif, bukan nasihat keuangan, hukum, atau pajak resmi. Ingatkan singkat jika pertanyaannya mengarah ke keputusan besar.
- Jangan menyebut angka suku bunga, biaya, promo, atau syarat produk bank tertentu, dan jangan menjanjikan persetujuan kredit. Arahkan pengguna ke bank resmi atau Sales Center untuk ketentuan terbaru.
- Rasio cicilan terhadap penghasilan sekitar 30% sering dipakai sebagai acuan umum, bukan aturan pasti.
- Jika pertanyaan di luar topik keuangan, tolak dengan sopan dan arahkan kembali ke topik keuangan.
- Jika data keuangan pengguna tersedia di bawah, gunakan untuk memberi contoh yang relevan. Jangan mengarang data yang tidak ada.`;

const rupiah = (n: number) => "Rp" + Math.round(n).toLocaleString("id-ID");
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
  const aiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!supabaseUrl || !serviceKey)
    return json({ error: "Konfigurasi Supabase tidak lengkap" }, 500);
  if (!aiKey) return json({ error: "ANTHROPIC_API_KEY belum diatur" }, 500);

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

  // 5. Data keuangan pengguna (diambil di server, tidak dikirim dari browser)
  let context = "";
  const { data: sim } = await admin
    .from("budget_simulations")
    .select("income,needs,debt,home_installment,saving")
    .eq("user_id", user.id)
    .maybeSingle();
  if (sim) {
    const ratio =
      sim.income > 0
        ? Math.round(((sim.debt + sim.home_installment) / sim.income) * 100)
        : 0;
    context += `\nSimulasi anggaran bulanan pengguna: penghasilan ${rupiah(sim.income)}, kebutuhan pokok ${rupiah(sim.needs)}, cicilan berjalan ${rupiah(sim.debt)}, perkiraan cicilan rumah ${rupiah(sim.home_installment)}, target tabungan ${rupiah(sim.saving)}, rasio cicilan ${ratio}%, sisa ${rupiah(sim.income - sim.needs - sim.debt - sim.home_installment - sim.saving)}.`;
  }
  const wib = new Date(Date.now() + 7 * 60 * 60 * 1000);
  const ym = wib.toISOString().slice(0, 7);
  const next = new Date(
    Date.UTC(wib.getUTCFullYear(), wib.getUTCMonth() + 1, 1),
  )
    .toISOString()
    .slice(0, 10);
  const { data: txs } = await admin
    .from("transactions")
    .select("amount,type,category")
    .eq("user_id", user.id)
    .gte("occurred_on", `${ym}-01`)
    .lt("occurred_on", next);
  if (txs && txs.length > 0) {
    let income = 0,
      expense = 0,
      saving = 0,
      kebutuhan = 0,
      kemauan = 0;
    for (const t of txs as {
      amount: number;
      type: string;
      category: string | null;
    }[]) {
      if (t.type === "income") income += t.amount;
      else if (t.type === "saving") saving += t.amount;
      else {
        expense += t.amount;
        if (t.category === "kebutuhan") kebutuhan += t.amount;
        if (t.category === "kemauan") kemauan += t.amount;
      }
    }
    context += `\nCatatan keuangan bulan ini: pemasukan ${rupiah(income)}, pengeluaran ${rupiah(expense)} (kebutuhan ${rupiah(kebutuhan)}, kemauan ${rupiah(kemauan)}), tabungan ${rupiah(saving)}, sisa ${rupiah(income - expense - saving)}.`;
  }
  const system = context
    ? `${BASE_SYSTEM}\n\nData keuangan pengguna:${context}`
    : BASE_SYSTEM;

  let imageBlock:
    | { type: "image"; source: { type: "base64"; media_type: string; data: string } }
    | undefined;
  if (imagePath) {
    const { data: image, error: imageError } = await admin.storage
      .from("chat-attachments")
      .download(imagePath);
    if (imageError || !image)
      return json({ error: "Gambar tidak dapat dibaca" }, 400);
    if (image.size > 5 * 1024 * 1024 || !imageTypes.has(image.type))
      return json({ error: "Format gambar tidak didukung atau ukurannya terlalu besar" }, 400);
    imageBlock = {
      type: "image",
      source: {
        type: "base64",
        media_type: image.type,
        data: toBase64(new Uint8Array(await image.arrayBuffer())),
      },
    };
  }

  // 6. Panggil model
  const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": aiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: Deno.env.get("AI_MODEL") ?? "claude-haiku-5-5",
      max_tokens: 700,
      system,
      messages: [
        ...past,
        {
          role: "user",
          content: imageBlock
            ? [{ type: "text", text: message }, imageBlock]
            : message,
        },
      ],
    }),
  });
  if (!aiRes.ok) {
    console.error("AI error", aiRes.status, await aiRes.text());
    return json({ error: "Fin sedang tidak bisa menjawab" }, 502);
  }
  const aiData = await aiRes.json();
  const reply = ((aiData.content ?? []) as { type: string; text?: string }[])
    .filter((b) => b.type === "text")
    .map((b) => b.text ?? "")
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
