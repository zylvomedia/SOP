import { computeTracker } from '../lib/cadence.js'

export const TODAY = '2026-09-16'

export const STATUSES = ['Not Responded', 'Responded', 'Scheduled for Call', 'Closed', 'Rejected', 'Dead End']
export const STAGES = ['Initial Outreach', 'Follow-up 1', 'Follow-up 2', 'Follow-up 3', 'Follow-up 4', 'Follow-up 5', 'Sequence Complete']

function buildMessages({ name, adCount, client, vertical, proof }) {
  return {
    first_dm: `${name}, ${adCount} ads live for the ${client} account and all ${adCount} open on the same shot???`,
    follow_up_1: `beep beep\nmanual follow-up, I actually typed this one.\n${name}, if the ${vertical} creative's already handled, say so and I'll leave you alone. If not, the Loom's 2 minutes and it's about your ads, not mine.`,
    follow_up_2: `[reusable GIF]\nlol no pressure, just didn't want this to get buried`,
    follow_up_3: `no rush either way, just let me know if creative's ever something you want off your plate`,
    follow_up_4: `${name}, Q4 creative is usually locked in by mid-October and I'm holding 3 slots for November. If you want fresh angles tested before spend goes up, now's the window. Same 2-minute Loom, still yours to ignore.`,
    follow_up_5: `Not chasing you further. If creative volume ever becomes the bottleneck, this thread's still here.`,
    who_you_are: `I'm Joe, I run Zylvo Media. We cut ad creative for Meta buyers in volume: 10–40 finished ads a month, new hooks and angles each round, most batches back in 48 hours.`,
    proof_line: proof,
  }
}

const raw = [
  {
    handle: 'maria.ads', name: 'Maria', niche: 'Home services', client: 'GreenLeaf Roofing',
    adCount: 6, vertical: 'home services', proof: '40 assets, two days, home services vertical, for a client running $30k/mo',
    status: 'Not Responded', stage: 'Follow-up 2', lastInteractionDate: '2026-09-10',
    source: 'Ad Library — outbound list 14', notes: 'Runs 3 accounts, decent spend signal. Worth a call push.',
  },
  {
    handle: 'thegrowthbuyer', name: 'Devon', niche: 'DTC e-commerce', client: 'Cinderwood Skincare',
    adCount: 11, vertical: 'ecommerce', proof: '25 hooks, 3 days, DTC skincare client scaling from $12k to $40k/mo',
    status: 'Not Responded', stage: 'Initial Outreach', lastInteractionDate: '2026-09-15',
    source: 'Ad Library — outbound list 15', notes: 'Fresh add, opener just went out.',
  },
  {
    handle: 'rooferleads.co', name: 'Pat', niche: 'Roofing', client: 'Summit Roofing Co',
    adCount: 4, vertical: 'roofing', proof: '18 assets in one week for a roofing client during storm season',
    status: 'Responded', stage: 'Sequence Complete', lastInteractionDate: '2026-09-12',
    source: 'Referral — Instagram comment', notes: 'Replied "who is this" then asked for the Loom. Sent Loom same day, awaiting watch.',
  },
  {
    handle: 'dtc.mediabuyer', name: 'Aisha', niche: 'DTC e-commerce', client: 'Northfield Coffee Co',
    adCount: 9, vertical: 'ecommerce', proof: '30 assets, four days, coffee subscription brand at $50k/mo spend',
    status: 'Scheduled for Call', stage: 'Sequence Complete', lastInteractionDate: '2026-09-14',
    source: 'Ad Library — outbound list 12', notes: 'Call booked Thu 9/18, 2:00pm — wants 3 sample ads before the call.',
  },
  {
    handle: 'clinicgrowthlabs', name: 'Sam', niche: 'Dental / medical', client: 'Brightline Dental Group',
    adCount: 5, vertical: 'dental', proof: '22 assets, two days, dental group running 4 clinic locations',
    status: 'Not Responded', stage: 'Follow-up 4', lastInteractionDate: '2026-09-09',
    source: 'Ad Library — outbound list 11', notes: 'Opened every message so far, zero replies. Watch reply rate on this segment.',
  },
  {
    handle: 'junk.removal.ppc', name: 'Terrence', niche: 'Junk removal', client: 'ClearOut Junk Removal',
    adCount: 3, vertical: 'junk removal', proof: '15 assets, one week, junk removal franchise across 6 markets',
    status: 'Dead End', stage: 'Sequence Complete', lastInteractionDate: '2026-08-22',
    source: 'Ad Library — outbound list 9', notes: 'Account went private mid-sequence. Leaving as dead end, not rejected.',
  },
  {
    handle: 'solarspend', name: 'Yusuf', niche: 'Solar', client: 'Meridian Solar',
    adCount: 14, vertical: 'solar', proof: '40 assets, two days, solar installer running $60k/mo',
    status: 'Rejected', stage: 'Sequence Complete', lastInteractionDate: '2026-09-02',
    source: 'Ad Library — outbound list 10', notes: 'Replied "not looking, in-house team handles this." Polite no.',
  },
  {
    handle: 'fitfunnelbuyer', name: 'Casey', niche: 'Fitness / coaching', client: 'Ironframe Coaching',
    adCount: 7, vertical: 'fitness', proof: '35 assets, three days, fitness coach scaling from $8k to $22k/mo',
    status: 'Closed', stage: 'Sequence Complete', lastInteractionDate: '2026-09-05',
    source: 'Referral — past client', notes: 'Closed! First batch of 20 ads delivered, onboarded onto monthly retainer.',
  },
  {
    handle: 'hvacgrowthguy', name: 'Marcus', niche: 'HVAC', client: 'ColdSnap HVAC',
    adCount: 8, vertical: 'HVAC', proof: '20 assets, two days, HVAC client ahead of summer demand spike',
    status: 'Not Responded', stage: 'Follow-up 1', lastInteractionDate: '2026-09-14',
    source: 'Ad Library — outbound list 15', notes: '',
  },
  {
    handle: 'dental.demand', name: 'Priya', niche: 'Dental / medical', client: 'Oakview Dental',
    adCount: 5, vertical: 'dental', proof: '22 assets, two days, dental group running 4 clinic locations',
    status: 'Not Responded', stage: 'Follow-up 5', lastInteractionDate: '2026-08-31',
    source: 'Ad Library — outbound list 8', notes: 'Sent T9. No further sends unless she reopens the thread — re-enter next quarter.',
  },
  {
    handle: 'legalleadsdaily', name: 'Owen', niche: 'Legal', client: 'Hargrove & Kline Law',
    adCount: 6, vertical: 'legal', proof: '18 assets, one week, personal injury firm running across 3 states',
    status: 'Responded', stage: 'Sequence Complete', lastInteractionDate: '2026-09-13',
    source: 'Ad Library — outbound list 13', notes: 'Replied fast, watched the Loom, asked for 3 sample ads.',
  },
  {
    handle: 'petcareads', name: 'Nadia', niche: 'Pet care', client: 'Wagbox Pet Boarding',
    adCount: 4, vertical: 'pet care', proof: '16 assets, three days, pet boarding chain across 5 locations',
    status: 'Not Responded', stage: 'Follow-up 3', lastInteractionDate: '2026-09-08',
    source: 'Ad Library — outbound list 12', notes: '',
  },
  {
    handle: 'movingcompanyads', name: 'Ellis', niche: 'Moving / logistics', client: 'Steadfast Moving Co',
    adCount: 5, vertical: 'moving', proof: '20 assets, two days, moving company ahead of peak season',
    status: 'Scheduled for Call', stage: 'Sequence Complete', lastInteractionDate: '2026-09-11',
    source: 'Ad Library — outbound list 9', notes: 'Call booked Mon 9/21, 11:00am.',
  },
  {
    handle: 'roofrescueads', name: 'Bianca', niche: 'Roofing', client: 'RoofRescue Pros',
    adCount: 7, vertical: 'roofing', proof: '18 assets in one week for a roofing client during storm season',
    status: 'Not Responded', stage: 'Initial Outreach', lastInteractionDate: '2026-09-16',
    source: 'Ad Library — outbound list 16', notes: 'Sent this morning.',
  },
  {
    handle: 'med.spa.buyer', name: 'Renata', niche: 'Med spa', client: 'Lumière Med Spa',
    adCount: 9, vertical: 'med spa', proof: '30 assets, four days, med spa client scaling injectable campaigns',
    status: 'Closed', stage: 'Sequence Complete', lastInteractionDate: '2026-08-28',
    source: 'Referral — past client', notes: 'Second month on retainer, 25 ads/month package.',
  },
  {
    handle: 'plumbingprofits', name: 'Julian', niche: 'Plumbing', client: 'Rapid Flow Plumbing',
    adCount: 6, vertical: 'plumbing', proof: '20 assets, two days, plumbing client running emergency-service campaigns',
    status: 'Not Responded', stage: 'Follow-up 2', lastInteractionDate: '2026-09-13',
    source: 'Ad Library — outbound list 14', notes: '',
  },
  {
    handle: 'hardscapehero', name: 'Dana', niche: 'Landscaping', client: 'Stonebridge Hardscapes',
    adCount: 3, vertical: 'landscaping', proof: '15 assets, one week, hardscaping company entering a new metro',
    status: 'Dead End', stage: 'Sequence Complete', lastInteractionDate: '2026-08-18',
    source: 'Ad Library — outbound list 7', notes: 'Number/account deactivated mid-sequence.',
  },
  {
    handle: 'windowworldbuyer', name: 'Farid', niche: 'Home improvement', client: 'ClearView Windows',
    adCount: 10, vertical: 'home improvement', proof: '25 assets, three days, window replacement client at $45k/mo spend',
    status: 'Rejected', stage: 'Sequence Complete', lastInteractionDate: '2026-09-01',
    source: 'Ad Library — outbound list 10', notes: 'Replied "we\'re good, thanks" after T4. Clean no.',
  },
  {
    handle: 'cleaningcodemedia', name: 'Winnie', niche: 'Cleaning services', client: 'Spotless Home Services',
    adCount: 5, vertical: 'cleaning services', proof: '16 assets, three days, residential cleaning franchise across 4 markets',
    status: 'Not Responded', stage: 'Follow-up 4', lastInteractionDate: '2026-09-05',
    source: 'Ad Library — outbound list 11', notes: 'Overdue on the day-12 touch — flag for send today.',
  },
  {
    handle: 'franchisegrowthjoe', name: 'Trevor', niche: 'Franchise / multi-location', client: 'BoltFit Franchise Group',
    adCount: 13, vertical: 'franchise fitness', proof: '40 assets, two days, home services vertical, for a client running $30k/mo',
    status: 'Responded', stage: 'Sequence Complete', lastInteractionDate: '2026-09-15',
    source: 'Ad Library — outbound list 16', notes: 'Replied same day. Sending Loom tomorrow AM.',
  },
]

export const leads = raw.map((r, i) => {
  const tracker = computeTracker(r.status, r.stage, r.lastInteractionDate)
  return {
    id: `lead-${String(i + 1).padStart(3, '0')}`,
    handle: r.handle,
    displayName: r.name,
    niche: r.niche,
    client: r.client,
    igUrl: `https://instagram.com/${r.handle}`,
    source: r.source,
    status: r.status,
    stage: r.stage,
    lastInteractionDate: r.lastInteractionDate,
    nextActionDate: tracker.nextActionDate,
    dateTrackerLabel: tracker.label,
    notes: r.notes,
    messages: buildMessages({ name: r.name, adCount: r.adCount, client: r.client, vertical: r.vertical, proof: r.proof }),
  }
})
