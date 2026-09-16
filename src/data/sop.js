export const sopMeta = {
  kicker: 'Standard Operating Procedure',
  title: 'Cold DM Outreach — Meta Ads Media Buyers',
  fields: [
    { label: 'Doc owner', value: 'Zylvo Media' },
    { label: 'Applies to', value: 'Instagram outreach' },
    { label: 'Target', value: 'Meta ads buyers' },
    { label: 'Last updated', value: 'Sep 2026' },
  ],
}

export const sopSections = [
  {
    id: '0.1',
    title: 'Purpose',
    body: [
      'Turn a cold Instagram DM into a warm reply, without sending a portfolio link. This SOP covers the opener, the Loom offer, and a five-touch follow-up sequence. Everything here is written to be sent at volume — no step requires a custom asset per lead.',
    ],
  },
  {
    id: '0.2',
    title: 'Scope',
    body: [
      'Applies to first-contact Instagram DMs to media buyers / ad managers sourced through the lead-gen process. Does not cover pricing negotiation, contracts, or onboarding — those start once a call is booked.',
    ],
  },
  {
    id: '1',
    title: 'Procedure — first contact',
    steps: [
      {
        n: '1.1',
        title: 'Pull one specific detail from their ad page',
        body: "Open the lead's Meta Ad Library page. Note: how many ads are live, how long they've been running, whether the creative repeats a shot/frame. This detail is what makes the opener specific — do not send an opener without it.",
        meta: '~2 min per lead · source: Ad Library',
      },
      {
        n: '1.2',
        title: 'Send the opener — no link, no attachment',
        body: "One line, their name, the detail from 1.1, ending in a gap they'd want closed. Template T1.",
      },
      {
        n: '1.3',
        title: 'Send who you are, in their terms',
        body: 'Volume, turnaround, variation — not "high quality." Template T2.',
      },
      {
        n: '1.4',
        title: 'Send one true proof line',
        body: 'A real client outcome stated as a fact: vertical, volume, turnaround. No invented performance numbers (CPA, ROAS). Template T3.',
      },
      {
        n: '1.5',
        title: 'Ask for permission to send the Loom — give a choice, not yes/no',
        body: 'End on a question with two easy answers, not one. Template T4.',
      },
    ],
    callout:
      'Rule: never paste a Loom or portfolio URL into message 1–4. A link collapses the preview text to "Sent a link" in their request folder, which is the exact thing this sequence is built to avoid.',
  },
  {
    id: '2',
    title: 'Procedure — on reply',
    steps: [
      {
        n: '2.1',
        title: 'Record the Loom (once they\u2019ve said yes)',
        body: 'Screen record on their live ads. Two minutes total: the recut (0:00–1:20) → the ask (1:20–1:45).',
      },
      {
        n: '2.2',
        title: 'Close the Loom on a choice',
        body: '"Want me to send over 3 finished ads in your niche, or grab 15 minutes this week?" Either answer moves them to the next stage.',
      },
      {
        n: '2.3',
        title: "Log the lead's stage",
        body: 'Opener sent → opener replied → Loom sent → Loom watched → call booked. Use the tracker (Section 5).',
      },
    ],
  },
  {
    id: '3',
    title: 'Procedure — no reply (follow-up ladder)',
    body: [
      "Run only if step 1 gets no reply. Five touches, five different message types, spaced as below. Do not repeat a message type back to back — that's what makes each one look new in their inbox preview.",
    ],
    table: {
      headers: ['Day', 'Type', 'Template', 'Purpose'],
      rows: [
        ['2', 'Text', 'T5', 'Interrupt — get the thread reopened'],
        ['5', 'GIF + text', 'T6', 'Light bump, zero effort, same asset every lead'],
        ['8', 'Text', 'T7', 'Soft check-in, easy out'],
        ['12', 'Text', 'T8', 'Real deadline, only if true'],
        ['16', 'Text', 'T9', 'Close the loop, stop the sequence'],
      ],
    },
  },
  {
    id: '4',
    title: 'Message templates',
    body: ['Tap Copy, then swap the highlighted placeholders before sending.'],
    templates: [
      { id: 'T1', label: 'opener', text: '[Name], [X] ads live for the [client] account and all [X] open on the same shot???' },
      { id: 'T2', label: 'who you are', text: "I'm Joe, I run Zylvo Media. We cut ad creative for Meta buyers in volume: 10–40 finished ads a month, new hooks and angles each round, most batches back in 48 hours." },
      { id: 'T3', label: 'proof line', text: '[Real outcome, e.g. "40 assets, two days, home services vertical, for a client running $30k/mo"]' },
      { id: 'T4', label: 'the ask', text: "I recorded a 2 minute Loom on [X] of your live ads, showing where I'd recut the first 3 seconds and the angles I'd test against them. Want the Loom, or easier to grab 15 minutes this week?" },
      { id: 'T5', label: 'day 2 follow-up', text: "beep beep\nmanual follow-up, I actually typed this one.\n[Name], if the [vertical] creative's already handled, say so and I'll leave you alone. If not, the Loom's 2 minutes and it's about your ads, not mine." },
      { id: 'T6', label: 'day 5 follow-up', text: '[send: one reusable GIF/meme, same one for every lead, no customizing]\nlol no pressure, just didn\u2019t want this to get buried', note: 'Attach one reusable GIF/meme — same asset for every lead, never customized.' },
      { id: 'T7', label: 'day 8 follow-up', text: "no rush either way, just let me know if creative's ever something you want off your plate" },
      { id: 'T8', label: 'day 12 follow-up', text: "[Name], Q4 creative is usually locked in by mid-October and I'm holding [X] slots for November. If you want fresh angles tested before spend goes up, now's the window. Same 2-minute Loom, still yours to ignore." },
      { id: 'T9', label: 'day 16 follow-up', text: "Not chasing you further. If creative volume ever becomes the bottleneck, this thread's still here." },
    ],
  },
  {
    id: '5',
    title: 'Tracking',
    body: [
      'Per batch of 50 leads, record: opened, replied, Loom watched, call/next-step accepted. Review weekly.',
    ],
    checklist: [
      'Reply rate under 10% → problem is the opener (step 1.2), not the rest of the sequence',
      "They reply but don't watch the Loom → the ask (step 1.5 / T4) is too vague",
      'They watch and go quiet → the Loom is selling instead of showing',
    ],
  },
  {
    id: '6',
    title: 'Rules',
    rules: [
      { title: 'No links before message 5', body: 'A URL in messages 1–4 collapses your preview text. Loom link only goes out after they\u2019ve replied to T4.' },
      { title: 'Give a choice, not a yes/no', body: 'Every ask ends with two easy answers, never one that\u2019s easiest to ignore.' },
      { title: 'Keep the ladder low-effort', body: 'Every follow-up (T5–T9) should be reusable as-is, or with just a name/placeholder swap. If a step requires digging into their account or making something new, drop it.' },
      { title: 'Never invent a performance number', body: 'No CPA, ROAS, or results claims that aren\u2019t true. Buyers check.' },
      { title: 'Never use "just following up" or "bumping this"', body: 'Signals you have nothing new to say — lowest-performing line in the whole sequence.' },
      { title: 'Stop after touch 5 (day 16)', body: 'No further sends without a genuinely new reason. Re-entry next quarter is fine; a bump is not.' },
    ],
  },
]

export const sopFooter =
  'Revise this doc as the templates get tested — update the reply-rate numbers in Section 5 once a batch has run, and swap any template that underperforms.'
