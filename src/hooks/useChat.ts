import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { uid } from '@/lib/format'
import { supabase } from '@/lib/supabase'
import type { ChatMessage } from '@/lib/types'

/**
 * Chat Fin AI. Riwayat disimpan di tabel chat_messages, balasan dibuat oleh
 * Edge Function `fin-ai` (kunci API AI tidak pernah ada di browser).
 */
export function useChat() {
  const { user } = useAuth()
  const userId = user?.id
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sending, setSending] = useState(false)

  useEffect(() => {
    setMessages([])
    if (!supabase || !userId) return
    let cancelled = false
    supabase
      .from('chat_messages')
      .select('id,role,content')
      .order('created_at', { ascending: false })
      .limit(40)
      .then(({ data }) => {
        if (cancelled || !data) return
        const history = (data as ChatMessage[]).reverse()
        setMessages((local) => [...history, ...local.filter((m) => !history.some((h) => h.id === m.id))])
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  const send = useCallback(
    async (text: string) => {
      const content = text.trim().slice(0, 1000)
      if (!content) return
      const mine: ChatMessage = { id: uid(), role: 'user', content }

      if (!supabase || !userId) {
        const reply: ChatMessage = supabase
          ? {
              id: uid(),
              role: 'assistant',
              content: 'Masuk dulu ya, supaya aku bisa menjawab pertanyaanmu dan menyimpan percakapan kita.',
              action: 'login',
            }
          : { id: uid(), role: 'assistant', content: 'Fin AI belum aktif karena Supabase belum dikonfigurasi.' }
        setMessages((m) => [...m, mine, reply])
        return
      }

      setMessages((m) => [...m, mine])
      setSending(true)
      try {
        const { data, error } = await supabase.functions.invoke<{ reply?: string }>('fin-ai', {
          body: { message: content },
        })
        if (error || !data?.reply) throw error ?? new Error('Balasan kosong')
        const reply = data.reply
        setMessages((m) => [...m, { id: uid(), role: 'assistant', content: reply }])
      } catch {
        setMessages((m) => [
          ...m,
          { id: uid(), role: 'assistant', content: 'Maaf, Fin sedang tidak bisa menjawab. Coba lagi sebentar lagi.' },
        ])
      } finally {
        setSending(false)
      }
    },
    [userId],
  )

  return { messages, sending, send }
}
