import type { RawQuestion, Difficulty } from '../../types'
import type { RNG } from '../../engine/random'
import { randInt } from '../../engine/random'
import { buildNumericOptions, fp } from '../helpers'
import { nCr, round2 } from '../../utils/mathUtils'

/**
 * Draw r items from n (a mixture of two types, say "good"/"defective")
 * without replacement; probability all r are "good" type.
 */
export function generateHypergeometricQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const total = difficulty === 'easy' ? randInt(rng, 8, 12) : difficulty === 'moderate' ? randInt(rng, 10, 18) : randInt(rng, 15, 25)
  const good = randInt(rng, 3, total - 3)
  const r = difficulty === 'hard' ? randInt(rng, 3, 4) : randInt(rng, 2, 3)
  if (good < r || total - good < 0) {
    // fall back to a safe configuration if random draw is degenerate
  }
  const favorable = nCr(good, r)
  const totalWays = nCr(total, r)
  const correctExact = totalWays > 0 ? favorable / totalWays : 0
  const correct = round2(correctExact)

  const wrong1 = round2(good / total) // ignored combinatorics, used naive single-draw probability
  const wrong2 = round2((good / total) ** r) // wrongly assumed independence (with replacement)
  const wrong3 = round2(1 - correctExact)

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3], (n) => n.toFixed(3))

  return {
    type: 'mcq',
    text: `A box has ${total} items, of which ${good} are non-defective. If ${r} items are drawn at random WITHOUT replacement, find the probability that all ${r} are non-defective (to 3 decimals).`,
    options,
    correctAnswer: correctIndex,
    explanation: `This is a hypergeometric setup: P = C(${good},${r}) / C(${total},${r}) = ${favorable}/${totalWays} ≈ ${correct}. Because the draws are without replacement, you must use combinations, not simple multiplication of a fixed per-draw probability.`,
    subtopic: 'Probability — hypergeometric (sampling without replacement)',
    fingerprint: fp('hypergeom', total, good, r),
  }
}

/** Binomial probability P(X = k) for X ~ Bin(n, p). */
export function generateBinomialQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const n = difficulty === 'easy' ? randInt(rng, 4, 6) : difficulty === 'moderate' ? randInt(rng, 6, 10) : randInt(rng, 8, 14)
  const pPercent = [10, 20, 25, 30, 40, 50, 60][randInt(rng, 0, 6)]
  const p = pPercent / 100
  const k = randInt(rng, 0, n)

  const prob = nCr(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k)
  const correct = round2(prob)

  const wrong1 = round2(nCr(n, k) * Math.pow(p, k)) // forgot the (1-p)^(n-k) factor
  const wrong2 = round2(Math.pow(p, k) * Math.pow(1 - p, n - k)) // forgot the combinatorial factor
  const wrong3 = round2(k / n)

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3], (v) => v.toFixed(3))

  return {
    type: 'mcq',
    text: `X ~ Binomial(n=${n}, p=${p}). Find P(X = ${k}) (to 3 decimals).`,
    options,
    correctAnswer: correctIndex,
    explanation: `P(X=k) = C(n,k) pᵏ (1−p)ⁿ⁻ᵏ = C(${n},${k}) × ${p}^${k} × ${round2(1 - p)}^${n - k} ≈ ${correct}.`,
    subtopic: 'Probability — binomial distribution',
    fingerprint: fp('binomial', n, pPercent, k),
  }
}

/** Sample mean and variance (population, dividing by n) from a small integer dataset. */
export function generateMeanVarianceQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const count = difficulty === 'easy' ? 4 : difficulty === 'moderate' ? 5 : 6
  const data: number[] = []
  for (let i = 0; i < count; i++) data.push(randInt(rng, 1, 20))

  const mean = data.reduce((s, v) => s + v, 0) / count
  const variance = data.reduce((s, v) => s + (v - mean) ** 2, 0) / count
  const correct = round2(variance)

  const wrong1 = round2(data.reduce((s, v) => s + (v - mean) ** 2, 0) / (count - 1)) // sample (n-1) variance instead
  const wrong2 = round2(mean) // confused variance with mean
  const wrong3 = round2(Math.sqrt(variance)) // gave standard deviation instead of variance

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3], (v) => v.toFixed(2))

  return {
    type: 'mcq',
    text: `Find the (population) variance of the dataset: {${data.join(', ')}}  (to 2 decimals)`,
    options,
    correctAnswer: correctIndex,
    explanation: `Mean = ${round2(mean)}. Variance = (1/n)Σ(xᵢ−mean)² = ${correct}. Note this uses n in the denominator (population variance), not n−1.`,
    subtopic: 'Statistics — mean and variance',
    fingerprint: fp('meanvar', ...data),
  }
}
