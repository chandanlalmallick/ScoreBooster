import type { RawQuestion, Difficulty } from '../../types'
import type { RNG } from '../../engine/random'
import { randInt } from '../../engine/random'
import { buildNumericOptions, fp } from '../helpers'
import { gcd } from '../../utils/mathUtils'

/** a^k mod n, computed via fast modular exponentiation. */
function modPow(base: number, exp: number, mod: number): number {
  let result = 1
  base = base % mod
  while (exp > 0) {
    if (exp & 1) result = (result * base) % mod
    exp = Math.floor(exp / 2)
    base = (base * base) % mod
  }
  return result
}

export function generateModularExponentQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const mod = difficulty === 'easy' ? randInt(rng, 5, 12) : difficulty === 'moderate' ? randInt(rng, 10, 25) : randInt(rng, 20, 97)
  const base = randInt(rng, 2, mod - 1)
  const exp = difficulty === 'easy' ? randInt(rng, 2, 5) : difficulty === 'moderate' ? randInt(rng, 5, 15) : randInt(rng, 10, 40)

  const correct = modPow(base, exp, mod)
  const wrong1 = (Math.pow(base, 2) % mod) // only squared once regardless of exponent
  const wrong2 = (correct + 1) % mod
  const wrong3 = mod - correct === 0 ? (correct + 2) % mod : mod - correct

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3])

  return {
    type: 'mcq',
    text: `Find ${base}^${exp} mod ${mod}.`,
    options,
    correctAnswer: correctIndex,
    explanation: `Using fast (repeated-squaring) modular exponentiation, ${base}^${exp} mod ${mod} = ${correct}.`,
    subtopic: 'Number Theory — modular exponentiation',
    fingerprint: fp('modpow', base, exp, mod),
  }
}

export function generateGcdLcmQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const range = difficulty === 'easy' ? [10, 60] : difficulty === 'moderate' ? [30, 150] : [60, 400]
  const a = randInt(rng, range[0], range[1])
  const b = randInt(rng, range[0], range[1])
  const askLcm = rng() < 0.5
  const g = gcd(a, b)
  const l = (a * b) / g
  const correct = askLcm ? l : g

  const wrong1 = askLcm ? g : l // swapped gcd/lcm
  const wrong2 = a * b // forgot to divide by gcd (if lcm) / just multiplied (if gcd asked)
  const wrong3 = Math.abs(a - b) || correct + 1

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3])

  return {
    type: 'mcq',
    text: `Find the ${askLcm ? 'LCM' : 'GCD'} of ${a} and ${b}.`,
    options,
    correctAnswer: correctIndex,
    explanation: `GCD(${a}, ${b}) = ${g} (via the Euclidean algorithm). ${askLcm ? `LCM(${a},${b}) = (${a}×${b})/GCD = ${l}.` : ''} The ${askLcm ? 'LCM' : 'GCD'} is ${correct}.`,
    subtopic: 'Number Theory — GCD and LCM',
    fingerprint: fp('gcdlcm', a, b, askLcm ? 1 : 0),
  }
}
