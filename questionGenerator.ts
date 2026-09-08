import type {
  Question,
  RawQuestion,
  SectionConfig,
  TopicConfig,
  Difficulty,
} from '../types'
import type { RNG } from './random'
import { weightedPick } from './random'
import { validateQuestion } from './validator'
import { buildDifficultyPlan } from './difficultyEngine'
import { generatorRegistry } from '../generators/registry'

const MAX_ATTEMPTS_PER_QUESTION = 25

let idCounter = 0
function nextId(): string {
  idCounter += 1
  return `q_${Date.now().toString(36)}_${idCounter}`
}

/**
 * Pipeline (per the architecture spec):
 * Exam Pattern -> Topic Selection -> Difficulty Selection -> Template
 * -> Parameter Generation -> Correct Answer Calculation
 * -> Distractor Generation -> Validation -> Final Question
 */
export function generateSectionQuestions(
  section: SectionConfig,
  examDefaultDifficulty: { easy: number; moderate: number; hard: number },
  rng: RNG
): Question[] {
  const difficultyDist = section.difficultyDistribution ?? examDefaultDifficulty
  const plan = buildDifficultyPlan(section.questionCount, difficultyDist, rng)

  const topicWeights = section.topics.map((t) => t.weight)
  const seenFingerprints = new Set<string>()
  const results: Question[] = []

  for (let i = 0; i < plan.length; i++) {
    const difficulty = plan[i]
    const topic = weightedPick(rng, section.topics, topicWeights)
    const question = generateOneValidQuestion(
      section,
      topic,
      difficulty,
      rng,
      seenFingerprints
    )
    if (question) {
      results.push(question)
      seenFingerprints.add(question.fingerprint)
    }
  }

  return results
}

function generateOneValidQuestion(
  section: SectionConfig,
  topic: TopicConfig,
  difficulty: Difficulty,
  rng: RNG,
  seenFingerprints: Set<string>
): Question | null {
  for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_QUESTION; attempt++) {
    const generatorKey = topic.generatorKeys[attempt % topic.generatorKeys.length]
    const generatorFn = generatorRegistry[generatorKey]
    if (!generatorFn) continue

    let raw: RawQuestion
    try {
      raw = generatorFn(rng, difficulty)
    } catch {
      continue // generator threw (e.g. degenerate random params) -> try again
    }

    const validation = validateQuestion(raw)
    if (!validation.valid) continue
    if (seenFingerprints.has(raw.fingerprint)) continue

    return {
      id: nextId(),
      type: raw.type,
      text: raw.text,
      options: raw.options,
      correctAnswer: raw.correctAnswer,
      tolerance: raw.tolerance,
      explanation: raw.explanation,
      topic: topic.topic,
      subtopic: raw.subtopic,
      difficulty,
      marks: section.marksPerQuestion,
      negativeMarks: section.negativeMarkingRatio * section.marksPerQuestion,
      sectionId: section.id,
      fingerprint: raw.fingerprint,
    }
  }
  return null // could not produce a valid unique question after all attempts
}
