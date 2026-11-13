import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { Icon, type IconName } from '@/components/Icon'
import { TransactionModal } from '@/components/TransactionModal'
import { useAuth } from '@/context/AuthContext'
import { CHALLENGE_ITEMS, useChallenge } from '@/hooks/useChallenge'
import { useSimulation, type SaveStatus } from '@/hooks/useSimulation'
import { useTransactions } from '@/hooks/useTransactions'
import { currentMonth, formatDate, formatIDR, formatPercent, monthLabel, shiftMonth } from '@/lib/format'
import { summarize } from '@/lib/summary'
import type { Transaction } from '@/lib/types'

const TX_ICON: Record<Transaction['type'], IconName> = { income: 'arrow', expense: 'arrow', saving: 'piggy' }
const TX_SIGN: Record<Transaction['type'], string> = { income: '+', expense: '-', saving: '-' }
const TX_LABEL: Record<Transaction['type'], string> = { income: 'Pemasukan', expense: 'Pengeluaran', saving: 'Tabungan' }
const STATUS_TEXT: Record<SaveStatus, string> = {
  idle: 'Perubahan tersimpan otomatis ke akunmu.',
  loading: 'Memuat simulasi tersimpan...',
  saving: 'Menyimpan...',
  saved: 'Tersimpan',
  error: 'Gagal menyimpan. Periksa koneksi lalu ubah angkanya lagi.',
}

export default function Calculate() {
  const { user, openAuth } = useAuth()
  const sim = useSimulation()
  const challenge = useChallenge()
  const [month, setMonth] = useState(currentMonth())
  const tx = useTransactions(month)
  const [txOpen, setTxOpen] = useState(false)
  const [showChallenge, setShowChallenge] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  useEffect(() => {
    if (!confirmId) return
    const timer = setTimeout(() => setConfirmId(null), 3000)
    return () => clearTimeout(timer)
  }, [confirmId])

  const { income, needs, debt, home_installment: homeInstallment, saving } = sim.values
  const remaining = income - needs - debt - homeInstallment - saving
  const ratio = income ? Math.round(((debt + homeInstallment) / income) * 100) : 0

  const s = summarize(tx.items)
  const target = saving
  const savingPct = target > 0 ? Math.round((s.saving / target) * 100) : 0
  const isCurrent = month === currentMonth()

  const cards: { icon: IconName; label: string; value: string; trend: string; tone: string }[] = user
    ? [
        { icon: 'arrow', label: 'Total pemasukan', value: formatIDR(s.income), trend: `${s.incomeCount} transaksi pemasukan`, tone: 'green' },
        { icon: 'arrow', label: 'Total pengeluaran', value: formatIDR(s.expense), trend: `${formatPercent(s.expenseRatio)} dari pemasukan`, tone: 'red' },
        { icon: 'wallet', label: 'Sisa keuangan', value: formatIDR(s.remaining), trend: s.remaining < 0 ? 'Pengeluaran melebihi pemasukan' : 'Masih ada sisa bulan ini', tone: 'blue' },
        { icon: 'piggy', label: 'Target tabungan', value: formatIDR(target), trend: `${savingPct}% target tercapai (${formatIDR(s.saving)})`, tone: 'yellow' },
      ]
    : [
        { icon: 'arrow', label: 'Total pemasukan', value: 'Rp5.300.000', trend: '+8% bulan ini', tone: 'green' },
        { icon: 'arrow', label: 'Total pengeluaran', value: 'Rp2.450.000', trend: '46,2% dari pemasukan', tone: 'red' },
        { icon: 'wallet', label: 'Sisa keuangan', value: 'Rp2.850.000', trend: 'Kondisi keuangan sehat', tone: 'blue' },
        { icon: 'piggy', label: 'Target tabungan', value: 'Rp500.000', trend: '100% target tercapai', tone: 'yellow' },
      ]

  const share = (value: number) => (s.income > 0 ? Math.min(100, (value / s.income) * 100) : 0)
  const breakdown = [
    { key: 'kebutuhan', label: 'Kebutuhan', value: s.kebutuhan, goal: 50 },
    { key: 'kemauan', label: 'Kemauan', value: s.kemauan, goal: 30 },
    { key: 'tabungan', label: 'Tabungan', value: s.saving, goal: 20 },
  ]

  const addTransaction = () => (user ? setTxOpen(true) : openAuth())

  return (
    <>
      <section id="calculate" className="section calculate-section">
        <div className="container">
          <div className="calc-intro">
            <div className="section-kicker light">KALKULATOR KEUANGAN</div>
            <h2>Angka yang lebih jelas,<br />keputusan yang lebih tenang.</h2>
            <p>Ubah angkanya dan lihat kemampuan anggaranmu secara langsung.</p>
          </div>
          <div className="calc-layout">
            <div className="calc-form">
              <div className="panel-title"><span><Icon name="calculator" /></span><div><h3>Simulasi anggaran bulanan</h3><p>Masukkan estimasi kondisi keuanganmu</p></div></div>
              <div className="form-grid">
                <MoneyInput label="Penghasilan bersih" value={income} setValue={(n) => sim.setField('income', n)} />
                <MoneyInput label="Kebutuhan pokok & rutin" value={needs} setValue={(n) => sim.setField('needs', n)} />
                <MoneyInput label="Cicilan berjalan" value={debt} setValue={(n) => sim.setField('debt', n)} />
                <MoneyInput label="Perkiraan cicilan rumah" value={homeInstallment} setValue={(n) => sim.setField('home_installment', n)} />
                <MoneyInput label="Target tabungan" value={saving} setValue={(n) => sim.setField('saving', n)} wide />
              </div>
              <div className="save-status">
                {user ? (
                  <span className={sim.status === 'saved' ? 'ok' : sim.status === 'error' ? 'bad' : ''} role="status">{STATUS_TEXT[sim.status]}</span>
                ) : (
                  <>
                    <span>Simulasi ini belum tersimpan. Masuk untuk menyimpannya otomatis.</span>
                    <button onClick={openAuth}>Masuk / Daftar</button>
                  </>
                )}
              </div>
            </div>
            <aside className="result-card">
              <span className="result-label">SISA ANGGARANMU</span>
              <strong className={remaining < 0 ? 'negative' : ''}>{formatIDR(remaining)}</strong>
              <p>Setelah kebutuhan, cicilan, dan tabungan terpenuhi.</p>
              <div className="score">
                <div className="score-head"><span>Rasio cicilan</span><b>{ratio}%</b></div>
                <div className="progress"><i style={{ width: `${Math.min(ratio, 100)}%` }} /></div>
                <small>{ratio <= 30 ? 'Sehat — masih dalam batas ideal' : 'Perlu ditinjau — di atas batas ideal 30%'}</small>
              </div>
              <div className="insight"><span><Icon name="spark" size={18} /></span><p><b>Insight Fin</b><br />{remaining >= 0 ? `Kamu masih memiliki ${formatIDR(remaining)} untuk ruang fleksibel.` : 'Pengeluaranmu melebihi pemasukan. Coba kurangi target cicilan.'}</p></div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section snapshot-section">
        <div className="container">
          <div className="section-heading compact">
            <div><div className="section-kicker">RINGKASAN KEUANGAN</div><h2>Satu tampilan untuk<br />keuangan yang terkendali.</h2></div>
            <Button variant="secondary" onClick={addTransaction}><Icon name="plus" size={18} /> Tambah transaksi</Button>
          </div>

          {!user && (
            <div className="important-note guest-note">
              <Icon name="shield" />
              <p><b>Ini hanya contoh tampilan.</b> Masuk untuk mencatat transaksimu sendiri dan melihat ringkasan yang sebenarnya.</p>
              <button className="note-action" onClick={openAuth}>Masuk / Daftar</button>
            </div>
          )}

          {user && (
            <div className="tx-toolbar">
              <h3>Ringkasan {monthLabel(month)}</h3>
              <div className="month-switch">
                <button onClick={() => setMonth(shiftMonth(month, -1))} aria-label="Bulan sebelumnya" className="prev"><Icon name="chevron" size={18} /></button>
                <b>{monthLabel(month)}</b>
                <button onClick={() => setMonth(shiftMonth(month, 1))} aria-label="Bulan berikutnya" disabled={isCurrent}><Icon name="chevron" size={18} /></button>
              </div>
            </div>
          )}

          <div className="summary-grid">
            {cards.map((c) => <Summary key={c.label} {...c} />)}
          </div>

          {user && (
            <>
              <div className="breakdown">
                {breakdown.map((b) => (
                  <div className={`breakdown-item ${b.key}`} key={b.key}>
                    <div className="breakdown-head"><span>{b.label}</span><b>{formatPercent(s.income > 0 ? (b.value / s.income) * 100 : 0)} <small>/ acuan {b.goal}%</small></b></div>
                    <div className="progress"><i style={{ width: `${share(b.value)}%` }} /></div>
                    <small>{formatIDR(b.value)}</small>
                  </div>
                ))}
              </div>

              <div className="tx-panel">
                <div className="tx-toolbar">
                  <h3>Riwayat transaksi</h3>
                  <small>{tx.loading ? 'Memuat...' : `${s.count} transaksi`}</small>
                </div>
                {tx.error && <div className="form-error" role="alert">{tx.error}</div>}
                {!tx.loading && !tx.error && tx.items.length === 0 && (
                  <div className="tx-empty">
                    <span><Icon name="wallet" size={26} /></span>
                    <b>Belum ada transaksi di {monthLabel(month)}</b>
                    <p>Mulai dengan mencatat pemasukan atau pengeluaran pertamamu.</p>
                    <Button onClick={() => setTxOpen(true)}><Icon name="plus" size={18} /> Tambah transaksi</Button>
                  </div>
                )}
                <div className="tx-list">
                  {tx.items.map((t) => (
                    <div className="tx-row" key={t.id}>
                      <span className={`tx-icon ${t.type}`}><Icon name={TX_ICON[t.type]} size={20} /></span>
                      <div>
                        <div className="tx-title">{t.title}</div>
                        <div className="tx-meta">
                          <span>{formatDate(t.occurred_on)}</span>
                          <span className="tx-badge">{t.category ? (t.category === 'kebutuhan' ? 'Kebutuhan' : 'Kemauan') : TX_LABEL[t.type]}</span>
                        </div>
                      </div>
                      <span className={`tx-amount ${t.type}`}>{TX_SIGN[t.type]}{formatIDR(t.amount)}</span>
                      <button
                        className={`tx-delete ${confirmId === t.id ? 'confirm' : ''}`}
                        onClick={() => {
                          if (confirmId === t.id) {
                            setConfirmId(null)
                            void tx.remove(t.id)
                          } else setConfirmId(t.id)
                        }}
                        aria-label={`Hapus ${t.title}`}
                      >
                        {confirmId === t.id ? 'Yakin?' : 'Hapus'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="challenge">
            <div className="challenge-copy"><span className="challenge-icon"><Icon name="check" /></span><div><small>TANTANGAN 7 HARI</small><h3>Bangun kebiasaan finansial yang lebih sehat</h3><p>Selesaikan checklist kecil setiap hari dan kenali pola keuanganmu.</p></div></div>
            <div className="challenge-progress"><div><span>Progresmu</span><b>{challenge.count} dari {challenge.total}</b></div><div className="progress"><i style={{ width: `${(challenge.count / challenge.total) * 100}%` }} /></div></div>
            <Button variant="secondary" onClick={() => setShowChallenge(!showChallenge)}>{showChallenge ? 'Sembunyikan' : 'Lanjutkan tantangan'} <Icon name="chevron" size={17} /></Button>
          </div>
          {showChallenge && (
            <div className="challenge-list">
              <ul>
                {CHALLENGE_ITEMS.map((text, i) => (
                  <li key={text}>
                    <button role="checkbox" aria-checked={challenge.done[i]} className={challenge.done[i] ? 'done' : ''} onClick={() => void challenge.toggle(i)}>
                      <span className="check-box">{challenge.done[i] && <Icon name="check" size={15} />}</span>
                      <span className="t">{text}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="challenge-actions">
                <span>{user ? 'Progres tersimpan di akunmu.' : 'Masuk agar progresmu tersimpan.'}</span>
                <button onClick={() => void challenge.reset()}>Ulangi tantangan</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {txOpen && <TransactionModal onClose={() => setTxOpen(false)} onSave={async (t) => {
        const err = await tx.add(t)
        if (!err) setMonth(t.occurred_on.slice(0, 7))
        return err
      }} />}
    </>
  )
}

function MoneyInput({ label, value, setValue, wide = false }: { label: string; value: number; setValue: (value: number) => void; wide?: boolean }) {
  return <label className={wide ? 'wide' : ''}><span>{label}</span><div className="money-input"><small>Rp</small><input type="number" min={0} value={value} onChange={(event) => setValue(Number(event.target.value))} /></div></label>
}

function Summary({ icon, label, value, trend, tone }: { icon: IconName; label: string; value: string; trend: string; tone: string }) {
  return <article className="summary-card"><div className={`summary-icon ${tone}`}><Icon name={icon} /></div><span>{label}</span><strong>{value}</strong><small>{trend}</small></article>
}

