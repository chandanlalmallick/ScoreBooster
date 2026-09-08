import type { ExamConfig } from '../../types'

/**
 * SSC CGL Tier I — simulation configuration: four equal sections,
 * 100 questions, 60 minutes, standard 2-marks/-0.5 marking scheme.
 * Update this file if/when the official pattern changes.
 */
export const sscCglConfig: ExamConfig = {
  id: 'ssc-cgl',
  slug: 'ssc-cgl',
  examName: 'SSC CGL Tier I',
  shortName: 'SSC CGL',
  description: 'Reasoning, Quantitative Aptitude, English and General Awareness — 100 questions.',
  longDescription:
    'A full-length practice test simulating SSC CGL Tier I: four sections of general intelligence & reasoning, quantitative aptitude, English comprehension, and general awareness, under strict timing.',
  durationMinutes: 60,
  totalQuestions: 100,
  negativeMarking: true,
  overallDifficultyLabel: 'Moderate',
  accentColor: '#0891b2',
  patternNote: 'Designed to closely simulate the SSC CGL Tier I pattern and difficulty — not a literal reproduction of any official paper.',
  difficultyDistribution: { easy: 30, moderate: 50, hard: 20 },
  sections: [
    {
      id: 'reasoning',
      name: 'General Intelligence & Reasoning',
      questionCount: 25,
      marksPerQuestion: 2,
      negativeMarkingRatio: 0.25,
      topics: [
        { topic: 'Series & Patterns', weight: 2, generatorKeys: ['ssc.reasoning.numberSeries'] },
        { topic: 'Coding-Decoding', weight: 2, generatorKeys: ['ssc.reasoning.coding'] },
        { topic: 'Blood Relations', weight: 1, generatorKeys: ['ssc.reasoning.bloodRelation'] },
        { topic: 'Analogy', weight: 2, generatorKeys: ['ssc.reasoning.analogy'] },
        { topic: 'Classification', weight: 2, generatorKeys: ['ssc.reasoning.classification'] },
      ],
    },
    {
      id: 'quant',
      name: 'Quantitative Aptitude',
      questionCount: 25,
      marksPerQuestion: 2,
      negativeMarkingRatio: 0.25,
      topics: [
        { topic: 'Percentage', weight: 2, generatorKeys: ['ssc.quant.percentage'] },
        { topic: 'Profit & Loss', weight: 2, generatorKeys: ['ssc.quant.profitLoss'] },
        { topic: 'Simple & Compound Interest', weight: 2, generatorKeys: ['ssc.quant.simpleInterest', 'ssc.quant.compoundInterest'] },
        { topic: 'Average', weight: 1, generatorKeys: ['ssc.quant.average'] },
        { topic: 'Ratio & Proportion', weight: 1, generatorKeys: ['ssc.quant.ratio'] },
        { topic: 'Time, Speed & Distance', weight: 2, generatorKeys: ['ssc.quant.timeSpeedDistance'] },
      ],
    },
    {
      id: 'english',
      name: 'English Comprehension',
      questionCount: 25,
      marksPerQuestion: 2,
      negativeMarkingRatio: 0.25,
      topics: [
        { topic: 'Synonyms', weight: 2, generatorKeys: ['ssc.english.synonym'] },
        { topic: 'Antonyms', weight: 2, generatorKeys: ['ssc.english.antonym'] },
        { topic: 'Error Detection', weight: 2, generatorKeys: ['ssc.english.errorDetection'] },
        { topic: 'Cloze Test', weight: 2, generatorKeys: ['ssc.english.cloze'] },
      ],
    },
    {
      id: 'general-awareness',
      name: 'General Awareness',
      questionCount: 25,
      marksPerQuestion: 2,
      negativeMarkingRatio: 0.25,
      topics: [{ topic: 'General Awareness', weight: 1, generatorKeys: ['ssc.generalAwareness'] }],
    },
  ],
}
