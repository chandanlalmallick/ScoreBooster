import type { RawQuestion, Difficulty } from '../../types'
import type { RNG } from '../../engine/random'
import { choice } from '../../engine/random'
import { buildLabeledOptions, fp } from '../helpers'

/**
 * General Awareness cannot be "computed" the way a maths question can —
 * there is no formula for a capital city. Per the spec, this uses a
 * structured, original question-bank instead of hallucinated facts:
 * every entry below is a well-known, static piece of public information
 * (constitution articles, static GK), not something that changes yearly
 * (we deliberately avoid "current" affairs, since those go stale).
 */
interface GKEntry {
  question: string
  correct: string
  distractors: string[]
  level: Difficulty
  subtopic: string
}

const GK_BANK: GKEntry[] = [
  { question: 'Which Article of the Indian Constitution deals with the Right to Equality?', correct: 'Article 14', distractors: ['Article 19', 'Article 21', 'Article 32'], level: 'moderate', subtopic: 'Polity' },
  { question: 'Who is known as the "Father of the Indian Constitution"?', correct: 'B. R. Ambedkar', distractors: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'Sardar Patel'], level: 'easy', subtopic: 'Polity' },
  { question: 'The Reserve Bank of India was established in which year?', correct: '1935', distractors: ['1947', '1950', '1969'], level: 'moderate', subtopic: 'Economy' },
  { question: 'Which is the largest river basin in India by area?', correct: 'Ganga basin', distractors: ['Godavari basin', 'Krishna basin', 'Brahmaputra basin'], level: 'moderate', subtopic: 'Geography' },
  { question: 'The Battle of Plassey was fought in which year?', correct: '1757', distractors: ['1764', '1857', '1707'], level: 'moderate', subtopic: 'History' },
  { question: 'Which vitamin is synthesised in human skin on exposure to sunlight?', correct: 'Vitamin D', distractors: ['Vitamin A', 'Vitamin C', 'Vitamin K'], level: 'easy', subtopic: 'Science' },
  { question: 'The SI unit of electric resistance is:', correct: 'Ohm', distractors: ['Volt', 'Ampere', 'Watt'], level: 'easy', subtopic: 'Science' },
  { question: 'Which Five-Year Plan is associated with the "Rolling Plan"?', correct: 'Sixth Plan', distractors: ['First Plan', 'Fourth Plan', 'Tenth Plan'], level: 'hard', subtopic: 'Economy' },
  { question: 'Which Indian state has the longest coastline?', correct: 'Gujarat', distractors: ['Tamil Nadu', 'Andhra Pradesh', 'Maharashtra'], level: 'moderate', subtopic: 'Geography' },
  { question: 'The Fundamental Duties of Indian citizens were added by which Constitutional Amendment?', correct: '42nd Amendment', distractors: ['44th Amendment', '52nd Amendment', '61st Amendment'], level: 'hard', subtopic: 'Polity' },
  { question: 'Which gas is most abundant in the Earth\'s atmosphere?', correct: 'Nitrogen', distractors: ['Oxygen', 'Carbon dioxide', 'Argon'], level: 'easy', subtopic: 'Science' },
  { question: 'The headquarters of the United Nations is located in:', correct: 'New York', distractors: ['Geneva', 'Paris', 'The Hague'], level: 'easy', subtopic: 'General Knowledge' },
  { question: 'Who wrote the national anthem of India, "Jana Gana Mana"?', correct: 'Rabindranath Tagore', distractors: ['Bankim Chandra Chattopadhyay', 'Sarojini Naidu', 'Muhammad Iqbal'], level: 'easy', subtopic: 'History' },
  { question: 'The Tropic of Cancer does NOT pass through which of these Indian states?', correct: 'Punjab', distractors: ['Gujarat', 'Madhya Pradesh', 'West Bengal'], level: 'hard', subtopic: 'Geography' },
  { question: 'Which organ in the human body produces insulin?', correct: 'Pancreas', distractors: ['Liver', 'Kidney', 'Spleen'], level: 'easy', subtopic: 'Science' },
]

export function generateGeneralAwarenessQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const pool = GK_BANK.filter((e) => e.level === difficulty)
  const entry = choice(rng, pool.length ? pool : GK_BANK)
  const { options, correctIndex } = buildLabeledOptions(rng, entry.correct, entry.distractors)

  return {
    type: 'mcq',
    text: entry.question,
    options,
    correctAnswer: correctIndex,
    explanation: `${entry.correct} is correct. (Topic: ${entry.subtopic})`,
    subtopic: `General Awareness — ${entry.subtopic}`,
    fingerprint: fp('gk', entry.question),
  }
}
