export const aptitudeQuestions = [
  {
    id: 'q1',
    question: 'Which activity sounds most enjoyable to you?',
    options: [
      'Solving math or logic puzzles',
      'Creating art, designs, or stories',
      'Helping people and working in teams',
      'Understanding business, money, and markets',
    ],
  },
  {
    id: 'q2',
    question: 'In school projects, you usually prefer to…',
    options: [
      'Plan the approach and make it efficient',
      'Present creatively with visuals',
      'Coordinate with everyone to complete tasks',
      'Analyze data and make a practical conclusion',
    ],
  },
  {
    id: 'q3',
    question: 'Which subject combination feels strongest for you?',
    options: [
      'Math + Science',
      'Languages + Social Science',
      'Biology + Chemistry',
      'Commerce + Economics',
    ],
  },
  {
    id: 'q4',
    question: 'How do you like to learn new things?',
    options: [
      'By experimenting and building',
      'By reading and reflecting',
      'By discussing with others',
      'By practicing and tracking progress',
    ],
  },
  {
    id: 'q5',
    question: 'What type of future work appeals most?',
    options: [
      'Tech / engineering roles',
      'Design / media roles',
      'Healthcare / teaching / public service',
      'Business / finance / entrepreneurship',
    ],
  },
]

export function scoreToProfile(answers = {}) {
  const keys = Object.keys(answers)
  if (keys.length === 0) return { profile: 'Explorer', streamHint: 'Science' }

  const bucket = { tech: 0, creative: 0, people: 0, business: 0 }
  for (const id of keys) {
    const idx = answers[id]
    if (idx === 0) bucket.tech += 2
    if (idx === 1) bucket.creative += 2
    if (idx === 2) bucket.people += 2
    if (idx === 3) bucket.business += 2
  }

  const best = Object.entries(bucket).sort((a, b) => b[1] - a[1])[0][0]

  if (best === 'tech') return { profile: 'Analytical Builder', streamHint: 'Science' }
  if (best === 'creative') return { profile: 'Creative Thinker', streamHint: 'Arts' }
  if (best === 'people') return { profile: 'People Helper', streamHint: 'Arts' }
  return { profile: 'Business Strategist', streamHint: 'Commerce' }
}

