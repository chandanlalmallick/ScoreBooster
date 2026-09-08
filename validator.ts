import type { RawQuestion } from '../types'

export interface ValidationResult {
  valid: boolean
  reason?: string
}

/**
 * Structural + mathematical sanity check on a generator's raw output,
 * before it is allowed into a test. Generators calculate their own
 * correct answer programmatically; this function verifies the shape
 * is internally consistent, not that the maths is "true" (that is the
 * generator's job — see each generator's own assertions).
 */
export function validateQuestion(q: RawQuestion): ValidationResult {
  if (!q.text || q.text.trim().length < 5) {
    return { valid: false, reason: 'question text missing or too short' }
  }
  if (!q.explanation || q.explanation.trim().length < 3) {
    return { valid: false, reason: 'explanation missing' }
  }
  if (!q.subtopic) {
    return { valid: false, reason: 'subtopic missing' }
  }
  if (!Number.isFinite(q.correctAnswer)) {
    return { valid: false, reason: 'correctAnswer is not a finite number' }
  }

  if (q.type === 'mcq') {
    if (!q.options || q.options.length !== 4) {
      return { valid: false, reason: 'mcq must have exactly 4 options' }
    }
    const trimmed = q.options.map((o) => o.trim())
    if (trimmed.some((o) => o.length === 0)) {
      return { valid: false, reason: 'an option is empty' }
    }
    const unique = new Set(trimmed)
    if (unique.size !== trimmed.length) {
      return { valid: false, reason: 'duplicate options' }
    }
    if (q.correctAnswer < 0 || q.correctAnswer > 3) {
      return { valid: false, reason: 'correctAnswer index out of range' }
    }
  }

  if (q.type === 'numerical') {
    if (q.options && q.options.length > 0) {
      return { valid: false, reason: 'numerical question should not have options' }
    }
  }

  return { valid: true }
}
