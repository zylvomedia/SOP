import { useEffect, useState } from 'react'
import { Users, KanbanSquare, BarChart3, BookOpen, RotateCcw } from 'lucide-react'
import { leads as seedLeads } from './data/mockData.js'
import { loadLeads, saveLeads, clearLeads } from './lib/storage.js'
import LeadsTab from './components/LeadsTab.jsx'
import PipelineTab from './components/PipelineTab.jsx'
import AnalyticsTab from './components/AnalyticsTab.jsx'
import SopTab from './components/SopTab.jsx'
import ImportModal from './components/ImportModal.jsx'
import AddLeadModal from './components/AddLeadModal.jsx'
import { LeadDrawer } from './components/Shared.jsx'
import { formatDate } from './lib/cadence.js'

const NAV = [
  { key: 'leads', label: 'Leads', icon: Users },
  { key: 'pipeline', label: 'Pipeline', icon: KanbanSquare },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'sop', label: 'SOP', icon: BookOpen },
]

const TITLES = {
  leads: { title: 'Leads', sub: 'Every lead in this workspace, with status, stage, and next action.' },
  pipeline: { title: 'Pipeline', sub: 'Where every lead sits in the outreach ladder, at a glance.' },
  analytics: { title: 'Analytics', sub: 'Reply rate, pipeline health, and where leads are coming from.' },
  sop: { title: 'SOP', sub: 'The playbook this pipeline runs on.' },
}

const today = new Date().toISOString().slice(0, 10)

export default function App() {
  const [tab, setTab] = useState('leads')
  const [leads, setLeads] = useState(() => loadLeads(seedLeads))
  const [selected, setSelected] = useState(null)
  const [importOpen, setImportOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    saveLeads(leads)
  }, [leads])

  function handleImport(newLeads) {
    setLeads((prev) => [...newLeads, ...prev])
  }

  function handleAddLead(lead) {
    setLeads((prev) => [lead, ...prev])
  }

  function handleUpdateMessages(id, messages) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, messages } : l)))
    setSelected((s) => (s?.id === id ? { ...s, messages } : s))
  }

  function handleDelete(id) {
    setLeads((prev) => prev.filter((l) => l.id !== id))
    setSelected((s) => (s?.id === id ? null : s))
  }

  function handleResetSample() {
    if (!confirm('Reset to the original sample data? This clears any leads you\'ve imported or edited in this browser.')) return
    clearLeads()
    setLeads(seedLeads)
    setSelected(null)
  }

  return (
    <div className="flex h-screen bg-canvas">
      <aside className="flex w-60 shrink-0 flex-col border-r border-ink-100 bg-white">
        <div className="px-5 pt-6 pb-5">
          <p className="text-xl font-bold tracking-tight text-ink-950">Zylvo</p>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-ink-400">Outreach CRM</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((n) => {
            const Icon = n.icon
            const active = tab === n.key
            return (
              <button
                key={n.key}
                onClick={() => setTab(n.key)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  active ? 'bg-blue text-white shadow-card' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-950'
                }`}
              >
                <Icon size={16} strokeWidth={2.25} />
                {n.label}
              </button>
            )
          })}
        </nav>
        <div className="space-y-2 border-t border-ink-100 px-5 py-4">
          <p className="text-[11px] text-ink-400">Today · {formatDate(today)}</p>
          <button
            onClick={handleResetSample}
            className="flex items-center gap-1.5 text-[11px] font-medium text-ink-400 hover:text-blue"
          >
            <RotateCcw size={12} /> Reset sample data
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">
          <div className="mb-7">
            <h1 className="text-3xl font-bold tracking-tight text-ink-950">{TITLES[tab].title}</h1>
            <p className="mt-1 text-sm text-ink-600">{TITLES[tab].sub}</p>
          </div>

          {tab === 'leads' && (
            <LeadsTab
              leads={leads}
              onSelect={setSelected}
              onDelete={handleDelete}
              onOpenImport={() => setImportOpen(true)}
              onOpenAdd={() => setAddOpen(true)}
              today={today}
            />
          )}
          {tab === 'pipeline' && <PipelineTab leads={leads} onSelect={setSelected} today={today} />}
          {tab === 'analytics' && <AnalyticsTab leads={leads} today={today} />}
          {tab === 'sop' && <SopTab />}
        </div>
      </main>

      {selected ? (
        <LeadDrawer lead={selected} onClose={() => setSelected(null)} onDelete={handleDelete} onUpdateMessages={handleUpdateMessages} today={today} />
      ) : null}
      {importOpen ? (
        <ImportModal existingLeads={leads} onImport={handleImport} onClose={() => setImportOpen(false)} today={today} />
      ) : null}
      {addOpen ? (
        <AddLeadModal existingLeads={leads} onAdd={handleAddLead} onClose={() => setAddOpen(false)} today={today} />
      ) : null}
    </div>
  )
}
