import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Icon } from '@/components/Icon'
import { useAuth } from '@/context/AuthContext'
import { useChat } from '@/hooks/useChat'

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const { openAuth } = useAuth()
  const { messages, sending, send } = useChat()
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages, sending])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    void send(text)
  }

  const quick = (text: string) => {
    if (!sending) void send(text)
  }

  return (
    <div className="chat-panel">
      <div className="chat-head">
        <div>
          <span><Icon name="bot" /></span>
          <div><b>Fin AI</b><small><i /> Online</small></div>
        </div>
        <button onClick={onClose} aria-label="Tutup chat"><Icon name="close" /></button>
      </div>
      <div className="chat-body">
        <div className="ai-bubble">Halo! Aku Fin. Mau mulai belajar keuangan atau menghitung kemampuan anggaranmu?</div>
        {messages.length === 0 && (
          <div className="chat-options">
            <button onClick={() => quick('Bantu cek kondisi keuanganku')}>Cek kondisi keuangan</button>
            <button onClick={() => quick('Jelaskan dasar-dasar KPR untuk pemula')}>Belajar tentang KPR</button>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'user-bubble' : 'ai-bubble'}>
            {m.content}
            {m.action === 'login' && <button className="chat-login" onClick={openAuth}>Masuk sekarang</button>}
          </div>
        ))}
        {sending && <div className="ai-bubble typing">Fin sedang mengetik...</div>}
        <div ref={endRef} />
      </div>
      <form className="chat-input" onSubmit={submit}>
        <input aria-label="Pesan" placeholder="Tulis pertanyaanmu..." value={input} maxLength={1000} onChange={(e) => setInput(e.target.value)} />
        <button aria-label="Kirim" disabled={sending}><Icon name="send" size={19} /></button>
      </form>
      <small className="disclaimer">Fin AI memberikan informasi edukatif, bukan nasihat finansial resmi.</small>
    </div>
  )
}
