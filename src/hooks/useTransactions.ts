import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { monthRange } from '@/lib/format'
import { supabase } from '@/lib/supabase'
import type { NewTransaction, Transaction } from '@/lib/types'

const COLUMNS = 'id,title,amount,type,category,occurred_on,created_at'

/** Transaksi milik pengguna yang sedang masuk untuk satu bulan (format YYYY-MM). */
export function useTransactions(month: string) {
  const { user } = useAuth()
  const userId = user?.id
  const [items, setItems] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestId = useRef(0)

  const load = useCallback(async () => {
    const id = ++requestId.current
    if (!supabase || !userId) {
      setItems([])
      setError(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    const { start, end } = monthRange(month)
    const { data, error: err } = await supabase
      .from('transactions')
      .select(COLUMNS)
      .gte('occurred_on', start)
      .lt('occurred_on', end)
      .order('occurred_on', { ascending: false })
      .order('created_at', { ascending: false })
    if (id !== requestId.current) return // permintaan lama, abaikan
    if (err) setError('Gagal memuat transaksi. ' + err.message)
    else setItems((data ?? []) as Transaction[])
    setLoading(false)
  }, [month, userId])

  useEffect(() => {
    void load()
  }, [load])

  const add = useCallback(
    async (tx: NewTransaction): Promise<string | null> => {
      if (!supabase || !userId) return 'Kamu harus masuk terlebih dahulu.'
      const { error: err } = await supabase.from('transactions').insert({ ...tx, user_id: userId })
      if (err) return 'Gagal menyimpan transaksi. ' + err.message
      await load()
      return null
    },
    [userId, load],
  )

  const remove = useCallback(
    async (id: string): Promise<string | null> => {
      if (!supabase || !userId) return 'Kamu harus masuk terlebih dahulu.'
      const previous = items
      setItems((list) => list.filter((t) => t.id !== id))
      const { error: err } = await supabase.from('transactions').delete().eq('id', id)
      if (err) {
        setItems(previous)
        return 'Gagal menghapus transaksi. ' + err.message
      }
      return null
    },
    [userId, items],
  )

  return { items, loading, error, add, remove, reload: load }
}
