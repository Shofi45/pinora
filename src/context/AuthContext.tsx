import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

export interface AuthResult {
  error: string | null;
  /** Pendaftaran berhasil tetapi pengguna harus mengonfirmasi email dulu */
  needsConfirmation?: boolean;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  /** Profil (role) pengguna yang sedang masuk; null jika belum masuk atau belum dimuat */
  profile: Profile | null;
  isAdmin: boolean;
  configured: boolean;
  authOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function translateError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "Email atau kata sandi salah.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Email ini sudah terdaftar. Coba masuk.";
  if (m.includes("email not confirmed"))
    return "Email belum dikonfirmasi. Cek kotak masuk emailmu.";
  if (m.includes("password should be at least"))
    return "Kata sandi terlalu pendek.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.";
  if (m.includes("valid email") || m.includes("invalid email"))
    return "Format email tidak valid.";
  if (m.includes("failed to fetch") || m.includes("network"))
    return "Tidak dapat terhubung ke server. Periksa koneksi internetmu.";
  return message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [authOpen, setAuthOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  // id pengguna yang profilnya sudah selesai dimuat, supaya tidak ada jeda antara sudah masuk dan role belum diketahui
  const [profileReadyFor, setProfileReadyFor] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session) setAuthOpen(false);
      },
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Muat profil (role) setiap kali pengguna berganti. Dipisah dari onAuthStateChange agar tidak deadlock.
  const userId = user?.id ?? null;
  useEffect(() => {
    if (!supabase || !userId) {
      setProfile(null);
      setProfileReadyFor(null);
      return;
    }
    let active = true;
    supabase
      .from("profiles")
      .select("user_id,email,role,disabled,created_at")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        const p = (data as Profile | null) ?? null;
        if (p?.disabled) {
          void supabase?.auth.signOut();
          setProfile(null);
        } else {
          setProfile(p);
        }
        setProfileReadyFor(userId);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const openAuth = useCallback(() => setAuthOpen(true), []);
  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!supabase) return { error: "Supabase belum dikonfigurasi." };
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error ? translateError(error.message) : null };
    },
    [],
  );

  const signUp = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!supabase) return { error: "Supabase belum dikonfigurasi." };
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) return { error: translateError(error.message) };
      return { error: null, needsConfirmation: !data.session };
    },
    [],
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading: loading || Boolean(userId && profileReadyFor !== userId),
      profile,
      isAdmin: profile?.role === "admin",
      configured: isSupabaseConfigured,
      authOpen,
      openAuth,
      closeAuth,
      signIn,
      signUp,
      signOut,
    }),
    [
      user,
      userId,
      loading,
      profileReadyFor,
      profile,
      authOpen,
      openAuth,
      closeAuth,
      signIn,
      signUp,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
