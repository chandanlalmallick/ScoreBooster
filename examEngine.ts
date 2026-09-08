import type { ExamConfig, GeneratedTest, Question } from '../types'
import { mulberry32, makeSeed, weightedPick } from './random'
import { generateSectionQuestions } from './questionGenerator'
import { generatorRegistry } from '../generators/registry'
import { validateQuestion } from './validator'

/**
 * Builds a complete test for the given exam configuration. This is the
 * single entry point the UI calls when the student presses "Start Test".
 */
export function generateTest(exam: ExamConfig, seed?: number): GeneratedTest {
  const usedSeed = seed ?? makeSeed()
  const rng = mulberry32(usedSeed)

  let questions: Question[] = []
  for (const section of exam.sections) {
    const sectionQuestions = generateSectionQuestions(
      section,
      exam.difficultyDistribution,
      rng
    )
    questions = questions.concat(sectionQuestions)
  }

  // Safety net: if any section came up short (a generator kept failing
  // validation), top it up so the paper still matches totalQuestions.
  if (questions.length < exam.totalQuestions) {
    questions = topUp(exam, questions, rng)
  }

  return {
    examId: exam.id,
    seed: usedSeed,
    generatedAt: Date.now(),
    questions,
  }
}

function topUp(exam: ExamConfig, questions: Question[], rng: ReturnType<typeof mulberry32>): Question[] {
  const seen = new Set(questions.map((q) => q.fingerprint))
  const need = exam.totalQuestions - questions.length
  const allKeys = Object.keys(generatorRegistry)
  const filled: Question[] = []
  let guard = 0
  while (filled.length < need && guard < need * 50 + 200) {
    guard++
    const key = allKeys[Math.floor(rng() * allKeys.length)]
    const fn = generatorRegistry[key]
    const difficulty = weightedPick(rng, ['easy', 'moderate', 'hard'] as const, [
      exam.difficultyDistribution.easy,
      exam.difficultyDistribution.moderate,
      exam.difficultyDistribution.hard,
    ])
    try {
      const raw = fn(rng, difficulty)
      if (!validateQuestion(raw).valid) continue
      if (seen.has(raw.fingerprint)) continue
      seen.add(raw.fingerprint)
      const fallbackSection = exam.sections[0]
      filled.push({
        id: `q_fill_${Date.now().toString(36)}_${filled.length}`,
        type: raw.type,
        text: raw.text,
        options: raw.options,
        correctAnswer: raw.correctAnswer,
        tolerance: raw.tolerance,
        explanation: raw.explanation,
        topic: 'General',
        subtopic: raw.subtopic,
        difficulty,
        marks: fallbackSection.marksPerQuestion,
        negativeMarks: fallbackSection.negativeMarkingRatio * fallbackSection.marksPerQuestion,
        sectionId: fallbackSection.id,
        fingerprint: raw.fingerprint,
      })
    } catch {
      continue
    }
  }
  return questions.concat(filled)
}
