// Follow-up cadence, in days-from-last-touch, keyed by the stage a lead is
// CURRENTLY sitting in while status = "Not Responded". This mirrors the
// ladder in the Cold DM Outreach SOP (Section 3): each step waits longer
// than the last, and stops dead after Follow-up 5.
export const CADENCE_DAYS = {
  'Initial Outreach': 2, // -> triggers Follow-up 1
  'Follow-up 1': 3, // -> triggers Follow-up 2
  'Follow-up 2': 4, // -> triggers Follow-up 3
  'Follow-up 3': 5, // -> triggers Follow-up 4
  'Follow-up 4': 7, // -> triggers Follow-up 5
  'Follow-up 5': null, // sequence complete, no further auto touch
}

export const NEXT_STAGE = {
  'Initial Outreach': 'Follow-up 1',
  'Follow-up 1': 'Follow-up 2',
  'Follow-up 2': 'Follow-up 3',
  'Follow-up 3': 'Follow-up 4',
  'Follow-up 4': 'Follow-up 5',
  'Follow-up 5': 'Sequence Complete',
}

export function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function formatDate(dateStr) {
  if (!dateStr || dateStr === 'N/A') return 'N/A'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function daysBetween(a, b) {
  const d1 = new Date(a + 'T00:00:00')
  const d2 = new Date(b + 'T00:00:00')
  return Math.round((d2 - d1) / 86400000)
}

// Computes the tracker fields the SOP's tracker demands: next action date
// and a human-readable label, from status + stage + last interaction date.
export function computeTracker(status, stage, lastInteractionDate) {
  if (['Closed', 'Rejected', 'Dead End', 'Responded', 'Scheduled for Call'].includes(status) === false && status !== 'Not Responded') {
    // unknown status fallback
  }
  if (status === 'Closed' || status === 'Rejected' || status === 'Dead End') {
    return { nextActionDate: null, label: 'N/A' }
  }
  if (status === 'Responded' || status === 'Scheduled for Call') {
    return { nextActionDate: null, label: status === 'Scheduled for Call' ? 'Call on calendar' : 'Awaiting your reply' }
  }
  // Not Responded
  if (stage === 'Sequence Complete') {
    return { nextActionDate: null, label: 'Sequence complete — no further sends' }
  }
  const gap = CADENCE_DAYS[stage]
  const nextStage = NEXT_STAGE[stage]
  if (gap == null) {
    return { nextActionDate: null, label: 'Sequence complete — no further sends' }
  }
  const nextActionDate = addDays(lastInteractionDate, gap)
  return { nextActionDate, label: `Send ${nextStage} on ${formatDate(nextActionDate)}` }
}

export function isOverdue(nextActionDate, today) {
  if (!nextActionDate) return false
  return daysBetween(today, nextActionDate) < 0
}

export function isDueToday(nextActionDate, today) {
  return nextActionDate === today
}
