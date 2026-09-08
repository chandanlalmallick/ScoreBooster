import type { RawQuestion, Difficulty } from '../../types'
import type { RNG } from '../../engine/random'
import { randInt, randNonZeroInt } from '../../engine/random'
import { buildNumericOptions, fp } from '../helpers'
import { det2, det3 } from '../../utils/mathUtils'

/**
 * Eigenvalues of a 2x2 matrix: trace/determinant approach, chosen so
 * the discriminant is always a perfect square (real, distinct integer
 * eigenvalues) — this keeps the question well-posed for an MCQ answer
 * (we ask for the larger eigenvalue).
 */
export function generateEigenvalueQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const range = difficulty === 'easy' ? 4 : difficulty === 'moderate' ? 6 : 9
  let l1 = 0, l2 = 0, a = 0, b = 0, c = 0, d = 0
  // Pick two integer eigenvalues first, then build a matrix with them
  // via a simple diagonal + off-diagonal construction that keeps trace/det exact.
  l1 = randNonZeroInt(rng, -range, range)
  l2 = randNonZeroInt(rng, -range, range)
  while (l2 === l1) l2 = randNonZeroInt(rng, -range, range)
  a = l1
  d = l2
  b = difficulty === 'easy' ? 0 : randInt(rng, 1, 3)
  c = 0 // keep it triangular so eigenvalues are exactly a and d — well-posed and checkable

  const trace = a + d
  const det = det2(a, b, c, d)
  const larger = Math.max(l1, l2)

  const { options, correctIndex } = buildNumericOptions(rng, larger, [
    Math.min(l1, l2), // picked the smaller root
    trace, // confused trace with an eigenvalue
    det,
  ])

  return {
    type: 'mcq',
    text: `Matrix A = [[${a}, ${b}], [${c}, ${d}]]. Find the larger eigenvalue of A.`,
    options,
    correctAnswer: correctIndex,
    explanation: `A is triangular, so its eigenvalues are exactly its diagonal entries: ${a} and ${d}. The larger one is ${larger}. (Check: trace = ${trace} = sum of eigenvalues, det = ${det} = product of eigenvalues.)`,
    subtopic: 'Linear Algebra — eigenvalues of a triangular matrix',
    fingerprint: fp('eigen', a, b, c, d),
  }
}

/** Determinant of a 3x3 integer matrix via cofactor expansion. */
export function generateDeterminantQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const range = difficulty === 'easy' ? 3 : difficulty === 'moderate' ? 5 : 7
  const m = [
    [randInt(rng, -range, range), randInt(rng, -range, range), randInt(rng, -range, range)],
    [randInt(rng, -range, range), randInt(rng, -range, range), randInt(rng, -range, range)],
    [randInt(rng, -range, range), randInt(rng, -range, range), randInt(rng, -range, range)],
  ]
  const correct = det3(m)
  const wrong1 = -correct // sign error from cofactor expansion
  const wrong2 = m[0][0] * m[1][1] * m[2][2] // treated as if diagonal product only
  const wrong3 = correct + m[0][1] * m[1][0] * m[2][2]

  const { options, correctIndex } = buildNumericOptions(rng, correct, [wrong1, wrong2, wrong3])
  const rows = m.map((r) => `[${r.join(', ')}]`).join(', ')

  return {
    type: 'mcq',
    text: `Find the determinant of the 3×3 matrix: ${rows}`,
    options,
    correctAnswer: correctIndex,
    explanation: `Expanding along the first row: det = ${m[0][0]}·(${m[1][1]}·${m[2][2]} − ${m[1][2]}·${m[2][1]}) − ${m[0][1]}·(${m[1][0]}·${m[2][2]} − ${m[1][2]}·${m[2][0]}) + ${m[0][2]}·(${m[1][0]}·${m[2][1]} − ${m[1][1]}·${m[2][0]}) = ${correct}.`,
    subtopic: 'Linear Algebra — determinant by cofactor expansion',
    fingerprint: fp('det3', ...m.flat()),
  }
}

/**
 * Rank of a 2x3 matrix built from one independent row and one row that
 * is a scalar multiple (rank 1) or not (rank 2) — student must notice
 * linear dependence, not just compute a formula.
 */
export function generateRankQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const dependent = difficulty !== 'hard' ? rng() < 0.5 : rng() < 0.3
  const row1 = [randNonZeroInt(rng, -5, 5), randNonZeroInt(rng, -5, 5), randNonZeroInt(rng, -5, 5)]
  let row2: number[]
  let correctRank: number
  if (dependent) {
    const k = randNonZeroInt(rng, -3, 3)
    row2 = row1.map((v) => v * k)
    correctRank = 1
  } else {
    row2 = [randNonZeroInt(rng, -5, 5), randNonZeroInt(rng, -5, 5), randNonZeroInt(rng, -5, 5)]
    // ensure genuinely independent (not a scalar multiple)
    const ratios = row1.map((v, i) => (row2[i] === 0 ? NaN : v / row2[i]))
    const allSame = ratios.every((r) => Math.abs(r - ratios[0]) < 1e-9)
    if (allSame) row2[0] += 1
    correctRank = 2
  }

  const { options, correctIndex } = buildNumericOptions(rng, correctRank, [
    correctRank === 1 ? 2 : 1,
    0,
    3,
  ])

  return {
    type: 'mcq',
    text: `Find the rank of the matrix: [[${row1.join(', ')}], [${row2.join(', ')}]]`,
    options,
    correctAnswer: correctIndex,
    explanation:
      correctRank === 1
        ? `Row 2 is a scalar multiple of Row 1, so the rows are linearly dependent — the rank is 1.`
        : `Neither row is a scalar multiple of the other, so both rows are linearly independent — the rank is 2 (the maximum possible for a 2×3 matrix).`,
    subtopic: 'Linear Algebra — rank via row dependence',
    fingerprint: fp('rank', ...row1, ...row2),
  }
}
