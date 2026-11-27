import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { uid } from "@/lib/format";
import {
  CHAT_IMAGE_BUCKET,
  CHAT_IMAGE_MAX_SIZE,
  CHAT_IMAGE_TYPES,
} from "@/lib/media";
import { supabase } from "@/lib/supabase";
import type { ChatMessage } from "@/lib/types";

/**
 * Chat Fin AI. Riwayat disimpan di tabel chat_messages, balasan dibuat oleh
 * Edge Function `fin-ai` (kunci API AI tidak pernah ada di browser).
 */
export function useChat() {
  const { user } = useAuth()
  const userId = user?.id
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sending, setSending] = useState(false)
  const sendLock = useRef(false)
  const loadRequest = useRef(0)
  const currentUserId = useRef(userId)
  const imageUrls = useRef<string[]>([])
  currentUserId.current = userId

  useEffect(() => {
    const request = ++loadRequest.current
    setMessages([])
    imageUrls.current.forEach((url) => URL.revokeObjectURL(url))
    imageUrls.current = []
    sendLock.current = false
    setSending(false)
    const client = supabase
    if (!client || !userId) return
    client
      .from('chat_messages')
      .select('id,role,content,image_path')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(40)
      .then(async ({ data, error }) => {
        if (error || !data || request !== loadRequest.current) return
        const historyRows = [...data].reverse() as {
          id: string;
          role: ChatMessage["role"];
          content: string;
          image_path: string | null;
        }[];
        const history = await Promise.all(
          historyRows.map(async (row): Promise<ChatMessage> => {
            if (!row.image_path) return row;
            const { data: signed, error: signedError } = await client.storage
              .from(CHAT_IMAGE_BUCKET)
              .createSignedUrl(row.image_path, 3600);
            if (signedError) {
              console.error("Gagal memuat gambar riwayat chat.", signedError);
              return row;
            }
            return { ...row, imageUrl: signed.signedUrl };
          }),
        );
        if (request !== loadRequest.current) return
        setMessages((local) => [
          ...history,
          ...local.filter(
            (localMessage) =>
              !history.some(
                (historyMessage) =>
                  historyMessage.role === localMessage.role &&
                  historyMessage.content === localMessage.content,
              ),
          ),
        ])
      })
  }, [userId])

  const send = useCallback(
    async (text: string, image?: File) => {
      if (sendLock.current) return
      const content = text.trim().slice(0, 1000) || (image ? "Tolong jelaskan gambar ini." : "")
      if (!content) return
      if (image && !CHAT_IMAGE_TYPES.split(",").includes(image.type)) {
        setMessages((messages) => [
          ...messages,
          { id: uid(), role: "assistant", content: "Gunakan gambar JPG, PNG, WebP, atau GIF." },
        ])
        return
      }
      if (image && image.size > CHAT_IMAGE_MAX_SIZE) {
        setMessages((messages) => [
          ...messages,
          { id: uid(), role: "assistant", content: "Ukuran gambar maksimal 1 MB setelah dikompres." },
        ])
        return
      }
      const imageUrl = image ? URL.createObjectURL(image) : undefined
      if (imageUrl) imageUrls.current.push(imageUrl)
      const mine: ChatMessage = { id: uid(), role: "user", content, imageUrl }

      if (!supabase || !userId) {
        const reply: ChatMessage = supabase
          ? {
              id: uid(),
              role: 'assistant',
              content: "Masuk dulu ya, supaya aku bisa menjawab pertanyaanmu dan menyimpan percakapan kita.",
              action: "login",
            }
          : { id: uid(), role: "assistant", content: "Fin AI belum aktif karena Supabase belum dikonfigurasi." }
        setMessages((m) => [...m, mine, reply])
        return
      }

      const sendingUserId = userId
      const sendingLoadRequest = loadRequest.current
      sendLock.current = true
      setMessages((m) => [...m, mine])
      setSending(true)
      let imagePath: string | undefined
      try {
        if (image) {
          const extension = image.type === "image/jpeg" ? "jpg" : image.type.split("/")[1]
          imagePath = `${userId}/${uid()}.${extension}`
          const { error: uploadError } = await supabase.storage
            .from(CHAT_IMAGE_BUCKET)
            .upload(imagePath, image, { contentType: image.type, cacheControl: "600" })
          if (uploadError) throw uploadError
        }
        const { data, error } = await supabase.functions.invoke<{ reply?: string }>('fin-ai', {
          body: { message: content, image_path: imagePath },
        })
        if (error || !data?.reply) throw error ?? new Error('Balasan kosong')
        const reply = data.reply
        if (
          currentUserId.current === sendingUserId &&
          loadRequest.current === sendingLoadRequest
        ) {
          setMessages((m) => [...m, { id: uid(), role: 'assistant', content: reply }])
        }
      } catch (reason) {
        if (imagePath) {
          const { error: cleanupError } = await supabase.storage
            .from(CHAT_IMAGE_BUCKET)
            .remove([imagePath])
          if (cleanupError) console.error("Gagal membersihkan gambar chat yang gagal diproses.", cleanupError)
        }
        if (
          currentUserId.current === sendingUserId &&
          loadRequest.current === sendingLoadRequest
        ) {
          const failure = image
            ? `Gambar tidak dapat diproses. ${reason instanceof Error ? reason.message : "Periksa koneksi dan konfigurasi Storage."}`
            : 'Maaf, Fin sedang tidak bisa menjawab. Coba lagi sebentar lagi.'
          setMessages((m) => [
            ...m,
            { id: uid(), role: 'assistant', content: failure },
          ])
        }
      } finally {
        if (
          currentUserId.current === sendingUserId &&
          loadRequest.current === sendingLoadRequest
        ) {
          sendLock.current = false
          setSending(false)
        }
      }
    },
    [userId],
  )

  useEffect(
    () => () => imageUrls.current.forEach((url) => URL.revokeObjectURL(url)),
    [],
  )

  return { messages, sending, send }
}
