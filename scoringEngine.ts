import type { ExamConfig, GeneratedTest, AnswerValue, ScoreBreakdown } from '../types'

/**
 * All marking-scheme logic lives here and is driven entirely by the
 * exam configuration (marks per question / negative marking ratio per
 * section). Nothing about scoring is hard-coded per exam.
 */
export function scoreTest(
  exam: ExamConfig,
  test: GeneratedTest,
  answers: Record<string, AnswerValue>,
  timeUsedSeconds: number
): ScoreBreakdown {
  let correct = 0
  let wrong = 0
  let unattempted = 0
  let positiveMarks = 0
  let negativeMarks = 0
  let maxScore = 0

  const sectionMap = new Map(
    exam.sections.map((s) => [
      s.id,
      { sectionId: s.id, sectionName: s.name, correct: 0, wrong: 0, unattempted: 0, marks: 0, maxMarks: 0 },
    ])
  )

  for (const q of test.questions) {
    maxScore += q.marks
    const bucket = sectionMap.get(q.sectionId)
    if (bucket) bucket.maxMarks += q.marks

    const given = answers[q.id]
    const isAttempted = given !== null && given !== undefined

    if (!isAttempted) {
      unattempted++
      if (bucket) bucket.unattempted++
      continue
    }

    const isCorrect =
      q.type === 'numerical' && typeof given === 'number'
        ? Math.abs(given - q.correctAnswer) <= (q.tolerance ?? 0.001)
        : given === q.correctAnswer

    if (isCorrect) {
      correct++
      positiveMarks += q.marks
      if (bucket) {
        bucket.correct++
        bucket.marks += q.marks
      }
    } else {
      wrong++
      negativeMarks += q.negativeMarks
      if (bucket) {
        bucket.wrong++
        bucket.marks -= q.negativeMarks
      }
    }
  }

  const finalScore = Math.round((positiveMarks - negativeMarks) * 100) / 100
  const attempted = correct + wrong
  const percentage = maxScore > 0 ? Math.round((finalScore / maxScore) * 10000) / 100 : 0
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 10000) / 100 : 0

  return {
    totalQuestions: test.questions.length,
    correct,
    wrong,
    unattempted,
    positiveMarks: Math.round(positiveMarks * 100) / 100,
    negativeMarks: Math.round(negativeMarks * 100) / 100,
    finalScore,
    maxScore,
    percentage,
    accuracy,
    timeUsedSeconds,
    sectionBreakdown: Array.from(sectionMap.values()).map((b) => ({
      ...b,
      marks: Math.round(b.marks * 100) / 100,
    })),
  }
}
