import { useMemo } from 'react'
import { STAGES } from '../data/mockData.js'
import { StatusBadge, NextAction, LeadAvatar, EstValue } from './Shared.jsx'

const STAGE_HINT = {
  'Initial Outreach': 'Opener + T2–T4 just sent',
  'Follow-up 1': 'Day 2 · interrupt sent',
  'Follow-up 2': 'Day 5 · light bump sent',
  'Follow-up 3': 'Day 8 · soft check-in sent',
  'Follow-up 4': 'Day 12 · deadline sent',
  'Follow-up 5': 'Day 16 · loop closed',
  'Sequence Complete': 'Replied, closed, or done',
}

const STAGE_DOT = {
  'Initial Outreach': 'bg-blue',
  'Follow-up 1': 'bg-purple',
  'Follow-up 2': 'bg-orange',
  'Follow-up 3': 'bg-pink',
  'Follow-up 4': 'bg-red',
  'Follow-up 5': 'bg-ink-600',
  'Sequence Complete': 'bg-green',
}

export default function PipelineTab({ leads, onSelect, today }) {
  const grouped = useMemo(() => {
    const map = Object.fromEntries(STAGES.map((s) => [s, []]))
    leads.forEach((l) => map[l.stage]?.push(l))
    return map
  }, [leads])

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STAGES.map((stage) => {
        const items = grouped[stage] || []
        return (
          <div key={stage} className="flex w-72 shrink-0 flex-col rounded-2xl border border-ink-100 bg-white shadow-card">
            <div className="border-b border-ink-100 px-4 py-3.5">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${STAGE_DOT[stage]}`} />
                <p className="text-sm font-semibold text-ink-950">{stage}</p>
                <span className="ml-auto rounded-full bg-canvas px-2 py-0.5 text-[11px] font-medium text-ink-600">{items.length}</span>
              </div>
              <p className="mt-1 text-[11px] text-ink-400">{STAGE_HINT[stage]}</p>
            </div>
            <div className="flex-1 space-y-2.5 bg-canvas/50 p-3">
              {items.length === 0 ? (
                <p className="px-1 py-6 text-center text-xs text-ink-400">No leads here</p>
              ) : (
                items.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => onSelect(l)}
                    className="block w-full rounded-xl border border-ink-100 bg-white px-3.5 py-3 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-pop"
                  >
                    <div className="flex items-start gap-2.5">
                      <LeadAvatar seed={l.handle} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink-950">{l.displayName}</p>
                        <p className="truncate text-[11px] text-ink-600">@{l.handle}</p>
                      </div>
                    </div>
                    <p className="mt-2 truncate text-[11px] text-ink-600">{l.niche} · {l.client}</p>
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <StatusBadge status={l.status} />
                      <EstValue value={l.estValue} />
                    </div>
                    <div className="mt-2">
                      <NextAction lead={l} today={today} />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
