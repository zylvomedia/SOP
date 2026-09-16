import { Clock, MessageCircle, Phone, CheckCircle2, XCircle, MinusCircle, AtSign, ExternalLink, X } from 'lucide-react'
import { formatDate, daysBetween } from '../lib/cadence.js'

export const STATUS_META = {
  'Not Responded': { icon: Clock, classes: 'bg-gray-light text-gray' },
  'Responded': { icon: MessageCircle, classes: 'bg-blue-light text-blue-dark' },
  'Scheduled for Call': { icon: Phone, classes: 'bg-orange-light text-orange' },
  'Closed': { icon: CheckCircle2, classes: 'bg-green-light text-green' },
  'Rejected': { icon: XCircle, classes: 'bg-red-light text-red' },
  'Dead End': { icon: MinusCircle, classes: 'bg-ink-100 text-ink-600' },
}

export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META['Not Responded']
  const Icon = meta.icon
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${meta.classes}`}>
      <Icon size={13} strokeWidth={2.5} />
      {status}
    </span>
  )
}

export function StageBadge({ stage }) {
  return (
    <span className="inline-flex items-center rounded-full border border-ink-200 bg-white px-2.5 py-1 text-xs font-medium text-ink-800 whitespace-nowrap">
      {stage}
    </span>
  )
}

export function LeadAvatar({ seed }) {
  const colors = ['#0071E3', '#AF52DE', '#FF9500', '#2FA84F', '#FF375F', '#5AC8FA']
  const idx = Math.abs([...String(seed)].reduce((a, c) => a + c.charCodeAt(0), 0)) % colors.length
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
      style={{ background: colors[idx] }}
    >
      <AtSign size={16} strokeWidth={2.2} />
    </div>
  )
}

export function EstValue({ value }) {
  if (value == null) return <span className="text-sm text-ink-400">—</span>
  return <span className="text-sm font-semibold text-green">${value.toLocaleString()}</span>
}

export function NextAction({ lead, today }) {
  if (!lead.nextActionDate) {
    return <span className="text-xs text-ink-400">{lead.dateTrackerLabel}</span>
  }
  const delta = daysBetween(today, lead.nextActionDate)
  let tone = 'text-ink-600'
  let text = `Due ${formatDate(lead.nextActionDate)}`
  if (delta < 0) {
    tone = 'text-red font-semibold'
    text = `Overdue ${Math.abs(delta)}d — ${formatDate(lead.nextActionDate)}`
  } else if (delta === 0) {
    tone = 'text-orange font-semibold'
    text = 'Due today'
  } else if (delta <= 2) {
    tone = 'text-blue font-medium'
  }
  return <span className={`text-xs ${tone}`}>{text}</span>
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

export function LeadDrawer({ lead, onClose, onDelete, today }) {
  if (!lead) return null
  const hasMessages = Object.values(lead.messages || {}).some((v) => v && v.trim())
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-ink-950/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-lg flex-col overflow-y-auto bg-surface shadow-pop">
        <div className="flex items-start justify-between border-b border-ink-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <LeadAvatar seed={lead.handle} />
            <div>
              <h2 className="text-xl font-semibold text-ink-950">{lead.displayName}</h2>
              <p className="text-sm text-ink-600">@{lead.handle} · {lead.niche}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-ink-600 hover:bg-ink-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-ink-100 px-6 py-4">
          <StatusBadge status={lead.status} />
          <StageBadge stage={lead.stage} />
          <NextAction lead={lead} today={today} />
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-ink-100 px-6 py-4 text-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Company</p>
            <p className="mt-0.5 text-ink-950">{lead.client}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Est. value</p>
            <p className="mt-0.5"><EstValue value={lead.estValue} /></p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Last interaction</p>
            <p className="mt-0.5 text-ink-950">{formatDate(lead.lastInteractionDate)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Source</p>
            <p className="mt-0.5 text-ink-950">{lead.source || '—'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Profile</p>
            <a href={lead.igUrl} target="_blank" rel="noreferrer" className="mt-0.5 inline-flex items-center gap-1 text-blue hover:underline">
              instagram.com/{lead.handle} <ExternalLink size={13} />
            </a>
          </div>
          {lead.notes ? (
            <div className="col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Notes</p>
              <p className="mt-0.5 text-ink-950">{lead.notes}</p>
            </div>
          ) : null}
        </div>

        <div className="px-6 py-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">Message sequence</p>
          {hasMessages ? (
            <div className="space-y-3">
              {MESSAGE_ROWS.map((row) => (
                lead.messages[row.key] ? (
                  <div key={row.key} className="rounded-xl border border-ink-100 bg-canvas px-3.5 py-3">
                    <p className="mb-1 text-[11px] font-medium text-ink-400">{row.label}</p>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-ink-950">{lead.messages[row.key]}</p>
                  </div>
                ) : null
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-ink-200 px-3.5 py-4 text-sm text-ink-400">
              No message sequence recorded for this lead yet.
            </p>
          )}
        </div>

        <div className="mt-auto flex justify-end border-t border-ink-100 px-6 py-4">
          <button
            onClick={() => onDelete(lead.id)}
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-red hover:bg-red-light"
          >
            Delete lead
          </button>
        </div>
      </div>
    </div>
  )
}
