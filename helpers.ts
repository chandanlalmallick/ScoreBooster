import type { RNG } from '../engine/random'
import { shuffle } from '../engine/random'
import { hashString, fmtNum } from '../utils/mathUtils'

/**
 * Builds a 4-option MCQ block from a correct numeric value and a set of
 * "plausible wrong" numeric distractors (typically produced by applying
 * common-mistake transforms to the correct value). Ensures all four are
 * distinct strings and returns the shuffled options plus correct index.
 */
export function buildNumericOptions(
  rng: RNG,
  correctValue: number,
  distractorCandidates: number[],
  formatter: (n: number) => string = fmtNum
): { options: string[]; correctIndex: number } {
  const correctStr = formatter(correctValue)
  const seen = new Set([correctStr])
  const distractors: string[] = []

  for (const d of distractorCandidates) {
    const s = formatter(d)
    if (!seen.has(s)) {
      seen.add(s)
      distractors.push(s)
    }
    if (distractors.length === 3) break
  }

  // If we still don't have 3 distinct distractors, perturb further.
  let guard = 0
  while (distractors.length < 3 && guard < 30) {
    guard++
    const jitter = correctValue + (rng() > 0.5 ? 1 : -1) * (1 + Math.floor(rng() * 5)) * (Math.abs(correctValue) < 5 ? 1 : Math.pow(10, Math.floor(Math.log10(Math.abs(correctValue) + 1))))
    const s = formatter(jitter)
    if (!seen.has(s)) {
      seen.add(s)
      distractors.push(s)
    }
  }

  const items = shuffle(rng, [
    { label: correctStr, correct: true },
    ...distractors.map((d) => ({ label: d, correct: false })),
  ])

  return {
    options: items.map((i) => i.label),
    correctIndex: items.findIndex((i) => i.correct),
  }
}

/** Builds a 4-option MCQ from pre-labelled text options (non-numeric). */
export function buildLabeledOptions(
  rng: RNG,
  correctLabel: string,
  wrongLabels: string[]
): { options: string[]; correctIndex: number } {
  const uniqueWrong: string[] = []
  const seen = new Set([correctLabel])
  for (const w of wrongLabels) {
    if (!seen.has(w)) {
      seen.add(w)
      uniqueWrong.push(w)
    }
    if (uniqueWrong.length === 3) break
  }
  const items = shuffle(rng, [
    { label: correctLabel, correct: true },
    ...uniqueWrong.slice(0, 3).map((l) => ({ label: l, correct: false })),
  ])
  return {
    options: items.map((i) => i.label),
    correctIndex: items.findIndex((i) => i.correct),
  }
}

export function fp(...parts: (string | number)[]): string {
  return hashString(parts.join('|'))
}
