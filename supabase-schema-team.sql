-- ============================================================
-- The Nanit Reset — Team auth (multi-user admin)
-- Run this in the Supabase SQL editor.
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists admin_users (
  id                  uuid primary key default gen_random_uuid(),
  email               text unique not null,
  name                text,
  role                text not null default 'viewer'
                        check (role in ('owner', 'manager', 'viewer', 'door')),
  password_hash       text,
  session_token       text,
  invite_token        text,
  invited_by          text,
  invite_sent_at      timestamptz,
  invite_accepted_at  timestamptz,
  reset_token         text,
  reset_expires_at    timestamptz,
  last_login_at       timestamptz,
  created_at          timestamptz not null default now()
);

create index if not exists admin_users_session_token_idx on admin_users (session_token);
create index if not exists admin_users_invite_token_idx  on admin_users (invite_token);
create index if not exists admin_users_reset_token_idx   on admin_users (reset_token);

-- Service role client bypasses RLS; enable RLS so nothing else can read this table.
alter table admin_users enable row level security;
