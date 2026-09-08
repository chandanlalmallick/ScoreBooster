import type { RawQuestion, Difficulty } from '../../types'
import type { RNG } from '../../engine/random'
import { randInt, choice } from '../../engine/random'
import { buildNumericOptions, buildLabeledOptions, fp } from '../helpers'
import { gcd, isPrime } from '../../utils/mathUtils'

/**
 * Order of an element k in the cyclic group (Z_n, +): order = n / gcd(n,k).
 */
export function generateCyclicGroupOrderQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const n = difficulty === 'easy' ? choice(rng, [6, 8, 10, 12]) : difficulty === 'moderate' ? choice(rng, [12, 15, 18, 20]) : choice(rng, [24, 30, 36, 42])
  const k = randInt(rng, 1, n - 1)
  const g = gcd(n, k)
  const correct = n / g

  const { options, correctIndex } = buildNumericOptions(rng, correct, [
    g, // confused order with gcd itself
    n, // assumed every element generates the whole group
    k,
  ])

  return {
    type: 'mcq',
    text: `In the cyclic group (Z_${n}, +), find the order of the element ${k}.`,
    options,
    correctAnswer: correctIndex,
    explanation: `The order of k in Z_n is n / gcd(n,k). Here gcd(${n}, ${k}) = ${g}, so the order is ${n}/${g} = ${correct}.`,
    subtopic: 'Abstract Algebra — order of an element in a cyclic group',
    fingerprint: fp('cyclic-order', n, k),
  }
}

/**
 * |G| and Lagrange's theorem: which of the following can be the order
 * of a subgroup of a group with order |G|? Tests the "divisor" concept
 * rather than raw computation.
 */
export function generateLagrangeQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const g = difficulty === 'easy' ? choice(rng, [12, 18, 20]) : difficulty === 'moderate' ? choice(rng, [24, 30, 36]) : choice(rng, [60, 72, 84])
  const divisors: number[] = []
  for (let i = 1; i <= g; i++) if (g % i === 0) divisors.push(i)
  const validDivisor = choice(rng, divisors.filter((d) => d !== g))
  // build a non-divisor near validDivisor
  let invalid = validDivisor + 1
  while (g % invalid === 0 || invalid >= g) invalid++

  const correctLabel = `${validDivisor}`
  const wrongLabels = [`${invalid}`, `${invalid + 1}`, `${g + 1}`]
  const { options, correctIndex } = buildLabeledOptions(rng, correctLabel, wrongLabels)

  return {
    type: 'mcq',
    text: `A group G has order ${g}. Which of the following could be the order of a subgroup of G?`,
    options,
    correctAnswer: correctIndex,
    explanation: `By Lagrange's Theorem, the order of any subgroup must divide |G| = ${g}. Since ${validDivisor} divides ${g} (${g}/${validDivisor} = ${g / validDivisor}), it is a valid subgroup order; the other options do not divide ${g} evenly.`,
    subtopic: 'Abstract Algebra — Lagrange\'s theorem',
    fingerprint: fp('lagrange', g, validDivisor, invalid),
  }
}

/**
 * Z_p is a field iff p is prime — conceptual check with a randomised n.
 */
export function generateFieldCheckQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const n = difficulty === 'easy' ? randInt(rng, 5, 15) : difficulty === 'moderate' ? randInt(rng, 10, 30) : randInt(rng, 20, 60)
  const prime = isPrime(n)
  const correctLabel = prime ? `Z_${n} is a field` : `Z_${n} is NOT a field (it has zero divisors)`
  const wrongLabels = [
    prime ? `Z_${n} is NOT a field (it has zero divisors)` : `Z_${n} is a field`,
    `Z_${n} is a field only if it is also cyclic`,
    `Cannot be determined without more information`,
  ]
  const { options, correctIndex } = buildLabeledOptions(rng, correctLabel, wrongLabels)

  return {
    type: 'mcq',
    text: `Is Z_${n} (integers mod ${n}, with usual + and ×) a field?`,
    options,
    correctAnswer: correctIndex,
    explanation: `Z_n is a field if and only if n is prime, because every nonzero element then has a multiplicative inverse. ${n} is ${prime ? 'prime' : 'not prime'}${prime ? '' : ` (it factors, e.g. ${n} = ${smallestFactor(n)} × ${n / smallestFactor(n)})`}, so Z_${n} ${prime ? 'is' : 'is not'} a field.`,
    subtopic: 'Abstract Algebra — fields and prime moduli',
    fingerprint: fp('field-check', n),
  }
}

function smallestFactor(n: number): number {
  for (let i = 2; i < n; i++) if (n % i === 0) return i
  return n
}
