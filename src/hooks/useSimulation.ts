import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import type { SimulationValues } from '@/lib/types'

export type SimField = keyof SimulationValues
export type SaveStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error'

export const DEFAULT_SIMULATION: SimulationValues = {
  income: 8_000_000,
  needs: 3_000_000,
  debt: 500_000,
  home_installment: 2_000_000,
  saving: 500_000,
}

const clean = (n: number) => Math.min(Math.max(0, Math.round(n) || 0), 100_000_000_000)

/**
 * Nilai kalkulator anggaran. Untuk pengguna yang masuk, nilai dimuat dari
 * Supabase dan disimpan otomatis (debounce) setiap kali diubah.
 */
export function useSimulation() {
  const { user } = useAuth()
  const userId = user?.id
  const [values, setValues] = useState<SimulationValues>(DEFAULT_SIMULATION)
  const [status, setStatus] = useState<SaveStatus>('idle')
  const ready = useRef(false) // data milik pengguna ini sudah dimuat
  const dirty = useRef(false) // pengguna mengubah angka setelah dimuat

  useEffect(() => {
    ready.current = false
    dirty.current = false
    if (!supabase || !userId) {
      setStatus('idle')
      return
    }
    let cancelled = false
    setStatus('loading')
    supabase
      .from('budget_simulations')
      .select('income,needs,debt,home_installment,saving')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setStatus('error')
          return
        }
        if (data) setValues(data as SimulationValues)
        ready.current = true
        setStatus('idle')
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  useEffect(() => {
    if (!supabase || !userId || !ready.current || !dirty.current) return
    setStatus('saving')
    const timer = setTimeout(async () => {
      const { error } = await supabase!.from('budget_simulations').upsert(
        {
          user_id: userId,
          income: clean(values.income),
          needs: clean(values.needs),
          debt: clean(values.debt),
          home_installment: clean(values.home_installment),
          saving: clean(values.saving),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      )
      setStatus(error ? 'error' : 'saved')
    }, 800)
    return () => clearTimeout(timer)
  }, [values, userId])

  const setField = useCallback((key: SimField, value: number) => {
    dirty.current = true
    setValues((v) => ({ ...v, [key]: clean(value) }))
  }, [])

  return { values, setField, status }
}
