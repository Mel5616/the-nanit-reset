-- ============================================================
-- The Nanit Reset — Giveaway, Survey & Referrals
-- Run this in the Supabase SQL editor.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Giveaway ----------
create table if not exists giveaway_entries (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  first_name        text not null,
  last_name         text,
  email             text not null,
  phone             text,
  postcode          text,
  answer            text,               -- optional entry question response
  marketing_opt_in  boolean not null default false,
  source            text default 'direct',
  is_winner         boolean not null default false,
  forfeited         boolean not null default false,
  drawn_at          timestamptz
);
create unique index if not exists giveaway_entries_email_uidx on giveaway_entries (lower(email));
alter table giveaway_entries enable row level security;

-- ---------- Post-event survey ----------
create table if not exists survey_responses (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  token           text unique not null,   -- guest invite_token
  guest_id        uuid,
  first_name      text,
  email           text,
  attended        boolean,
  overall_rating  int,                    -- 1..5
  recommend       int,                    -- 0..10 (NPS)
  highlight       text,
  improve         text,
  topics_next     text,
  consent         boolean not null default false,
  status          text not null default 'started' check (status in ('started','submitted')),
  submitted_at    timestamptz
);
alter table survey_responses enable row level security;

-- ---------- Referrals ----------
-- Referred people are captured straight into the guests table with
-- added_by = 'referral:<referrer name>' and status 'waitlist' (pending review).
-- This table just tracks link opens per referring guest.
create table if not exists referral_stats (
  token       text primary key,           -- referring guest's invite_token
  opens       int not null default 0,
  updated_at  timestamptz not null default now()
);
alter table referral_stats enable row level security;
