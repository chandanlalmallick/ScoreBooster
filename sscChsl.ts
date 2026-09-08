import type { ExamConfig } from '../../types'

/**
 * SSC CHSL Tier I — a distinct configuration from SSC CGL: same broad
 * section types but a different question/topic mix, difficulty
 * distribution, and marking scheme, reflecting that CHSL targets a
 * different (10+2 level) candidate pool.
 */
export const sscChslConfig: ExamConfig = {
  id: 'ssc-chsl',
  slug: 'ssc-chsl',
  examName: 'SSC CHSL Tier I',
  shortName: 'SSC CHSL',
  description: 'General Intelligence, Quantitative Aptitude, English & General Awareness at 10+2 level.',
  longDescription:
    'A full-length practice test simulating SSC CHSL Tier I, pitched at a slightly gentler difficulty curve than CGL, with its own section weighting and marking scheme.',
  durationMinutes: 60,
  totalQuestions: 100,
  negativeMarking: true,
  overallDifficultyLabel: 'Moderate',
  accentColor: '#059669',
  patternNote: 'Designed to closely simulate the SSC CHSL Tier I pattern and difficulty — not a literal reproduction of any official paper.',
  difficultyDistribution: { easy: 40, moderate: 45, hard: 15 },
  sections: [
    {
      id: 'reasoning',
      name: 'General Intelligence',
      questionCount: 25,
      marksPerQuestion: 1,
      negativeMarkingRatio: 0.5,
      difficultyDistribution: { easy: 40, moderate: 45, hard: 15 },
      topics: [
        { topic: 'Series & Patterns', weight: 2, generatorKeys: ['ssc.reasoning.numberSeries'] },
        { topic: 'Classification', weight: 2, generatorKeys: ['ssc.reasoning.classification'] },
        { topic: 'Analogy', weight: 2, generatorKeys: ['ssc.reasoning.analogy'] },
        { topic: 'Blood Relations', weight: 1, generatorKeys: ['ssc.reasoning.bloodRelation'] },
      ],
    },
    {
      id: 'quant',
      name: 'Quantitative Aptitude',
      questionCount: 25,
      marksPerQuestion: 1,
      negativeMarkingRatio: 0.5,
      difficultyDistribution: { easy: 45, moderate: 40, hard: 15 },
      topics: [
        { topic: 'Percentage', weight: 2, generatorKeys: ['ssc.quant.percentage'] },
        { topic: 'Average', weight: 2, generatorKeys: ['ssc.quant.average'] },
        { topic: 'Ratio & Proportion', weight: 2, generatorKeys: ['ssc.quant.ratio'] },
        { topic: 'Simple Interest', weight: 1, generatorKeys: ['ssc.quant.simpleInterest'] },
        { topic: 'Profit & Loss', weight: 1, generatorKeys: ['ssc.quant.profitLoss'] },
      ],
    },
    {
      id: 'english',
      name: 'English Language',
      questionCount: 25,
      marksPerQuestion: 1,
      negativeMarkingRatio: 0.5,
      topics: [
        { topic: 'Synonyms', weight: 1, generatorKeys: ['ssc.english.synonym'] },
        { topic: 'Antonyms', weight: 1, generatorKeys: ['ssc.english.antonym'] },
        { topic: 'Cloze Test', weight: 2, generatorKeys: ['ssc.english.cloze'] },
        { topic: 'Error Detection', weight: 1, generatorKeys: ['ssc.english.errorDetection'] },
      ],
    },
    {
      id: 'general-awareness',
      name: 'General Awareness',
      questionCount: 25,
      marksPerQuestion: 1,
      negativeMarkingRatio: 0.5,
      topics: [{ topic: 'General Awareness', weight: 1, generatorKeys: ['ssc.generalAwareness'] }],
    },
  ],
}
