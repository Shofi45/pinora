import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Icon } from '@/components/Icon'
import { useAuth } from '@/context/AuthContext'
import { useChat } from '@/hooks/useChat'
import { CHAT_IMAGE_MAX_SIZE, CHAT_IMAGE_TYPES } from '@/lib/media'

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const { openAuth } = useAuth()
  const { messages, sending, send } = useChat()
  const [input, setInput] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imageError, setImageError] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages, sending])

  useEffect(() => {
    if (!image) {
      setImagePreview(null)
      return
    }
    const url = URL.createObjectURL(image)
    setImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [image])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const text = input.trim()
    if ((!text && !image) || sending) return
    setInput('')
    void send(text, image ?? undefined)
    setImage(null)
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
            {m.imageUrl && <img className="chat-attachment" src={m.imageUrl} alt="Gambar yang dikirim" />}
            {m.action === 'login' && <button className="chat-login" onClick={openAuth}>Masuk sekarang</button>}
          </div>
        ))}
        {sending && <div className="ai-bubble typing">Fin sedang mengetik...</div>}
        <div ref={endRef} />
      </div>
      <form className="chat-input" onSubmit={submit}>
        <label className="chat-image-button" title="Lampirkan gambar">
          <Icon name="document" size={18} />
          <input
            type="file"
            accept={CHAT_IMAGE_TYPES}
            disabled={sending}
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (!file) return
              if (!CHAT_IMAGE_TYPES.split(",").includes(file.type)) {
                setImageError("Gunakan gambar JPG, PNG, WebP, atau GIF.")
                setImage(null)
                event.target.value = ""
                return
              }
              if (file.size > CHAT_IMAGE_MAX_SIZE) {
                setImageError("Ukuran gambar maksimal 5 MB.")
                setImage(null)
                event.target.value = ""
                return
              }
              setImageError('')
              setImage(file)
              event.target.value = ""
            }}
          />
        </label>
        <input aria-label="Pesan" placeholder="Tulis pertanyaanmu..." value={input} maxLength={1000} onChange={(e) => setInput(e.target.value)} />
        <button aria-label="Kirim" disabled={sending || (!input.trim() && !image)}><Icon name="send" size={19} /></button>
        {imagePreview && <div className="chat-image-preview">
          <img src={imagePreview} alt="Pratinjau gambar" />
          <button type="button" onClick={() => { setImage(null); setImageError('') }} aria-label="Hapus gambar">×</button>
        </div>}
        {imageError && <span className="chat-image-error" role="alert">{imageError}</span>}
      </form>
      <small className="disclaimer">Fin AI memberikan informasi edukatif, bukan nasihat finansial resmi.</small>
    </div>
  )
}
