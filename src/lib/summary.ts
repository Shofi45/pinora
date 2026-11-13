import type { Transaction } from './types'

export interface Summary {
  income: number
  expense: number
  saving: number
  /** Pemasukan dikurangi pengeluaran dan tabungan */
  remaining: number
  /** Pengeluaran sebagai persen dari pemasukan, satu desimal */
  expenseRatio: number
  kebutuhan: number
  kemauan: number
  incomeCount: number
  count: number
}

export function summarize(items: Transaction[]): Summary {
  let income = 0
  let expense = 0
  let saving = 0
  let kebutuhan = 0
  let kemauan = 0
  let incomeCount = 0

  for (const t of items) {
    if (t.type === 'income') {
      income += t.amount
      incomeCount += 1
    } else if (t.type === 'saving') {
      saving += t.amount
    } else {
      expense += t.amount
      if (t.category === 'kebutuhan') kebutuhan += t.amount
      if (t.category === 'kemauan') kemauan += t.amount
    }
  }

  return {
    income,
    expense,
    saving,
    remaining: income - expense - saving,
    expenseRatio: income > 0 ? Math.round((expense / income) * 1000) / 10 : 0,
    kebutuhan,
    kemauan,
    incomeCount,
    count: items.length,
  }
}
