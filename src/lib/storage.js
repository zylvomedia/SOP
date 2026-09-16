const KEY = 'zylvo_crm_leads_v1'

export function loadLeads(fallback) {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
    return fallback
  } catch {
    return fallback
  }
}

export function saveLeads(leads) {
  try {
    localStorage.setItem(KEY, JSON.stringify(leads))
    return true
  } catch {
    return false
  }
}

export function clearLeads() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* no-op */
  }
}
