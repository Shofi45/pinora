import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { AuthModal } from "@/components/AuthModal";
import { Button } from "@/components/Button";
import { Icon, type IconName } from "@/components/Icon";
import { useAuth } from "@/context/AuthContext";

const NAV: {
  to: string;
  end?: boolean;
  icon: IconName;
  label: string;
  sub: string;
}[] = [
  {
    to: "/admin",
    end: true,
    icon: "grid",
    label: "Dashboard",
    sub: "Ringkasan aktivitas dan grafik kunjungan Finora.",
  },
  {
    to: "/admin/pengguna",
    icon: "users",
    label: "Pengguna",
    sub: "Kelola akun, role admin, dan status pengguna.",
  },
  {
    to: "/admin/materi",
    icon: "book",
    label: "Materi",
    sub: "Tambah, ubah, dan terbitkan materi belajar.",
  },
  {
    to: "/admin/chat",
    icon: "bot",
    label: "Chat Fin AI",
    sub: "Pantau percakapan pengguna dengan Fin AI.",
  },
];

export default function AdminLayout() {
  const { user, isAdmin, loading, configured, openAuth, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [busy, setBusy] = useState(false);

  const exit = async () => {
    setBusy(true);
    await signOut();
    navigate("/", { replace: true });
  };

  if (!configured)
    return (
      <Gate
        title="Supabase belum dikonfigurasi"
        text="Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env, lalu jalankan ulang server."
      />
    );
  if (loading) return <Gate title="Memeriksa akses…" />;
  if (!user) {
    return (
      <Gate
        title="Masuk sebagai admin"
        text="Panel ini hanya untuk admin Finora."
      >
        <Button onClick={openAuth}>Masuk</Button>
        <AuthModal />
      </Gate>
    );
  }
  if (!isAdmin) {
    return (
      <Gate
        title="Kamu tidak punya akses"
        text="Akun ini bukan admin. Minta admin lain untuk menjadikanmu admin."
      >
        <div className="gate-actions">
          <Button onClick={() => navigate("/")}>Ke website</Button>
          <Button variant="secondary" onClick={() => void exit()}>
            Keluar
          </Button>
        </div>
      </Gate>
    );
  }

  const current =
    NAV.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to))) ??
    NAV[0];
  const name = (user.email ?? "Admin").split("@")[0];
  const display = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div className="ad-shell">
      <aside className="ad-side">
        <div className="ad-brand">
          <span>
            <Icon name="chart" size={20} />
          </span>
          <b>finora</b>
          <small>admin</small>
        </div>
        <nav aria-label="Menu admin">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Icon name={n.icon} size={19} />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <button
          className="ad-logout"
          onClick={() => void exit()}
          disabled={busy}
        >
          <Icon name="logout" size={19} />
          <span>Keluar</span>
        </button>
      </aside>

      <div className="ad-main">
        <header className="ad-head">
          <div>
            <p className="ad-hello">Selamat datang kembali, {display} 👋</p>
            <h1>{current.label}</h1>
            <p className="ad-sub">{current.sub}</p>
          </div>
          <div className="ad-head-actions">
            <a
              className="btn btn-secondary"
              href="/?preview=1"
              target="_blank"
              rel="noopener"
            >
              <Icon name="globe" size={17} /> Website
            </a>
            <span className="ad-avatar" title={user.email ?? undefined}>
              {display.charAt(0)}
            </span>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}

function Gate({
  title,
  text,
  children,
}: {
  title: string;
  text?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="ad-gate-page">
      <div className="admin-gate">
        <span>
          <Icon name="shield" size={26} />
        </span>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
        {children}
      </div>
    </div>
  );
}
