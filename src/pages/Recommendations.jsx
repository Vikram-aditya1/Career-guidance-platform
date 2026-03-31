import { useEffect, useMemo, useState } from 'react'
import { Sparkles, Target } from 'lucide-react'
import { PageHeader } from '../components/PageHeader.jsx'
import { CardSkeleton } from '../components/Skeleton.jsx'
import {
  courseRecommendations,
  streamRecommendations,
} from '../data/recommendations.js'

const KEY = 'oscea_test_results'

function loadResults() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function Recommendations() {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => {
      setResults(loadResults())
      setLoading(false)
    }, 650)
    return () => clearTimeout(t)
  }, [])

  const streamHint = results?.streamHint || 'Science'
  const profile = results?.profile || 'Explorer'

  const courses = useMemo(() => {
    return courseRecommendations
      .slice()
      .sort((a, b) =>
        a.stream === streamHint && b.stream !== streamHint ? -1 : 0,
      )
  }, [streamHint])

  return (
    <div>
      <PageHeader
        title="Recommendations"
        subtitle="Suggested streams, courses, and career paths based on a simple aptitude profile."
        right={
          <div className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-extrabold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-200">
            <Sparkles size={16} />
            Profile: {profile}
          </div>
        }
      />

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <>
          {!results ? (
            <div className="card p-6">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200">
                  <Target size={18} />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Take the aptitude test first
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Once you submit the test, you’ll see a profile-based hint and
                    stream-first course ordering here.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-6">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Suggested streams
            </div>
            <div className="mt-3 grid gap-5 md:grid-cols-3">
              {streamRecommendations.map((s) => {
                const emphasized = s.stream === streamHint
                return (
                  <div
                    key={s.stream}
                    className={`card p-6 ${
                      emphasized
                        ? 'ring-2 ring-indigo-500/30'
                        : 'ring-0 ring-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                          {s.stream}
                        </div>
                        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          {s.description}
                        </div>
                      </div>
                      {emphasized ? (
                        <div className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200">
                          Best match
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {s.highlights.map((h) => (
                        <span
                          key={h}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-200"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-10">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Courses & career paths
            </div>
            <div className="mt-3 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <div key={c.title} className="card p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {c.title}
                      </div>
                      <div className="mt-1 text-sm font-bold text-indigo-600 dark:text-indigo-300">
                        Stream: {c.stream}
                      </div>
                    </div>
                    {c.stream === streamHint ? (
                      <div className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200">
                        Matches hint
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Possible careers
                  </div>
                  <div className="mt-2 grid gap-2">
                    {c.careers.map((p) => (
                      <div
                        key={p}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-200"
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

