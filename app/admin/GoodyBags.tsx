'use client'

import { useState } from 'react'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const CREAM = '#F3E8E0'
const PEACH = '#EDB39A'

const BAG_TYPES = [
  {
    name: 'Creator Bag',
    audiences: 'Influencer · Media & PR · Wellness Creator · Celebrity',
    qty: 22,
    color: '#6681AB',
  },
  {
    name: 'Healthcare Bag',
    audiences: 'Healthcare Professional',
    qty: 4,
    color: '#204977',
  },
  {
    name: 'Retail Bag',
    audiences: 'Retail Partner',
    qty: 4,
    color: '#EDB39A',
  },
  {
    name: 'VIP Bag',
    audiences: 'Special guests / override',
    qty: 0,
    color: '#EFC973',
  },
]

interface BagItem {
  id: string
  name: string
  packed: boolean
}

type BagContents = Record<string, BagItem[]>

const INITIAL_CONTENTS: BagContents = {
  'Creator Bag': [],
  'Healthcare Bag': [],
  'Retail Bag': [],
  'VIP Bag': [],
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100" style={{ background: CREAM }}>
        <h2 className="font-semibold text-sm uppercase tracking-widest"
          style={{ color: NAVY, fontFamily: 'NeuePlak, sans-serif', letterSpacing: '0.12em' }}>
          {title}
        </h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export default function GoodyBags() {
  const [contents, setContents] = useState<BagContents>(INITIAL_CONTENTS)
  const [newItems, setNewItems] = useState<Record<string, string>>({})
  const [qtys, setQtys] = useState<Record<string, number>>(
    Object.fromEntries(BAG_TYPES.map(b => [b.name, b.qty]))
  )

  function addItem(bagName: string) {
    const text = newItems[bagName]?.trim()
    if (!text) return
    setContents(c => ({
      ...c,
      [bagName]: [...(c[bagName] || []), { id: crypto.randomUUID(), name: text, packed: false }],
    }))
    setNewItems(n => ({ ...n, [bagName]: '' }))
  }

  function toggleItem(bagName: string, id: string) {
    setContents(c => ({
      ...c,
      [bagName]: c[bagName].map(item => item.id === id ? { ...item, packed: !item.packed } : item),
    }))
  }

  function removeItem(bagName: string, id: string) {
    setContents(c => ({
      ...c,
      [bagName]: c[bagName].filter(item => item.id !== id),
    }))
  }

  const totalBags = Object.values(qtys).reduce((a, b) => a + b, 0)
  const totalItems = Object.values(contents).reduce((a, b) => a + b.length, 0)
  const totalPacked = Object.values(contents).reduce((a, b) => a + b.filter(i => i.packed).length, 0)

  return (
    <div>
      {/* Overview */}
      <SectionCard title="Bag summary">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {BAG_TYPES.map(bag => {
            const items = contents[bag.name] || []
            const packedCount = items.filter(i => i.packed).length
            const qty = qtys[bag.name]
            return (
              <div key={bag.name} className="rounded-xl p-4 text-center" style={{ background: CREAM }}>
                <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ background: bag.color }} />
                <p className="text-xs font-semibold mb-1" style={{ color: NAVY, fontFamily: 'BentonSans, sans-serif' }}>{bag.name}</p>
                <p className="text-xs mb-3" style={{ color: '#6681AB' }}>{bag.audiences}</p>
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => setQtys(q => ({ ...q, [bag.name]: Math.max(0, q[bag.name] - 1) }))}
                    className="w-6 h-6 rounded-full text-white text-sm leading-none" style={{ background: BLUE }}>−</button>
                  <span className="text-2xl font-light w-8 text-center" style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>{qty}</span>
                  <button onClick={() => setQtys(q => ({ ...q, [bag.name]: q[bag.name] + 1 }))}
                    className="w-6 h-6 rounded-full text-white text-sm leading-none" style={{ background: BLUE }}>+</button>
                </div>
                <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>bags needed</p>
                {items.length > 0 && (
                  <p className="text-xs mt-2 font-medium" style={{ color: packedCount === items.length ? '#059669' : PEACH }}>
                    {packedCount}/{items.length} items confirmed
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Totals bar */}
        <div className="flex gap-6 pt-4 border-t border-gray-100 text-sm">
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-widest mr-2" style={{ fontFamily: 'NeuePlak, sans-serif' }}>Total bags</span>
            <span className="font-semibold" style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>{totalBags}</span>
          </div>
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-widest mr-2" style={{ fontFamily: 'NeuePlak, sans-serif' }}>Unique items</span>
            <span className="font-semibold" style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>{totalItems}</span>
          </div>
          {totalItems > 0 && (
            <div>
              <span className="text-gray-400 text-xs uppercase tracking-widest mr-2" style={{ fontFamily: 'NeuePlak, sans-serif' }}>Items confirmed</span>
              <span className="font-semibold" style={{ color: totalPacked === totalItems ? '#059669' : NAVY, fontFamily: 'Cotford, Georgia, serif' }}>{totalPacked}/{totalItems}</span>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Contents per bag */}
      <SectionCard title="Bag contents">
        <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
          Add items to each bag type below. Tick them off as you confirm each item is sourced and ready.
        </p>
        <div className="grid grid-cols-2 gap-6">
          {BAG_TYPES.map(bag => {
            const items = contents[bag.name] || []
            const packedCount = items.filter(i => i.packed).length
            return (
              <div key={bag.name} className="rounded-xl border border-gray-100 overflow-hidden">
                {/* Bag header */}
                <div className="px-4 py-3 flex items-center gap-3" style={{ background: CREAM }}>
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: bag.color }} />
                  <p className="text-sm font-semibold flex-1" style={{ color: NAVY, fontFamily: 'BentonSans, sans-serif' }}>{bag.name}</p>
                  {items.length > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: packedCount === items.length ? '#ECFDF5' : '#FFF7ED',
                        color: packedCount === items.length ? '#059669' : '#D97706',
                      }}>
                      {packedCount}/{items.length}
                    </span>
                  )}
                </div>

                {/* Items list */}
                <div className="divide-y divide-gray-50">
                  {items.length === 0 && (
                    <p className="px-4 py-4 text-sm text-gray-300 italic">No items added yet</p>
                  )}
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 group">
                      <input
                        type="checkbox"
                        checked={item.packed}
                        onChange={() => toggleItem(bag.name, item.id)}
                        className="w-4 h-4 rounded shrink-0"
                        style={{ accentColor: BLUE }}
                      />
                      <span className={`flex-1 text-sm ${item.packed ? 'line-through text-gray-300' : ''}`}
                        style={{ color: item.packed ? undefined : NAVY, fontFamily: 'BentonSans, sans-serif' }}>
                        {item.name}
                      </span>
                      <button
                        onClick={() => removeItem(bag.name, item.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 text-xs transition-opacity">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add item */}
                <div className="px-4 py-3 flex gap-2 border-t border-gray-100" style={{ background: '#FAFAFA' }}>
                  <input
                    type="text"
                    value={newItems[bag.name] || ''}
                    onChange={e => setNewItems(n => ({ ...n, [bag.name]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addItem(bag.name)}
                    placeholder="Add item…"
                    className="flex-1 text-sm px-3 py-1.5 rounded-lg border border-gray-200 outline-none focus:border-blue-300"
                    style={{ fontFamily: 'BentonSans, sans-serif' }}
                  />
                  <button
                    onClick={() => addItem(bag.name)}
                    className="px-3 py-1.5 rounded-lg text-white text-xs font-medium"
                    style={{ background: BLUE }}>
                    Add
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </SectionCard>

      {/* Notes */}
      <SectionCard title="Gifting notes">
        <textarea
          placeholder="Add any notes about gifting, sourcing, packaging, or delivery…"
          rows={4}
          className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none"
          style={{ fontFamily: 'BentonSans, sans-serif', color: NAVY }}
        />
      </SectionCard>
    </div>
  )
}
