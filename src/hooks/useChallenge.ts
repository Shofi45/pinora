import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

export const CHALLENGE_ITEMS = [
  'Mencatat semua pemasukan dan pengeluaran selama 7 hari.',
  'Mengidentifikasi tiga kategori pengeluaran terbesar.',
  'Menentukan satu pengeluaran yang dapat dikurangi.',
  'Menentukan target tabungan untuk bulan berikutnya.',
  'Menghitung anggaran yang tersisa setelah kebutuhan dan cicilan.',
]

const empty = () => CHALLENGE_ITEMS.map(() => false)

/** Progres tantangan 7 hari. Tersimpan di Supabase untuk pengguna yang masuk. */
export function useChallenge() {
  const { user } = useAuth()
  const userId = user?.id
  const [done, setDone] = useState<boolean[]>(empty)

  useEffect(() => {
    setDone(empty())
    if (!supabase || !userId) return
    let cancelled = false
    supabase
      .from('challenge_progress')
      .select('item_index,done')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (cancelled || !data) return
        const next = empty()
        for (const row of data as { item_index: number; done: boolean }[]) {
          if (row.item_index >= 1 && row.item_index <= next.length) next[row.item_index - 1] = row.done
        }
        setDone(next)
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  const toggle = useCallback(
    async (index: number) => {
      const nextValue = !done[index]
      setDone((list) => list.map((v, i) => (i === index ? nextValue : v)))
      if (!supabase || !userId) return
      const { error } = await supabase.from('challenge_progress').upsert(
        { user_id: userId, item_index: index + 1, done: nextValue, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,item_index' },
      )
      if (error) setDone((list) => list.map((v, i) => (i === index ? !nextValue : v)))
    },
    [done, userId],
  )

  const reset = useCallback(async () => {
    setDone(empty())
    if (!supabase || !userId) return
    await supabase.from('challenge_progress').delete().eq('user_id', userId)
  }, [userId])

  return { done, count: done.filter(Boolean).length, total: CHALLENGE_ITEMS.length, toggle, reset }
}
