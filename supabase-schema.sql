-- The Nanit Reset — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  first_name text not null,
  last_name text not null,
  email text not null unique,
  audience_type text not null check (audience_type in ('influencer','media','wellness','hcp','retail','celebrity')),
  company text,
  instagram_handle text,
  notes text,
  dietary_requirements text,
  status text not null default 'pending' check (status in ('pending','invited','confirmed','declined','waitlist')),
  invite_token uuid default gen_random_uuid() unique,
  invite_sent_at timestamptz,
  rsvp_confirmed_at timestamptz,
  added_by text
);

-- Index for fast token lookups
create index if not exists guests_invite_token_idx on guests (invite_token);

-- Row-level security: service role bypasses RLS; anon only reads by token
alter table guests enable row level security;

create policy "Service role full access" on guests
  for all using (auth.role() = 'service_role');

create policy "Public read by token" on guests
  for select using (true);
