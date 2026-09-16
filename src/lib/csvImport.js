import { STATUSES, STAGES } from '../data/mockData.js'
import { computeTracker } from './cadence.js'

export const IMPORT_FIELDS = [
  { key: 'handle', label: 'Instagram handle', required: true, aliases: ['handle', 'username', 'instagram', 'instagramhandle', 'ighandle', 'igusername', 'profile', 'account'] },
  { key: 'displayName', label: 'Name', required: false, aliases: ['name', 'fullname', 'contact', 'contactname', 'lead'] },
  { key: 'client', label: 'Company / client', required: false, aliases: ['company', 'client', 'business', 'brand'] },
  { key: 'niche', label: 'Niche / industry', required: false, aliases: ['niche', 'industry', 'vertical', 'category'] },
  { key: 'status', label: 'Status', required: false, aliases: ['status', 'currentstatus'] },
  { key: 'stage', label: 'Outreach stage', required: false, aliases: ['stage', 'outreachstage', 'cadencestage', 'sequencestage'] },
  { key: 'lastInteractionDate', label: 'Last interaction date', required: false, aliases: ['lastinteraction', 'lastinteractiondate', 'lastcontacted', 'lasttouch', 'date'] },
  { key: 'estValue', label: 'Est. value', required: false, aliases: ['estvalue', 'value', 'dealvalue', 'estimatedvalue', 'amount'] },
  { key: 'notes', label: 'Notes', required: false, aliases: ['notes', 'note', 'comments'] },
]

function normalize(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function guessMapping(headers) {
  const mapping = {}
  const normalizedHeaders = headers.map((h) => ({ raw: h, norm: normalize(h) }))
  IMPORT_FIELDS.forEach((field) => {
    const match = normalizedHeaders.find((h) => h.norm === normalize(field.key) || field.aliases.includes(h.norm))
    mapping[field.key] = match ? match.raw : ''
  })
  return mapping
}

function matchEnum(value, options, fallback) {
  if (!value) return fallback
  const norm = normalize(value)
  const found = options.find((o) => normalize(o) === norm || normalize(o).includes(norm) || norm.includes(normalize(o)))
  return found || fallback
}

function parseDateLoose(value) {
  if (!value) return null
  const d = new Date(value)
  if (isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 10)
}

export function rowToLead(row, mapping, { idGenerator, today }) {
  const get = (key) => (mapping[key] ? row[mapping[key]] : '')

  const handleRaw = get('handle').trim()
  const handle = handleRaw.replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/\/$/, '').split('?')[0]
  if (!handle) return null

  const status = matchEnum(get('status'), STATUSES, 'Not Responded')
  const stage = matchEnum(get('stage'), STAGES, 'Initial Outreach')
  const lastInteractionDate = parseDateLoose(get('lastInteractionDate')) || today
  const estValueRaw = get('estValue').replace(/[^0-9.]/g, '')
  const estValue = estValueRaw ? Math.round(parseFloat(estValueRaw)) : null

  const tracker = computeTracker(status, stage, lastInteractionDate)

  return {
    id: idGenerator(),
    handle,
    displayName: get('displayName').trim() || handle,
    niche: get('niche').trim() || 'Uncategorized',
    client: get('client').trim() || '—',
    igUrl: `https://instagram.com/${handle}`,
    source: 'CSV import',
    status,
    stage,
    lastInteractionDate,
    nextActionDate: tracker.nextActionDate,
    dateTrackerLabel: tracker.label,
    notes: get('notes').trim(),
    estValue,
    messages: {
      first_dm: '', who_you_are: '', proof_line: '',
      follow_up_1: '', follow_up_2: '', follow_up_3: '', follow_up_4: '', follow_up_5: '',
    },
  }
}
