# The Nanit Reset — Event App

Invitation and RSVP system for The Nanit Reset, 15 November 2026, Sydney.

## How it works

1. Coolkidz team adds guests via `/admin/guests/new`
2. Send personalised invitation emails from the admin dashboard
3. Each guest gets a unique link: `/invite/[token]`
4. Guest RSVPs — confirmed or declined — logged automatically
5. Export full guest list as CSV any time

## Setup

### 1. Supabase

1. Create a free account at supabase.com
2. Create a new project named `the-nanit-reset`
3. Go to Settings → API and copy: Project URL, anon/public key, service_role key
4. Go to SQL Editor → New query, paste `supabase-schema.sql`, and run it

### 2. Resend

1. Create a free account at resend.com
2. Add and verify your sending domain (e.g. coolkidz.com.au)
3. Create an API key

### 3. Environment variables

Copy `.env.local` and fill in your values:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
FROM_EMAIL=events@coolkidz.com.au
ADMIN_PASSWORD=
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

### 4. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — redirects to /admin.

## Deploy to Vercel

1. Push to GitHub
2. Import repo at vercel.com
3. Add all environment variables under Settings → Environment Variables
4. Update NEXT_PUBLIC_BASE_URL to your Vercel URL
5. Redeploy

## URLs

| URL | What it is |
|-----|------------|
| /admin | Admin dashboard (password protected) |
| /admin/guests/new | Add a new guest |
| /admin/login | Admin login |
| /invite/[token] | Personalised guest invitation |
| /api/admin/export | Download CSV guest list |
