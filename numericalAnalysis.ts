import type { RawQuestion, Difficulty } from '../../types'
import type { RNG } from '../../engine/random'
import { randInt } from '../../engine/random'
import { buildNumericOptions, fp } from '../helpers'
import { round2 } from '../../utils/mathUtils'

/**
 * One step of the Newton-Raphson method applied to f(x) = x^2 - N,
 * starting from x0. x1 = x0 - f(x0)/f'(x0) = (x0 + N/x0) / 2.
 * This tests procedural fluency, not just a formula lookup.
 */
export function generateNewtonRaphsonStepQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const N = difficulty === 'easy' ? randInt(rng, 2, 10) : difficulty === 'moderate' ? randInt(rng, 5, 30) : randInt(rng, 10, 80)
  const x0 = difficulty === 'easy' ? Math.ceil(Math.sqrt(N)) : randInt(rng, 1, Math.max(2, Math.ceil(Math.sqrt(N)) + 2))

  const x1Exact = (x0 + N / x0) / 2
  const correct = round2(x1Exact)

  const wrong1 = round2(x0 - (x0 * x0 - N)) // forgot to divide by f'(x0) = 2x0
  const wrong2 = round2((x0 * x0 - N) / (2 * x0)) // returned the correction term itself, not x0 minus it
  const wrong3 = round2(Math.sqrt(N))

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3], (v) => v.toFixed(3))

  return {
    type: 'mcq',
    text: `Apply one step of Newton–Raphson to f(x) = x² − ${N}, starting at x₀ = ${x0}, to find x₁ (to 3 decimals).`,
    options,
    correctAnswer: correctIndex,
    explanation: `Newton–Raphson: x₁ = x₀ − f(x₀)/f'(x₀) = x₀ − (x₀²−${N})/(2x₀) = (x₀ + ${N}/x₀)/2 = (${x0} + ${round2(N / x0)})/2 ≈ ${correct}.`,
    subtopic: 'Numerical Analysis — Newton–Raphson method',
    fingerprint: fp('newton', N, x0),
  }
}

/** Trapezoidal rule with 2 subintervals for a simple polynomial f(x)=x^2. */
export function generateTrapezoidalRuleQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const a = 0
  const b = difficulty === 'easy' ? 2 : difficulty === 'moderate' ? 4 : 6
  const n = difficulty === 'hard' ? 4 : 2
  const h = (b - a) / n

  const f = (x: number) => x * x
  let sum = f(a) + f(b)
  for (let i = 1; i < n; i++) sum += 2 * f(a + i * h)
  const approx = (h / 2) * sum
  const correct = round2(approx)

  const exact = (b * b * b) / 3
  const wrong1 = round2(exact) // gave the exact integral instead of the trapezoidal estimate
  const wrong2 = round2(approx / 2) // forgot the h/2 factor correctly (halved again)
  const wrong3 = round2(h * sum) // forgot to divide by 2

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3], (v) => v.toFixed(3))

  return {
    type: 'mcq',
    text: `Estimate ∫₀^${b} x² dx using the Trapezoidal Rule with n = ${n} subintervals (to 3 decimals).`,
    options,
    correctAnswer: correctIndex,
    explanation: `With h = (b−a)/n = ${round2(h)}, the trapezoidal estimate is (h/2)[f(x₀) + 2Σf(xᵢ) + f(xₙ)] ≈ ${correct}. (The exact value is ${round2(exact)}; the trapezoidal rule gives an approximation, not the true integral.)`,
    subtopic: 'Numerical Analysis — trapezoidal rule',
    fingerprint: fp('trapezoid', b, n),
  }
}
