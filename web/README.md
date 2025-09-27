CoinFlip Insights — Landing Page

Stack
- Next.js 15 (App Router), TypeScript
- Tailwind via `@import "tailwindcss"` and custom utilities in `src/app/globals.css`

Features
- Hero, How It Works, Quick Guide, FAQ, Footer sections
- Free daily Scan with 24h lock (localStorage) and countdown
- CoinFlip modes with mutual 24h lock and live patch timers (1h13m, 1h16m)
- Geo detection API (`/api/geo`): uses Vercel geo headers in prod, ipapi.co in dev

Configure
- Access Gateway link is currently a placeholder; provide the external URL to wire it.

Dev
```bash
npm install
npm run dev
```

Build
```bash
npm run build
npm start
```

Deploy
- Push to GitHub and import the repo in Vercel. No env vars required.
