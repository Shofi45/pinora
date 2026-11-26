export type TxType = "income" | "expense" | "saving";
export type TxCategory = "kebutuhan" | "kemauan";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TxType;
  category: TxCategory | null;
  occurred_on: string;
  created_at: string;
}

export interface NewTransaction {
  title: string;
  amount: number;
  type: TxType;
  category: TxCategory | null;
  occurred_on: string;
}

export interface SimulationValues {
  income: number;
  needs: number;
  debt: number;
  home_installment: number;
  saving: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  /** Hanya untuk pesan lokal: menampilkan tombol Masuk di dalam gelembung chat */
  action?: "login";
}

export type Role = "user" | "admin";

export interface Profile {
  user_id: string;
  email: string | null;
  role: Role;
  disabled: boolean;
  created_at: string;
}

export type LessonAccent =
  | "mint"
  | "blue"
  | "coral"
  | "yellow"
  | "purple"
  | "navy";
export type LessonTarget = "page" | "sc-btn" | "calculate";

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  summary: string;
  tag: string;
  icon: import("@/components/Icon").IconName;
  accent: LessonAccent;
  target: LessonTarget;
  content: string;
  sort_order: number;
  published: boolean;
}

export interface LessonQuiz {
  id: string;
  lesson_id: string;
  question: string;
  options: string[];
  answer_index: number;
  explanation: string;
  sort_order: number;
  published: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
}

export interface DocumentationItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  cover_image: string;
  sort_order: number;
  published: boolean;
}

export interface DayCount {
  day: string;
  count: number;
}

export interface AdminStats {
  users: number;
  admins: number;
  disabled: number;
  new_users_7d: number;
  transactions: number;
  tx_users: number;
  simulations: number;
  chat_messages: number;
  active_7d: number;
  // Diisi oleh supabase/admin-grafik.sql. Kosong bila skrip itu belum dijalankan.
  visits_14d?: number;
  visitors_14d?: number;
  tx_types?: {
    income: number;
    expense: number;
    saving: number;
    kebutuhan: number;
    kemauan: number;
  };
  lessons?: { published: number; draft: number };
  top_pages?: { path: string; count: number }[];
  visits_by_day?: { day: string; visits: number; visitors: number }[];
  signups_by_day?: DayCount[];
  tx_by_day?: DayCount[];
  chat_by_day?: DayCount[];
}
