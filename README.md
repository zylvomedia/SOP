# Zylvo Outreach CRM

An internal CRM for running and tracking cold Instagram DM outreach to Meta ads media buyers, built around Zylvo Media's [Cold DM Outreach SOP](#the-sop).

## What's in it

- **Leads** — every lead in one searchable, filterable table: handle, niche, status, stage, and the date the next touch is due.
- **Pipeline** — a kanban view of the outreach ladder (Initial Outreach → Follow-up 1–5 → Sequence Complete), so you can see at a glance where every lead is sitting.
- **Analytics** — reply rate, calls booked, closed-won, overdue/due-today counts, stage distribution, status breakdown, and leads by niche.
- **SOP** — a living copy of the Cold DM Outreach SOP (opener → proof → ask → five-touch follow-up ladder), with copyable message templates, so the playbook lives next to the leads it drives.

Every lead record includes the full message sequence (opener through Follow-up 5), following the exact template ladder in the SOP, and the next-action date is computed automatically from the cadence rules (Not Responded → scheduled follow-up; Closed / Rejected / Dead End → no further action).

The app ships pre-loaded with 20 mock leads across every status and stage so you can see it working immediately — swap in real data whenever you're ready.

## Running it locally

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # serve the production build locally
```

## Stack

React 18 + Vite + Tailwind CSS, with Recharts for the analytics charts. No backend yet — all data lives in `src/data/mockData.js`. This is intended as the front end for a real CRM: swap `mockData.js` for calls to whatever database/API backs it once you're ready to persist real leads, and it's ready to deploy as a static site (Vercel, Netlify, GitHub Pages, etc.).

## Project structure

```
src/
  data/
    mockData.js     # mock leads + follow-up cadence application
    sop.js          # SOP content, structured for the SOP tab
  lib/
    cadence.js       # follow-up cadence + next-action-date logic
  components/
    LeadsTab.jsx
    PipelineTab.jsx
    AnalyticsTab.jsx
    SopTab.jsx
    Shared.jsx        # badges + lead detail drawer
  App.jsx              # sidebar nav + tab routing
```

## The SOP

The full outreach playbook this CRM is built around — opener, proof line, the Loom ask, and the five-touch follow-up ladder — lives in the app's **SOP** tab, sourced from `src/data/sop.js`. Update that file as templates get tested and reply-rate benchmarks change.
