import { useState } from 'react'
import { sopMeta, sopSections, sopFooter } from '../data/sop.js'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 1200)
        } catch {
          /* clipboard unavailable — no-op */
        }
      }}
      className="rounded-md border border-ink-200 px-2.5 py-1 text-xs text-ink-800 hover:bg-ink-100"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export default function SopTab() {
  return (
    <div className="mx-auto max-w-3xl pb-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{sopMeta.kicker}</p>
      <h1 className="mt-1 text-4xl font-bold tracking-tight leading-tight text-ink-950">{sopMeta.title}</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-ink-100 bg-white p-5 sm:grid-cols-4">
        {sopMeta.fields.map((f) => (
          <div key={f.label}>
            <p className="text-[11px] uppercase tracking-wide text-ink-400">{f.label}</p>
            <p className="mt-0.5 text-sm font-medium text-ink-950">{f.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-10">
        {sopSections.map((section) => (
          <section key={section.id} className="scroll-mt-6" id={`sec-${section.id}`}>
            <div className="mb-3 flex items-baseline gap-2 border-b border-ink-100 pb-2">
              <span className="text-xs font-semibold text-ink-400">{section.id}</span>
              <h2 className="text-2xl font-semibold text-ink-950">{section.title}</h2>
            </div>

            {section.body?.map((p, i) => (
              <p key={i} className="mb-3 text-[15px] leading-relaxed text-ink-800">{p}</p>
            ))}

            {section.steps ? (
              <div className="mt-4 space-y-3">
                {section.steps.map((s) => (
                  <div key={s.n} className="flex gap-4 rounded-lg border border-ink-100 bg-white px-4 py-3.5">
                    <span className="mt-0.5 text-xs font-semibold text-blue">{s.n}</span>
                    <div>
                      <p className="text-sm font-semibold text-ink-950">{s.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-800">{s.body}</p>
                      {s.meta ? <p className="mt-1.5 text-[11px] text-ink-400">{s.meta}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {section.callout ? (
              <div className="mt-4 rounded-lg border border-orange/30 bg-orange-light px-4 py-3 text-sm leading-relaxed text-ink-950">
                {section.callout}
              </div>
            ) : null}

            {section.table ? (
              <div className="mt-4 overflow-hidden rounded-lg border border-ink-100">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-canvas text-left text-xs text-ink-600">
                      {section.table.headers.map((h) => (
                        <th key={h} className="px-4 py-2.5 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, i) => (
                      <tr key={i} className="border-t border-ink-100">
                        {row.map((cell, j) => (
                          <td key={j} className={`px-4 py-2.5 ${j === 2 ? 'text-xs font-semibold text-blue' : 'text-ink-800'}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            {section.templates ? (
              <div className="mt-4 space-y-3">
                {section.templates.map((t) => (
                  <div key={t.id} className="rounded-lg border border-ink-100 bg-white px-4 py-3.5">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold text-ink-950">{t.id} — {t.label}</p>
                      <CopyButton text={t.text} />
                    </div>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-ink-800">{t.text}</p>
                    {t.note ? <p className="mt-2 text-[11px] text-ink-400">{t.note}</p> : null}
                  </div>
                ))}
              </div>
            ) : null}

            {section.checklist ? (
              <ul className="mt-4 space-y-2">
                {section.checklist.map((c, i) => (
                  <li key={i} className="flex gap-2.5 rounded-lg border border-ink-100 bg-white px-4 py-3 text-sm text-ink-800">
                    <span className="text-ink-400">—</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {section.rules ? (
              <div className="mt-4 space-y-3">
                {section.rules.map((r) => (
                  <div key={r.title} className="border-l-2 border-blue/40 pl-4">
                    <p className="text-sm font-semibold text-ink-950">{r.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-ink-800">{r.body}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </div>

      <p className="mt-10 border-t border-ink-100 pt-5 text-xs leading-relaxed text-ink-400">{sopFooter}</p>
    </div>
  )
}
