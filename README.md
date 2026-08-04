# F3 Lincoln

Regional website for **F3 Lincoln** (Fitness · Fellowship · Faith) — built for [f3lincoln.com](https://f3lincoln.com).

| | |
|--|--|
| **Local** | `C:\Users\Mark\Projects\f3-lincoln` |
| **GitHub** | https://github.com/mnolley/f3-lincoln |
| **PRD** | [docs/PRD.md](./docs/PRD.md) |

## Stack

Next.js · TypeScript · Tailwind CSS · Vercel-ready

## Getting started

```bash
cd C:\Users\Mark\Projects\f3-lincoln
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Site map

| Path | Page |
|------|------|
| `/` | Home |
| `/new` | New Here (FNG) |
| `/locations` | Locations & schedule |
| `/leadership` | Leadership directory |
| `/backblasts` | Pre-blasts & backblasts |
| `/backblasts/[id]` | Backblast detail |

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
