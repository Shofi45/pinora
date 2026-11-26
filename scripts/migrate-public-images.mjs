import { createClient } from "@supabase/supabase-js";
import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative, resolve, sep } from "node:path";

const root = process.cwd();
const publicDir = resolve(root, "public");
const envText = await readFile(resolve(root, ".env"), "utf8").catch(() => "");
for (const line of envText.split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
  if (match && !process.env[match[1]]) {
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  throw new Error(
    "Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env before running this migration.",
  );
}

const contentTypes = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
]);
const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function* walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

let uploaded = 0;
for await (const filePath of walk(publicDir)) {
  const extension = extname(filePath).toLowerCase();
  const contentType = contentTypes.get(extension);
  if (!contentType) continue;

  const objectPath = relative(publicDir, filePath).split(sep).join("/");
  const { error } = await supabase.storage
    .from("site-media")
    .upload(objectPath, await readFile(filePath), {
      upsert: true,
      cacheControl: "3600",
      contentType,
    });
  if (error) throw new Error(`Failed to upload ${objectPath}: ${error.message}`);
  uploaded += 1;
  console.log(`Uploaded ${objectPath}`);
}

console.log(`Migration complete: ${uploaded} local image files uploaded.`);
