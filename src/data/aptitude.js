// ================= GENERAL =================
export const generalAptitudeQuestions = [
  {
    id: 'g1',
    question: 'Which activity sounds most enjoyable to you?',
    options: [
      'Solving math or logic puzzles',
      'Creating art, designs, or stories',
      'Helping people and working in teams',
      'Understanding business, money, and markets',
    ],
  },
]
export const scienceQuestions = [
  { id: 's1', question: 'A student solves numerical problems using formulas and logical steps. Which skill is strongest?', options: ['Creativity','Analytical reasoning','Communication','Memorization'], stream: 'Science' },
  { id: 's2', question: 'Which field primarily requires knowledge of calculus and physics laws?', options: ['Medicine','Engineering','Law','Design'], stream: 'Science' },
  { id: 's3', question: 'If a student prefers experiment-based learning, which domain suits best?', options: ['Humanities','Commerce','Science','Management'], stream: 'Science' },
  { id: 's4', question: 'Which concept is used to design circuits in electronics?', options: ['Supply chain','Ohm’s Law','Demand curve','Grammar rules'], stream: 'Science' },
  { id: 's5', question: 'A student enjoys solving algorithm-based problems. Suitable career?', options: ['Lawyer','Data Scientist','Journalist','Economist'], stream: 'Science' },
  { id: 's6', question: 'Which subject combination is required for medical entrance exams?', options: ['PCM','PCB','Commerce','Arts'], stream: 'Science' },
  { id: 's7', question: 'Which tool is used for data analysis in tech fields?', options: ['Excel only','Python','Photoshop','Canva'], stream: 'Science' },
  { id: 's8', question: 'AI & Machine Learning belong to which stream?', options: ['Arts','Commerce','Science','Law'], stream: 'Science' },
  { id: 's9', question: 'Which branch deals with designing buildings and structures?', options: ['Mechanical','Civil','Electrical','Chemical'], stream: 'Science' },
  { id: 's10', question: 'Which skill is most important in scientific research?', options: ['Guessing','Observation & experimentation','Marketing','Storytelling'], stream: 'Science' },
]
export const commerceQuestions = [
  { id: 'c1', question: 'Which subject deals with recording financial transactions?', options: ['Economics','Accountancy','Marketing','Law'], stream: 'Commerce' },
  { id: 'c2', question: 'Which concept explains demand vs price relationship?', options: ['Balance sheet','Demand curve','Algorithm','Circuit'], stream: 'Commerce' },
  { id: 'c3', question: 'A student interested in stock market analysis should choose?', options: ['Arts','Science','Commerce','Medical'], stream: 'Commerce' },
  { id: 'c4', question: 'Which tool is commonly used for financial data analysis?', options: ['Excel','AutoCAD','Figma','Blender'], stream: 'Commerce' },
  { id: 'c5', question: 'Which career requires clearing CA exams?', options: ['Engineer','Chartered Accountant','Doctor','Designer'], stream: 'Commerce' },
  { id: 'c6', question: 'Which concept is used in business decision-making?', options: ['Newton’s Law','Cost-benefit analysis','DNA structure','Grammar'], stream: 'Commerce' },
  { id: 'c7', question: 'Which field focuses on managing employees and organizations?', options: ['HR Management','Physics','Chemistry','Geography'], stream: 'Commerce' },
  { id: 'c8', question: 'Which subject helps understand GDP, inflation, economy?', options: ['Economics','Biology','History','Computer Science'], stream: 'Commerce' },
  { id: 'c9', question: 'Which skill is most important for entrepreneurship?', options: ['Drawing','Risk-taking','Memorization','Acting'], stream: 'Commerce' },
  { id: 'c10', question: 'Which system records assets, liabilities, and capital?', options: ['Ledger system','Operating system','Database system','Network system'], stream: 'Commerce' },
]

export const artsQuestions = [
  { id: 'a1', question: 'Which subject studies human behavior and mind?', options: ['Physics','Psychology','Chemistry','Math'], stream: 'Arts' },
  { id: 'a2', question: 'Which field deals with laws and legal systems?', options: ['Engineering','Law','Medicine','Finance'], stream: 'Arts' },
  { id: 'a3', question: 'Which skill is essential for a journalist?', options: ['Coding','Writing & communication','Accounting','Programming'], stream: 'Arts' },
  { id: 'a4', question: 'Which subject focuses on government and political systems?', options: ['Political Science','Biology','Economics','Physics'], stream: 'Arts' },
  { id: 'a5', question: 'A student interested in civil services should prefer?', options: ['Science','Commerce','Arts','Engineering'], stream: 'Arts' },
  { id: 'a6', question: 'Which field involves design, creativity, and visual communication?', options: ['Graphic Design','Accounting','Engineering','Medicine'], stream: 'Arts' },
  { id: 'a7', question: 'Which subject studies past events and civilizations?', options: ['History','Physics','Chemistry','Math'], stream: 'Arts' },
  { id: 'a8', question: 'Which skill is important for public speaking and debates?', options: ['Logical expression','Drawing','Coding','Experimentation'], stream: 'Arts' },
  { id: 'a9', question: 'Which field focuses on social issues and human development?', options: ['Sociology','Physics','Chemistry','Accounting'], stream: 'Arts' },
  { id: 'a10', question: 'Which career involves content creation and storytelling?', options: ['Software Developer','Content Writer','Accountant','Engineer'], stream: 'Arts' },
]

export const aptitudeQuestions = [
  ...generalAptitudeQuestions,
  ...scienceQuestions,
  ...commerceQuestions,
  ...artsQuestions,
]

export function scoreToProfile(answers = {}) {
  const bucket = { Science: 0, Commerce: 0, Arts: 0 }

  for (const [qid, idx] of Object.entries(answers)) {
    if (qid.startsWith('s') && idx === 1) bucket.Science += 2
    if (qid.startsWith('c') && idx === 1) bucket.Commerce += 2
    if (qid.startsWith('a') && idx === 1) bucket.Arts += 2

    if (qid.startsWith('g')) {
      if (idx === 0) bucket.Science += 1
      if (idx === 1) bucket.Arts += 1
      if (idx === 2) bucket.Arts += 1
      if (idx === 3) bucket.Commerce += 1
    }
  }

  const best = Object.entries(bucket).sort((a, b) => b[1] - a[1])[0][0]

  return {
    profile:
      best === 'Science'
        ? 'Analytical Builder'
        : best === 'Commerce'
        ? 'Business Strategist'
        : 'Creative Thinker',
    streamHint: best,
  }
}
export function scoreStreamTest(answers = {}) {
  const total = Object.keys(answers).length
  if (total === 0) return { score: 0, level: 'Not attempted' }

  let strong = 0
  for (const val of Object.values(answers)) {
    if (val === 0 || val === 1) strong++
  }

  const percentage = Math.round((strong / total) * 100)

  if (percentage >= 70) return { score: percentage, level: 'Strong Fit' }
  if (percentage >= 40) return { score: percentage, level: 'Moderate Fit' }
  return { score: percentage, level: 'Low Fit' }
}