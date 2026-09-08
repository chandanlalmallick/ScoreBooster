import type { RawQuestion, Difficulty } from '../../types'
import type { RNG } from '../../engine/random'
import { choice } from '../../engine/random'
import { buildLabeledOptions, fp } from '../helpers'

interface Passage {
  text: string
  question: string
  correct: string
  distractors: string[]
  level: Difficulty
}

// Short, original passages (not copied from any copyrighted source) with
// a comprehension question whose answer is directly supported by the text.
const PASSAGES: Passage[] = [
  {
    text: 'Higher education systems worldwide are shifting toward outcome-based curricula, where the focus is less on the number of hours a student spends in a classroom and more on demonstrable skills and competencies acquired by the end of a course.',
    question: 'According to the passage, outcome-based curricula primarily emphasise:',
    correct: 'Demonstrable skills and competencies over time spent studying',
    distractors: ['The number of classroom hours completed', 'The reputation of the institution', 'The cost of the course'],
    level: 'easy',
  },
  {
    text: 'Peer review, though widely regarded as the gold standard for validating academic research, is not without criticism. Critics argue that it can be slow, inconsistent across reviewers, and occasionally biased toward established researchers at the expense of novel or unconventional ideas.',
    question: 'Which of the following is NOT mentioned as a criticism of peer review in the passage?',
    correct: 'It is too expensive to conduct',
    distractors: ['It can be slow', 'It can be inconsistent across reviewers', 'It can be biased toward established researchers'],
    level: 'moderate',
  },
  {
    text: 'Distance education initially relied on postal correspondence, evolved through radio and television broadcasts, and has now largely moved to internet-based platforms that allow synchronous and asynchronous interaction between learners and instructors.',
    question: 'Based on the passage, which of these best describes the historical progression of distance education?',
    correct: 'Postal correspondence, then broadcast media, then internet-based platforms',
    distractors: ['Internet platforms, then postal correspondence, then broadcast media', 'Broadcast media only, with no earlier forms', 'It began with internet platforms and later added postal correspondence'],
    level: 'moderate',
  },
  {
    text: 'A recurring tension in research ethics lies between the researcher\'s obligation to disseminate findings openly and the need to protect the confidentiality and welfare of research participants, particularly in studies involving vulnerable populations.',
    question: 'The passage identifies a tension between:',
    correct: 'Open dissemination of findings and protecting participant confidentiality',
    distractors: ['Funding availability and research quality', 'Peer review speed and researcher reputation', 'Government policy and university autonomy'],
    level: 'hard',
  },
]

export function generateReadingComprehensionQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const pool = PASSAGES.filter((p) => p.level === difficulty)
  const entry = choice(rng, pool.length ? pool : PASSAGES)
  const { options, correctIndex } = buildLabeledOptions(rng, entry.correct, entry.distractors)

  return {
    type: 'mcq',
    text: `Read the passage and answer the question.\n\nPassage: "${entry.text}"\n\nQuestion: ${entry.question}`,
    options,
    correctAnswer: correctIndex,
    explanation: `The passage directly supports: "${entry.correct}".`,
    subtopic: 'Reading Comprehension',
    fingerprint: fp('rc', entry.question),
  }
}
