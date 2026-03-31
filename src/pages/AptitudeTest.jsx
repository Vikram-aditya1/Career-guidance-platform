import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { PageHeader } from '../components/PageHeader.jsx'
import { aptitudeQuestions, scoreToProfile } from '../data/aptitude.js'

const KEY = 'oscea_test_results'

function saveResults(results) {
  localStorage.setItem(KEY, JSON.stringify(results))
}

export function AptitudeTest() {
  const navigate = useNavigate()
  const total = aptitudeQuestions.length
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const current = aptitudeQuestions[step]

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers])
  const progress = Math.round(((step + 1) / total) * 100)

  const canPrev = step > 0
  const canNext = step < total - 1
  const selected = answers[current.id]

  function setAnswer(idx) {
    setAnswers((a) => ({ ...a, [current.id]: idx }))
  }

  async function submit() {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))
    const profile = scoreToProfile(answers)
    saveResults({
      completedAt: new Date().toISOString(),
      answers,
      ...profile,
    })
    setSubmitting(false)
    navigate('/dashboard/recommendations')
  }

  return (
    <div>
      <PageHeader
        title="Aptitude Test"
        subtitle="Answer a few quick questions. Your results will be saved locally."
      />

      <div className="card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">
            Question {step + 1} of {total}
          </div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Answered: {answeredCount}/{total}
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-2 rounded-full bg-indigo-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-right text-xs font-bold text-slate-500 dark:text-slate-400">
            {progress}%
          </div>
        </div>

        <div className="mt-6 text-left">
          <div className="text-lg font-extrabold text-slate-900 dark:text-white">
            {current.question}
          </div>

          <div className="mt-4 grid gap-3">
            {current.options.map((opt, idx) => {
              const active = selected === idx
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAnswer(idx)}
                  className={`flex items-start justify-between gap-3 rounded-2xl border p-4 text-left transition ${
                    active
                      ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950/30'
                      : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/30 dark:hover:bg-slate-900/40'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {opt}
                    </div>
                  </div>
                  {active ? (
                    <div className="mt-0.5 text-indigo-600 dark:text-indigo-300">
                      <CheckCircle2 size={18} />
                    </div>
                  ) : (
                    <div className="mt-1 h-4 w-4 rounded-full border border-slate-300 dark:border-slate-700" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={!canPrev}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            {canNext ? (
              <button
                type="button"
                className="btn-primary"
                onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
              >
                Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={submit}
                disabled={submitting || Object.keys(answers).length < total}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Submitting…
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            )}
          </div>
        </div>

        {Object.keys(answers).length < total ? (
          <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Please answer all questions to submit.
          </div>
        ) : null}
      </div>
    </div>
  )
}

