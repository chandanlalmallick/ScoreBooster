import type { ExamConfig } from '../../types'

/**
 * CSIR-NET Mathematical Sciences — simulation configuration.
 *
 * This is a *practice simulation*, calibrated to the broad, publicly
 * known structure of the exam (three parts of increasing difficulty,
 * negative marking, MCQ format). It is not a byte-for-byte reproduction
 * of any single official paper. Update questionCount/duration/marks
 * here the moment the official pattern changes — nothing elsewhere in
 * the app needs to change.
 */
export const csirNetConfig: ExamConfig = {
  id: 'csir-net-mathematics',
  slug: 'csir-net-mathematics',
  examName: 'CSIR-NET Mathematical Sciences',
  shortName: 'CSIR-NET',
  description: 'Part A/B/C simulation covering general aptitude and core mathematics topics.',
  longDescription:
    'A full-length practice test simulating the three-part structure of CSIR-NET Mathematical Sciences: general aptitude (Part A), core subject questions (Part B), and higher-difficulty applied questions (Part C).',
  durationMinutes: 180,
  totalQuestions: 60,
  negativeMarking: true,
  overallDifficultyLabel: 'Hard',
  accentColor: '#4f46e5',
  patternNote: 'Designed to closely simulate the CSIR-NET pattern and difficulty — not a literal reproduction of any official paper.',
  difficultyDistribution: { easy: 20, moderate: 55, hard: 25 },
  sections: [
    {
      id: 'part-a',
      name: 'Part A — General Aptitude',
      description: 'General reasoning and basic mathematics, common to all streams.',
      questionCount: 20,
      marksPerQuestion: 2,
      negativeMarkingRatio: 0.25,
      difficultyDistribution: { easy: 45, moderate: 45, hard: 10 },
      topics: [
        { topic: 'Numerical Reasoning', weight: 2, generatorKeys: ['ssc.reasoning.numberSeries', 'ssc.reasoning.analogy'] },
        { topic: 'Basic Calculus', weight: 2, generatorKeys: ['csir.calculus.limit', 'csir.calculus.derivative'] },
        { topic: 'Basic Algebra', weight: 1, generatorKeys: ['csir.numberTheory.gcdLcm'] },
      ],
    },
    {
      id: 'part-b',
      name: 'Part B — Core Mathematics',
      description: 'Standard-difficulty questions across core postgraduate mathematics topics.',
      questionCount: 20,
      marksPerQuestion: 3,
      negativeMarkingRatio: 0.25,
      difficultyDistribution: { easy: 15, moderate: 65, hard: 20 },
      topics: [
        { topic: 'Linear Algebra', weight: 2, generatorKeys: ['csir.linearAlgebra.eigenvalue', 'csir.linearAlgebra.determinant', 'csir.linearAlgebra.rank'] },
        { topic: 'Real Analysis', weight: 2, generatorKeys: ['csir.realAnalysis.sequenceLimit', 'csir.realAnalysis.seriesConvergence', 'csir.realAnalysis.continuity'] },
        { topic: 'Abstract Algebra', weight: 2, generatorKeys: ['csir.abstractAlgebra.cyclicOrder', 'csir.abstractAlgebra.lagrange', 'csir.abstractAlgebra.field'] },
        { topic: 'Complex Analysis', weight: 1, generatorKeys: ['csir.complex.modulus'] },
        { topic: 'Ordinary Differential Equations', weight: 1, generatorKeys: ['csir.ode.firstOrder'] },
      ],
    },
    {
      id: 'part-c',
      name: 'Part C — Applied & Advanced Topics',
      description: 'Higher-difficulty, multi-step questions requiring deeper conceptual chaining.',
      questionCount: 20,
      marksPerQuestion: 4,
      negativeMarkingRatio: 0.25,
      difficultyDistribution: { easy: 5, moderate: 45, hard: 50 },
      topics: [
        { topic: 'Numerical Analysis', weight: 2, generatorKeys: ['csir.numerical.newtonRaphson', 'csir.numerical.trapezoidal'] },
        { topic: 'Probability & Statistics', weight: 2, generatorKeys: ['csir.probability.hypergeometric', 'csir.probability.binomial', 'csir.statistics.meanVariance'] },
        { topic: 'Number Theory', weight: 1, generatorKeys: ['csir.numberTheory.modPow', 'csir.numberTheory.gcdLcm'] },
        { topic: 'Complex & Differential Equations', weight: 1, generatorKeys: ['csir.complex.modulus', 'csir.ode.firstOrder'] },
        { topic: 'Calculus (Advanced)', weight: 1, generatorKeys: ['csir.calculus.integral', 'csir.calculus.derivative'] },
      ],
    },
  ],
}
