import type { RawQuestion, Difficulty } from '../../types'
import type { RNG } from '../../engine/random'
import { randInt } from '../../engine/random'
import { buildNumericOptions, fp } from '../helpers'
import { round2 } from '../../utils/mathUtils'

/**
 * A small randomised "bar chart" table (4 categories, values), asked as
 * a data-interpretation question — e.g. what % of the total does the
 * largest category represent.
 */
export function generateDataInterpretationQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const categories = ['Science', 'Arts', 'Commerce', 'Engineering']
  const range = difficulty === 'easy' ? [50, 150] : difficulty === 'moderate' ? [100, 400] : [200, 900]
  const values = categories.map(() => randInt(rng, range[0], range[1]))
  const total = values.reduce((s, v) => s + v, 0)
  const maxIdx = values.indexOf(Math.max(...values))
  const correct = round2((values[maxIdx] / total) * 100)

  const wrong1 = round2((values[maxIdx] / (total - values[maxIdx])) * 100) // divided by wrong denominator
  const wrong2 = round2(100 / categories.length)
  const wrong3 = round2(correct + 5)

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3], (v) => `${v.toFixed(1)}%`)

  const tableStr = categories.map((c, i) => `${c}: ${values[i]}`).join(', ')

  return {
    type: 'mcq',
    text: `The table shows the number of students enrolled by stream: ${tableStr}. What percentage of the total enrolment does the largest stream (${categories[maxIdx]}) represent (to 1 decimal)?`,
    options,
    correctAnswer: correctIndex,
    explanation: `Total enrolment = ${total}. ${categories[maxIdx]} has the highest value (${values[maxIdx]}). Percentage = (${values[maxIdx]}/${total}) × 100 ≈ ${correct}%.`,
    subtopic: 'Data Interpretation',
    fingerprint: fp('di-bar', ...values),
  }
}

/** Simple mathematical/logical reasoning: deduce a missing value from a stated relationship. */
export function generateMathematicalReasoningQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const x = randInt(rng, difficulty === 'easy' ? 2 : 5, difficulty === 'hard' ? 40 : 20)
  const k = randInt(rng, 2, difficulty === 'hard' ? 9 : 5)
  const c = randInt(rng, 1, 15)
  // "k times a number, plus c, equals result" — solve for the number given the result.
  const result = k * x + c
  const correct = x

  const wrong1 = round2((result + c) / k) // sign error on c
  const wrong2 = round2(result / k) // forgot to subtract c first
  const wrong3 = x + k

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3])

  return {
    type: 'mcq',
    text: `If ${k} times a number, increased by ${c}, equals ${result}, find the number.`,
    options,
    correctAnswer: correctIndex,
    explanation: `Let the number be n. ${k}n + ${c} = ${result} ⟹ ${k}n = ${result - c} ⟹ n = ${correct}.`,
    subtopic: 'Mathematical Reasoning',
    fingerprint: fp('math-reasoning', x, k, c),
  }
}
