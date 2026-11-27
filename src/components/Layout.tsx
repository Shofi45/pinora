import { useEffect, useState } from "react"
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router"
import { AuthModal } from "@/components/AuthModal"
import { Button } from "@/components/Button"
import { ChatPanel } from "@/components/ChatPanel"
import { Icon } from "@/components/Icon"
import { SettingsFab, type TextSize } from "@/components/SettingsFab"
import { useAuth } from "@/context/AuthContext"
import { pathToPage, useGo } from "@/lib/nav"
import { trackVisit } from "@/lib/track"
import { getMediaUrl } from "@/lib/media"

export default function Layout() {
  const go = useGo()
  const { pathname } = useLocation()
  const { user, isAdmin, loading, openAuth, signOut } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  // Admin hanya boleh melihat situs lewat tombol "Website" di panel admin (tab baru, ?preview=1)
  const [preview] = useState(() => {
    if (params.get("preview") === "1") return true
    try {
      return sessionStorage.getItem("finora_preview") === "1"
    } catch {
      return false
    }
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatHintDismissed, setChatHintDismissed] = useState(false)
  const [textSize, setTextSize] = useState<TextSize>(() => {
    try {
      const v = localStorage.getItem("finora_text")
      return v === "large" || v === "xlarge" ? v : "normal"
    } catch {
      return "normal"
    }
  })
  const changeTextSize = (s: TextSize) => {
    setTextSize(s)
    try {
      localStorage.setItem("finora_text", s)
    } catch {
      /* abaikan */
    }
  }
  const page = pathToPage(pathname)
  const isInvestmentChapter = pathname.startsWith("/learn/investasi/")
  const initial = (user?.email ?? "?").charAt(0).toUpperCase()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const shell = document.querySelector(".app-shell")
    const elements = document.querySelectorAll<HTMLElement>(".scroll-reveal")
    if (!shell || elements.length === 0 || !("IntersectionObserver" in window))
      return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting)
        })
      },
      { threshold: 0, rootMargin: "0px 0px 96px 0px" },
    )
    const observeRevealElements = (node: Node) => {
      if (!(node instanceof HTMLElement)) return;
      if (node.matches(".scroll-reveal")) observer.observe(node);
      node
        .querySelectorAll<HTMLElement>(".scroll-reveal")
        .forEach((element) => observer.observe(element));
    };
    const mutations = new MutationObserver((records) => {
      records.forEach((record) =>
        record.addedNodes.forEach(observeRevealElements),
      );
    });

    shell.classList.add("scroll-reveal-ready")
    elements.forEach((element) => observer.observe(element))
    mutations.observe(shell, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect()
      shell.classList.remove("scroll-reveal-ready")
    }
  }, [pathname])

  useEffect(() => {
    if (!preview) return
    try {
      sessionStorage.setItem("finora_preview", "1")
    } catch {
      /* abaikan */
    }
    if (params.get("preview") === "1") navigate(pathname, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Kunjungan admin tidak dihitung
  useEffect(() => {
    if (loading || isAdmin) return
    trackVisit(pathname)
  }, [pathname, loading, isAdmin])

  if (isAdmin && !preview) return <Navigate to="/admin" replace />

  return (
    <div className={`app-shell text-${textSize}`}>
      <header className="nav-wrap">
        <nav className="nav container" aria-label="Navigasi utama">
          <button
            className="brand"
            onClick={() => go("home")}
            aria-label="Finwise home"
          >
            <img
              className="brand-logo"
              src={getMediaUrl("images/finwise-logo.png")}
              alt=""
            />
          </button>
          <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>
            <button
              className={page === "home" ? "active" : ""}
              onClick={() => go("home")}
            >
              Beranda
            </button>
            <button
              className={page === "learn" || page === "sc-btn" ? "active" : ""}
              onClick={() => go("learn")}
            >
              Materi Belajar
            </button>
            <button
              className={page === "calculate" ? "active" : ""}
              onClick={() => go("calculate")}
            >
              Kalkulator
            </button>
            <button
              className={page === "profile" ? "active" : ""}
              onClick={() => go("profile")}
            >
              Tentang Kami
            </button>
            <button
              className={page === "faq" ? "active" : ""}
              onClick={() => go("faq")}
            >
              FAQ
            </button>
            <button
              className={page === "documentation" ? "active" : ""}
              onClick={() => go("documentation")}
            >
              Dokumentasi
            </button>
            {isAdmin && preview && (
              <button
                className="nav-auth-mobile"
                onClick={() => navigate("/admin")}
              >
                ← Kembali ke panel admin
              </button>
            )}
            <button
              className="nav-auth-mobile"
              onClick={() => (user ? void signOut() : openAuth())}
            >
              {user ? `Keluar (${user.email})` : "Masuk / Daftar"}
            </button>
          </div>
          <div className="nav-actions">
            {isAdmin && preview && (
              <button
                className="back-admin"
                onClick={() => navigate("/admin")}
                title="Kembali ke panel admin"
              >
                <Icon name="back" size={17} />
                <span>Panel admin</span>
              </button>
            )}
            {user ? (
              <button
                className="user-chip"
                onClick={() => void signOut()}
                title={user.email ?? undefined}
              >
                <span>{initial}</span>Keluar
              </button>
            ) : (
              <Button variant="secondary" onClick={openAuth}>
                Masuk
              </Button>
            )}
            <Button onClick={() => setChatOpen(true)}>
              <Icon name="spark" size={17} /> Tanya Fin
            </Button>
            <button
              className="menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Buka menu"
            >
              <Icon name={menuOpen ? "close" : "menu"} />
            </button>
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      {!isInvestmentChapter && (
        <footer className="site-footer">
          <div className="site-footer-main container">
            <div className="site-footer-brand">
              <button
                className="brand"
                onClick={() => go("home")}
                aria-label="Kembali ke beranda Finwise"
              >
                <img
                  className="brand-logo"
                  src={getMediaUrl("images/finwise-logo.png")}
                  alt=""
                />
              </button>
              <p>
                Teman belajar untuk mengelola keuangan dan merencanakan masa
                depanmu.
              </p>
            </div>
            <nav className="site-footer-links" aria-label="Navigasi footer">
              <h2>Jelajahi</h2>
              <button onClick={() => go("home")}>Beranda</button>
              <button onClick={() => go("learn")}>Materi Belajar</button>
              <button onClick={() => go("calculate")}>Kalkulator</button>
              <button onClick={() => go("profile")}>Tentang Kami</button>
              <button onClick={() => go("faq")}>FAQ</button>
              <button onClick={() => go("documentation")}>Dokumentasi</button>
            </nav>
          </div>
          <div className="site-footer-bottom container">
            <small>
              © {new Date().getFullYear()} Finwise. Semua hak dilindungi.
            </small>
            <small>Belajar. Catat. Rencanakan.</small>
          </div>
        </footer>
      )}

      <button
        className="chat-fab"
        onClick={() => setChatOpen(true)}
        aria-label="Buka chat Fin AI"
      >
        <Icon name="bot" />
        <span>Tanya Fin AI</span>
      </button>
      {!chatOpen && !chatHintDismissed && (
        <div className="chat-invite">
          <button
            className="chat-invite-copy"
            onClick={() => setChatOpen(true)}
          >
            Tanya AI seputar website ini yuk! <span>🤖</span>
          </button>
          <button
            className="chat-invite-close"
            onClick={() => setChatHintDismissed(true)}
            aria-label="Tutup ajakan chat"
          >
            <Icon name="close" size={13} />
          </button>
        </div>
      )}
      <SettingsFab textSize={textSize} onTextSize={changeTextSize} />
      {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}
      <AuthModal />
    </div>
  )
}
