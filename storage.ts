import type { TestSession } from '../types'

const SESSION_KEY = 'examforge_active_session_v1'

/**
 * Persists only the temporary state needed to resume a test if the
 * browser refreshes — no account, no server, no cross-device sync.
 */
export function saveSession(session: TestSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    // localStorage may be unavailable (private browsing, quota) — the
    // test still works in-memory, it just won't survive a refresh.
  }
}

export function loadSession(): TestSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as TestSession
  } catch {
    return null
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
}
