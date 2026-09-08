import type { RawQuestion, Difficulty } from '../../types'
import type { RNG } from '../../engine/random'
import { randInt, randNonZeroInt } from '../../engine/random'
import { buildNumericOptions, fp } from '../helpers'
import { round2 } from '../../utils/mathUtils'

/**
 * BODMAS-style simplification: a op b op c (with parentheses at higher
 * difficulty), evaluated with correct operator precedence.
 */
export function generateSimplificationQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const a = randInt(rng, 2, 20)
  const b = randInt(rng, 2, 12)
  const c = randInt(rng, 2, 10)
  const d = randInt(rng, 2, 8)

  let expr: string
  let correct: number
  let wrongLeftToRight: number

  if (difficulty === 'easy') {
    // a + b * c
    correct = a + b * c
    wrongLeftToRight = (a + b) * c
    expr = `${a} + ${b} × ${c}`
  } else if (difficulty === 'moderate') {
    // (a + b) * c - d
    correct = (a + b) * c - d
    wrongLeftToRight = a + b * c - d
    expr = `(${a} + ${b}) × ${c} − ${d}`
  } else {
    // a * b - c * d + a  (multiple mult/add mixed)
    correct = a * b - c * d + a
    wrongLeftToRight = ((a * b - c) * d + a)
    expr = `${a} × ${b} − ${c} × ${d} + ${a}`
  }

  const wrong2 = correct + d
  const wrong3 = correct - a

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrongLeftToRight, wrong2, wrong3])

  return {
    type: 'mcq',
    text: `Simplify: ${expr}`,
    options,
    correctAnswer: correctIndex,
    explanation: `Applying BODMAS/order of operations (brackets and multiplication/division before addition/subtraction) gives ${correct}.`,
    subtopic: 'Quantitative Aptitude — simplification (BODMAS)',
    fingerprint: fp('simplify', a, b, c, d, difficulty),
  }
}

/** Approximation: round each operand before combining, per typical bank-exam "approximate the value" questions. */
export function generateApproximationQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const a = randInt(rng, 100, 999) + round2(rng() * 0.9)
  const b = randInt(rng, 10, 99) + round2(rng() * 0.9)
  const roundedA = Math.round(a)
  const roundedB = Math.round(b)
  const opAdd = rng() < 0.5

  const correct = opAdd ? roundedA + roundedB : roundedA - roundedB
  const wrong1 = opAdd ? roundedA - roundedB : roundedA + roundedB
  const wrong2 = correct + 10
  const wrong3 = Math.round(a) + Math.round(b) - (opAdd ? 0 : 2 * roundedB)

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3])

  return {
    type: 'mcq',
    text: `Find the approximate value of: ${a.toFixed(2)} ${opAdd ? '+' : '−'} ${b.toFixed(2)}  (round each number to the nearest whole number first)`,
    options,
    correctAnswer: correctIndex,
    explanation: `Round each value first: ${a.toFixed(2)} ≈ ${roundedA}, ${b.toFixed(2)} ≈ ${roundedB}. Then ${roundedA} ${opAdd ? '+' : '−'} ${roundedB} = ${correct}.`,
    subtopic: 'Quantitative Aptitude — approximation',
    fingerprint: fp('approx', roundedA, roundedB, opAdd ? 1 : 0),
  }
}
