import { AudienceType } from './supabase'

export interface InviteContent {
  hook: string
  sub: string
  label: string
}

export const audienceLabels: Record<AudienceType, string> = {
  influencer: 'Influencer',
  media: 'Media & PR',
  wellness: 'Wellness Creator',
  hcp: 'Healthcare Professional',
  retail: 'Retail Partner',
  celebrity: 'Celebrity / High-Profile',
}

export const inviteContent: Record<AudienceType, InviteContent> = {
  influencer: {
    hook: "Nobody told you what the first year would actually feel like.",
    sub: "You told your community anyway. Now we'd like to tell you something.",
    label: 'Influencer',
  },
  media: {
    hook: "The science of infant sleep. The story nobody's told properly.",
    sub: "We'd like you in the room when we tell it.",
    label: 'Media & PR',
  },
  wellness: {
    hook: "Nobody told you how much the first year shapes everything that follows.",
    sub: "The science caught up. We'd like to share it with you.",
    label: 'Wellness Creator',
  },
  hcp: {
    hook: "The research your patients deserve to hear about.",
    sub: "We'd like you in the room when Dr Natalie Barnett shares it.",
    label: 'Healthcare Professional',
  },
  retail: {
    hook: "Nobody told you what this brand looks like when it's fully in the room.",
    sub: "We'd like to show you.",
    label: 'Retail Partner',
  },
  celebrity: {
    hook: "Nobody told you that the hardest parts were the ones nobody talks about.",
    sub: "We're starting that conversation. We'd like you there.",
    label: 'Celebrity / High-Profile',
  },
}

export const goodyBagDefaults: Record<AudienceType, string> = {
  influencer: 'Creator Bag',
  media: 'Creator Bag',
  wellness: 'Creator Bag',
  hcp: 'Healthcare Bag',
  retail: 'Retail Bag',
  celebrity: 'Creator Bag',
}

export const capacityTargets: Record<AudienceType, number> = {
  influencer: 10,
  media: 6,
  wellness: 4,
  hcp: 4,
  retail: 4,
  celebrity: 2,
}

export const TOTAL_CAPACITY = 30
