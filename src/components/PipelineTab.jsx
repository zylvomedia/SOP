import { useMemo } from 'react'
import { STAGES } from '../data/mockData.js'
import { StatusBadge, NextAction } from './Shared.jsx'

const STAGE_HINT = {
  'Initial Outreach': 'Opener + T2–T4 just sent',
  'Follow-up 1': 'Day 2 · interrupt sent',
  'Follow-up 2': 'Day 5 · light bump sent',
  'Follow-up 3': 'Day 8 · soft check-in sent',
  'Follow-up 4': 'Day 12 · deadline sent',
  'Follow-up 5': 'Day 16 · loop closed',
  'Sequence Complete': 'Replied, closed, or done',
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
          <div key={stage} className="flex w-72 shrink-0 flex-col rounded-xl border border-ink-700/10 bg-paper-200/70">
            <div className="border-b border-ink-700/10 px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs font-semibold text-ink-900">{stage}</p>
                <span className="rounded-full bg-white px-2 py-0.5 font-mono text-[11px] text-ink-700/60">{items.length}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-ink-700/50">{STAGE_HINT[stage]}</p>
            </div>
            <div className="flex-1 space-y-2.5 p-3">
              {items.length === 0 ? (
                <p className="px-1 py-6 text-center text-xs text-ink-700/40">No leads here</p>
              ) : (
                items.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => onSelect(l)}
                    className="block w-full rounded-lg border border-ink-700/10 bg-white px-3 py-2.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-ink-950">{l.displayName}</p>
                        <p className="font-mono text-[11px] text-ink-700/55">@{l.handle}</p>
                      </div>
                    </div>
                    <p className="mt-1.5 text-[11px] text-ink-700/60">{l.niche}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <StatusBadge status={l.status} />
                    </div>
                    <div className="mt-1.5">
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
