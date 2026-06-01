'use client'

import { useEffect, useState } from 'react'

export default function QRCode({ value, size = 140 }: { value: string; size?: number }) {
  const [svg, setSvg] = useState<string | null>(null)

  useEffect(() => {
    import('qrcode').then(QR => {
      QR.toString(value, { type: 'svg', margin: 0, color: { dark: '#111D41', light: '#FAF7F3' } })
        .then(setSvg)
    })
  }, [value])

  if (!svg) return <div style={{ width: size, height: size, background: 'rgba(255,255,255,0.05)', borderRadius: 8 }} />

  return (
    <div
      style={{ width: size, height: size, borderRadius: 12, overflow: 'hidden', background: '#FAF7F3', padding: 10 }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
