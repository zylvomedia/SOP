import { useState } from 'react'
import { X } from 'lucide-react'
import { STATUSES, STAGES, nextLeadId, makeBlankMessages } from '../data/mockData.js'
import { computeTracker } from '../lib/cadence.js'

const FIELD_CLASS = 'w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/15'

export default function AddLeadModal({ existingLeads, onAdd, onClose, today }) {
  const [form, setForm] = useState({
    handle: '',
    displayName: '',
    client: '',
    niche: '',
    status: 'Not Responded',
    stage: 'Initial Outreach',
    lastInteractionDate: today,
    estValue: '',
    notes: '',
  })
  const [error, setError] = useState('')

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function submit() {
    const handle = form.handle.trim().replace(/^@/, '')
    if (!handle) {
      setError('An Instagram handle is required.')
      return
    }
    const tracker = computeTracker(form.status, form.stage, form.lastInteractionDate || today)
    const lead = {
      id: nextLeadId(existingLeads),
      handle,
      displayName: form.displayName.trim() || handle,
      niche: form.niche.trim() || 'Uncategorized',
      client: form.client.trim() || '—',
      igUrl: `https://instagram.com/${handle}`,
      source: 'Added manually',
      status: form.status,
      stage: form.stage,
      lastInteractionDate: form.lastInteractionDate || today,
      nextActionDate: tracker.nextActionDate,
      dateTrackerLabel: tracker.label,
      notes: form.notes.trim(),
      estValue: form.estValue ? Math.round(parseFloat(form.estValue)) : null,
      messages: makeBlankMessages(),
    }
    onAdd(lead)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-surface shadow-pop">
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-ink-950">Add a lead</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-ink-600 hover:bg-ink-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-3.5 overflow-y-auto px-6 py-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-600">Instagram handle *</label>
            <input className={FIELD_CLASS} value={form.handle} onChange={(e) => update('handle', e.target.value)} placeholder="maria.ads" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-600">Name</label>
              <input className={FIELD_CLASS} value={form.displayName} onChange={(e) => update('displayName', e.target.value)} placeholder="Maria" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-600">Company</label>
              <input className={FIELD_CLASS} value={form.client} onChange={(e) => update('client', e.target.value)} placeholder="GreenLeaf Roofing" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-600">Niche</label>
            <input className={FIELD_CLASS} value={form.niche} onChange={(e) => update('niche', e.target.value)} placeholder="Home services" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-600">Status</label>
              <select className={FIELD_CLASS} value={form.status} onChange={(e) => update('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-600">Stage</label>
              <select className={FIELD_CLASS} value={form.stage} onChange={(e) => update('stage', e.target.value)}>
                {STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-600">Last interaction</label>
              <input type="date" className={FIELD_CLASS} value={form.lastInteractionDate} onChange={(e) => update('lastInteractionDate', e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-600">Est. value ($)</label>
              <input type="number" className={FIELD_CLASS} value={form.estValue} onChange={(e) => update('estValue', e.target.value)} placeholder="3200" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-600">Notes</label>
            <textarea className={FIELD_CLASS} rows={2} value={form.notes} onChange={(e) => update('notes', e.target.value)} />
          </div>

          {error && <p className="text-sm text-red">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-ink-100 px-6 py-4">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-ink-800 hover:bg-ink-100">Cancel</button>
          <button onClick={submit} className="rounded-lg bg-blue px-4 py-2 text-sm font-medium text-white hover:bg-blue-dark">Add lead</button>
        </div>
      </div>
    </div>
  )
}
