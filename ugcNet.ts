import type { ExamConfig } from '../../types'

/**
 * UGC NET Paper 1 — common to all candidates regardless of subject.
 * No negative marking, 50 questions, 100 minutes. The architecture
 * leaves room to add subject-specific Paper 2 configs later without
 * touching this file or the engine.
 */
export const ugcNetConfig: ExamConfig = {
  id: 'ugc-net-paper1',
  slug: 'ugc-net-paper1',
  examName: 'UGC NET Paper 1',
  shortName: 'UGC NET',
  description: 'Teaching & Research Aptitude, Reasoning, Comprehension, ICT and more — 50 questions.',
  longDescription:
    'A full-length practice test simulating UGC NET Paper 1, covering the ten prescribed areas: teaching aptitude, research aptitude, reading comprehension, communication, mathematical & logical reasoning, data interpretation, ICT, people & environment, and the higher education system.',
  durationMinutes: 100,
  totalQuestions: 50,
  negativeMarking: false,
  overallDifficultyLabel: 'Moderate',
  accentColor: '#d97706',
  patternNote: 'Designed to closely simulate the UGC NET Paper 1 pattern and difficulty — not a literal reproduction of any official paper.',
  difficultyDistribution: { easy: 30, moderate: 50, hard: 20 },
  sections: [
    {
      id: 'paper-1',
      name: 'Paper 1 — Teaching & Research Aptitude',
      questionCount: 50,
      marksPerQuestion: 2,
      negativeMarkingRatio: 0,
      topics: [
        { topic: 'Teaching Aptitude', weight: 1.2, generatorKeys: ['ugc.teachingAptitude'] },
        { topic: 'Research Aptitude', weight: 1.2, generatorKeys: ['ugc.researchAptitude'] },
        { topic: 'Reading Comprehension', weight: 1, generatorKeys: ['ugc.readingComprehension'] },
        { topic: 'Communication', weight: 1, generatorKeys: ['ugc.communication'] },
        { topic: 'Mathematical Reasoning', weight: 1, generatorKeys: ['ugc.mathematicalReasoning'] },
        { topic: 'Logical Reasoning', weight: 1, generatorKeys: ['ugc.logicalReasoning.series', 'ugc.logicalReasoning.analogy', 'ugc.logicalReasoning.classification'] },
        { topic: 'Data Interpretation', weight: 1, generatorKeys: ['ugc.dataInterpretation'] },
        { topic: 'ICT', weight: 1, generatorKeys: ['ugc.ict'] },
        { topic: 'People & Environment', weight: 1, generatorKeys: ['ugc.environment'] },
        { topic: 'Higher Education System', weight: 1, generatorKeys: ['ugc.higherEd'] },
      ],
    },
  ],
}
