import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { STAGES } from '../data/mockData.js'
import { daysBetween } from '../lib/cadence.js'

const STATUS_COLORS = {
  'Not Responded': '#8E8E93',
  'Responded': '#0071E3',
  'Scheduled for Call': '#FF9500',
  'Closed': '#2FA84F',
  'Rejected': '#FF3B30',
  'Dead End': '#D2D2D7',
}

function Kpi({ label, value, sub, tone }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-surface px-5 py-4 shadow-card">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className={`mt-1.5 text-3xl font-semibold ${tone || 'text-ink-950'}`}>{value}</p>
      {sub ? <p className="mt-1 text-xs text-ink-600">{sub}</p> : null}
    </div>
  )
}

export default function AnalyticsTab({ leads, today }) {
  const stats = useMemo(() => {
    const total = leads.length
    const byStatus = {}
    leads.forEach((l) => { byStatus[l.status] = (byStatus[l.status] || 0) + 1 })

    const engaged = ['Responded', 'Scheduled for Call', 'Closed'].reduce((n, s) => n + (byStatus[s] || 0), 0)
    const deadOrRejected = (byStatus['Rejected'] || 0) + (byStatus['Dead End'] || 0)
    const activeInSequence = byStatus['Not Responded'] || 0
    const replyRate = total ? Math.round((engaged / total) * 100) : 0
    const closedWon = byStatus['Closed'] || 0
    const callsBooked = byStatus['Scheduled for Call'] || 0

    const overdue = leads.filter((l) => l.nextActionDate && daysBetween(today, l.nextActionDate) < 0)
    const dueToday = leads.filter((l) => l.nextActionDate === today)

    const stageData = STAGES.map((s) => ({ stage: s.replace('Follow-up', 'FU'), count: leads.filter((l) => l.stage === s).length }))
    const statusData = Object.entries(byStatus).map(([name, value]) => ({ name, value }))

    const nicheMap = {}
    leads.forEach((l) => { nicheMap[l.niche] = (nicheMap[l.niche] || 0) + 1 })
    const nicheData = Object.entries(nicheMap)
      .map(([niche, count]) => ({ niche, count }))
      .sort((a, b) => b.count - a.count)

    return { total, replyRate, closedWon, callsBooked, activeInSequence, deadOrRejected, overdue, dueToday, stageData, statusData, nicheData }
  }, [leads, today])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Kpi label="Total leads" value={stats.total} sub="In this workspace" />
        <Kpi label="Reply rate" value={`${stats.replyRate}%`} sub="Replied, booked, or closed" tone={stats.replyRate < 10 ? 'text-red' : 'text-green'} />
        <Kpi label="Calls booked" value={stats.callsBooked} sub="Scheduled for call" tone="text-blue" />
        <Kpi label="Closed won" value={stats.closedWon} sub="Onboarded onto retainer" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Kpi label="Active in sequence" value={stats.activeInSequence} sub="Not responded, still ladder-running" />
        <Kpi label="Due today" value={stats.dueToday.length} sub="Send the next touch today" tone={stats.dueToday.length ? 'text-orange' : undefined} />
        <Kpi label="Overdue" value={stats.overdue.length} sub="Past their next-action date" tone={stats.overdue.length ? 'text-red' : undefined} />
        <Kpi label="Dead / rejected" value={stats.deadOrRejected} sub="Out of the active pipeline" />
      </div>

      {stats.replyRate < 10 ? (
        <div className="rounded-xl border border-red/25 bg-red-light px-5 py-3.5 text-sm text-red">
          Reply rate is under 10% — per the SOP, the opener (step 1.2) is the likely problem, not the rest of the sequence.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-ink-100 bg-surface p-5 shadow-card lg:col-span-3">
          <p className="mb-4 text-lg font-semibold text-ink-950">Leads by stage</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.stageData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E8ED" vertical={false} />
              <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#8E8E93' }} axisLine={{ stroke: '#E8E8ED' }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#8E8E93' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#F5F5F7' }} contentStyle={{ borderRadius: 8, border: '1px solid #E8E8ED', fontSize: 12 }} />
              <Bar dataKey="count" fill="#0071E3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-ink-100 bg-surface p-5 shadow-card lg:col-span-2">
          <p className="mb-4 text-lg font-semibold text-ink-950">Status breakdown</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={stats.statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {stats.statusData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#999'} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8E8ED', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-ink-100 bg-surface p-5 shadow-card">
        <p className="mb-4 text-lg font-semibold text-ink-950">Leads by niche</p>
        <ResponsiveContainer width="100%" height={Math.max(200, stats.nicheData.length * 34)}>
          <BarChart data={stats.nicheData} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E8ED" horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#8E8E93' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="niche" width={140} tick={{ fontSize: 11, fill: '#14202A' }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: '#F5F5F7' }} contentStyle={{ borderRadius: 8, border: '1px solid #E8E8ED', fontSize: 12 }} />
            <Bar dataKey="count" fill="#2FA84F" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
