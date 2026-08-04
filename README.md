# F3 Lincoln

Public website for the **F3 Lincoln** men’s workout group (Fitness · Fellowship · Faith).

## Locations

| | |
|--|--|
| **Local** | `C:\Users\Mark\Projects\f3-lincoln` |
| **GitHub** | https://github.com/mnolley/f3-lincoln |

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Getting started

```bash
cd C:\Users\Mark\Projects\f3-lincoln
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
f3-lincoln/
├── public/
│   ├── brand/          # Logos and F3 brand images
│   └── images/         # General site images
├── src/
│   ├── app/            # Routes (pages)
│   │   ├── page.tsx           # Home
│   │   ├── about/
│   │   ├── workouts/          # AO list
│   │   ├── schedule/
│   │   ├── join/
│   │   ├── contact/
│   │   └── backblasts/
│   ├── components/     # Shared UI (Header, Footer, PageShell)
│   ├── content/        # Static copy (principles, join steps)
│   └── lib/            # Site config & AO data (site.ts)
├── package.json
└── README.md
```

## Edit content

| What | Where |
|------|--------|
| Site name, mission, contact links | `src/lib/site.ts` |
| Workout AOs / schedule data | `src/lib/site.ts` (`workouts` array) |
| Principles & join steps | `src/content/copy.ts` |
| Brand logos | `public/brand/` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |

## Related

- Backblast app (existing): `C:\Users\Mark\Projects\Backblast`
- Brand assets source: `C:\Users\Mark\Documents\F3 Web Content`
