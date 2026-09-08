import type { RawQuestion, Difficulty } from '../../types'
import type { RNG } from '../../engine/random'
import { choice } from '../../engine/random'
import { buildLabeledOptions, fp } from '../helpers'

interface BankEntry {
  question: string
  correct: string
  distractors: string[]
  level: Difficulty
  explanation: string
}

const TEACHING_APTITUDE: BankEntry[] = [
  { question: 'Which teaching method emphasises learning through student-led discovery rather than direct instruction?', correct: 'Heuristic method', distractors: ['Lecture method', 'Demonstration method', 'Drill method'], level: 'moderate', explanation: 'The heuristic method centres on guided self-discovery by the learner.' },
  { question: 'Formative assessment is primarily used to:', correct: 'Provide ongoing feedback to improve learning', distractors: ['Assign final grades', 'Rank students', 'Certify course completion'], level: 'easy', explanation: 'Formative assessment happens during instruction to guide and improve learning, unlike summative assessment.' },
  { question: 'According to Bloom\'s Taxonomy, which is the highest level in the cognitive domain (revised version)?', correct: 'Create', distractors: ['Evaluate', 'Analyse', 'Apply'], level: 'hard', explanation: 'In the revised Bloom\'s Taxonomy, the order is Remember, Understand, Apply, Analyse, Evaluate, Create — with Create at the top.' },
  { question: 'A teacher who adjusts pace and method based on individual student needs is practising:', correct: 'Differentiated instruction', distractors: ['Rote learning', 'Mass instruction', 'Standardised testing'], level: 'moderate', explanation: 'Differentiated instruction tailors teaching to individual learner needs.' },
]

const RESEARCH_APTITUDE: BankEntry[] = [
  { question: 'A hypothesis that states there is NO relationship between two variables is called:', correct: 'Null hypothesis', distractors: ['Alternative hypothesis', 'Working hypothesis', 'Directional hypothesis'], level: 'easy', explanation: 'The null hypothesis (H0) posits no effect or no relationship.' },
  { question: 'Which sampling method gives every member of the population an equal chance of selection?', correct: 'Simple random sampling', distractors: ['Purposive sampling', 'Convenience sampling', 'Quota sampling'], level: 'moderate', explanation: 'Simple random sampling is defined by equal selection probability for all population members.' },
  { question: 'A research design that studies the same group of subjects over an extended period is called:', correct: 'Longitudinal study', distractors: ['Cross-sectional study', 'Case study', 'Ex post facto study'], level: 'moderate', explanation: 'Longitudinal studies track the same subjects over time, unlike cross-sectional studies which sample at one point in time.' },
  { question: 'The degree to which a research instrument measures what it is intended to measure is called:', correct: 'Validity', distractors: ['Reliability', 'Objectivity', 'Feasibility'], level: 'hard', explanation: 'Validity concerns whether an instrument measures the intended construct; reliability concerns consistency of measurement.' },
]

const COMMUNICATION: BankEntry[] = [
  { question: 'Communication that occurs without the use of words is called:', correct: 'Non-verbal communication', distractors: ['Intrapersonal communication', 'Mass communication', 'Grapevine communication'], level: 'easy', explanation: 'Non-verbal communication relies on body language, tone, and gestures rather than words.' },
  { question: 'Which barrier to communication arises from differing interpretations of the same word or symbol?', correct: 'Semantic barrier', distractors: ['Physical barrier', 'Organisational barrier', 'Psychological barrier'], level: 'moderate', explanation: 'Semantic barriers occur when the sender and receiver interpret words/symbols differently.' },
  { question: 'Informal communication that spreads through an organisation via unofficial channels is called:', correct: 'Grapevine communication', distractors: ['Downward communication', 'Formal communication', 'Vertical communication'], level: 'moderate', explanation: 'The grapevine is the informal, unofficial communication network in an organisation.' },
]

const ICT: BankEntry[] = [
  { question: 'In networking, the abbreviation "LAN" stands for:', correct: 'Local Area Network', distractors: ['Large Area Network', 'Long Access Network', 'Linked Area Network'], level: 'easy', explanation: 'LAN = Local Area Network, a network confined to a small geographic area.' },
  { question: 'Which of these is a valid example of open-source software?', correct: 'Linux', distractors: ['Microsoft Windows', 'macOS', 'Adobe Photoshop'], level: 'easy', explanation: 'Linux is open-source; the others are proprietary commercial software.' },
  { question: 'A software distributed for free but with the source code hidden and restricted use is called:', correct: 'Freeware', distractors: ['Open-source software', 'Shareware', 'Firmware'], level: 'moderate', explanation: 'Freeware is free to use but the source is typically closed, unlike open-source software.' },
  { question: 'MOOC stands for:', correct: 'Massive Open Online Course', distractors: ['Managed Open Online Curriculum', 'Multi-Organisation Online Class', 'Massive Offline Online Course'], level: 'easy', explanation: 'MOOC = Massive Open Online Course, a large-scale, freely accessible online course.' },
]

const ENVIRONMENT: BankEntry[] = [
  { question: 'The layer of the atmosphere that protects Earth from harmful ultraviolet radiation is the:', correct: 'Ozone layer', distractors: ['Troposphere', 'Ionosphere', 'Mesosphere'], level: 'easy', explanation: 'The ozone layer (in the stratosphere) absorbs most of the sun\'s harmful UV radiation.' },
  { question: 'Which international agreement primarily targets the reduction of greenhouse gas emissions to limit global warming?', correct: 'Paris Agreement', distractors: ['Montreal Protocol', 'Basel Convention', 'Ramsar Convention'], level: 'moderate', explanation: 'The Paris Agreement (2015) sets targets for limiting global temperature rise via emissions reduction.' },
  { question: 'The Montreal Protocol is specifically aimed at:', correct: 'Phasing out ozone-depleting substances', distractors: ['Reducing plastic waste', 'Protecting wetlands', 'Controlling hazardous waste trade'], level: 'hard', explanation: 'The Montreal Protocol (1987) targets substances that deplete the ozone layer, such as CFCs.' },
]

const HIGHER_ED: BankEntry[] = [
  { question: 'Which body is the primary regulator of university education standards in India?', correct: 'University Grants Commission (UGC)', distractors: ['AICTE', 'NCERT', 'NCTE'], level: 'easy', explanation: 'UGC coordinates, determines and maintains standards for university education in India.' },
  { question: 'The National Education Policy (NEP) 2020 recommends which structure for school education?', correct: '5+3+3+4', distractors: ['10+2', '8+4', '6+4+2'], level: 'moderate', explanation: 'NEP 2020 replaces the 10+2 structure with a 5+3+3+4 structure covering foundational to secondary stages.' },
  { question: 'Choice Based Credit System (CBCS) primarily aims to provide students with:', correct: 'Flexibility to choose courses across disciplines', distractors: ['A fixed, rigid curriculum', 'Only vocational training', 'Compulsory single-subject specialisation'], level: 'moderate', explanation: 'CBCS allows students to select from core, elective and skill-based courses across disciplines.' },
]

function bankGenerator(bank: BankEntry[], subtopicLabel: string) {
  return (rng: RNG, difficulty: Difficulty): RawQuestion => {
    const pool = bank.filter((e) => e.level === difficulty)
    const entry = choice(rng, pool.length ? pool : bank)
    const { options, correctIndex } = buildLabeledOptions(rng, entry.correct, entry.distractors)
    return {
      type: 'mcq',
      text: entry.question,
      options,
      correctAnswer: correctIndex,
      explanation: entry.explanation,
      subtopic: subtopicLabel,
      fingerprint: fp('ugc-bank', subtopicLabel, entry.question),
    }
  }
}

export const generateTeachingAptitudeQuestion = bankGenerator(TEACHING_APTITUDE, 'Teaching Aptitude')
export const generateResearchAptitudeQuestion = bankGenerator(RESEARCH_APTITUDE, 'Research Aptitude')
export const generateCommunicationQuestion = bankGenerator(COMMUNICATION, 'Communication')
export const generateICTQuestion = bankGenerator(ICT, 'ICT')
export const generateEnvironmentQuestion = bankGenerator(ENVIRONMENT, 'People & Environment')
export const generateHigherEdQuestion = bankGenerator(HIGHER_ED, 'Higher Education System')
