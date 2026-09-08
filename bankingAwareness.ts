import type { RawQuestion, Difficulty } from '../../types'
import type { RNG } from '../../engine/random'
import { choice } from '../../engine/random'
import { buildLabeledOptions, fp } from '../helpers'

interface BankEntry {
  question: string
  correct: string
  distractors: string[]
  level: Difficulty
}

// Static, structural banking-domain knowledge (definitions, mechanisms) —
// deliberately avoids "current rates/current governor" style facts that
// go stale; those are exactly the kind of "current affairs" this static
// site cannot keep up to date.
const BANK: BankEntry[] = [
  { question: 'The rate at which the central bank lends money to commercial banks for the short term is called the:', correct: 'Repo rate', distractors: ['Reverse repo rate', 'Bank rate', 'CRR'], level: 'moderate' },
  { question: 'CRR stands for:', correct: 'Cash Reserve Ratio', distractors: ['Credit Reserve Rate', 'Cash Return Ratio', 'Capital Reserve Requirement'], level: 'easy' },
  { question: 'A cheque that has "A/C Payee" written across it can only be:', correct: 'Deposited into the payee\'s bank account, not cashed over the counter', distractors: ['Cashed by anyone at the counter', 'Endorsed to a third party freely', 'Used as a bearer cheque'], level: 'moderate' },
  { question: 'NEFT stands for:', correct: 'National Electronic Funds Transfer', distractors: ['National Exchange Fund Transaction', 'Net Electronic Fund Transaction', 'National Emergency Funds Transfer'], level: 'easy' },
  { question: 'A Non-Performing Asset (NPA) refers to a loan where:', correct: 'Interest or principal has remained overdue for a specified period', distractors: ['The loan has been fully repaid', 'The interest rate is variable', 'The loan is secured by collateral'], level: 'moderate' },
  { question: 'Which of these is NOT a function of a central bank?', correct: 'Accepting retail customer deposits directly', distractors: ['Regulating money supply', 'Acting as lender of last resort', 'Issuing currency'], level: 'hard' },
  { question: 'SLR stands for:', correct: 'Statutory Liquidity Ratio', distractors: ['Standard Lending Rate', 'Secured Loan Ratio', 'Statutory Lending Reserve'], level: 'easy' },
  { question: 'A "Demand Draft" differs from a cheque mainly because:', correct: 'It is pre-paid and drawn by a bank, so it cannot bounce for insufficient funds', distractors: ['It can only be used internationally', 'It requires no signature', 'It is valid indefinitely'], level: 'hard' },
]

export function generateBankingAwarenessQuestion(rng: RNG, difficulty: Difficulty): RawQuestion {
  const pool = BANK.filter((e) => e.level === difficulty)
  const entry = choice(rng, pool.length ? pool : BANK)
  const { options, correctIndex } = buildLabeledOptions(rng, entry.correct, entry.distractors)

  return {
    type: 'mcq',
    text: entry.question,
    options,
    correctAnswer: correctIndex,
    explanation: `${entry.correct} is correct.`,
    subtopic: 'Banking Awareness',
    fingerprint: fp('banking-gk', entry.question),
  }
}
