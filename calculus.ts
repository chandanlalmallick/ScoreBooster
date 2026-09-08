import type { RawQuestion, Difficulty } from '../../types'
import type { RNG } from '../../engine/random'
import { randInt, randNonZeroInt, choice } from '../../engine/random'
import { buildNumericOptions, fp } from '../helpers'
import { fmtNum } from '../../utils/mathUtils'

/**
 * lim x->a (x^2 - a^2)/(x - a) = 2a               [easy: single factoring step]
 * lim x->0 sin(kx)/x = k                          [moderate: standard limit + scaling]
 * lim x->infinity (1 + k/x)^x = e^k, reported via k [hard: recognising the exponential limit form]
 */
export function generateLimitQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  if (difficulty === 'easy') {
    const a = randNonZeroInt(rng, 2, 9)
    const correct = 2 * a
    const { options, correctIndex } = buildNumericOptions(rng, correct, [
      a, // forgot the factor of 2
      correct + a, // arithmetic slip
      -correct, // sign error
    ])
    return {
      type: 'mcq',
      text: `Evaluate: lim (x → ${a}) of (x² − ${a * a}) / (x − ${a})`,
      options,
      correctAnswer: correctIndex,
      explanation: `Factor the numerator: x² − ${a}² = (x−${a})(x+${a}). Cancel (x−${a}) to get x+${a}, then substitute x=${a}: result = ${correct}.`,
      subtopic: 'Limits — factoring',
      fingerprint: fp('limit-factor', a),
    }
  }

  if (difficulty === 'moderate') {
    const k = randNonZeroInt(rng, 2, 9)
    const correct = k
    const { options, correctIndex } = buildNumericOptions(rng, correct, [
      k * k, // squared instead of standard limit
      1, // thinking limit of sinθ/θ ignores the k scaling entirely
      2 * k,
    ])
    return {
      type: 'mcq',
      text: `Evaluate: lim (x → 0) of sin(${k}x) / x`,
      options,
      correctAnswer: correctIndex,
      explanation: `Using the standard limit lim(θ→0) sinθ/θ = 1 with θ = ${k}x: lim sin(${k}x)/x = ${k} · lim sin(${k}x)/(${k}x) = ${k} · 1 = ${k}.`,
      subtopic: 'Limits — standard trigonometric limit',
      fingerprint: fp('limit-sinkx', k),
    }
  }

  // hard
  const k = randInt(rng, 2, 6)
  const correctExact = Math.exp(k)
  const correct = Math.round(correctExact * 100) / 100
  const { options, correctIndex } = buildNumericOptions(
    rng,
    correct,
    [Math.round(Math.exp(1 / k) * 100) / 100, k, Math.round(k * Math.E * 100) / 100],
    fmtNum
  )
  return {
    type: 'mcq',
    text: `Evaluate: lim (x → ∞) of (1 + ${k}/x)^x  (answer to 2 decimal places)`,
    options,
    correctAnswer: correctIndex,
    explanation: `This is the standard exponential limit lim(x→∞) (1 + k/x)^x = e^k. With k = ${k}, the value is e^${k} ≈ ${correct}.`,
    subtopic: 'Limits — exponential form e^k',
    fingerprint: fp('limit-exp', k),
  }
}

/**
 * d/dx [x^n * e^(ax)] at a point, using the product rule.
 * Difficulty scales via n and whether a is negative/fractional-feeling.
 */
export function generateDerivativeQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const n = difficulty === 'easy' ? randInt(rng, 1, 2) : difficulty === 'moderate' ? randInt(rng, 2, 3) : randInt(rng, 3, 4)
  const a = difficulty === 'hard' ? randNonZeroInt(rng, -3, 3) : randInt(rng, 1, 3)
  const x0 = randInt(rng, 1, 2)

  // f(x) = x^n * e^(a x); f'(x) = n x^(n-1) e^(ax) + a x^n e^(ax) = e^(ax) x^(n-1) (n + a x)
  const ex = Math.exp(a * x0)
  const derivativeAtX0 = ex * Math.pow(x0, n - 1) * (n + a * x0)
  const correct = Math.round(derivativeAtX0 * 1000) / 1000

  const wrong1 = Math.round(n * Math.pow(x0, n - 1) * ex * 1000) / 1000 // forgot product rule 2nd term
  const wrong2 = Math.round(a * Math.pow(x0, n) * ex * 1000) / 1000 // forgot 1st term
  const wrong3 = Math.round(derivativeAtX0 * -1 * 1000) / 1000 // sign slip

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3])

  return {
    type: 'mcq',
    text: `Let f(x) = x^${n} · e^(${a}x). Find f'(${x0}) (to 3 decimal places).`,
    options,
    correctAnswer: correctIndex,
    explanation: `By the product rule, f'(x) = ${n}x^${n - 1}e^(${a}x) + ${a}x^${n}e^(${a}x) = e^(${a}x)·x^${n - 1}(${n} + ${a}x). At x=${x0}: e^(${a * x0}) · ${x0}^${n - 1} · (${n} + ${a}·${x0}) ≈ ${correct}.`,
    subtopic: 'Differentiation — product rule',
    fingerprint: fp('derivative-product', n, a, x0),
  }
}

/**
 * Definite integral of a polynomial over [0, b] — tests power rule
 * application chained across multiple terms.
 */
export function generateDefiniteIntegralQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const degree = difficulty === 'easy' ? 1 : difficulty === 'moderate' ? 2 : 3
  const coeffs: number[] = []
  for (let i = 0; i <= degree; i++) coeffs.push(randNonZeroInt(rng, -4, 4))
  const b = randInt(rng, 1, 3)

  // integral of sum c_i x^i from 0 to b = sum c_i b^(i+1)/(i+1)
  let correct = 0
  const terms: string[] = []
  for (let i = 0; i <= degree; i++) {
    correct += (coeffs[i] * Math.pow(b, i + 1)) / (i + 1)
    if (coeffs[i] !== 0) {
      const power = i === 0 ? '' : i === 1 ? 'x' : `x^${i}`
      terms.push(`${coeffs[i] >= 0 && terms.length ? '+' : ''}${coeffs[i]}${power}`)
    }
  }
  correct = Math.round(correct * 1000) / 1000
  const poly = terms.join(' ').replace(/^\+/, '')

  const wrongNoDiv = Math.round(
    coeffs.reduce((s, c, i) => s + c * Math.pow(b, i + 1), 0) * 1000
  ) / 1000 // forgot to divide by (i+1)
  const wrongLowerBound = Math.round((correct + coeffs[0] * b) * 1000) / 1000
  const wrongSign = -correct

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrongNoDiv, wrongLowerBound, wrongSign])

  return {
    type: 'mcq',
    text: `Evaluate the definite integral: ∫₀^${b} (${poly}) dx  (to 3 decimal places)`,
    options,
    correctAnswer: correctIndex,
    explanation: `Apply the power rule term-by-term: ∫x^i dx = x^(i+1)/(i+1), then evaluate at the limits 0 to ${b}. Summing the terms gives ≈ ${correct}.`,
    subtopic: 'Integration — definite integral of a polynomial',
    fingerprint: fp('integral-poly', ...coeffs, b),
  }
}
