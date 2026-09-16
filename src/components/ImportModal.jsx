import { useState } from 'react'
import Papa from 'papaparse'
import { Upload, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import { IMPORT_FIELDS, guessMapping, rowToLead } from '../lib/csvImport.js'
import { nextLeadId } from '../data/mockData.js'

const STEPS = { PASTE: 'paste', MAP: 'map', DONE: 'done' }

export default function ImportModal({ existingLeads, onImport, onClose, today }) {
  const [step, setStep] = useState(STEPS.PASTE)
  const [error, setError] = useState('')
  const [headers, setHeaders] = useState([])
  const [rows, setRows] = useState([])
  const [mapping, setMapping] = useState({})
  const [importedCount, setImportedCount] = useState(0)
  const [text, setText] = useState('')

  function parseText(csvText) {
    const result = Papa.parse(csvText, { header: true, skipEmptyLines: true })
    if (result.errors?.length) {
      setError('Could not parse that as CSV — check for stray commas or unmatched quotes.')
      return
    }
    if (!result.data.length) {
      setError('No rows found.')
      return
    }
    setError('')
    setHeaders(result.meta.fields || [])
    setRows(result.data)
    setMapping(guessMapping(result.meta.fields || []))
    setStep(STEPS.MAP)
  }

  function handleFile(file) {
    const reader = new FileReader()
    reader.onload = (e) => parseText(String(e.target.result))
    reader.readAsText(file)
  }

  function confirmImport() {
    const idCounter = { current: nextLeadId(existingLeads) }
    const idGenerator = () => {
      const id = idCounter.current
      const num = parseInt(id.split('-')[1], 10) + 1
      idCounter.current = `lead-${String(num).padStart(3, '0')}`
      return id
    }
    const newLeads = rows
      .map((row) => rowToLead(row, mapping, { idGenerator, today }))
      .filter(Boolean)
    onImport(newLeads)
    setImportedCount(newLeads.length)
    setStep(STEPS.DONE)
  }

  const requiredMapped = mapping.handle && mapping.handle.length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-surface shadow-pop">
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-ink-950">Import leads</h2>
            <p className="text-sm text-ink-600">From a CSV export — any column names, we'll help you map them.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-ink-600 hover:bg-ink-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === STEPS.PASTE && (
            <div className="space-y-4">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 bg-canvas px-6 py-10 text-center transition hover:border-blue hover:bg-blue-light">
                <Upload size={22} className="text-blue" />
                <span className="text-sm font-medium text-ink-950">Click to upload a .csv file</span>
                <span className="text-xs text-ink-600">or paste rows in the box below</span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </label>

              <div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={'handle,name,niche,status,stage,last_interaction_date\nmaria.ads,Maria,Home services,Not Responded,Follow-up 2,2026-09-10'}
                  rows={6}
                  className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-3 font-mono text-xs text-ink-800 outline-none focus:border-blue focus:ring-2 focus:ring-blue/15"
                />
                <button
                  onClick={() => text.trim() && parseText(text)}
                  disabled={!text.trim()}
                  className="mt-2 rounded-lg bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Parse pasted rows
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-light px-3.5 py-2.5 text-sm text-red">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
            </div>
          )}

          {step === STEPS.MAP && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 rounded-lg bg-blue-light px-3.5 py-2.5 text-sm text-blue-dark">
                <FileText size={16} /> Found {rows.length} row{rows.length === 1 ? '' : 's'} with {headers.length} columns. Match your columns to CRM fields below.
              </div>

              <div className="space-y-2.5">
                {IMPORT_FIELDS.map((field) => (
                  <div key={field.key} className="flex items-center gap-3">
                    <div className="w-44 shrink-0 text-sm text-ink-800">
                      {field.label}
                      {field.required && <span className="ml-1 text-red">*</span>}
                    </div>
                    <select
                      value={mapping[field.key] || ''}
                      onChange={(e) => setMapping((m) => ({ ...m, [field.key]: e.target.value }))}
                      className="flex-1 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue"
                    >
                      <option value="">— Don't import —</option>
                      {headers.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {!requiredMapped && (
                <div className="flex items-center gap-2 rounded-lg bg-orange-light px-3.5 py-2.5 text-sm text-orange">
                  <AlertCircle size={16} /> Map an Instagram handle column to continue — it's the only required field.
                </div>
              )}

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-600">Preview (first 3 rows)</p>
                <div className="overflow-x-auto rounded-lg border border-ink-100">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="bg-canvas text-left text-ink-600">
                        {IMPORT_FIELDS.map((f) => (
                          <th key={f.key} className="px-3 py-2 font-medium">{f.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.slice(0, 3).map((row, i) => (
                        <tr key={i} className="border-t border-ink-100">
                          {IMPORT_FIELDS.map((f) => (
                            <td key={f.key} className="px-3 py-2 text-ink-800">{mapping[f.key] ? row[mapping[f.key]] : '—'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {step === STEPS.DONE && (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <CheckCircle2 size={40} className="text-green" />
              <p className="text-lg font-semibold text-ink-950">Imported {importedCount} lead{importedCount === 1 ? '' : 's'}</p>
              <p className="text-sm text-ink-600">They're saved to this browser and show up in Leads and Pipeline now.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-ink-100 px-6 py-4">
          {step === STEPS.MAP && (
            <>
              <button onClick={() => setStep(STEPS.PASTE)} className="rounded-lg px-4 py-2 text-sm font-medium text-ink-800 hover:bg-ink-100">
                Back
              </button>
              <button
                onClick={confirmImport}
                disabled={!requiredMapped}
                className="rounded-lg bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                Import {rows.length} lead{rows.length === 1 ? '' : 's'}
              </button>
            </>
          )}
          {step === STEPS.DONE && (
            <button onClick={onClose} className="rounded-lg bg-blue px-4 py-2 text-sm font-medium text-white hover:bg-blue-dark">
              Done
            </button>
          )}
          {step === STEPS.PASTE && (
            <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-ink-800 hover:bg-ink-100">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
