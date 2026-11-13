import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  AreaChart,
  Bars,
  Donut,
  HBars,
  Spark,
  shortDay,
} from "@/components/admin/Charts";
import { Icon, type IconName } from "@/components/Icon";
import { supabase } from "@/lib/supabase";
import type { AdminStats, Profile } from "@/lib/types";

const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
const fmt = (n: number) => n.toLocaleString("id-ID");
const pct = (a: number, b: number) =>
  b > 0 ? Math.min(100, Math.round((a / b) * 100)) : 0;
const PAGE_NAMES: Record<string, string> = {
  "/": "Beranda",
  "/learn": "Materi Belajar",
  "/learn/sc-btn": "SC BTN",
  "/calculate": "Kalkulator",
  "/profile": "Tentang Kami",
};
const pageName = (p: string) => PAGE_NAMES[p] ?? p;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recent, setRecent] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<7 | 14>(14);

  useEffect(() => {
    if (!supabase) return;
    supabase.rpc("admin_stats").then(({ data, error: e }) => {
      if (e)
        setError(
          "Gagal memuat statistik. Pastikan admin.sql dan admin-grafik.sql sudah dijalankan.",
        );
      else setStats(data as AdminStats);
    });
    supabase
      .from("profiles")
      .select("user_id,email,role,disabled,created_at")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setRecent((data ?? []) as Profile[]));
  }, []);

  const view = useMemo(() => {
    if (!stats) return null;
    const cut = <T,>(a?: T[]) => (a ?? []).slice(-range);
    const visits = cut(stats.visits_by_day);
    return {
      visits,
      signups: cut(stats.signups_by_day),
      tx: cut(stats.tx_by_day),
      chat: cut(stats.chat_by_day),
      totalVisits: sum(visits.map((v) => v.visits)),
      totalVisitors: sum(visits.map((v) => v.visitors)),
    };
  }, [stats, range]);

  if (error) return <div className="admin-error">{error}</div>;
  if (!stats || !view) return <p className="lesson-empty">Memuat dashboard…</p>;

  const hasTraffic = Boolean(stats.visits_by_day);
  const t = stats.tx_types;
  const signupsInRange = sum(view.signups.map((s) => s.count));

  const miniCards: {
    icon: IconName;
    title: string;
    value: number;
    note: string;
    progress: number;
    spark: number[];
    color: string;
  }[] = [
    {
      icon: "wallet",
      title: "Catatan transaksi",
      value: stats.transactions,
      note: `${stats.tx_users} dari ${stats.users} pengguna mencatat`,
      progress: pct(stats.tx_users, stats.users),
      spark: view.tx.map((d) => d.count),
      color: "#7a6fe0",
    },
    {
      icon: "calculator",
      title: "Simulasi kalkulator",
      value: stats.simulations,
      note: `${pct(stats.simulations, stats.users)}% pengguna menyimpan simulasi`,
      progress: pct(stats.simulations, stats.users),
      spark: [],
      color: "#28a277",
    },
    {
      icon: "bot",
      title: "Pertanyaan Fin AI",
      value: stats.chat_messages,
      note: "total pesan dari pengguna",
      progress: 0,
      spark: view.chat.map((d) => d.count),
      color: "#e8647a",
    },
  ];

  return (
    <div className="ad-grid">
      <div className="ad-col">
        {/* Kunjungan */}
        <section className="ad-card violet">
          <div className="ad-card-head">
            <div>
              <h3>Kunjungan situs</h3>
              <p>Kunjungan dan pengunjung unik per hari</p>
            </div>
            <div className="range" role="group" aria-label="Rentang waktu">
              {([7, 14] as const).map((r) => (
                <button
                  key={r}
                  className={range === r ? "on" : ""}
                  onClick={() => setRange(r)}
                >
                  {r} hari
                </button>
              ))}
            </div>
          </div>
          {hasTraffic ? (
            <AreaChart
              dark
              labels={view.visits.map((v) => v.day)}
              series={[
                {
                  name: "Kunjungan",
                  values: view.visits.map((v) => v.visits),
                  color: "#ffffff",
                },
                {
                  name: "Pengunjung unik",
                  values: view.visits.map((v) => v.visitors),
                  color: "#ff8fb0",
                },
              ]}
            />
          ) : (
            <p className="chart-empty">
              Data kunjungan belum tersedia. Jalankan{" "}
              <b>supabase/admin-grafik.sql</b> di SQL Editor, lalu muat ulang.
            </p>
          )}
          <div className="ad-totals">
            <div>
              <small>Total kunjungan</small>
              <b>{fmt(view.totalVisits)}</b>
              <span>{range} hari terakhir</span>
            </div>
            <div className="mid">
              <small>Pengunjung unik</small>
              <b>{fmt(view.totalVisitors)}</b>
              <span>{range} hari terakhir</span>
            </div>
            <div>
              <small>Pendaftar baru</small>
              <b>{fmt(signupsInRange)}</b>
              <span>{range} hari terakhir</span>
            </div>
          </div>
        </section>

        {/* Kartu ringkasan */}
        <div className="ad-mini-row">
          {miniCards.map((c) => (
            <section className="ad-card mini" key={c.title}>
              <span className="mini-icon" style={{ background: c.color }}>
                <Icon name={c.icon} size={22} />
              </span>
              <h4>{c.title}</h4>
              <strong>{fmt(c.value)}</strong>
              <p>{c.note}</p>
              {c.spark.length > 0 ? (
                <div className="mini-spark" style={{ color: c.color }}>
                  <Spark values={c.spark} color={c.color} />
                </div>
              ) : (
                <div className="mini-progress">
                  <i style={{ width: `${c.progress}%`, background: c.color }} />
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Donat + halaman populer */}
        <div className="ad-two">
          <section className="ad-card">
            <div className="ad-card-head">
              <div>
                <h3>Jenis transaksi</h3>
                <p>Pemasukan, pengeluaran, dan tabungan</p>
              </div>
            </div>
            {t ? (
              <>
                <Donut
                  centerLabel="transaksi"
                  slices={[
                    { label: "Pemasukan", value: t.income, color: "#28a277" },
                    {
                      label: "Pengeluaran",
                      value: t.expense,
                      color: "#e8647a",
                    },
                    { label: "Tabungan", value: t.saving, color: "#7a6fe0" },
                  ]}
                />
                <div className="nw-split">
                  <span>
                    Pengeluaran: <b>{fmt(t.kebutuhan)}</b> kebutuhan
                  </span>
                  <span>
                    <b>{fmt(t.kemauan)}</b> kemauan
                  </span>
                </div>
              </>
            ) : (
              <p className="chart-empty">
                Jalankan <b>admin-grafik.sql</b> untuk menampilkan diagram ini.
              </p>
            )}
          </section>
          <section className="ad-card">
            <div className="ad-card-head">
              <div>
                <h3>Halaman terpopuler</h3>
                <p>Kunjungan 14 hari terakhir</p>
              </div>
            </div>
            {stats.top_pages && stats.top_pages.length > 0 ? (
              <HBars
                items={stats.top_pages.map((p) => ({
                  label: pageName(p.path),
                  value: p.count,
                }))}
              />
            ) : (
              <p className="chart-empty">
                {hasTraffic
                  ? "Belum ada kunjungan tercatat."
                  : "Jalankan admin-grafik.sql untuk melihat halaman terpopuler."}
              </p>
            )}
          </section>
        </div>

        {/* Batang */}
        <div className="ad-two">
          <section className="ad-card">
            <div className="ad-card-head">
              <div>
                <h3>Pendaftar baru</h3>
                <p>Per hari, {range} hari terakhir</p>
              </div>
            </div>
            {view.signups.length ? (
              <Bars
                items={view.signups.map((d) => ({
                  label: d.day,
                  value: d.count,
                }))}
                color="#0b5cad"
              />
            ) : (
              <p className="chart-empty">Belum ada data.</p>
            )}
          </section>
          <section className="ad-card">
            <div className="ad-card-head">
              <div>
                <h3>Aktivitas Fin AI</h3>
                <p>Pertanyaan per hari, {range} hari terakhir</p>
              </div>
            </div>
            {view.chat.length ? (
              <Bars
                items={view.chat.map((d) => ({ label: d.day, value: d.count }))}
                color="#e8647a"
              />
            ) : (
              <p className="chart-empty">Belum ada data.</p>
            )}
          </section>
        </div>
      </div>

      <div className="ad-col side">
        <section className="ad-card glass">
          <span className="mini-icon" style={{ background: "var(--blue)" }}>
            <Icon name="users" size={22} />
          </span>
          <h4>Total pengguna</h4>
          <strong>{fmt(stats.users)}</strong>
          <p>
            {stats.new_users_7d} baru dalam 7 hari · {stats.admins} admin
          </p>
        </section>
        <section className="ad-card pink">
          <span className="mini-icon light">
            <Icon name="trend" size={22} />
          </span>
          <h4>Aktif 7 hari</h4>
          <strong>{fmt(stats.active_7d)}</strong>
          <p>{pct(stats.active_7d, stats.users)}% dari seluruh pengguna</p>
        </section>
        <section className="ad-card">
          <div className="ad-card-head">
            <div>
              <h3>Pengguna terbaru</h3>
            </div>
            <button
              className="link-btn"
              onClick={() => navigate("/admin/pengguna")}
            >
              Lihat semua
            </button>
          </div>
          <ul className="recent">
            {recent.map((p) => (
              <li key={p.user_id}>
                <span className="r-avatar">
                  {(p.email ?? "?").charAt(0).toUpperCase()}
                </span>
                <div>
                  <b>{p.email ?? "-"}</b>
                  <small>
                    {p.role === "admin" ? "Admin" : "Pengguna"} ·{" "}
                    {shortDay(p.created_at.slice(0, 10))}
                  </small>
                </div>
              </li>
            ))}
            {recent.length === 0 && (
              <li className="admin-muted">Belum ada pengguna.</li>
            )}
          </ul>
        </section>
        <section className="ad-card">
          <div className="ad-card-head">
            <div>
              <h3>Materi belajar</h3>
            </div>
            <button
              className="link-btn"
              onClick={() => navigate("/admin/materi")}
            >
              Kelola
            </button>
          </div>
          {stats.lessons ? (
            <div className="lesson-stat">
              <div>
                <b>{stats.lessons.published}</b>
                <small>terbit</small>
              </div>
              <div>
                <b>{stats.lessons.draft}</b>
                <small>draf</small>
              </div>
            </div>
          ) : (
            <p className="chart-empty">Jalankan admin-grafik.sql.</p>
          )}
        </section>
      </div>
    </div>
  );
}
