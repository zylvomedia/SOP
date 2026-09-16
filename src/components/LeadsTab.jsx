import { useMemo, useState } from 'react'
import { Upload, Eye, Trash2, Search, Plus } from 'lucide-react'
import { STATUSES, STAGES } from '../data/mockData.js'
import { StatusBadge, StageBadge, NextAction, LeadAvatar, EstValue } from './Shared.jsx'
import { formatDate } from '../lib/cadence.js'

export default function LeadsTab({ leads, onSelect, onDelete, onOpenImport, onOpenAdd, today }) {
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
      if (sortKey === 'recent') return b.lastInteractionDate.localeCompare(a.lastInteractionDate)
      if (sortKey === 'handle') return a.handle.localeCompare(b.handle)
      if (sortKey === 'value') return (b.estValue || 0) - (a.estValue || 0)
      return 0
    })
    return rows
  }, [leads, query, statusFilter, stageFilter, sortKey])

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search handle, name, niche, company…"
            className="w-64 rounded-lg border border-ink-200 bg-white py-2 pl-9 pr-3.5 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/15"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue"
        >
          <option>All</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue"
        >
          <option>All</option>
          {STAGES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue"
        >
          <option value="next">Sort: next action</option>
          <option value="recent">Sort: most recent</option>
          <option value="value">Sort: est. value</option>
          <option value="handle">Sort: handle A–Z</option>
        </select>
        <span className="text-xs text-ink-400">{filtered.length} of {leads.length}</span>

        <button
          onClick={onOpenAdd}
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-800 transition hover:bg-ink-100"
        >
          <Plus size={15} /> Add lead
        </button>
        <button
          onClick={onOpenImport}
          className="flex items-center gap-1.5 rounded-lg bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark"
        >
          <Upload size={15} /> Import leads
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-surface shadow-card">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-ink-100 bg-canvas text-left text-xs text-ink-600">
              <th className="px-4 py-3 font-medium">Lead</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">Next action</th>
              <th className="px-4 py-3 font-medium">Est. value</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-b border-ink-100 last:border-0 hover:bg-canvas/60">
                <td className="cursor-pointer px-4 py-3" onClick={() => onSelect(l)}>
                  <div className="flex items-center gap-3">
                    <LeadAvatar seed={l.handle} />
                    <div>
                      <p className="font-medium text-ink-950">{l.displayName}</p>
                      <p className="text-xs text-ink-600">@{l.handle} · {l.niche}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-800">{l.client}</td>
                <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                <td className="px-4 py-3"><StageBadge stage={l.stage} /></td>
                <td className="px-4 py-3"><NextAction lead={l} today={today} /></td>
                <td className="px-4 py-3"><EstValue value={l.estValue} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onSelect(l)}
                      className="rounded-lg border border-ink-200 p-1.5 text-ink-600 hover:bg-ink-100"
                      aria-label="View lead"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(l.id)}
                      className="rounded-lg border border-ink-200 p-1.5 text-ink-600 hover:bg-red-light hover:text-red"
                      aria-label="Delete lead"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-ink-400">
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
