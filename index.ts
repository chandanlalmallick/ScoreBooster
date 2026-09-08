// Core domain types shared across the whole application.

export type Difficulty = 'easy' | 'moderate' | 'hard'

export type QuestionType = 'mcq' | 'numerical'

/** A fully-formed, validated question ready to be shown to the student. */
export interface Question {
  id: string
  type: QuestionType
  text: string
  /** Present for 'mcq' questions. Always length 4, exactly one correct. */
  options?: string[]
  /** Index into `options` for mcq, or the numeric value for numerical. */
  correctAnswer: number
  /** Accepted tolerance for numerical-answer questions (absolute). */
  tolerance?: number
  explanation: string
  topic: string
  subtopic: string
  difficulty: Difficulty
  marks: number
  negativeMarks: number
  sectionId: string
  /** Used to detect near-duplicate questions within one generated test. */
  fingerprint: string
}

/** What a generator function returns before validation/finalisation. */
export interface RawQuestion {
  type: QuestionType
  text: string
  options?: string[]
  correctAnswer: number
  tolerance?: number
  explanation: string
  subtopic: string
  fingerprint: string
}

export type Generator = (rng: () => number, difficulty: Difficulty) => RawQuestion

export interface TopicConfig {
  topic: string
  /** Relative weight within the section (weights are normalised). */
  weight: number
  /** Keys into the generator registry for this exam. */
  generatorKeys: string[]
}

export interface DifficultyDistribution {
  easy: number
  moderate: number
  hard: number
}

export interface SectionConfig {
  id: string
  name: string
  questionCount: number
  marksPerQuestion: number
  negativeMarkingRatio: number // 0 disables negative marking for this section
  topics: TopicConfig[]
  difficultyDistribution?: DifficultyDistribution // overrides exam-level default
  questionTypes?: QuestionType[]
  description?: string
}

export interface ExamConfig {
  id: string
  slug: string
  examName: string
  shortName: string
  description: string
  longDescription: string
  durationMinutes: number
  totalQuestions: number
  sections: SectionConfig[]
  difficultyDistribution: DifficultyDistribution
  negativeMarking: boolean
  overallDifficultyLabel: 'Moderate' | 'Moderate-Hard' | 'Hard' | 'Very Hard'
  accentColor: string
  patternNote: string
}

export interface GeneratedTest {
  examId: string
  seed: number
  generatedAt: number
  questions: Question[]
}

export type AnswerValue = number | null

export interface QuestionStatus {
  visited: boolean
  answered: boolean
  markedForReview: boolean
}

export interface TestSession {
  examId: string
  seed: number
  test: GeneratedTest
  answers: Record<string, AnswerValue>
  statuses: Record<string, QuestionStatus>
  currentIndex: number
  startedAt: number
  endsAt: number
}

export interface ScoreBreakdown {
  totalQuestions: number
  correct: number
  wrong: number
  unattempted: number
  positiveMarks: number
  negativeMarks: number
  finalScore: number
  maxScore: number
  percentage: number
  accuracy: number // correct / attempted, 0-100
  timeUsedSeconds: number
  sectionBreakdown: {
    sectionId: string
    sectionName: string
    correct: number
    wrong: number
    unattempted: number
    marks: number
    maxMarks: number
  }[]
}
