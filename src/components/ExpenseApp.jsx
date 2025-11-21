import React, { useMemo, useState } from 'react'
import { Plus, Filter, PieChart, Settings, Trash2, Wallet, Sparkles, Tag } from 'lucide-react'
import Spline from '@splinetool/react-spline'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const defaultCategories = [
  { id: 'food', name: 'Food & Dining', color: 'bg-emerald-500', keywords: ['food','dinner','lunch','breakfast','restaurant','cafe','coffee'] },
  { id: 'transport', name: 'Transport', color: 'bg-blue-500', keywords: ['uber','lyft','bus','train','metro','gas','fuel','parking'] },
  { id: 'shopping', name: 'Shopping', color: 'bg-pink-500', keywords: ['shop','amazon','mall','store','clothes','electronics'] },
  { id: 'bills', name: 'Bills & Utilities', color: 'bg-amber-500', keywords: ['bill','electric','water','internet','phone','rent','subscription'] },
  { id: 'entertainment', name: 'Entertainment', color: 'bg-violet-500', keywords: ['movie','netflix','spotify','game','concert','tickets'] },
]

const palette = ['bg-emerald-500','bg-blue-500','bg-pink-500','bg-amber-500','bg-violet-500','bg-cyan-500','bg-rose-500','bg-lime-500']

function useLocalState(key, initial) {
  const [state, setState] = useState(() => {
    const s = localStorage.getItem(key)
    return s ? JSON.parse(s) : initial
  })
  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])
  return [state, setState]
}

function Hero() {
  return (
    <div className="relative h-[340px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/40 to-slate-950 pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 flex items-end h-full pb-6">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10"><Wallet className="w-6 h-6 text-emerald-300"/></div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Glass Card Expense Tracker</h1>
              <p className="text-slate-300 text-sm">Smart categories by keywords • Fast entry • Live analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickAdd({ onAdd }) {
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const a = parseFloat(amount)
    if (!desc.trim() || isNaN(a)) return
    onAdd({ id: crypto.randomUUID(), desc: desc.trim(), amount: a, date: new Date().toISOString(), categoryId: null })
    setDesc(''); setAmount('')
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
      <input
        value={desc}
        onChange={(e)=>setDesc(e.target.value)}
        placeholder="Description (e.g., Starbucks latte)"
        className="md:col-span-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-slate-400"
      />
      <input
        value={amount}
        inputMode="decimal"
        onChange={(e)=>setAmount(e.target.value)}
        placeholder="Amount"
        className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-slate-400"
      />
      <button className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold transition" type="submit">
        <Plus className="w-4 h-4"/> Quick Add
      </button>
    </form>
  )
}

function CategoryBadge({ color, name }) {
  return (
    <span className={classNames('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', color, 'text-slate-900')}>
      {name}
    </span>
  )
}

function CategoryManager({ categories, setCategories }) {
  const [name, setName] = useState('')
  const [keywords, setKeywords] = useState('')

  const add = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    const color = palette[(categories.length) % palette.length]
    const newCat = { id: name.toLowerCase().replace(/\s+/g,'-'), name: name.trim(), color, keywords: keywords.split(',').map(s=>s.trim().toLowerCase()).filter(Boolean) }
    setCategories([...categories, newCat])
    setName(''); setKeywords('')
  }

  const remove = (id) => setCategories(categories.filter(c=>c.id!==id))

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="New category name" className="md:col-span-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10" />
        <input value={keywords} onChange={(e)=>setKeywords(e.target.value)} placeholder="Keywords (comma separated)" className="md:col-span-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10" />
        <button className="px-4 py-2 rounded-lg bg-sky-500 text-slate-900 font-semibold">Add</button>
      </form>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map(c => (
          <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <span className={classNames('w-2.5 h-2.5 rounded-full', c.color)} />
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-slate-400">{c.keywords.join(', ') || 'No keywords'}</div>
              </div>
            </div>
            <button onClick={()=>remove(c.id)} className="p-2 rounded-lg hover:bg-white/10 text-slate-300"><Trash2 className="w-4 h-4"/></button>
          </div>
        ))}
      </div>
    </div>
  )
}

function autoCategorize(expense, categories) {
  const text = (expense.desc || '').toLowerCase()
  for (const c of categories) {
    if (c.keywords?.some(k => text.includes(k))) return c.id
  }
  return null
}

function ExpenseList({ items, categories, onRemove }) {
  const getCat = (id) => categories.find(c=>c.id===id)
  return (
    <div className="divide-y divide-white/5 rounded-xl overflow-hidden border border-white/10 bg-white/5">
      {items.length === 0 && (
        <div className="p-6 text-center text-slate-400">No expenses yet. Add one above.</div>
      )}
      {items.map(it => (
        <div key={it.id} className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10"><Tag className="w-4 h-4 text-emerald-300"/></div>
            <div>
              <div className="font-medium">{it.desc}</div>
              <div className="text-xs text-slate-400">{new Date(it.date).toLocaleDateString()} • {getCat(it.categoryId)?.name || 'Uncategorized'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {it.categoryId && <CategoryBadge color={getCat(it.categoryId)?.color || 'bg-slate-300'} name={getCat(it.categoryId)?.name || ''} />}
            <div className="font-semibold">${it.amount.toFixed(2)}</div>
            <button onClick={()=>onRemove(it.id)} className="p-2 rounded-lg hover:bg-white/10 text-slate-300"><Trash2 className="w-4 h-4"/></button>
          </div>
        </div>
      ))}
    </div>
  )
}

function Analytics({ items, categories }) {
  const byCategory = useMemo(() => {
    const map = {}
    for (const c of categories) map[c.id] = 0
    for (const it of items) if (it.categoryId) map[it.categoryId] = (map[it.categoryId]||0) + it.amount
    const entries = Object.entries(map).map(([id, total])=>({ id, total }))
    const totalAll = items.reduce((s,i)=>s+i.amount,0)
    return { entries, totalAll }
  }, [items, categories])

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 mb-2"><PieChart className="w-4 h-4 text-emerald-300"/><span className="font-medium">Spend by category</span></div>
        <div className="space-y-2">
          {byCategory.entries.map(e => {
            const cat = categories.find(c=>c.id===e.id)
            const pct = byCategory.totalAll>0 ? Math.round((e.total/byCategory.totalAll)*100) : 0
            return (
              <div key={e.id} className="">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={classNames('w-2.5 h-2.5 rounded-full', cat?.color)} />
                    <span className="text-slate-300">{cat?.name}</span>
                  </div>
                  <div className="text-slate-200 font-medium">${e.total.toFixed(2)} ({pct}%)</div>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className={classNames('h-full', cat?.color)} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-emerald-300"/><span className="font-medium">Quick stats</span></div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Stat label="Total Spend" value={(items.reduce((s,i)=>s+i.amount,0)).toFixed(2)} prefix="$" />
          <Stat label="Avg / Expense" value={(items.length ? (items.reduce((s,i)=>s+i.amount,0)/items.length) : 0).toFixed(2)} prefix="$" />
          <Stat label="# Expenses" value={String(items.length)} />
          <Stat label="# Categories" value={String(categories.length)} />
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, prefix }) {
  return (
    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
      <div className="text-slate-400 text-xs">{label}</div>
      <div className="text-lg font-semibold">{prefix}{value}</div>
    </div>
  )
}

export default function ExpenseApp() {
  const [categories, setCategories] = useLocalState('categories', defaultCategories)
  const [expenses, setExpenses] = useLocalState('expenses', [])
  const [query, setQuery] = useState('')
  const [filterCat, setFilterCat] = useState('all')

  const addExpense = (e) => {
    const id = crypto.randomUUID()
    const categoryId = autoCategorize(e, categories)
    const item = { ...e, id, categoryId }
    setExpenses([item, ...expenses])
  }
  const removeExpense = (id) => setExpenses(expenses.filter(e=>e.id!==id))

  const displayed = useMemo(()=>{
    return expenses.filter(e=>{
      const matchesQuery = !query || e.desc.toLowerCase().includes(query.toLowerCase())
      const matchesCat = filterCat==='all' || e.categoryId===filterCat
      return matchesQuery && matchesCat
    })
  }, [expenses, query, filterCat])

  return (
    <div>
      <Hero />

      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10 space-y-6">
        <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-6">
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"><Wallet className="w-4 h-4 text-emerald-300"/><span className="font-semibold">Add Expense</span></div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-300"/>
                  <select value={filterCat} onChange={(e)=>setFilterCat(e.target.value)} className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-sm">
                    <option value="all">All</option>
                    {categories.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search" className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm" />
                </div>
              </div>
              <QuickAdd onAdd={addExpense} />
            </div>

            <ExpenseList items={displayed} categories={categories} onRemove={removeExpense} />
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-3"><Settings className="w-4 h-4 text-emerald-300"/><span className="font-semibold">Manage Categories</span></div>
              <CategoryManager categories={categories} setCategories={setCategories} />
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <Analytics items={expenses} categories={categories} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
