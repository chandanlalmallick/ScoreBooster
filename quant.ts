import type { RawQuestion, Difficulty } from '../../types'
import type { RNG } from '../../engine/random'
import { randInt, choice } from '../../engine/random'
import { buildNumericOptions, fp } from '../helpers'
import { round2 } from '../../utils/mathUtils'

export function generatePercentageQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const base = difficulty === 'easy' ? randInt(rng, 100, 500) * 1 : difficulty === 'moderate' ? randInt(rng, 200, 900) : randInt(rng, 500, 5000)
  const pct = difficulty === 'easy' ? choice(rng, [10, 20, 25, 50]) : difficulty === 'moderate' ? choice(rng, [12, 15, 18, 35, 45]) : choice(rng, [12.5, 17.5, 33.33, 62.5])
  const correct = round2((base * pct) / 100)

  const wrong1 = round2(base + (base * pct) / 100) // added instead of just the percentage amount
  const wrong2 = round2((base * (100 - Number(pct))) / 100) // computed the complement
  const wrong3 = round2((base * pct) / 10)

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3], (v) => v.toFixed(2))

  return {
    type: 'mcq',
    text: `Find ${pct}% of ${base}.`,
    options,
    correctAnswer: correctIndex,
    explanation: `${pct}% of ${base} = (${pct}/100) × ${base} = ${correct}.`,
    subtopic: 'Quantitative Aptitude — percentage',
    fingerprint: fp('pct', base, pct),
  }
}

export function generateProfitLossQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const cp = difficulty === 'easy' ? randInt(rng, 100, 1000) : difficulty === 'moderate' ? randInt(rng, 500, 5000) : randInt(rng, 1000, 20000)
  const pct = difficulty === 'easy' ? choice(rng, [10, 20, 25]) : difficulty === 'moderate' ? choice(rng, [12, 15, 18, 22]) : choice(rng, [8.5, 13.5, 27.5])
  const isProfit = rng() < 0.5
  const sp = isProfit ? cp * (1 + pct / 100) : cp * (1 - pct / 100)
  const correct = round2(sp)

  const wrong1 = round2(isProfit ? cp - (cp * pct) / 100 : cp + (cp * pct) / 100) // flipped profit/loss direction
  const wrong2 = round2(cp * (pct / 100))
  const wrong3 = round2(cp + pct)

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3], (v) => v.toFixed(2))

  return {
    type: 'mcq',
    text: `A shopkeeper buys an article for ₹${cp} and sells it at a ${pct}% ${isProfit ? 'profit' : 'loss'}. Find the selling price (to 2 decimals).`,
    options,
    correctAnswer: correctIndex,
    explanation: `${isProfit ? 'Profit' : 'Loss'} of ${pct}% means SP = CP × (1 ${isProfit ? '+' : '−'} ${pct}/100) = ${cp} × ${isProfit ? 1 + pct / 100 : 1 - pct / 100} = ₹${correct}.`,
    subtopic: 'Quantitative Aptitude — profit and loss',
    fingerprint: fp('profitloss', cp, pct, isProfit ? 1 : 0),
  }
}

export function generateSimpleInterestQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const p = difficulty === 'easy' ? randInt(rng, 1000, 5000) : difficulty === 'moderate' ? randInt(rng, 2000, 15000) : randInt(rng, 5000, 50000)
  const r = difficulty === 'easy' ? choice(rng, [4, 5, 8, 10]) : choice(rng, [6, 7.5, 9, 11.5])
  const t = difficulty === 'hard' ? randInt(rng, 2, 5) : randInt(rng, 1, 3)
  const si = (p * r * t) / 100
  const correct = round2(si)

  const wrong1 = round2(p * r * t) // forgot to divide by 100
  const wrong2 = round2((p * r) / 100) // forgot to multiply by time
  const wrong3 = round2(p * Math.pow(1 + r / 100, t) - p) // used compound interest formula instead

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3], (v) => v.toFixed(2))

  return {
    type: 'mcq',
    text: `Find the Simple Interest on ₹${p} at ${r}% per annum for ${t} years.`,
    options,
    correctAnswer: correctIndex,
    explanation: `SI = (P × R × T) / 100 = (${p} × ${r} × ${t}) / 100 = ₹${correct}.`,
    subtopic: 'Quantitative Aptitude — simple interest',
    fingerprint: fp('si', p, r, t),
  }
}

export function generateCompoundInterestQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const p = difficulty === 'easy' ? randInt(rng, 1000, 5000) : randInt(rng, 2000, 15000)
  const r = choice(rng, [5, 8, 10, 12, 20])
  const t = difficulty === 'hard' ? 3 : 2
  const amount = p * Math.pow(1 + r / 100, t)
  const ci = amount - p
  const correct = round2(ci)

  const wrong1 = round2((p * r * t) / 100) // used simple interest formula instead
  const wrong2 = round2(amount)
  const wrong3 = round2(ci * 1.1)

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3], (v) => v.toFixed(2))

  return {
    type: 'mcq',
    text: `Find the Compound Interest on ₹${p} at ${r}% per annum for ${t} years (compounded annually).`,
    options,
    correctAnswer: correctIndex,
    explanation: `Amount = P(1 + R/100)^T = ${p} × (1 + ${r}/100)^${t} ≈ ₹${round2(amount)}. CI = Amount − P ≈ ₹${correct}.`,
    subtopic: 'Quantitative Aptitude — compound interest',
    fingerprint: fp('ci', p, r, t),
  }
}

export function generateAverageQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const count = difficulty === 'easy' ? 4 : difficulty === 'moderate' ? 5 : 6
  const values: number[] = []
  for (let i = 0; i < count; i++) values.push(randInt(rng, 10, 99))
  const sum = values.reduce((s, v) => s + v, 0)
  const correct = round2(sum / count)

  const wrong1 = round2(sum / (count - 1)) // wrong divisor
  const wrong2 = round2(sum / (count + 1))
  const wrong3 = Math.max(...values)

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3], (v) => v.toFixed(2))

  return {
    type: 'mcq',
    text: `Find the average of: ${values.join(', ')}`,
    options,
    correctAnswer: correctIndex,
    explanation: `Average = (sum of values) / (number of values) = ${sum} / ${count} = ${correct}.`,
    subtopic: 'Quantitative Aptitude — average',
    fingerprint: fp('avg', ...values),
  }
}

export function generateRatioQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const a = randInt(rng, 2, 9)
  const b = randInt(rng, 2, 9)
  const total = difficulty === 'easy' ? (a + b) * randInt(rng, 4, 10) : difficulty === 'moderate' ? (a + b) * randInt(rng, 8, 20) : (a + b) * randInt(rng, 15, 40)
  const shareA = (total * a) / (a + b)
  const correct = round2(shareA)

  const wrong1 = round2((total * b) / (a + b)) // swapped which share was asked for
  const wrong2 = round2(total / 2)
  const wrong3 = round2((total * a) / b)

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3], (v) => v.toFixed(2))

  return {
    type: 'mcq',
    text: `₹${total} is divided between two people in the ratio ${a}:${b}. Find the first person's share.`,
    options,
    correctAnswer: correctIndex,
    explanation: `First share = total × a/(a+b) = ${total} × ${a}/${a + b} = ${correct}.`,
    subtopic: 'Quantitative Aptitude — ratio and proportion',
    fingerprint: fp('ratio', a, b, total),
  }
}

export function generateTimeSpeedDistanceQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const speed = difficulty === 'easy' ? choice(rng, [40, 50, 60, 80]) : choice(rng, [36, 45, 54, 72, 90])
  const time = difficulty === 'hard' ? round2(randInt(rng, 15, 45) / 10) : randInt(rng, 1, 5)
  const distance = round2(speed * time)
  // ask for time given distance and speed (inverse of the generation), to avoid trivial "just multiply"
  const askTime = difficulty !== 'easy'
  const correct = askTime ? round2(distance / speed) : distance

  const wrong1 = askTime ? round2(distance * speed) : round2(distance / speed)
  const wrong2 = askTime ? round2(speed / distance) : round2(speed - distance)
  const wrong3 = askTime ? time + 1 : distance + speed

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3], (v) => v.toFixed(2))

  return {
    type: 'mcq',
    text: askTime
      ? `A car travels ${distance} km at a constant speed of ${speed} km/h. How long does the journey take (in hours)?`
      : `A car travels at ${speed} km/h for ${time} hours. Find the distance covered.`,
    options,
    correctAnswer: correctIndex,
    explanation: askTime
      ? `Time = Distance / Speed = ${distance} / ${speed} = ${correct} hours.`
      : `Distance = Speed × Time = ${speed} × ${time} = ${correct} km.`,
    subtopic: 'Quantitative Aptitude — time, speed and distance',
    fingerprint: fp('tsd', speed, time, askTime ? 1 : 0),
  }
}
