// Supabase Edge Function: admin-users
// Dipakai halaman /admin untuk menonaktifkan / mengaktifkan akun pengguna.
// Perlu service role (menyentuh Auth), jadi tidak bisa dilakukan dari browser.
//
// Deploy: supabase functions deploy admin-users

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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key)
    return json({ error: "Konfigurasi Supabase tidak lengkap" }, 500);
  const admin = createClient(url, key);

  // 1. Pemanggil harus admin aktif
  const token = (req.headers.get("Authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  const { data: u, error: ue } = await admin.auth.getUser(token);
  const caller = u?.user;
  if (ue || !caller)
    return json({ error: "Silakan masuk terlebih dahulu" }, 401);
  const { data: me } = await admin
    .from("profiles")
    .select("role,disabled")
    .eq("user_id", caller.id)
    .maybeSingle();
  if (!me || me.role !== "admin" || me.disabled)
    return json({ error: "Hanya admin" }, 403);

  // 2. Validasi permintaan
  let body: { user_id?: unknown; disabled?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Body tidak valid" }, 400);
  }
  const target = typeof body.user_id === "string" ? body.user_id : "";
  if (!/^[0-9a-f-]{36}$/i.test(target) || typeof body.disabled !== "boolean")
    return json({ error: "Data tidak valid" }, 400);
  if (target === caller.id)
    return json({ error: "Kamu tidak bisa menonaktifkan akunmu sendiri" }, 400);

  // 3. Blokir / buka blokir di Auth, lalu catat di profil
  const { error: be } = await admin.auth.admin.updateUserById(target, {
    ban_duration: body.disabled ? "876000h" : "none",
  });
  if (be) return json({ error: "Gagal mengubah status akun" }, 500);
  await admin
    .from("profiles")
    .update({ disabled: body.disabled })
    .eq("user_id", target);
  return json({ ok: true });
});
