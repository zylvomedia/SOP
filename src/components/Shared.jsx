import { formatDate, daysBetween } from '../lib/cadence.js'

export const STATUS_STYLE = {
  'Not Responded': 'bg-slate-light text-slate border border-slate/30',
  'Responded': 'bg-moss-light text-moss border border-moss/30',
  'Scheduled for Call': 'bg-signal-dim text-signal border border-signal/30',
  'Closed': 'bg-ink-900 text-paper-100 border border-ink-900',
  'Rejected': 'bg-rust-light text-rust border border-rust/30',
  'Dead End': 'bg-paper-300 text-ink-700 border border-ink-700/20',
}

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${STATUS_STYLE[status] || 'bg-paper-300'}`}>
      {status}
    </span>
  )
}

export function StageBadge({ stage }) {
  return (
    <span className="inline-flex items-center rounded-md border border-ink-700/15 bg-white px-2 py-1 font-mono text-[11px] text-ink-800 whitespace-nowrap">
      {stage}
    </span>
  )
}

export function NextAction({ lead, today }) {
  if (!lead.nextActionDate) {
    return <span className="text-xs text-ink-700/50">{lead.dateTrackerLabel}</span>
  }
  const delta = daysBetween(today, lead.nextActionDate)
  let tone = 'text-ink-700/70'
  let text = `Due ${formatDate(lead.nextActionDate)}`
  if (delta < 0) {
    tone = 'text-rust font-semibold'
    text = `Overdue ${Math.abs(delta)}d — ${formatDate(lead.nextActionDate)}`
  } else if (delta === 0) {
    tone = 'text-amber font-semibold'
    text = `Due today`
  } else if (delta <= 2) {
    tone = 'text-signal font-medium'
  }
  return <span className={`font-mono text-xs ${tone}`}>{text}</span>
}

const MESSAGE_ROWS = [
  { key: 'first_dm', label: 'T1 · Opener (first DM)' },
  { key: 'who_you_are', label: 'T2 · Who you are' },
  { key: 'proof_line', label: 'T3 · Proof line' },
  { key: 'follow_up_1', label: 'T5 · Follow-up 1 (day 2)' },
  { key: 'follow_up_2', label: 'T6 · Follow-up 2 (day 5)' },
  { key: 'follow_up_3', label: 'T7 · Follow-up 3 (day 8)' },
  { key: 'follow_up_4', label: 'T8 · Follow-up 4 (day 12)' },
  { key: 'follow_up_5', label: 'T9 · Follow-up 5 (day 16)' },
]

export function LeadDrawer({ lead, onClose, today }) {
  if (!lead) return null
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-ink-950/40" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-ink-700/10 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-paper-300 px-6 py-5">
          <div>
            <p className="font-mono text-xs text-ink-700/60">@{lead.handle}</p>
            <h2 className="font-display text-2xl text-ink-950">{lead.displayName}</h2>
            <p className="mt-1 text-sm text-ink-700/70">{lead.niche} · {lead.client}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-ink-700/15 px-2.5 py-1 text-sm text-ink-700 hover:bg-paper-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-paper-300 px-6 py-4">
          <StatusBadge status={lead.status} />
          <StageBadge stage={lead.stage} />
          <NextAction lead={lead} today={today} />
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-paper-300 px-6 py-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-700/50">Last interaction</p>
            <p className="mt-0.5 font-mono text-ink-900">{formatDate(lead.lastInteractionDate)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-700/50">Source</p>
            <p className="mt-0.5 text-ink-900">{lead.source || '—'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs uppercase tracking-wide text-ink-700/50">Profile</p>
            <a href={lead.igUrl} target="_blank" rel="noreferrer" className="mt-0.5 block font-mono text-signal hover:underline">
              instagram.com/{lead.handle}
            </a>
          </div>
          {lead.notes ? (
            <div className="col-span-2">
              <p className="text-xs uppercase tracking-wide text-ink-700/50">Notes</p>
              <p className="mt-0.5 text-ink-900">{lead.notes}</p>
            </div>
          ) : null}
        </div>

        <div className="px-6 py-4">
          <p className="mb-3 text-xs uppercase tracking-wide text-ink-700/50">Message sequence</p>
          <div className="space-y-3">
            {MESSAGE_ROWS.map((row) => (
              <div key={row.key} className="rounded-lg border border-paper-300 bg-paper-100 px-3.5 py-3">
                <p className="mb-1 font-mono text-[11px] text-ink-700/60">{row.label}</p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-ink-900">{lead.messages[row.key]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
