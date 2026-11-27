import { Fragment, useEffect, useRef, useState, type FormEvent } from 'react'
import { Icon } from '@/components/Icon'
import { useAuth } from '@/context/AuthContext'
import { useChat } from '@/hooks/useChat'
import { CHAT_IMAGE_TYPES, compressImageForUpload } from '@/lib/media'

function renderInlineText(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={index}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  )
}

function renderMessageText(content: string) {
  const blocks: { type: 'paragraph' | 'list'; lines: string[] }[] = []
  let current: { type: 'paragraph' | 'list'; lines: string[] } | undefined

  for (const line of content.split(/\r?\n/)) {
    if (!line.trim()) {
      current = undefined
      continue
    }

    const listItem = /^\s*[-*]\s+(.+)$/.exec(line)
    const type = listItem ? 'list' : 'paragraph'
    if (!current || current.type !== type) {
      current = { type, lines: [] }
      blocks.push(current)
    }
    current.lines.push(listItem?.[1] ?? line)
  }

  return blocks.map((block, blockIndex) =>
    block.type === 'list' ? (
      <ul key={blockIndex}>
        {block.lines.map((line, lineIndex) => (
          <li key={lineIndex}>{renderInlineText(line)}</li>
        ))}
      </ul>
    ) : (
      <p key={blockIndex}>
        {block.lines.map((line, lineIndex) => (
          <Fragment key={lineIndex}>
            {lineIndex > 0 && <br />}
            {renderInlineText(line)}
          </Fragment>
        ))}
      </p>
    ),
  )
}

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const { openAuth } = useAuth()
  const { messages, sending, send } = useChat()
  const [input, setInput] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imageError, setImageError] = useState('')
  const [imageStatus, setImageStatus] = useState('')
  const [compressingImage, setCompressingImage] = useState(false)
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
    if ((!text && !image) || sending || compressingImage) return
    setInput('')
    void send(text, image ?? undefined)
    setImage(null)
    setImageStatus('')
  }

  const selectImage = async (file?: File) => {
    if (!file) return
    setImageError('')
    setImageStatus('Mengompres gambar...')
    setCompressingImage(true)
    try {
      const optimized = await compressImageForUpload(file)
      setImage(optimized)
      setImageStatus(
        optimized === file
          ? ''
          : file.type === 'image/gif'
            ? 'GIF dikompres ke WebP; animasinya menjadi gambar statis.'
            : 'Gambar otomatis dikompres hingga maksimal 1 MB.',
      )
    } catch (reason) {
      setImage(null)
      setImageStatus('')
      setImageError(
        reason instanceof Error ? reason.message : 'Gambar tidak dapat diproses.',
      )
    } finally {
      setCompressingImage(false)
    }
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
            <div className="chat-message-text">{renderMessageText(m.content)}</div>
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
            disabled={sending || compressingImage}
            onChange={(event) => {
              const file = event.currentTarget.files?.[0]
              event.currentTarget.value = ''
              void selectImage(file)
            }}
          />
        </label>
        <input aria-label="Pesan" placeholder="Tulis pertanyaanmu..." value={input} maxLength={1000} onChange={(e) => setInput(e.target.value)} />
        <button aria-label="Kirim" disabled={sending || compressingImage || (!input.trim() && !image)}><Icon name="send" size={19} /></button>
        {imagePreview && <div className="chat-image-preview">
          <img src={imagePreview} alt="Pratinjau gambar" />
          <button type="button" onClick={() => { setImage(null); setImageError(''); setImageStatus('') }} aria-label="Hapus gambar">×</button>
        </div>}
        {imageError && <span className="chat-image-error" role="alert">{imageError}</span>}
        {imageStatus && <span className="chat-image-status" role="status">{imageStatus}</span>}
      </form>
      <small className="disclaimer">Fin AI memberikan informasi edukatif, bukan nasihat finansial resmi.</small>
    </div>
  )
}
