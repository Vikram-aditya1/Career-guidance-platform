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

  // ✅ ALWAYS GET LATEST RESULT (FIXED)
  useEffect(() => {
    function refresh() {
      setResults(loadResults())
    }

    refresh()

    // listen when user comes back to this tab/page
    window.addEventListener('focus', refresh)

    return () => {
      window.removeEventListener('focus', refresh)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const streamHint = results?.streamHint || null
  const profile = results?.profile || 'Explorer'

  const courses = useMemo(() => {
    if (!streamHint) return courseRecommendations

    return courseRecommendations
      .slice()
      .sort((a, b) =>
        a.stream === streamHint && b.stream !== streamHint ? -1 : 0
      )
  }, [streamHint])

  return (
    <div>
      <PageHeader
        title="Recommendations"
        subtitle="Personalized guidance based on your aptitude test."
        right={
          <div className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-extrabold text-indigo-700">
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
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 text-indigo-700">
                  <Target size={18} />
                </div>
                <div>
                  <div className="text-lg font-extrabold">
                    Take the aptitude test first
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Complete the test to get personalized recommendations.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* 🔥 RESULT */}
              <div className="card p-6 mb-6">

                <div className="text-xl font-extrabold">
                  🎯 Recommended Stream:
                  <span className="text-indigo-600 ml-2">
                    {results.streamHint}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-600">
                  {results.reason}
                </p>

                {/* SCORES */}
                <div className="mt-6">
                  <div className="font-bold mb-2">Your Performance</div>

                  {Object.entries(results.scores || {}).map(([key, value]) => (
                    <div key={key} className="mb-3">
                      <div className="flex justify-between text-sm font-bold">
                        <span>{key}</span>
                        <span>{value}</span>
                      </div>

                      <div className="w-full bg-gray-200 h-2 rounded mt-1">
                        <div
                          className="bg-indigo-500 h-2 rounded"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* STREAMS */}
              <div className="mt-6">
                <div className="text-xs font-extrabold uppercase text-slate-400">
                  Suggested streams
                </div>

                <div className="mt-3 grid gap-5 md:grid-cols-3">
                  {streamRecommendations.map((s) => {
                    const emphasized = s.stream === streamHint
                    return (
                      <div
                        key={s.stream}
                        className={`card p-6 ${
                          emphasized ? 'ring-2 ring-indigo-500/30' : ''
                        }`}
                      >
                        <div className="flex justify-between">
                          <div>
                            <div className="text-lg font-extrabold">
                              {s.stream}
                            </div>
                            <div className="mt-2 text-sm text-slate-600">
                              {s.description}
                            </div>
                          </div>

                          {emphasized && (
                            <div className="text-xs font-bold text-indigo-600">
                              Best match
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* COURSES */}
              <div className="mt-10">
                <div className="text-xs font-extrabold uppercase text-slate-400">
                  Courses & career paths
                </div>

                <div className="mt-3 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {courses.map((c) => (
                    <div key={c.title} className="card p-6">

                      <div className="text-lg font-extrabold">
                        {c.title}
                      </div>

                      <div className="mt-1 text-sm text-indigo-600 font-bold">
                        Stream: {c.stream}
                      </div>

                      {c.stream === streamHint && (
                        <div className="mt-2 text-xs text-green-600 font-bold">
                          Matches your profile
                        </div>
                      )}

                      <div className="mt-4 text-xs font-bold uppercase text-slate-400">
                        Careers
                      </div>

                      <div className="mt-2 space-y-2">
                        {c.careers.map((p) => (
                          <div key={p} className="text-sm">
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
        </>
      )}
    </div>
  )
}