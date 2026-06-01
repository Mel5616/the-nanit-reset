'use client'

import { useState, useEffect } from 'react'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const CREAM = '#F3E8E0'
const PEACH = '#EDB39A'

interface LineItem {
  id: string
  description: string
  estimated: string
  actual: string
  status: 'quoted' | 'confirmed' | 'paid' | 'tbc'
}

interface Category {
  name: string
  icon: string
  items: LineItem[]
}

const STATUS_STYLES = {
  tbc:       { bg: '#F9FAFB', text: '#9CA3AF', label: 'TBC' },
  quoted:    { bg: '#EFF6FF', text: '#3B82F6', label: 'Quoted' },
  confirmed: { bg: '#FFF7ED', text: '#F59E0B', label: 'Confirmed' },
  paid:      { bg: '#ECFDF5', text: '#059669', label: 'Paid ✓' },
}

const DEFAULT_CATEGORIES: Category[] = [
  { name: 'Venue', icon: '🏛', items: [] },
  { name: 'Catering', icon: '🍽', items: [] },
  { name: 'Styling & Florals', icon: '🌿', items: [] },
  { name: 'Gifting', icon: '🎁', items: [] },
  { name: 'Photography & Video', icon: '📸', items: [] },
  { name: 'PR & Agency', icon: '📢', items: [] },
  { name: 'AV & Tech', icon: '🎙', items: [] },
  { name: 'Miscellaneous', icon: '📋', items: [] },
]

function parse(v: string) { return parseFloat(v.replace(/[^0-9.]/g, '')) || 0 }
function fmt(n: number) { return n === 0 ? '—' : `$${n.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` }

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100" style={{ background: CREAM }}>
        <h2 className="font-semibold text-sm uppercase tracking-widest" style={{ color: NAVY, fontFamily: 'NeuePlak, sans-serif', letterSpacing: '0.12em' }}>{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export default function Budget() {
  const [totalBudget, setTotalBudget] = useState('')
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)
  const [newItems, setNewItems] = useState<Record<string, Partial<LineItem>>>({})
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nanit-budget')
    if (saved) {
      const data = JSON.parse(saved)
      setTotalBudget(data.totalBudget || '')
      setCategories(data.categories || DEFAULT_CATEGORIES)
    }
  }, [])

  function save(cats: Category[], budget: string) {
    localStorage.setItem('nanit-budget', JSON.stringify({ categories: cats, totalBudget: budget }))
  }

  function updateCats(cats: Category[]) { setCategories(cats); save(cats, totalBudget) }
  function updateBudget(b: string) { setTotalBudget(b); save(categories, b) }

  function addItem(catName: string) {
    const item = newItems[catName]
    if (!item?.description?.trim()) return
    const newItem: LineItem = { id: crypto.randomUUID(), description: item.description.trim(), estimated: item.estimated || '', actual: '', status: 'tbc' }
    updateCats(categories.map(c => c.name === catName ? { ...c, items: [...c.items, newItem] } : c))
    setNewItems(n => ({ ...n, [catName]: {} }))
  }

  function updateItem(catName: string, id: string, field: keyof LineItem, value: string) {
    updateCats(categories.map(c => c.name === catName ? { ...c, items: c.items.map(i => i.id === id ? { ...i, [field]: value } : i) } : c))
  }

  function removeItem(catName: string, id: string) {
    updateCats(categories.map(c => c.name === catName ? { ...c, items: c.items.filter(i => i.id !== id) } : c))
  }

  function toggleCollapse(name: string) {
    setCollapsed(s => { const n = new Set(s); n.has(name) ? n.delete(name) : n.add(name); return n })
  }

  const allItems = categories.flatMap(c => c.items)
  const totalEstimated = allItems.reduce((s, i) => s + parse(i.estimated), 0)
  const totalActual = allItems.reduce((s, i) => s + parse(i.actual), 0)
  const budgetNum = parse(totalBudget)
  const variance = budgetNum - totalEstimated
  const paidItems = allItems.filter(i => i.status === 'paid')
  const totalPaid = paidItems.reduce((s, i) => s + parse(i.actual || i.estimated), 0)

  return (
    <div>
      {/* Summary */}
      <SectionCard title="Budget summary">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total budget', value: budgetNum > 0 ? fmt(budgetNum) : '—', color: NAVY, editable: true },
            { label: 'Estimated spend', value: fmt(totalEstimated), color: totalEstimated > budgetNum && budgetNum > 0 ? '#DC2626' : BLUE },
            { label: 'Variance', value: budgetNum > 0 ? (variance >= 0 ? `+${fmt(variance)}` : fmt(variance)) : '—', color: variance >= 0 ? '#059669' : '#DC2626' },
            { label: 'Total paid', value: fmt(totalPaid), color: '#059669' },
          ].map(({ label, value, color, editable }) => (
            <div key={label} className="rounded-xl px-4 py-4 text-center" style={{ background: CREAM }}>
              {editable ? (
                <input
                  value={totalBudget}
                  onChange={e => updateBudget(e.target.value)}
                  placeholder="$0"
                  className="text-3xl font-light text-center w-full bg-transparent outline-none"
                  style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}
                />
              ) : (
                <p className="text-3xl font-light mb-1" style={{ color, fontFamily: 'Cotford, Georgia, serif' }}>{value}</p>
              )}
              <p className="text-xs uppercase tracking-widest mt-1" style={{ color: '#9CA3AF', fontFamily: 'NeuePlak, sans-serif' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Spend bar */}
        {budgetNum > 0 && (
          <div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((totalEstimated / budgetNum) * 100, 100)}%`, background: totalEstimated > budgetNum ? '#DC2626' : BLUE }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{budgetNum > 0 ? `${Math.round((totalEstimated / budgetNum) * 100)}% of budget allocated` : ''}</p>
          </div>
        )}
      </SectionCard>

      {/* Categories */}
      {categories.map(cat => {
        const catEstimated = cat.items.reduce((s, i) => s + parse(i.estimated), 0)
        const catActual = cat.items.reduce((s, i) => s + parse(i.actual), 0)
        const isCollapsed = collapsed.has(cat.name)

        return (
          <div key={cat.name} className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
            <button onClick={() => toggleCollapse(cat.name)} className="w-full px-6 py-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100" style={{ background: CREAM }}>
              <span className="text-lg">{cat.icon}</span>
              <span className="font-semibold text-sm flex-1" style={{ color: NAVY, fontFamily: 'BentonSans, sans-serif' }}>{cat.name}</span>
              {catEstimated > 0 && <span className="text-xs font-medium mr-2" style={{ color: BLUE }}>{fmt(catEstimated)} est.</span>}
              {catActual > 0 && <span className="text-xs font-medium mr-2" style={{ color: '#059669' }}>{fmt(catActual)} actual</span>}
              <span className="text-gray-400 text-sm">{isCollapsed ? '▼' : '▲'}</span>
            </button>

            {!isCollapsed && (
              <div className="p-4">
                {cat.items.length === 0 && <p className="text-sm text-gray-300 italic px-2 py-2">No items yet</p>}

                {cat.items.map(item => (
                  <div key={item.id} className="grid gap-2 py-2 border-b border-gray-50 last:border-0" style={{ gridTemplateColumns: '1fr 100px 100px 110px 32px' }}>
                    <input value={item.description} onChange={e => updateItem(cat.name, item.id, 'description', e.target.value)}
                      className="text-sm px-2 py-1 rounded border border-transparent hover:border-gray-200 focus:border-blue-300 outline-none" style={{ color: NAVY }} />
                    <input value={item.estimated} onChange={e => updateItem(cat.name, item.id, 'estimated', e.target.value)}
                      placeholder="Est. $" className="text-sm px-2 py-1 rounded border border-gray-100 outline-none text-center" style={{ color: BLUE }} />
                    <input value={item.actual} onChange={e => updateItem(cat.name, item.id, 'actual', e.target.value)}
                      placeholder="Actual $" className="text-sm px-2 py-1 rounded border border-gray-100 outline-none text-center" style={{ color: '#059669' }} />
                    <select value={item.status} onChange={e => updateItem(cat.name, item.id, 'status', e.target.value as LineItem['status'])}
                      className="text-xs px-2 py-1 rounded border border-gray-100 outline-none"
                      style={{ color: STATUS_STYLES[item.status].text, background: STATUS_STYLES[item.status].bg }}>
                      {Object.entries(STATUS_STYLES).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
                    </select>
                    <button onClick={() => removeItem(cat.name, item.id)} className="text-gray-300 hover:text-red-400 text-xs">✕</button>
                  </div>
                ))}

                {/* Add row */}
                <div className="flex gap-2 mt-3">
                  <input
                    value={newItems[cat.name]?.description || ''}
                    onChange={e => setNewItems(n => ({ ...n, [cat.name]: { ...n[cat.name], description: e.target.value } }))}
                    onKeyDown={e => e.key === 'Enter' && addItem(cat.name)}
                    placeholder="Add line item…"
                    className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-blue-300"
                  />
                  <input
                    value={newItems[cat.name]?.estimated || ''}
                    onChange={e => setNewItems(n => ({ ...n, [cat.name]: { ...n[cat.name], estimated: e.target.value } }))}
                    placeholder="Est. $"
                    className="w-24 text-sm px-3 py-2 rounded-lg border border-gray-200 outline-none text-center"
                  />
                  <button onClick={() => addItem(cat.name)} className="px-4 py-2 rounded-lg text-white text-sm" style={{ background: BLUE }}>Add</button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
