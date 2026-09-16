import { useMemo, useState } from 'react'
import { STATUSES, STAGES } from '../data/mockData.js'
import { StatusBadge, StageBadge, NextAction } from './Shared.jsx'
import { formatDate } from '../lib/cadence.js'

export default function LeadsTab({ leads, onSelect, today }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [stageFilter, setStageFilter] = useState('All')
  const [sortKey, setSortKey] = useState('next')

  const filtered = useMemo(() => {
    let rows = leads.filter((l) => {
      const matchesQuery =
        query.trim() === '' ||
        l.handle.toLowerCase().includes(query.toLowerCase()) ||
        l.displayName.toLowerCase().includes(query.toLowerCase()) ||
        l.niche.toLowerCase().includes(query.toLowerCase()) ||
        l.client.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = statusFilter === 'All' || l.status === statusFilter
      const matchesStage = stageFilter === 'All' || l.stage === stageFilter
      return matchesQuery && matchesStatus && matchesStage
    })
    rows = [...rows].sort((a, b) => {
      if (sortKey === 'next') {
        if (!a.nextActionDate) return 1
        if (!b.nextActionDate) return -1
        return a.nextActionDate.localeCompare(b.nextActionDate)
      }
      if (sortKey === 'recent') {
        return b.lastInteractionDate.localeCompare(a.lastInteractionDate)
      }
      if (sortKey === 'handle') {
        return a.handle.localeCompare(b.handle)
      }
      return 0
    })
    return rows
  }, [leads, query, statusFilter, stageFilter, sortKey])

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search handle, name, niche, client…"
          className="w-64 rounded-lg border border-ink-700/15 bg-white px-3.5 py-2 text-sm outline-none focus:border-signal focus:ring-2 focus:ring-signal/20"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-ink-700/15 bg-white px-3 py-2 text-sm outline-none focus:border-signal"
        >
          <option>All</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="rounded-lg border border-ink-700/15 bg-white px-3 py-2 text-sm outline-none focus:border-signal"
        >
          <option>All</option>
          {STAGES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="ml-auto rounded-lg border border-ink-700/15 bg-white px-3 py-2 text-sm outline-none focus:border-signal"
        >
          <option value="next">Sort: next action</option>
          <option value="recent">Sort: most recent</option>
          <option value="handle">Sort: handle A–Z</option>
        </select>
        <span className="font-mono text-xs text-ink-700/50">{filtered.length} of {leads.length}</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-700/10 bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-paper-300 bg-paper-100 text-left text-xs text-ink-700/60">
              <th className="px-4 py-3 font-medium">Lead</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">Last interaction</th>
              <th className="px-4 py-3 font-medium">Next action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr
                key={l.id}
                onClick={() => onSelect(l)}
                className="cursor-pointer border-b border-paper-200 last:border-0 hover:bg-paper-100"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-ink-950">{l.displayName}</p>
                  <p className="font-mono text-xs text-ink-700/60">@{l.handle} · {l.niche}</p>
                </td>
                <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                <td className="px-4 py-3"><StageBadge stage={l.stage} /></td>
                <td className="px-4 py-3 font-mono text-xs text-ink-700/70">{formatDate(l.lastInteractionDate)}</td>
                <td className="px-4 py-3"><NextAction lead={l} today={today} /></td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-ink-700/50">
                  No leads match these filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
