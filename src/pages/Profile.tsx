import { Icon } from '@/components/Icon'
import { useGo } from '@/lib/nav'

export default function Profile() {
  const go = useGo()
  return (
    <>
        <section id="profile" className="profile-section">
          <div className="container profile-grid">
            <div><div className="section-kicker light">TENTANG KAMI</div><h2>Teman bertumbuh dalam setiap langkah keuanganmu.</h2></div>
            <div><p>Finora hadir untuk membuat literasi finansial terasa dekat, relevan, dan mudah dipraktikkan oleh siapa pun.</p><div className="profile-points"><span><Icon name="book" /> Materi praktis</span><span><Icon name="shield" /> Data privat</span><span><Icon name="bot" /> Dukungan AI</span></div></div>
          </div>
          <div className="container footer"><button className="brand footer-brand" onClick={() => go('home')}><span className="brand-mark"><Icon name="chart" size={22} /></span><span>finora<span className="brand-dot">.</span></span></button><span>Belajar. Catat. Rencanakan.</span><small>© 2026 Finora</small></div>
        </section>
    </>
  )
}
