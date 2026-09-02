-- ============================================================
-- The Nanit Reset — Speakers module
-- Run this in the Supabase SQL editor.
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists speakers (
  id                          uuid primary key default gen_random_uuid(),
  created_at                  timestamptz not null default now(),

  -- Identity
  name                        text not null,
  title                       text,          -- honorific or role, e.g. "Dr" or "Founder"
  organization                text,
  email                       text,
  phone                       text,
  instagram_handle            text,

  -- Invitation content (all editable per speaker)
  involved_as                 text,          -- e.g. "a featured speaker" / "our host"
  specialty                   text,
  personalized_why            text,          -- opening personalised paragraph(s)
  why_involved                text,          -- "why we'd love you involved"
  proposed_topic              text,          -- proposed involvement / session
  involvement_note            text,
  custom_provisions           text,          -- newline-separated "what we provide" list

  public_token                text unique not null,
  status                      text not null default 'invited'
                                check (status in ('invited', 'confirmed', 'declined')),
  email_sent_at               timestamptz,

  -- Talent agreement
  agreement_fee               text,
  agreement_body              text,          -- editable clause text (defaults from lib)
  agreement_status            text not null default 'not_sent'
                                check (agreement_status in ('not_sent','sent','signed_by_speaker','fully_executed')),
  agreement_speaker_signature text,
  agreement_speaker_signed_at timestamptz,
  agreement_org_signature     text,
  agreement_org_signed_at     timestamptz,

  notes                       text
);

create index if not exists speakers_public_token_idx on speakers (public_token);

alter table speakers enable row level security;
