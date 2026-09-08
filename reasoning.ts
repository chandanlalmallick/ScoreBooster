import type { RawQuestion, Difficulty } from '../../types'
import type { RNG } from '../../engine/random'
import { randInt, choice } from '../../engine/random'
import { buildNumericOptions, buildLabeledOptions, fp } from '../helpers'

/**
 * Number series: arithmetic, then arithmetic-with-growing-step, then
 * alternating two interleaved series at hard difficulty.
 */
export function generateNumberSeriesQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const start = randInt(rng, 2, 20)
  let series: number[] = []
  let explanation = ''
  let next = 0

  if (difficulty === 'easy') {
    const step = randInt(rng, 2, 9)
    series = Array.from({ length: 5 }, (_, i) => start + i * step)
    next = start + 5 * step
    explanation = `This is a simple arithmetic series with a common difference of ${step}: each term = previous + ${step}.`
  } else if (difficulty === 'moderate') {
    const step0 = randInt(rng, 2, 5)
    const growth = randInt(rng, 1, 3)
    series = [start]
    let step = step0
    for (let i = 0; i < 4; i++) {
      series.push(series[series.length - 1] + step)
      step += growth
    }
    next = series[series.length - 1] + step
    explanation = `The difference between consecutive terms increases by ${growth} each time, starting from a difference of ${step0}.`
  } else {
    // interleaved: odd positions +a, even positions +b
    const a = randInt(rng, 2, 6)
    const b = randInt(rng, 3, 8)
    series = [start]
    for (let i = 0; i < 5; i++) {
      const delta = i % 2 === 0 ? a : b
      series.push(series[series.length - 1] + delta)
    }
    next = series[series.length - 1] + (series.length % 2 === 1 ? a : b)
    series = series.slice(0, 6)
    explanation = `This series alternates between adding ${a} and adding ${b}.`
  }

  const correct = next
  const { options, correctIndex } = buildNumericOptions(rng, correct, [
    correct + 1,
    correct - 1,
    series[series.length - 1] + (series[series.length - 1] - series[series.length - 2]) * 2,
  ])

  return {
    type: 'mcq',
    text: `Find the next number in the series: ${series.join(', ')}, ?`,
    options,
    correctAnswer: correctIndex,
    explanation: `${explanation} The next term is ${correct}.`,
    subtopic: 'Reasoning — number series',
    fingerprint: fp('num-series', ...series, difficulty),
  }
}

/**
 * Coding-decoding: each letter is shifted by a fixed amount in the
 * alphabet. Student must decode a coded word.
 */
export function generateCodingDecodingQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const words = ['LOGIC', 'MARKET', 'SYSTEM', 'FRIEND', 'PLANET', 'SIGNAL', 'GARDEN', 'MOTHER', 'WINTER', 'CIRCLE']
  const word = choice(rng, words)
  const shift = difficulty === 'easy' ? randInt(rng, 1, 3) : difficulty === 'moderate' ? randInt(rng, 2, 5) : randInt(rng, 3, 8)

  const shiftChar = (c: string, s: number) => {
    const code = ((c.charCodeAt(0) - 65 + s + 260) % 26) + 65
    return String.fromCharCode(code)
  }
  const coded = word.split('').map((c) => shiftChar(c, shift)).join('')
  // ask: if WORD is coded as `coded`, how is a second word coded?
  const word2 = choice(rng, words.filter((w) => w !== word))
  const coded2 = word2.split('').map((c) => shiftChar(c, shift)).join('')

  const wrong1 = word2.split('').map((c) => shiftChar(c, shift - 1)).join('')
  const wrong2 = word2.split('').map((c) => shiftChar(c, shift + 1)).join('')
  const wrong3 = word2.split('').reverse().map((c) => shiftChar(c, shift)).join('')

  const { options, correctIndex } = buildLabeledOptions(rng, coded2, [wrong1, wrong2, wrong3])

  return {
    type: 'mcq',
    text: `In a certain code, ${word} is written as ${coded}. How is ${word2} written in that code?`,
    options,
    correctAnswer: correctIndex,
    explanation: `Each letter of ${word} is shifted forward by ${shift} position(s) in the alphabet to get ${coded}. Applying the same shift of ${shift} to each letter of ${word2} gives ${coded2}.`,
    subtopic: 'Reasoning — coding-decoding',
    fingerprint: fp('coding', word, word2, shift),
  }
}

/**
 * Blood relations: a small randomised family-tree statement, asking
 * for the relationship between two people, computed from the graph.
 */
export function generateBloodRelationQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  // Simple 3-generation template: A is father of B; B is father/mother of C
  const names = ['Arjun', 'Bina', 'Chetan', 'Divya', 'Esha', 'Farhan', 'Gita', 'Harish']
  const [a, b, c] = [choice(rng, names), choice(rng, names.filter((n) => n)), choice(rng, names)]
  const aMale = rng() < 0.5
  const cMale = rng() < 0.5

  if (difficulty === 'easy') {
    // A is parent of B. What is B to A?
    const relation = aMale ? 'father' : 'mother'
    const child = cMale ? 'son' : 'daughter'
    const correctLabel = child
    const wrongLabels = ['brother', 'cousin', aMale ? 'daughter' : 'son'].filter((l) => l !== correctLabel)
    const { options, correctIndex } = buildLabeledOptions(rng, correctLabel, wrongLabels)
    return {
      type: 'mcq',
      text: `${a} is the ${relation} of ${b}. What is ${b} to ${a}?`,
      options,
      correctAnswer: correctIndex,
      explanation: `Since ${a} is the ${relation} of ${b}, ${b} is ${a}'s ${correctLabel} (assuming ${b} is ${cMale ? 'male' : 'female'}).`,
      subtopic: 'Reasoning — blood relations (direct)',
      fingerprint: fp('bloodrel-easy', a, b, relation),
    }
  }

  // moderate/hard: two-step relation, A parent of B, B parent of C -> A is grandparent of C
  const relAB = aMale ? 'father' : 'mother'
  const bMale = rng() < 0.5
  const relBC = bMale ? 'father' : 'mother'
  const grand = aMale ? 'grandfather' : 'grandmother'
  const correctLabel = grand
  const wrongLabels = ['uncle', 'father-in-law', aMale ? 'grandmother' : 'grandfather']
  const { options, correctIndex } = buildLabeledOptions(rng, correctLabel, wrongLabels)

  return {
    type: 'mcq',
    text: `${a} is the ${relAB} of ${b}. ${b} is the ${relBC} of ${c}. How is ${a} related to ${c}?`,
    options,
    correctAnswer: correctIndex,
    explanation: `${a} → ${b} (${relAB}) → ${c} (${relBC}) is a two-generation chain, so ${a} is ${c}'s ${correctLabel}.`,
    subtopic: 'Reasoning — blood relations (multi-generation)',
    fingerprint: fp('bloodrel-multi', a, b, c, relAB, relBC),
  }
}

/** Numeric analogy: A:B :: C:? where the relation is a fixed arithmetic transform. */
export function generateAnalogyQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  type Rule = { name: string; f: (n: number) => number }
  const rules: Rule[] = [
    { name: 'square', f: (n) => n * n },
    { name: 'double then add 1', f: (n) => n * 2 + 1 },
    { name: 'multiply by 3', f: (n) => n * 3 },
    { name: 'add its digit sum', f: (n) => n + String(n).split('').reduce((s, d) => s + Number(d), 0) },
  ]
  const rule = difficulty === 'hard' ? rules[3] : choice(rng, rules.slice(0, 3))
  const a = randInt(rng, 2, difficulty === 'easy' ? 9 : 15)
  const c = randInt(rng, 2, difficulty === 'easy' ? 9 : 15)
  const b = rule.f(a)
  const correct = rule.f(c)

  const { options, correctIndex } = buildNumericOptions(rng, correct, [correct + 1, correct - 1, c * 2])

  return {
    type: 'mcq',
    text: `${a} : ${b} :: ${c} : ?`,
    options,
    correctAnswer: correctIndex,
    explanation: `The rule linking each pair is "${rule.name}": applying it to ${a} gives ${b}, so applying it to ${c} gives ${correct}.`,
    subtopic: 'Reasoning — numeric analogy',
    fingerprint: fp('analogy', rule.name, a, c),
  }
}

/** Odd-one-out among 4 numbers, based on a hidden shared property. */
export function generateClassificationQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const isEven = (n: number) => n % 2 === 0
  const isSquare = (n: number) => Number.isInteger(Math.sqrt(n))
  const isMultipleOf3 = (n: number) => n % 3 === 0

  const propertyPool = difficulty === 'easy'
    ? [{ name: 'even numbers', test: isEven }]
    : difficulty === 'moderate'
      ? [{ name: 'multiples of 3', test: isMultipleOf3 }, { name: 'even numbers', test: isEven }]
      : [{ name: 'perfect squares', test: isSquare }, { name: 'multiples of 3', test: isMultipleOf3 }]
  const prop = choice(rng, propertyPool)

  const matching: number[] = []
  let guard = 0
  while (matching.length < 3 && guard < 200) {
    guard++
    const n = randInt(rng, 4, 60)
    if (prop.test(n) && !matching.includes(n)) matching.push(n)
  }
  let odd = 0
  guard = 0
  while (guard < 200) {
    guard++
    const n = randInt(rng, 4, 60)
    if (!prop.test(n) && !matching.includes(n)) {
      odd = n
      break
    }
  }

  const numberSet = [...matching, odd]
  const shuffledForDisplay = numberSet // keep deterministic order for the fingerprint; UI shows as-is
  const correctLabel = `${odd}`
  const otherLabels = matching.map((m) => `${m}`)
  const { options, correctIndex } = buildLabeledOptions(rng, correctLabel, otherLabels)

  return {
    type: 'mcq',
    text: `Find the odd one out: ${shuffledForDisplay.join(', ')}`,
    options,
    correctAnswer: correctIndex,
    explanation: `${matching.join(', ')} are all ${prop.name}, while ${odd} is not — so ${odd} is the odd one out.`,
    subtopic: 'Reasoning — classification / odd one out',
    fingerprint: fp('classify', ...numberSet, prop.name),
  }
}
