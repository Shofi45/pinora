import { useState, type FormEvent } from 'react'
import { Icon } from '@/components/Icon'
import { todayISO } from '@/lib/format'
import type { NewTransaction, TxCategory, TxType } from '@/lib/types'

const TYPES: { value: TxType; label: string }[] = [
  { value: 'income', label: 'Pemasukan' },
  { value: 'expense', label: 'Pengeluaran' },
  { value: 'saving', label: 'Tabungan' },
]

export function TransactionModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  /** Mengembalikan pesan error, atau null jika berhasil */
  onSave: (tx: NewTransaction) => Promise<string | null>
}) {
  const [type, setType] = useState<TxType>('expense')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<TxCategory>('kebutuhan')
  const [date, setDate] = useState(todayISO())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const value = Math.round(Number(amount))
    if (!title.trim()) return setError('Nama transaksi wajib diisi.')
    if (!Number.isFinite(value) || value <= 0) return setError('Nominal harus lebih dari 0.')
    if (!date) return setError('Tanggal wajib diisi.')
    setError(null)
    setBusy(true)
    const err = await onSave({
      title: title.trim(),
      amount: value,
      type,
      category: type === 'expense' ? category : null,
      occurred_on: date,
    })
    setBusy(false)
    if (err) setError(err)
    else onClose()
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="tx-title">
        <div className="modal-head">
          <div>
            <h3 id="tx-title">Tambah transaksi</h3>
            <p>Catat uang masuk, uang keluar, atau tabunganmu.</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Tutup"><Icon name="close" size={18} /></button>
        </div>

        <div className="tabs-seg cols-3" role="tablist">
          {TYPES.map((t) => (
            <button key={t.value} type="button" role="tab" aria-selected={type === t.value} className={type === t.value ? 'on' : ''} onClick={() => setType(t.value)}>{t.label}</button>
          ))}
        </div>

        <form onSubmit={submit}>
          <label className="field"><span>Nama transaksi</span>
            <input type="text" autoFocus maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: makan siang" />
          </label>
          <label className="field"><span>Nominal (Rp)</span>
            <input type="number" inputMode="numeric" min={1} step={1} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
          </label>
          {type === 'expense' && (
            <label className="field"><span>Kategori</span>
              <select value={category} onChange={(e) => setCategory(e.target.value as TxCategory)}>
                <option value="kebutuhan">Kebutuhan</option>
                <option value="kemauan">Kemauan</option>
              </select>
            </label>
          )}
          <label className="field"><span>Tanggal</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
