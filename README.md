# RESQ AI — Frontend (Vite SPA)

Pure React + Vite + React Router SPA. No SSR, no Nitro, no TanStack Start.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # outputs dist/
npm run preview
```

## Deploy to Vercel

- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`

`vercel.json` includes a SPA fallback so client-side routes refresh correctly.
