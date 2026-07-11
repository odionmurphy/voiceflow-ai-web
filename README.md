# VoiceFlow AI — Web Business Dashboard

The web counterpart to the mobile app — login, Overview stats, Appointments,
Customers, AI Settings, and business Settings, all talking to the same
backend API your mobile app already uses.

## Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (CSS-first config, see `app/globals.css` for the design tokens)
- No extra state library — plain React Context for auth/business state, matching
  the mobile app's pattern

## Design
- **Palette**: deep navy (`#1e2740`) for structure, warm amber (`#d89b3c`) as the
  single accent color, off-white paper background — deliberately not the
  generic "cream + terracotta" AI-generated look.
- **Type**: Space Grotesk for headings, Inter for body/data — both via
  `next/font/google`, which needs real internet access at build time to fetch
  (this only failed in Claude's own sandboxed dev environment, which blocks
  Google Fonts; it will work normally on your machine).
- **Signature element**: a small pulsing amber dot next to the logo, meant to
  read as "the AI is listening" — used sparingly (login page, sidebar) rather
  than overused throughout.

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Edit `.env.local` if your backend isn't running on the default `localhost:4000`:
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Run it:
```bash
npm run dev
# -> http://localhost:3000
```

Make sure your backend (`../backend`) is running first — this dashboard is
just a client for that API, it doesn't run its own database logic.

## Pages

| Route | Purpose |
|---|---|
| `/login` | Email/password login (same accounts as the mobile app) |
| `/dashboard` | Overview: today's stats (appointments, calls answered/missed), today's schedule |
| `/dashboard/appointments` | Full appointment list with cancel action |
| `/dashboard/customers` | Customer list + add-customer form |
| `/dashboard/ai-settings` | Greeting, assistant name, services, FAQ, booking rules, escalation/notification settings — same fields as the mobile app's AI Settings screen |
| `/dashboard/messages` | SMS/email log — every booking confirmation, cancellation, and reminder sent, with delivery status |
| `/dashboard/settings` | Business profile editing, Google Calendar connect, billing/subscription plan |

The sidebar includes a business switcher if you have more than one business
on your account (matches the mobile app's Settings screen behavior).

## Notes
- Auth token is stored in `localStorage` (key `voiceflow_token`) — simple and
  fine for an internal dashboard MVP, though worth moving to an httpOnly
  cookie before any public-facing launch.
- Billing is wired up (Stripe Checkout + Billing Portal, under Settings), but the
  Overview page's "Revenue" stat card is still a placeholder — it would need
  per-appointment revenue (from `ai_settings.services[].price` × completed
  appointments), which is a separate calculation from the subscription plan itself.
- Call recordings/transcripts aren't surfaced in the UI yet, even though the
  backend's `/api/calls` endpoint already returns transcript data from the
  voice pipeline — natural next addition if you want it.
