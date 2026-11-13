import { Button } from '@/components/Button'
import { Icon } from '@/components/Icon'
import { useAuth } from '@/context/AuthContext'
import { useTransactions } from '@/hooks/useTransactions'
import { currentMonth, formatIDR } from '@/lib/format'
import { useGo } from '@/lib/nav'
import { summarize } from '@/lib/summary'

export default function Home() {
  const go = useGo()
  const { user } = useAuth()
  const { items } = useTransactions(currentMonth())
  const s = summarize(items)
  const leftPct = s.income > 0 ? Math.max(0, Math.round((s.remaining / s.income) * 1000) / 10).toString().replace('.', ',') : '0'
  return (
    <>
        <section id="home" className="hero">
          <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><Icon name="spark" size={15} /> Finansial lebih mudah, mulai dari sini</div>
              <h1>Pahami uangmu.<br /><span>Wujudkan rumahmu.</span></h1>
              <p>Belajar finansial, mencatat keuangan, dan merencanakan rumah impian dalam satu tempat yang sederhana.</p>
              <div className="hero-actions">
                <Button onClick={() => go('learn')}>Mulai belajar <Icon name="arrow" /></Button>
                <Button variant="secondary" onClick={() => go('calculate')}>Hitung anggaran</Button>
              </div>
              <div className="trust-row">
                <span><Icon name="shield" size={18} /> Aman & privat</span>
                <span><Icon name="check" size={18} /> Gratis dipelajari</span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-photo">
                <img src="https://images.unsplash.com/photo-1758522487963-1b193a2837fd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1080" alt="Pasangan sedang merencanakan keuangan bersama di rumah" />
                <div className="photo-shade" />
                <div className="photo-caption"><span><Icon name="spark" size={15} /></span><div><small>RENCANA HARI INI</small><b>Masa depan lebih pasti</b></div></div>
              </div>
              <div className="dashboard-card">
                <div className="balance-head">
                  <div className="balance-title"><span><Icon name="wallet" size={19} /></span><div><small>RINGKASAN BULAN INI</small><b>Sisa uangmu</b></div></div>
                  <span className="status-pill"><Icon name="arrow" size={12} /> {user ? `${leftPct}% sisa` : '12,4%'}</span>
                </div>
                <strong className="balance-value">{user ? formatIDR(s.remaining) : 'Rp2.850.000'}</strong>
                <p className="balance-formula">{user ? 'Pemasukan dikurangi pengeluaran dan tabungan' : 'Pemasukan dikurangi pengeluaran'}</p>
                <div className="balance-breakdown">
                  <div><i className="income-dot" /><span><small>Pemasukan</small><b>{user ? formatIDR(s.income) : 'Rp5.300.000'}</b></span></div>
                  <div><i className="expense-dot" /><span><small>Pengeluaran</small><b>{user ? formatIDR(s.expense) : 'Rp2.450.000'}</b></span></div>
                </div>
              </div>
              <div className="float-card float-goal"><span className="goal-icon"><Icon name="home" /></span><div><small>Target rumah</small><b>68% tercapai</b><i><em /></i></div></div>
              <div className="float-card float-ai"><span><Icon name="bot" /></span><div><small>Fin AI</small><b>Siap membantu</b></div></div>
            </div>
          </div>
          <div className="container home-shortcuts" aria-label="Akses cepat">
            <button onClick={() => go('learn')}><span><Icon name="book" /></span><div><small>LANGKAH 1</small><b>Pelajari dasar keuangan</b></div><Icon name="chevron" /></button>
            <button onClick={() => go('sc-btn')}><span><Icon name="home" /></span><div><small>LANGKAH 2</small><b>Siapkan rumah impian</b></div><Icon name="chevron" /></button>
            <button onClick={() => go('calculate')}><span><Icon name="calculator" /></span><div><small>LANGKAH 3</small><b>Hitung kemampuanmu</b></div><Icon name="chevron" /></button>
          </div>
        </section>
    </>
  )
}
