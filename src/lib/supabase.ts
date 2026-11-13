import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** True jika VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah diisi di .env */
export const isSupabaseConfigured = Boolean(url && anonKey)

/**
 * Klien Supabase. Bernilai null jika env belum diisi, sehingga situs tetap
 * bisa dibuka dalam mode tamu (kalkulator lokal, data contoh) tanpa error.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null

if (!isSupabaseConfigured) {
  console.warn('[Finora] Supabase belum dikonfigurasi. Salin .env.example menjadi .env lalu isi URL dan anon key.')
}
