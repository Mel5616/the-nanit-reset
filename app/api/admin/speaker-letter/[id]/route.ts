import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/auth'
import { EVENT } from '@/lib/event'

// Branded speaker invitation letter (print / save to PDF), ported from the Frida
// "Nobody Told Me" event and restyled for The Nanit Reset.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return new NextResponse('Unauthorized', { status: 401 })

  const { id } = await params
  const db = getServiceClient()
  const { data: sp } = await db.from('speakers').select('*').eq('id', id).single()
  if (!sp) return new NextResponse('Not found', { status: 404 })

  const displayName = sp.title ? `${sp.title} ${sp.name}` : sp.name
  const inviteVerb = /host/i.test(sp.involved_as || '') ? 'Host' : 'Speak'
  const greeting = sp.title ? `Dear ${sp.title} ${sp.name},` : `Dear ${sp.name},`
  const handle = sp.instagram_handle ? (sp.instagram_handle.startsWith('@') ? sp.instagram_handle : `@${sp.instagram_handle}`) : null

  const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const mdToHtml = (text: string) =>
    esc(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')

  const NAVY = '#111D41', MID = '#2D4977', BLUE = '#6681AB'

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Invitation to ${inviteVerb} — ${esc(displayName)}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1a1a1a;background:#fff}
@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}.no-print{display:none!important}}
.page{max-width:760px;margin:0 auto;padding:0 0 60px}
.header{display:flex;justify-content:space-between;align-items:flex-start;padding:28px 40px 24px;border-bottom:1px solid #e0e0e0}
.nanit-mark{font-family:Georgia,serif;font-size:24px;font-weight:400;color:${BLUE};letter-spacing:.5px}
.header-sub{font-size:9px;letter-spacing:2px;color:#999;text-transform:uppercase;margin-top:4px}
.header-right{text-align:right}
.event-name{font-family:Georgia,serif;font-style:italic;font-size:20px;color:${NAVY}}
.event-detail{font-size:11px;color:#666;margin-top:4px}
.colour-bar{height:3px;background:${NAVY}}
.body{padding:36px 40px 0}
.address{margin-bottom:28px}
.address-name{font-weight:bold;font-size:13px;color:${NAVY}}
.address-org{font-size:12px;color:#666}
hr{border:none;border-top:1px solid #e0e0e0;margin:24px 0}
.section-label{font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${MID};margin-bottom:10px}
.section-italic{font-family:Georgia,serif;font-style:italic;font-size:15px;color:${NAVY};margin-bottom:20px;line-height:1.5}
p{font-size:13px;line-height:1.75;margin-bottom:14px;color:#333}
p strong{color:${NAVY}}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0}
.chip{border:1px solid #d7ddea;border-radius:20px;padding:5px 14px;font-size:11px;color:#555}
.stats-row{display:flex;border:1px solid #e2e7f0;border-radius:12px;overflow:hidden;margin:18px 0}
.stat-cell{flex:1;text-align:center;padding:16px 12px;border-right:1px solid #e2e7f0}
.stat-cell:last-child{border-right:none}
.stat-label{font-size:9px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${MID};margin-bottom:6px}
.stat-value{font-family:Georgia,serif;font-style:italic;font-size:14px;color:${NAVY}}
.num-item{display:flex;gap:14px;margin-bottom:14px;align-items:flex-start}
.provide-item{display:flex;gap:10px;align-items:flex-start;margin-bottom:10px}
.check{color:${BLUE};font-size:14px;flex-shrink:0}
.provide-text{font-size:12px;color:#444;line-height:1.5}
.footer{margin-top:32px;padding:20px 40px;border-top:1px solid #e0e0e0}
.footer-contact{font-size:11px;color:#888}
.footer-contact span{margin:0 8px;color:#bbb}
.print-btn{position:fixed;bottom:24px;right:24px;background:${NAVY};color:#fff;border:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:bold;cursor:pointer;box-shadow:0 4px 16px rgba(17,29,65,.4);font-family:Arial}
.sig{font-family:Georgia,serif;font-style:italic;font-size:18px;color:${NAVY};margin-top:-4px}
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div>
      <div class="nanit-mark">nanit</div>
      <div class="header-sub">Nanit in partnership with Coolkidz Australia</div>
    </div>
    <div class="header-right">
      <div class="event-name">${EVENT.name}</div>
      <div class="event-detail">${EVENT.dayDate} 2026 · ${EVENT.time}</div>
      <div class="event-detail">${EVENT.location}</div>
    </div>
  </div>
  <div class="colour-bar"></div>

  <div class="body">
    <div class="address">
      <div class="address-name">${esc(displayName)}</div>
      ${sp.organization ? `<div class="address-org">${esc(sp.organization)}</div>` : ''}
    </div>

    <hr/>
    <div class="section-label">Invitation to ${inviteVerb}</div>
    <div class="section-italic">${EVENT.name} — an intimate, education-led morning to stop, breathe and reset, ${EVENT.dateLong}</div>

    <p>${esc(greeting)}</p>
    <p>I'm reaching out on behalf of <strong>Nanit</strong> and <strong>Coolkidz Australia</strong> to invite you to be involved as ${esc(sp.involved_as || 'a featured speaker')} at our upcoming event, <strong><em>${EVENT.name}</em></strong>, taking place on <strong>${EVENT.dateLong}</strong> from ${EVENT.time} at ${EVENT.venue}, ${EVENT.city}.</p>
    ${sp.personalized_why ? sp.personalized_why.split('\n\n').filter(Boolean).map((p: string) => `<p>${mdToHtml(p.trim())}</p>`).join('') : ''}

    <hr/>
    <div class="section-label">— About the event</div>
    <p><strong><em>${EVENT.name}</em></strong> will be an intimate, education-led morning designed to create calm, honest conversations around baby sleep, early parenthood and looking after yourself. In conversation with <strong>Dr Natalie Barnett</strong>, Vice President of Clinical Research at Nanit, it's a supportive and genuinely useful space for parents to pause, breathe and reset, hearing trusted, evidence-based guidance on the things people often feel underprepared for.</p>

    <p style="color:${MID};font-weight:600;margin:18px 0 10px">The audience will include:</p>
    <div class="chips">
      ${['Parents', 'Influencers &amp; Creators', 'Wellness Creators', 'Parenting Media', 'Healthcare Professionals', 'Retail Partners'].map(c => `<span class="chip">${c}</span>`).join('')}
    </div>

    <div class="stats-row">
      <div class="stat-cell"><div class="stat-label">Guests</div><div class="stat-value">${EVENT.attendees}</div></div>
      <div class="stat-cell"><div class="stat-label">Venue</div><div class="stat-value">${EVENT.venue}</div></div>
      <div class="stat-cell"><div class="stat-label">Occasion</div><div class="stat-value">A morning to reset</div></div>
    </div>

    <hr/>
    <div class="section-label">— Why we'd love you involved</div>
    ${sp.why_involved
      ? sp.why_involved.split('\n\n').filter(Boolean).map((p: string) => `<p>${mdToHtml(p.trim())}</p>`).join('')
      : `<p>One of the core themes of <em>${EVENT.name}</em> is helping parents feel more informed, supported and less alone in the realities of early parenthood, and in making space to look after themselves along the way.</p><p>What stood out to us is the way you combine real expertise with warm, approachable guidance that genuinely resonates with parents. We feel your perspective would bring enormous credibility, warmth and practical value to the morning.</p>`
    }

    <hr/>
    <div class="section-label">— Proposed involvement</div>
    <p>We would love to explore your involvement in the following ways:</p>
    ${(() => {
      const def = ['Delivering a short expert-led session on your area of expertise', 'Joining an intimate conversation and audience Q&amp;A', 'Connecting with guests during the relaxed, social portion of the morning']
      const t = (sp.proposed_topic || '').trim()
      return !t ? def : /[\n•]/.test(t) ? [t] : [t, def[1], def[2]]
    })().flatMap((it: string) => it.split(/[\n•]/).map(x => x.trim()).filter(Boolean)).map((item: string) => `<div class="num-item"><div style="color:${BLUE};font-size:18px;line-height:1;flex-shrink:0">•</div><p style="margin:0">${mdToHtml(item)}</p></div>`).join('')}
    <p style="margin-top:14px">${sp.involvement_note ? mdToHtml(sp.involvement_note) : 'Importantly, we want every speaker to feel authentic and comfortable. This is not about scripted brand messaging, we want you to speak openly from your expertise and experience in a way that feels honest and genuinely valuable to parents.'}</p>

    <hr/>
    <div class="section-label">— What we'd provide</div>
    <div>
      ${(sp.custom_provisions
        ? sp.custom_provisions.split('\n').filter((l: string) => l.trim())
        : [
          `Exposure of ${displayName}${sp.organization ? ` — ${sp.organization}` : ''} across all event advertising materials`,
          handle ? `Social media engagement with ${handle}` : 'Social media engagement and tagging',
          'Nanit / Coolkidz database exposure',
          'Full event support and briefing ahead of the day',
          'A Nanit product gift ahead of the event',
          'Professional photography and content assets from the day',
          'Opportunity for ongoing collaboration beyond the event itself',
        ]
      ).map((item: string) => `<div class="provide-item"><span class="check">✓</span><span class="provide-text">${mdToHtml(item.trim())}</span></div>`).join('')}
    </div>

    <p style="margin-top:20px">We genuinely believe <em>${EVENT.name}</em> has the opportunity to become a meaningful morning for Australian parents, and we would be honoured to have you involved. We'd love the chance to discuss it further and explore whether it feels like the right fit.</p>
    <p>Warm regards,</p>
    <p class="sig">Jane Edmonds</p>
    <p style="color:#666;margin-top:-8px">Partnerships &amp; Affiliate Manager</p>
  </div>

  <div class="footer">
    <div class="footer-contact">
      0429 276 523<span>|</span>jane@coolkidz.com.au<span>|</span>nanit.com.au<span>|</span>@nanit.au<span>|</span>coolkidz.com.au
    </div>
  </div>
</div>

<button class="print-btn no-print" onclick="window.print()">🖨 Print / Save PDF</button>
</body>
</html>`

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
