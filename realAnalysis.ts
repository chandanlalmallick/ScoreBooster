import type { RawQuestion, Difficulty } from '../../types'
import type { RNG } from '../../engine/random'
import { randInt, randNonZeroInt, choice } from '../../engine/random'
import { buildNumericOptions, buildLabeledOptions, fp } from '../helpers'

/**
 * Limit of a rational sequence a_n = (p n^2 + q n) / (r n^2 + s n) as n -> ∞.
 * Limit = p/r. Difficulty scales via how "hidden" the leading terms are
 * (more lower-order terms to see past).
 */
export function generateSequenceLimitQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const p = randNonZeroInt(rng, 1, 6)
  const r = randNonZeroInt(rng, 1, 6)
  const q = difficulty === 'easy' ? 0 : randInt(rng, -5, 5)
  const s = difficulty === 'hard' ? randInt(rng, -5, 5) : 0

  const correctExact = p / r
  const correct = Math.round(correctExact * 1000) / 1000
  const qTerm = q !== 0 ? ` ${q >= 0 ? '+' : '-'} ${Math.abs(q)}n` : ''
  const sTerm = s !== 0 ? ` ${s >= 0 ? '+' : '-'} ${Math.abs(s)}n` : ''

  const wrong1 = 0 // wrongly assumes it goes to 0 since "n^2 dominates"
  const wrong2 = Math.round((q === 0 ? p + 1 : (p + q) / (r + s || 1)) * 1000) / 1000
  const wrong3 = Math.round((p / r) * -1 * 1000) / 1000

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3])

  return {
    type: 'mcq',
    text: `Find lim (n → ∞) of (${p}n²${qTerm}) / (${r}n²${sTerm})  (to 3 decimal places if not exact)`,
    options,
    correctAnswer: correctIndex,
    explanation: `Divide numerator and denominator by n² (the highest power present). All terms with 1/n or 1/n² vanish as n→∞, leaving ${p}/${r} ≈ ${correct}. Only the leading coefficients matter.`,
    subtopic: 'Real Analysis — limits of sequences',
    fingerprint: fp('seq-limit', p, q, r, s),
  }
}

/**
 * Convergence of the p-series sum 1/n^p — conceptual question with a
 * randomised p, using the well-known p-series test (converges iff p>1).
 */
export function generateSeriesConvergenceQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const isInteger = difficulty !== 'hard'
  const p = isInteger ? randInt(rng, -2, 4) : Math.round((randInt(rng, 5, 20) / 10) * 10) / 10
  const converges = p > 1

  const correctLabel = converges ? 'Converges' : 'Diverges'
  const wrongLabels = [
    converges ? 'Diverges' : 'Converges',
    'Converges conditionally but not absolutely',
    'Cannot be determined',
  ]
  const { options, correctIndex } = buildLabeledOptions(rng, correctLabel, wrongLabels)

  return {
    type: 'mcq',
    text: `Does the series Σ (n=1 to ∞) 1/n^${p} converge or diverge?`,
    options,
    correctAnswer: correctIndex,
    explanation: `By the p-series test, Σ 1/n^p converges if and only if p > 1. Here p = ${p}, so the series ${converges ? 'converges' : 'diverges'}.`,
    subtopic: 'Real Analysis — p-series convergence test',
    fingerprint: fp('p-series', p),
  }
}

/**
 * Continuity/differentiability conceptual bank — templated statements
 * about a piecewise function f, with the correct classification computed
 * from the randomised piece parameters rather than fixed text.
 */
export function generateContinuityQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  // f(x) = a x for x <= c ; f(x) = b(x-c) + a c  for x > c   (b != a => corner, but always continuous)
  const a = randNonZeroInt(rng, 1, 4)
  const c = randInt(rng, 1, 3)
  let b = randNonZeroInt(rng, 1, 4)
  if (difficulty === 'easy') b = a // no corner: fully differentiable everywhere

  const continuous = true // both pieces meet at x=c by construction: a*c = b*(c-c)+a*c always
  const differentiable = a === b

  const correctLabel = differentiable
    ? 'Continuous and differentiable at x = ' + c
    : 'Continuous but NOT differentiable at x = ' + c
  const wrongLabels = [
    'Neither continuous nor differentiable at x = ' + c,
    'Differentiable but not continuous at x = ' + c,
    'Discontinuous with a jump at x = ' + c,
  ]
  const { options, correctIndex } = buildLabeledOptions(rng, correctLabel, wrongLabels)

  return {
    type: 'mcq',
    text: `Let f(x) = ${a}x for x ≤ ${c}, and f(x) = ${b}(x−${c}) + ${a * c} for x > ${c}. Classify f at x = ${c}.`,
    options,
    correctAnswer: correctIndex,
    explanation: `Both pieces equal ${a * c} at x=${c}, so f is continuous there. The left derivative is ${a} and the right derivative is ${b}; ${differentiable ? 'since these are equal, f is also differentiable' : 'since these differ, f has a corner and is not differentiable'} at x=${c}.`,
    subtopic: 'Real Analysis — continuity and differentiability of piecewise functions',
    fingerprint: fp('continuity', a, b, c),
  }
}
