# F3 Lincoln

Regional website for **F3 Lincoln** (Fitness · Fellowship · Faith) — built for [f3lincoln.com](https://f3lincoln.com).

| | |
|--|--|
| **Local** | `C:\Users\Mark\Projects\f3-lincoln` |
| **GitHub** | https://github.com/mnolley/f3-lincoln |
| **PRD** | [docs/PRD.md](./docs/PRD.md) |

## Stack

Next.js · TypeScript · Tailwind CSS · Vercel · Vercel Blob (backblast archive)

## Getting started

```bash
cd C:\Users\Mark\Projects\f3-lincoln
npm install
cp .env.example .env.local   # then fill Slack (+ Blob token from Vercel)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Backblast archive (durable storage)

Slack channel history eventually rolls off. On each fetch the site:

1. Pulls live Paxminer posts from Slack  
2. **Merges** them into a private Vercel Blob archive (`archive/backblasts.json`)  
3. Serves **archive + live** so deleted Slack messages stay on the site, stats, and leaderboard  

**Primary:** Vercel Blob — create/link a store on the project (`BLOB_READ_WRITE_TOKEN` is set automatically when linked).  

**Optional secondary:** Supabase table `f3_backblasts` — run [`database/backblasts.sql`](./database/backblasts.sql) and set `SUPABASE_URL` + `SUPABASE_ANON_KEY` if you want a SQL backup.

### PAX tools

| Path | Password | Notes |
|------|----------|--------|
| `/stats` | `gloom` | Individual Q / attendance stats |
| `/leaderboard` | `gloom` | Top Qs, posts, recent joiners, CSV export |

Date pickers are limited to the first/last backblast dates in the archive.

## Site map

| Path | Page |
|------|------|
| `/` | Home |
| `/new` | New Here (FNG) |
| `/locations` | Locations & schedule |
| `/leadership` | Leadership directory |
| `/backblasts` | Backblasts (Slack + archive) |
| `/backblasts/[id]` | Backblast detail |
| `/stats` | PAX stats (password) |
| `/leaderboard` | Leaderboard (password) |

## Edit content

| Content | File |
|---------|------|
| Site name, Slack, email, map | `src/lib/site.ts` |
| AO schedule | `src/content/aos.ts` |
| Leadership | `src/content/leadership.ts` |
| Backblasts / pre-blasts | `src/content/backblasts.ts` |
| Brand images | `public/brand/` |

## Design system (PRD)

- **Background:** The Gloom — charcoal `#1F2937` / deep slate
- **Accent:** F3 Red `#DC2626`
- **Text:** Off-white body, white headers
- **Fonts:** Montserrat (display), Inter (body)
- **Mobile-first** large CTAs for 5 AM parking-lot use

## Deploy

Connect the GitHub repo to Vercel and set domain `f3lincoln.com`.
