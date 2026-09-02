// The Nanit Reset — Speaker Talent Agreement body.
// Shared between the speaker signing page and the executed-copy email so wording stays identical.
// NOTE: default wording is a starting point only — have it reviewed before sending to speakers.
import { EVENT } from './event'

// Format a speaker's name with honorifics (Dr, Prof, etc.) prefixed; role-type titles kept as subtitle.
export function speakerDisplay(name: string, title: string | null, org: string | null) {
  const honorific = !!title && /^(dr|dr\.|prof|prof\.|professor|mr|mrs|ms|mx)\.?$/i.test((title || '').trim())
  const fullName = honorific ? `${title} ${name}` : name
  const sub = org ? (honorific || !title ? org : `${title}, ${org}`) : (title || '')
  return { fullName, sub }
}

// The default, editable clause text (sections 2–8). Plain text with "## heading" and "- bullet" markers.
export function defaultAgreementClauses({ org, fee }: { org: string | null; fee: string | null }): string {
  const feeText = fee || '0.00'
  return `## 2 · Speaker services
The Speaker agrees to:
- Deliver a presentation of approximately 15–20 minutes on their area of expertise;
- Participate in an expert panel discussion and audience Q&A session;
- Engage with attendees during the networking portion of the Event; and
- Provide professional expertise and commentary relevant to infant sleep, early parenthood, wellbeing, and related topics.
- The Speaker will present information in a manner consistent with their professional expertise and personal views.

## 3 · Speaker fee
The Organiser agrees to pay the Speaker a fee of AUD $${feeText} (inclusive of GST, where applicable). Payment will be made within fourteen (14) days following receipt of a valid tax invoice from the Speaker. The fee constitutes full compensation for the Speaker's participation in the Event unless otherwise agreed in writing.

## 4 · Marketing and promotional rights
The Speaker grants the Organiser, ${EVENT.brand}, and ${EVENT.organiser} a non-exclusive, royalty-free licence to use:
- The Speaker's name, professional title, and credentials;
- Business name${org ? ` (${org})` : ''};
- Biography, approved headshots, photographs, and other promotional images supplied by or approved by the Speaker; and
- Event-related photographs, video recordings, and audio recordings featuring the Speaker.
For the purposes of promoting and advertising the Event; public relations activities; social media, email marketing and website content; event recap and post-event communications; and future promotional materials relating to the Event.
The Organiser agrees that all use of the Speaker's image, name, and professional credentials will be respectful, accurate, and consistent with the Speaker's professional reputation.

## 5 · Event recording and photography
The Speaker acknowledges that photography, videography, and audio recording may occur during the Event. The Speaker grants permission for the Organiser to use and reproduce photographs, recordings, and content captured during the Event for promotional, educational, marketing, and commercial purposes.

## 6 · Independent contractor
The Speaker is engaged as an independent contractor. Nothing in this Agreement creates an employment, partnership, or agency relationship between the parties.

## 7 · Cancellation
If the Event is cancelled by the Organiser, the parties will discuss reasonable compensation for any work already completed by the Speaker. If the Speaker is unable to attend due to illness, emergency, or circumstances beyond their reasonable control, the Speaker will notify the Organiser as soon as practical, and both parties will work in good faith to determine an alternative arrangement where possible.

## 8 · General
This Agreement constitutes the entire agreement between the parties regarding the Speaker's participation in the Event and may only be amended in writing and signed by both parties.`
}
