# Zylvo Outreach CRM

An internal CRM for running and tracking cold Instagram DM outreach to Meta ads media buyers, built around Zylvo Media's Cold DM Outreach SOP.

## What's in it

- **Leads** — every lead in a searchable, filterable table: handle, company, niche, status, stage, est. value, and the date the next touch is due. Select-all and bulk-delete leads, or manage them one at a time.
- **Pipeline** — a kanban view of the outreach ladder (Initial Outreach → Follow-up 1–5 → Sequence Complete).
- **Analytics** — reply rate, calls booked, closed-won, overdue/due-today counts, stage distribution, status breakdown, and leads by niche.
- **SOP** — a living copy of the Cold DM Outreach SOP (opener → proof → ask → five-touch follow-up ladder), with copyable message templates.
- **Notes** — a workspace-level notes & media page for anything that isn't tied to one specific lead.
- **Add / Import leads** — add a lead manually, or bulk-import from a CSV with flexible column mapping.
- **Per-lead detail drawer** — full message sequence (editable — rewrite any follow-up), a running note log, and media attachments (screenshots, files) per lead.

The app ships pre-loaded with 20 mock leads across every status and stage so it's usable immediately — real data (added, imported, or edited) is saved to the browser's local storage and persists across visits.

## Architecture

This is a **single self-contained HTML file** (`index.html`) — vanilla JavaScript, no framework, no build-time dependencies. It's wrapped in a minimal Vite project only so `npm run dev` / `npm run build` work as a convenience; Vite performs no bundling here beyond passing the file through (there's nothing to bundle — everything is inline).

```bash
npm install
npm run dev       # local dev server
npm run build     # -> dist/index.html (same file, minified)
npm run preview   # serve the production build locally
```

You can also just open `index.html` directly in a browser — no server required.

### Why single-file vanilla JS

No dependencies to break, no build step required to deploy, trivially portable (email it, drop it on any static host, open it locally), and small (under 100KB). The tradeoff: no component reuse across files, so `index.html` is long — but it's organized into clear sections (styles, icons, data, state, render functions) with `render()` doing a full re-render off a single `state` object whenever anything changes.

### Data & persistence

- **Leads** persist to `localStorage` under `zylvo_crm_leads_v2`.
- **Workspace notes/media** persist under `zylvo_crm_notes_v1`.
- This means data is **per-browser, per-device** — not shared across your team yet. For multi-user shared access, this would need a real backend (e.g. Supabase or Postgres) behind it.
- Media (screenshots/files) are stored as base64 data URLs in localStorage, which has a practical ceiling around 5–10MB total — fine for a handful of attachments, not a real file-storage system.

## The SOP

The full outreach playbook this CRM is built around lives in the app's **SOP** tab, sourced from the `SOP_SECTIONS` constant near the top of the inline script. Update it there as templates get tested and reply-rate benchmarks change.

## Deployment

Deployed via Vercel, connected to this repo's `main` branch — every push auto-redeploys. No build configuration needed beyond the default (`npm run build`, output `dist/`).
