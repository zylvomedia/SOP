import { useState } from 'react'
import { leads as mockLeads, TODAY } from './data/mockData.js'
import LeadsTab from './components/LeadsTab.jsx'
import PipelineTab from './components/PipelineTab.jsx'
import AnalyticsTab from './components/AnalyticsTab.jsx'
import SopTab from './components/SopTab.jsx'
import { LeadDrawer } from './components/Shared.jsx'
import { formatDate } from './lib/cadence.js'

const NAV = [
  { key: 'leads', label: 'Leads' },
  { key: 'pipeline', label: 'Pipeline' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'sop', label: 'SOP' },
]

const TITLES = {
  leads: { title: 'Leads', sub: 'Every lead in this workspace, with status, stage, and next action.' },
  pipeline: { title: 'Pipeline', sub: 'Where every lead sits in the outreach ladder, at a glance.' },
  analytics: { title: 'Analytics', sub: 'Reply rate, pipeline health, and where leads are coming from.' },
  sop: { title: 'SOP', sub: 'The playbook this pipeline runs on.' },
}

export default function App() {
  const [tab, setTab] = useState('leads')
  const [leads] = useState(mockLeads)
  const [selected, setSelected] = useState(null)

  return (
    <div className="flex h-screen bg-paper-100">
      <aside className="flex w-60 shrink-0 flex-col bg-ink-950 text-paper-100">
        <div className="px-5 pt-6 pb-5">
          <p className="font-display text-2xl tracking-tight">Zylvo</p>
          <p className="mt-0.5 text-[11px] uppercase tracking-wide text-paper-100/40">Outreach CRM</p>
        </div>
        <nav className="flex-1 px-3">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setTab(n.key)}
              className={`mb-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                tab === n.key ? 'bg-ink-800 text-white' : 'text-paper-100/65 hover:bg-ink-900 hover:text-paper-100'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${tab === n.key ? 'bg-signal-light' : 'bg-paper-100/20'}`} />
              {n.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-white/10 px-5 py-4">
          <p className="font-mono text-[11px] text-paper-100/40">Today · {formatDate(TODAY)}</p>
          <p className="mt-0.5 font-mono text-[11px] text-paper-100/40">v1.0 · Zylvo Media</p>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">
          <div className="mb-7">
            <h1 className="font-display text-3xl text-ink-950">{TITLES[tab].title}</h1>
            <p className="mt-1 text-sm text-ink-700/65">{TITLES[tab].sub}</p>
          </div>

          {tab === 'leads' && <LeadsTab leads={leads} onSelect={setSelected} today={TODAY} />}
          {tab === 'pipeline' && <PipelineTab leads={leads} onSelect={setSelected} today={TODAY} />}
          {tab === 'analytics' && <AnalyticsTab leads={leads} today={TODAY} />}
          {tab === 'sop' && <SopTab />}
        </div>
      </main>

      {selected ? <LeadDrawer lead={selected} onClose={() => setSelected(null)} today={TODAY} /> : null}
    </div>
  )
}
