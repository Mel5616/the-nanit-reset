'use client'

import { useState, useEffect } from 'react'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const CREAM = '#F3E8E0'

type BookingStatus = 'enquiring' | 'quoted' | 'confirmed' | 'paid' | 'cancelled'

const STATUS_STYLES: Record<BookingStatus, { bg: string; text: string; label: string }> = {
  enquiring: { bg: '#F9FAFB', text: '#9CA3AF', label: 'Enquiring' },
  quoted:    { bg: '#EFF6FF', text: '#3B82F6', label: 'Quoted' },
  confirmed: { bg: '#FFF7ED', text: '#F59E0B', label: 'Confirmed' },
  paid:      { bg: '#ECFDF5', text: '#059669', label: 'Paid ✓' },
  cancelled: { bg: '#FEF2F2', text: '#DC2626', label: 'Cancelled' },
}

interface Vendor {
  id: string
  category: string
  name: string
  contactName: string
  phone: string
  email: string
  status: BookingStatus
  fee: string
  paymentDue: string
  notes: string
}

const CATEGORIES = [
  { name: 'Venue', icon: '🏛' },
  { name: 'Catering', icon: '🍽' },
  { name: 'Styling & Florals', icon: '🌿' },
  { name: 'Photography & Video', icon: '📸' },
  { name: 'AV & Tech', icon: '🎙' },
  { name: 'PR & Agency', icon: '📢' },
  { name: 'Other', icon: '📋' },
]

const EMPTY_VENDOR: Omit<Vendor, 'id'> = {
  category: CATEGORIES[0].name, name: '', contactName: '', phone: '', email: '',
  status: 'enquiring', fee: '', paymentDue: '', notes: '',
}

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: BLUE, fontFamily: 'NeuePlak, sans-serif' }}>{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full text-sm px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-blue-300"

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Vendor | null>(null)
  const [form, setForm] = useState<Omit<Vendor, 'id'>>(EMPTY_VENDOR)
  const [filterCat, setFilterCat] = useState('All')

  useEffect(() => {
    const saved = localStorage.getItem('nanit-vendors')
    if (saved) setVendors(JSON.parse(saved))
  }, [])

  function save(v: Vendor[]) { setVendors(v); localStorage.setItem('nanit-vendors', JSON.stringify(v)) }

  function openNew() { setForm(EMPTY_VENDOR); setEditing(null); setShowForm(true) }
  function openEdit(v: Vendor) { setForm({ ...v }); setEditing(v); setShowForm(true) }

  function submit() {
    if (!form.name.trim()) return
    if (editing) {
      save(vendors.map(v => v.id === editing.id ? { ...form, id: editing.id } : v))
    } else {
      save([...vendors, { ...form, id: crypto.randomUUID() }])
    }
    setShowForm(false)
  }

  function remove(id: string) { save(vendors.filter(v => v.id !== id)) }

  function updateStatus(id: string, status: BookingStatus) {
    save(vendors.map(v => v.id === id ? { ...v, status } : v))
  }

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  const confirmed = vendors.filter(v => v.status === 'confirmed' || v.status === 'paid').length
  const filtered = filterCat === 'All' ? vendors : vendors.filter(v => v.category === filterCat)

  return (
    <div>
      {/* Summary */}
      <SectionCard title="Vendor summary">
        <div className="grid grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Total vendors', value: vendors.length },
            { label: 'Confirmed', value: confirmed },
            { label: 'Enquiring / Quoted', value: vendors.filter(v => v.status === 'enquiring' || v.status === 'quoted').length },
            { label: 'Paid', value: vendors.filter(v => v.status === 'paid').length },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl px-4 py-4 text-center" style={{ background: CREAM }}>
              <p className="text-3xl font-light mb-1" style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>{value}</p>
              <p className="text-xs uppercase tracking-widest" style={{ color: '#9CA3AF', fontFamily: 'NeuePlak, sans-serif' }}>{label}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => {
            const count = vendors.filter(v => v.category === c.name).length
            if (count === 0) return null
            return (
              <span key={c.name} className="text-xs px-3 py-1 rounded-full" style={{ background: '#F3E8E0', color: NAVY }}>
                {c.icon} {c.name} ({count})
              </span>
            )
          })}
        </div>
      </SectionCard>

      {/* Vendor list */}
      <SectionCard title={`Vendors (${vendors.length})`}>
        <div className="flex gap-3 mb-5 flex-wrap items-center">
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2">
            <option value="All">All categories</option>
            {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
          </select>
          <button onClick={openNew}
            className="ml-auto px-5 py-2 rounded-full text-white text-sm font-medium"
            style={{ background: BLUE }}>
            + Add vendor
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No vendors added yet.</p>
            <button onClick={openNew} className="mt-3 text-sm underline" style={{ color: BLUE }}>Add your first vendor</button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(v => {
              const status = STATUS_STYLES[v.status]
              const cat = CATEGORIES.find(c => c.name === v.category)
              return (
                <div key={v.id} className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{cat?.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold" style={{ color: NAVY, fontFamily: 'BentonSans, sans-serif' }}>{v.name}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: '#6B7280', background: '#F3F4F6' }}>{v.category}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs mt-2 md:grid-cols-4">
                        {v.contactName && <div><span className="text-gray-400">Contact: </span><span style={{ color: NAVY }}>{v.contactName}</span></div>}
                        {v.phone && <div><span className="text-gray-400">Phone: </span><a href={`tel:${v.phone}`} style={{ color: BLUE }}>{v.phone}</a></div>}
                        {v.email && <div><span className="text-gray-400">Email: </span><a href={`mailto:${v.email}`} style={{ color: BLUE }}>{v.email}</a></div>}
                        {v.fee && <div><span className="text-gray-400">Fee: </span><span style={{ color: NAVY }}>{v.fee}</span></div>}
                        {v.paymentDue && <div><span className="text-gray-400">Payment due: </span><span style={{ color: NAVY }}>{v.paymentDue}</span></div>}
                      </div>
                      {v.notes && <p className="text-xs text-gray-400 mt-2 italic">{v.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <select value={v.status} onChange={e => updateStatus(v.id, e.target.value as BookingStatus)}
                        className="text-xs px-2 py-1.5 rounded-lg border border-gray-100 font-medium"
                        style={{ color: status.text, background: status.bg }}>
                        {Object.entries(STATUS_STYLES).map(([val, s]) => <option key={val} value={val}>{s.label}</option>)}
                      </select>
                      <button onClick={() => openEdit(v)} className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded border border-gray-200">Edit</button>
                      <button onClick={() => remove(v.id)} className="text-xs text-gray-300 hover:text-red-400 px-2 py-1">✕</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </SectionCard>

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(17,29,65,0.7)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between" style={{ background: CREAM }}>
              <h3 className="font-semibold" style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>{editing ? 'Edit vendor' : 'Add vendor'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <select value={form.category} onChange={set('category')} className={inputCls}>
                    {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
                  </select>
                </Field>
                <Field label="Status">
                  <select value={form.status} onChange={set('status')} className={inputCls}>
                    {Object.entries(STATUS_STYLES).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Business name *">
                <input value={form.name} onChange={set('name')} placeholder="e.g. Palm & Petal Florals" className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Contact name">
                  <input value={form.contactName} onChange={set('contactName')} placeholder="e.g. Sarah Brown" className={inputCls} />
                </Field>
                <Field label="Phone">
                  <input value={form.phone} onChange={set('phone')} type="tel" placeholder="+61 4xx xxx xxx" className={inputCls} />
                </Field>
              </div>
              <Field label="Email">
                <input value={form.email} onChange={set('email')} type="email" placeholder="contact@vendor.com.au" className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Fee / Quote">
                  <input value={form.fee} onChange={set('fee')} placeholder="e.g. $3,500" className={inputCls} />
                </Field>
                <Field label="Payment due date">
                  <input value={form.paymentDue} onChange={set('paymentDue')} type="date" className={inputCls} />
                </Field>
              </div>
              <Field label="Notes">
                <textarea value={form.notes} onChange={set('notes')} rows={2} placeholder="Any notes, inclusions, T&Cs…"
                  className={`${inputCls} resize-none`} />
              </Field>
              <div className="flex gap-3 pt-2">
                <button onClick={submit} className="flex-1 py-3 rounded-full text-white text-sm font-medium" style={{ background: BLUE }}>
                  {editing ? 'Save changes' : 'Add vendor'}
                </button>
                <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-full text-gray-500 text-sm border border-gray-200">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
