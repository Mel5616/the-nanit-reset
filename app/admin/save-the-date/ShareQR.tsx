'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const CREAM = '#FAF7F3'

export default function ShareQR({ url }: { url: string }) {
  const [svg, setSvg] = useState<string | null>(null)
  const [pngUrl, setPngUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!url) return
    import('qrcode').then(QR => {
      QR.toString(url, { type: 'svg', margin: 1, width: 320, color: { dark: NAVY, light: CREAM } }).then(setSvg)
      QR.toDataURL(url, { margin: 2, width: 1024, color: { dark: NAVY, light: '#ffffff' } }).then(setPngUrl)
    })
  }, [url])

  function copy() {
    navigator.clipboard?.writeText(url)
    setCopied(true); setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="min-h-screen" style={{ background: CREAM }}>
      <header style={{ background: NAVY }} className="px-6 py-4 flex items-center justify-between no-print">
        <div className="flex items-center gap-4">
          <img src="/nanit-logo-light.png" alt="Nanit" style={{ height: 26, opacity: 0.9 }} />
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest" style={{ fontFamily: 'NeuePlak, sans-serif' }}>Save the date</p>
            <h1 className="text-white text-lg font-light" style={{ fontFamily: 'Cotford, Georgia, serif' }}>Share with influencers</h1>
          </div>
        </div>
        <Link href="/admin" className="text-white/60 text-sm hover:text-white border border-white/20 hover:border-white/40 rounded-full px-4 py-2">← Dashboard</Link>
      </header>

      <div className="max-w-lg mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden text-center" style={{ border: '1px solid #EEE6DA' }}>
          <div style={{ background: NAVY }} className="px-8 pt-10 pb-8">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3" style={{ fontFamily: 'NeuePlak, sans-serif', letterSpacing: '0.2em' }}>By invitation only</p>
            <p className="text-white text-4xl font-light" style={{ fontFamily: 'Cotford, Georgia, serif' }}>Save the date</p>
            <p className="text-[#BDD4E7] text-sm mt-3" style={{ fontFamily: 'Cotford, Georgia, serif' }}>The Nanit Reset · Monday 16 November 2026 · Sydney</p>
            <p className="text-white/55 text-sm mt-3 leading-relaxed">A morning just for you. Scan to register your interest.</p>
          </div>
          <div className="px-8 py-8 flex flex-col items-center">
            {svg
              ? <div style={{ width: 240, height: 240 }} dangerouslySetInnerHTML={{ __html: svg }} />
              : <div style={{ width: 240, height: 240, background: '#f2ece3', borderRadius: 12 }} />}
            <p className="text-xs mt-6 break-all" style={{ color: BLUE }}>{url}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mt-6 no-print">
          <button onClick={copy} className="px-4 py-2.5 rounded-full text-white text-sm font-medium" style={{ background: BLUE }}>
            {copied ? 'Link copied ✓' : 'Copy link'}
          </button>
          <a href="/save-the-date" target="_blank" rel="noreferrer" className="px-4 py-2.5 rounded-full text-sm border border-gray-200 text-gray-600 hover:border-gray-300">Open page</a>
          {pngUrl && <a href={pngUrl} download="nanit-reset-save-the-date-qr.png" className="px-4 py-2.5 rounded-full text-sm border border-gray-200 text-gray-600 hover:border-gray-300">Download QR (PNG)</a>}
          <button onClick={() => window.print()} className="px-4 py-2.5 rounded-full text-sm border border-gray-200 text-gray-600 hover:border-gray-300">Print</button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-4 no-print">Add the QR to a story, a printed card or a DM. It links to the expression-of-interest page.</p>
      </div>
      <style>{`@media print { .no-print { display:none !important } body { background:#fff } }`}</style>
    </div>
  )
}
