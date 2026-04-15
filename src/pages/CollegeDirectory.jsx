import { useEffect, useMemo, useState } from 'react'
import { Filter, Search } from 'lucide-react'
import { PageHeader } from '../components/PageHeader.jsx'
import { CardSkeleton } from '../components/Skeleton.jsx'
import { colleges } from '../data/colleges.js'

export function CollegeDirectory() {
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [state, setState] = useState('All')

  // ✅ loading skeleton
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  // ✅ AUTO LOCATION DETECTION (ADDED)
  useEffect(() => {
    async function detectLocation() {
      try {
        const res = await fetch("https://ipapi.co/json/")
        const data = await res.json()

        if (data?.region) {
          setState(data.region)
        }
      } catch (err) {
        console.log("Location fetch failed")
      }
    }

    detectLocation()
  }, [])

  // ✅ dynamic states
  const states = useMemo(() => {
    return ['All', ...new Set(colleges.map(c => c.state))]
  }, [])

  // ✅ filtering
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()

    return colleges.filter((c) => {
      const matchTerm =
        !term ||
        c.name.toLowerCase().includes(term) ||
        c.courses.some((x) => x.toLowerCase().includes(term))

      const matchState = state === 'All' || c.state === state

      return matchTerm && matchState
    })
  }, [q, state])

  return (
    <div>
      <PageHeader
        title="Government College Directory"
        subtitle="Find colleges based on your location and interests."
      />

      {/* 🔍 FILTER */}
      <div className="card p-5">
        <div className="grid gap-3 md:grid-cols-3">

          {/* SEARCH */}
          <div className="md:col-span-2">
            <label className="text-sm font-bold">Search</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border px-3 py-2">
              <Search size={18} className="text-slate-400" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by college or course..."
              />
            </div>
          </div>

          {/* STATE FILTER */}
          <div>
            <label className="text-sm font-bold">State</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border px-3 py-2">
              <Filter size={18} className="text-slate-400" />
              <select
                className="w-full bg-transparent text-sm outline-none"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

        <div className="mt-4 text-xs text-slate-500">
          Showing <b>{filtered.length}</b> colleges
        </div>
      </div>

      {/* 🏫 LIST */}
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          : filtered.map((c) => (
              <div key={c.id} className="card p-6">

                <div className="text-lg font-extrabold">
                  {c.name}
                </div>

                <div className="mt-1 text-sm text-indigo-600 font-bold">
                  {c.district}, {c.state}
                </div>

                {/* 🔥 RECOMMENDED TAG */}
                {c.state === state && state !== "All" && (
                  <div className="text-xs font-bold text-green-600 mt-2">
                    Recommended for you
                  </div>
                )}

                {/* COURSES */}
                <div className="mt-4 text-xs font-bold uppercase text-slate-400">
                  Courses
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {c.courses.map((x) => (
                    <span
                      key={x}
                      className="rounded-full border px-3 py-1 text-xs font-bold"
                    >
                      {x}
                    </span>
                  ))}
                </div>

                {/* WEBSITE */}
                {c.website && (
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block text-sm text-indigo-600 font-bold"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            ))}
      </div>
    </div>
  )
}