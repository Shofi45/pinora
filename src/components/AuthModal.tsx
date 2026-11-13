import { useState, type FormEvent } from 'react'
import { Icon } from '@/components/Icon'
import { useAuth } from '@/context/AuthContext'

export function AuthModal() {
  const { authOpen, closeAuth, configured, signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  if (!authOpen) return null

  const switchMode = (next: 'login' | 'register') => {
    setMode(next)
    setError(null)
    setInfo(null)
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setInfo(null)
    setBusy(true)
    const result = mode === 'login' ? await signIn(email.trim(), password) : await signUp(email.trim(), password)
    setBusy(false)
    if (result.error) {
      setError(result.error)
      return
    }
    if (mode === 'register' && result.needsConfirmation) {
      setInfo('Pendaftaran berhasil. Kami sudah mengirim email konfirmasi, buka tautannya lalu masuk.')
      setMode('login')
      setPassword('')
      return
    }
    setPassword('')
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && closeAuth()} onKeyDown={(e) => e.key === 'Escape' && closeAuth()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <div className="modal-head">
          <div>
            <h3 id="auth-title">{mode === 'login' ? 'Masuk ke Finora' : 'Buat akun Finora'}</h3>
            <p>Simpan simulasi, catatan transaksi, dan progres belajarmu dengan aman.</p>
          </div>
          <button className="modal-close" onClick={closeAuth} aria-label="Tutup"><Icon name="close" size={18} /></button>
        </div>

        {!configured && <div className="form-warn">Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env.</div>}

        <div className="tabs-seg cols-2" role="tablist">
          <button role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'on' : ''} onClick={() => switchMode('login')} type="button">Masuk</button>
          <button role="tab" aria-selected={mode === 'register'} className={mode === 'register' ? 'on' : ''} onClick={() => switchMode('register')} type="button">Daftar</button>
        </div>

        <form onSubmit={submit}>
          <label className="field"><span>Email</span>
            <input type="email" required autoFocus autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" />
          </label>
          <label className="field"><span>Kata sandi</span>
            <input type="password" required minLength={mode === 'register' ? 8 : 1} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === 'register' ? 'Minimal 8 karakter' : 'Kata sandimu'} />
          </label>
          {error && <div className="form-error" role="alert">{error}</div>}
          {info && <div className="form-info" role="status">{info}</div>}
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={busy || !configured}>
              {busy ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Buat akun'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
