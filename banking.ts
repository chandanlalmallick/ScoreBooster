import type { ExamConfig } from '../../types'

/**
 * Banking Exams — a generic Prelims-style configuration covering the
 * common structure shared by SBI/IBPS-style banking prelims exams.
 * Kept generic per the initial-scope requirement (one "Banking Exams"
 * category); can be split into SBI/IBPS/RBI-specific configs later
 * simply by adding new files here and new dashboard cards.
 */
export const bankingConfig: ExamConfig = {
  id: 'banking-exams',
  slug: 'banking-exams',
  examName: 'Banking Exams (Prelims Pattern)',
  shortName: 'Banking Exams',
  description: 'Quant, Reasoning, English and Banking Awareness — common bank-prelims structure.',
  longDescription:
    'A full-length practice test simulating the common prelims structure used across SBI/IBPS-style banking exams: quantitative aptitude, reasoning ability, English language, and banking awareness, under strict timing.',
  durationMinutes: 60,
  totalQuestions: 100,
  negativeMarking: true,
  overallDifficultyLabel: 'Moderate-Hard',
  accentColor: '#be123c',
  patternNote: 'Designed to closely simulate common banking-prelims pattern and difficulty — not a literal reproduction of any single bank\'s official paper.',
  difficultyDistribution: { easy: 20, moderate: 55, hard: 25 },
  sections: [
    {
      id: 'quant',
      name: 'Quantitative Aptitude',
      questionCount: 30,
      marksPerQuestion: 1,
      negativeMarkingRatio: 0.25,
      topics: [
        { topic: 'Simplification', weight: 2, generatorKeys: ['bank.quant.simplification'] },
        { topic: 'Approximation', weight: 1, generatorKeys: ['bank.quant.approximation'] },
        { topic: 'Percentage', weight: 1, generatorKeys: ['bank.quant.percentage'] },
        { topic: 'Profit & Loss', weight: 1, generatorKeys: ['bank.quant.profitLoss'] },
        { topic: 'Interest', weight: 1, generatorKeys: ['bank.quant.simpleInterest', 'bank.quant.compoundInterest'] },
        { topic: 'Average', weight: 1, generatorKeys: ['bank.quant.average'] },
        { topic: 'Ratio & Proportion', weight: 1, generatorKeys: ['bank.quant.ratio'] },
      ],
    },
    {
      id: 'reasoning',
      name: 'Reasoning Ability',
      questionCount: 30,
      marksPerQuestion: 1,
      negativeMarkingRatio: 0.25,
      topics: [
        { topic: 'Series', weight: 2, generatorKeys: ['bank.reasoning.numberSeries'] },
        { topic: 'Coding-Decoding', weight: 2, generatorKeys: ['bank.reasoning.coding'] },
        { topic: 'Blood Relations', weight: 1, generatorKeys: ['bank.reasoning.bloodRelation'] },
        { topic: 'Classification', weight: 1, generatorKeys: ['bank.reasoning.classification'] },
      ],
    },
    {
      id: 'english',
      name: 'English Language',
      questionCount: 20,
      marksPerQuestion: 1,
      negativeMarkingRatio: 0.25,
      topics: [
        { topic: 'Cloze Test', weight: 2, generatorKeys: ['bank.english.cloze'] },
        { topic: 'Error Detection', weight: 2, generatorKeys: ['bank.english.errorDetection'] },
        { topic: 'Vocabulary', weight: 1, generatorKeys: ['bank.english.synonym'] },
      ],
    },
    {
      id: 'banking-awareness',
      name: 'Banking Awareness',
      questionCount: 20,
      marksPerQuestion: 1,
      negativeMarkingRatio: 0.25,
      topics: [{ topic: 'Banking Awareness', weight: 1, generatorKeys: ['bank.awareness'] }],
    },
  ],
}
