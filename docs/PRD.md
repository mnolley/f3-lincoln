# Product Requirements Document: F3 Lincoln

Source of truth for the f3lincoln.com build. See also regional references: F3 Nation, Omaha, St. Louis, Nashville, etc.

## 1.0 Executive Summary

- **Product:** Custom responsive web app for F3 Lincoln
- **Domain:** f3lincoln.com
- **Objective:** Attract FNGs, show schedules, archive Backblasts, list leadership
- **Audience:** Local men, current Pax, Downrange visitors

## 2.0 Tech Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Hosting: Vercel
- Source: GitHub (`mnolley/f3-lincoln`)
- Content: typed TS modules under `src/content/` (MDX/CMS later)

## 3.0 Design System

- **Gloom backgrounds:** `#1F2937`, deeper slate/black panels
- **Accent:** F3 Red `#DC2626`
- **Text:** Off-white body, white headers
- **Type:** Montserrat (headers), Inter (body)
- **UX:** Mobile-first, large touch targets, high contrast, no gym-stock polish

## 4.0 Pages

| Route | Purpose |
|-------|---------|
| `/` | Hero, 3 Fs, 5 principles, Start Here CTA |
| `/new` | FNG guide, disclaimer, contact intake |
| `/locations` | AO grid/table + Slack Q-signup CTA |
| `/leadership` | Directory; roles are people not workout styles |
| `/backblasts` | Pre-blast + Backblast feed |
| `/backblasts/[id]` | Full backblast detail |

## 5.0 Data models

See `src/lib/types.ts` for Preblast, Backblast, Leader, AreaOfOperation.

## 6.0 Integrations

- Schedule is read-only; Q claims via Slack/Paxminer
- Optional future: Slack webhook on publish
