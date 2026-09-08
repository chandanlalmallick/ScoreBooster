import type { RawQuestion, Difficulty } from '../../types'
import type { RNG } from '../../engine/random'
import { choice } from '../../engine/random'
import { buildLabeledOptions, fp } from '../helpers'

interface WordEntry {
  word: string
  synonym: string
  antonym: string
  distractorSynonyms: string[]
  distractorAntonyms: string[]
  level: Difficulty
}

const WORD_BANK: WordEntry[] = [
  { word: 'Abundant', synonym: 'Plentiful', antonym: 'Scarce', distractorSynonyms: ['Empty', 'Rare', 'Small'], distractorAntonyms: ['Plentiful', 'Huge', 'Wide'], level: 'easy' },
  { word: 'Candid', synonym: 'Frank', antonym: 'Evasive', distractorSynonyms: ['Silent', 'Rude', 'Shy'], distractorAntonyms: ['Frank', 'Bold', 'Loud'], level: 'moderate' },
  { word: 'Diligent', synonym: 'Hardworking', antonym: 'Lazy', distractorSynonyms: ['Careless', 'Slow', 'Weak'], distractorAntonyms: ['Hardworking', 'Smart', 'Quick'], level: 'easy' },
  { word: 'Ephemeral', synonym: 'Fleeting', antonym: 'Permanent', distractorSynonyms: ['Eternal', 'Solid', 'Ancient'], distractorAntonyms: ['Fleeting', 'Brief', 'Short'], level: 'hard' },
  { word: 'Frugal', synonym: 'Thrifty', antonym: 'Extravagant', distractorSynonyms: ['Wasteful', 'Generous', 'Rich'], distractorAntonyms: ['Thrifty', 'Careful', 'Modest'], level: 'moderate' },
  { word: 'Gregarious', synonym: 'Sociable', antonym: 'Reserved', distractorSynonyms: ['Shy', 'Angry', 'Silent'], distractorAntonyms: ['Sociable', 'Friendly', 'Loud'], level: 'hard' },
  { word: 'Hostile', synonym: 'Antagonistic', antonym: 'Friendly', distractorSynonyms: ['Kind', 'Calm', 'Weak'], distractorAntonyms: ['Antagonistic', 'Cruel', 'Fierce'], level: 'moderate' },
  { word: 'Immense', synonym: 'Enormous', antonym: 'Tiny', distractorSynonyms: ['Small', 'Narrow', 'Short'], distractorAntonyms: ['Enormous', 'Wide', 'Long'], level: 'easy' },
  { word: 'Judicious', synonym: 'Sensible', antonym: 'Reckless', distractorSynonyms: ['Foolish', 'Careless', 'Hasty'], distractorAntonyms: ['Sensible', 'Wise', 'Careful'], level: 'hard' },
  { word: 'Lucid', synonym: 'Clear', antonym: 'Confusing', distractorSynonyms: ['Vague', 'Dull', 'Complex'], distractorAntonyms: ['Clear', 'Simple', 'Plain'], level: 'moderate' },
  { word: 'Meticulous', synonym: 'Careful', antonym: 'Careless', distractorSynonyms: ['Hasty', 'Lazy', 'Rough'], distractorAntonyms: ['Careful', 'Precise', 'Neat'], level: 'moderate' },
  { word: 'Novice', synonym: 'Beginner', antonym: 'Expert', distractorSynonyms: ['Veteran', 'Master', 'Professional'], distractorAntonyms: ['Beginner', 'Amateur', 'Learner'], level: 'easy' },
  { word: 'Obstinate', synonym: 'Stubborn', antonym: 'Flexible', distractorSynonyms: ['Kind', 'Gentle', 'Weak'], distractorAntonyms: ['Stubborn', 'Rigid', 'Firm'], level: 'moderate' },
  { word: 'Pragmatic', synonym: 'Practical', antonym: 'Idealistic', distractorSynonyms: ['Dreamy', 'Naive', 'Foolish'], distractorAntonyms: ['Practical', 'Realistic', 'Logical'], level: 'hard' },
  { word: 'Reluctant', synonym: 'Unwilling', antonym: 'Eager', distractorSynonyms: ['Willing', 'Happy', 'Bold'], distractorAntonyms: ['Unwilling', 'Hesitant', 'Shy'], level: 'easy' },
]

export function generateSynonymQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const pool = WORD_BANK.filter((w) => w.level === difficulty)
  const entry = choice(rng, pool.length ? pool : WORD_BANK)
  const { options, correctIndex } = buildLabeledOptions(rng, entry.synonym, entry.distractorSynonyms)

  return {
    type: 'mcq',
    text: `Choose the word most similar in meaning to: "${entry.word}"`,
    options,
    correctAnswer: correctIndex,
    explanation: `"${entry.word}" most closely means "${entry.synonym}".`,
    subtopic: 'English — synonyms',
    fingerprint: fp('synonym', entry.word),
  }
}

export function generateAntonymQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const pool = WORD_BANK.filter((w) => w.level === difficulty)
  const entry = choice(rng, pool.length ? pool : WORD_BANK)
  const { options, correctIndex } = buildLabeledOptions(rng, entry.antonym, entry.distractorAntonyms)

  return {
    type: 'mcq',
    text: `Choose the word most OPPOSITE in meaning to: "${entry.word}"`,
    options,
    correctAnswer: correctIndex,
    explanation: `"${entry.word}" means the opposite of "${entry.antonym}".`,
    subtopic: 'English — antonyms',
    fingerprint: fp('antonym', entry.word),
  }
}

interface ErrorSentence {
  correct: string
  wrong: string
  errorPart: string
  fixedPart: string
  rule: string
  level: Difficulty
}

const ERROR_BANK: ErrorSentence[] = [
  { correct: 'She has been working here since 2019.', wrong: 'She has been working here from 2019.', errorPart: 'from 2019', fixedPart: 'since 2019', rule: '"Since" is used with a specific point in time; "for" is used with a duration.', level: 'easy' },
  { correct: 'Neither of the boys was ready.', wrong: 'Neither of the boys were ready.', errorPart: 'were ready', fixedPart: 'was ready', rule: '"Neither" is singular and takes a singular verb.', level: 'moderate' },
  { correct: 'Each of the students has submitted the assignment.', wrong: 'Each of the students have submitted the assignment.', errorPart: 'have submitted', fixedPart: 'has submitted', rule: '"Each" is singular and takes a singular verb.', level: 'moderate' },
  { correct: 'He is one of the best players who has ever played here.', wrong: 'He is one of the best players who have ever played here.', errorPart: 'who have', fixedPart: 'who has', rule: 'In "one of the ___ who", the relative clause verb agrees with "one" here, taking a singular verb.', level: 'hard' },
  { correct: 'The news of his promotion was surprising.', wrong: 'The news of his promotion were surprising.', errorPart: 'were surprising', fixedPart: 'was surprising', rule: '"News" is treated as singular in English despite ending in -s.', level: 'moderate' },
  { correct: 'I look forward to meeting you.', wrong: 'I look forward to meet you.', errorPart: 'to meet', fixedPart: 'to meeting', rule: '"Look forward to" is followed by a gerund (verb+ing), not the base infinitive.', level: 'easy' },
  { correct: 'If I were you, I would accept the offer.', wrong: 'If I was you, I would accept the offer.', errorPart: 'If I was', fixedPart: 'If I were', rule: 'The subjunctive mood uses "were" for all persons in hypothetical "if" clauses.', level: 'hard' },
]

export function generateErrorDetectionQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const pool = ERROR_BANK.filter((e) => e.level === difficulty)
  const entry = choice(rng, pool.length ? pool : ERROR_BANK)

  const correctLabel = entry.errorPart
  const otherParts = entry.wrong.split(' ')
  const distractor1 = otherParts.slice(0, 2).join(' ')
  const distractor2 = otherParts.slice(-2).join(' ')
  const distractor3 = 'No error'
  const { options, correctIndex } = buildLabeledOptions(rng, correctLabel, [distractor1, distractor2, distractor3])

  return {
    type: 'mcq',
    text: `Identify the part of the sentence that contains a grammatical error: "${entry.wrong}"`,
    options,
    correctAnswer: correctIndex,
    explanation: `The error is in "${entry.errorPart}" — it should read "${entry.fixedPart}". Rule: ${entry.rule}`,
    subtopic: 'English — spotting the error',
    fingerprint: fp('errordetect', entry.wrong),
  }
}

interface ClozeEntry {
  sentence: string // contains ___
  correct: string
  distractors: string[]
  level: Difficulty
}

const CLOZE_BANK: ClozeEntry[] = [
  { sentence: 'The manager insisted ___ finishing the report before noon.', correct: 'on', distractors: ['at', 'for', 'to'], level: 'easy' },
  { sentence: 'Despite ___ hard, he failed to qualify.', correct: 'trying', distractors: ['try', 'tries', 'tried'], level: 'moderate' },
  { sentence: 'The committee could not agree ___ a final decision.', correct: 'on', distractors: ['with', 'about', 'in'], level: 'easy' },
  { sentence: 'Had she known the truth, she ___ have acted differently.', correct: 'would', distractors: ['will', 'shall', 'must'], level: 'hard' },
  { sentence: 'The report was written ___ by the intern, not the manager.', correct: 'entirely', distractors: ['entire', 'entirety', 'enter'], level: 'moderate' },
]

export function generateClozeQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const pool = CLOZE_BANK.filter((c) => c.level === difficulty)
  const entry = choice(rng, pool.length ? pool : CLOZE_BANK)
  const { options, correctIndex } = buildLabeledOptions(rng, entry.correct, entry.distractors)

  return {
    type: 'mcq',
    text: `Fill in the blank: "${entry.sentence}"`,
    options,
    correctAnswer: correctIndex,
    explanation: `The correct word is "${entry.correct}", which best completes the sentence grammatically and in meaning.`,
    subtopic: 'English — cloze / fill in the blank',
    fingerprint: fp('cloze', entry.sentence),
  }
}
