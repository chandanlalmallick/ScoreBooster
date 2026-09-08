import type { RawQuestion, Difficulty } from '../../types'
import type { RNG } from '../../engine/random'
import { randInt, randNonZeroInt } from '../../engine/random'
import { buildNumericOptions, fp } from '../helpers'
import { round2 } from '../../utils/mathUtils'

/**
 * First-order linear ODE: dy/dx + k y = 0, y(0) = y0. Solution
 * y = y0 e^(-kx). We ask for y at a given x.
 */
export function generateFirstOrderODEQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const k = difficulty === 'easy' ? randInt(rng, 1, 3) : difficulty === 'moderate' ? randInt(rng, 1, 5) : randNonZeroInt(rng, -5, 5)
  const y0 = randInt(rng, 1, 5)
  const x = difficulty === 'hard' ? randInt(rng, 1, 3) : 1

  const correctExact = y0 * Math.exp(-k * x)
  const correct = round2(correctExact)

  const wrong1 = round2(y0 * Math.exp(k * x)) // sign error in exponent
  const wrong2 = round2(y0 - k * x) // treated it as linear decay instead of exponential
  const wrong3 = round2(y0 * Math.exp(-k))

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3], (v) => v.toFixed(2))

  return {
    type: 'mcq',
    text: `Solve dy/dx + ${k}y = 0 with y(0) = ${y0}. Find y(${x}) (to 2 decimals).`,
    options,
    correctAnswer: correctIndex,
    explanation: `This is separable: dy/y = −${k}dx, giving y = y0·e^(−${k}x). With y0=${y0}, y(${x}) = ${y0}·e^(−${k}×${x}) ≈ ${correct}.`,
    subtopic: 'Ordinary Differential Equations — first-order linear (separable)',
    fingerprint: fp('ode1', k, y0, x),
  }
}

/**
 * Modulus and argument of a complex number a + bi.
 */
export function generateComplexModulusQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  // Use Pythagorean-triple-friendly pairs at easy/moderate so |z| is a clean integer.
  const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]
  let a: number, b: number, correct: number
  if (difficulty === 'hard') {
    a = randNonZeroInt(rng, -9, 9)
    b = randNonZeroInt(rng, -9, 9)
    correct = round2(Math.sqrt(a * a + b * b))
  } else {
    const t = triples[randInt(rng, 0, triples.length - 1)]
    const sign1 = rng() < 0.5 ? -1 : 1
    const sign2 = rng() < 0.5 ? -1 : 1
    a = t[0] * sign1
    b = t[1] * sign2
    correct = t[2]
  }

  const wrong1 = round2(Math.abs(a) + Math.abs(b)) // used |a|+|b| instead of sqrt(a^2+b^2)
  const wrong2 = round2(a * a + b * b) // forgot the square root
  const wrong3 = round2(Math.sqrt(Math.abs(a * b)))

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3], (v) => v.toFixed(2))

  return {
    type: 'mcq',
    text: `Find the modulus |z| of the complex number z = ${a} ${b >= 0 ? '+' : '-'} ${Math.abs(b)}i  (to 2 decimals)`,
    options,
    correctAnswer: correctIndex,
    explanation: `|z| = √(a² + b²) = √(${a}² + ${b}²) = √${a * a + b * b} ≈ ${correct}.`,
    subtopic: 'Complex Analysis — modulus of a complex number',
    fingerprint: fp('modulus', a, b),
  }
}
