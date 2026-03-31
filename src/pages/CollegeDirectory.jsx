import { useEffect, useMemo, useState } from 'react'
import { Filter, Search, Send } from 'lucide-react'
import { PageHeader } from '../components/PageHeader.jsx'
import { CardSkeleton } from '../components/Skeleton.jsx'
import { collegeLocations, colleges } from '../data/colleges.js'

export function CollegeDirectory() {
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [location, setLocation] = useState('All')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return colleges.filter((c) => {
      const matchTerm =
        !term ||
        c.name.toLowerCase().includes(term) ||
        c.courses.some((x) => x.toLowerCase().includes(term))
      const matchLoc = location === 'All' || c.location === location
      return matchTerm && matchLoc
    })
  }, [q, location])

  return (
    <div>
      <PageHeader
        title="College Directory"
        subtitle="Search and filter government colleges (dummy data)."
      />

      <div className="card p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Search
            </label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950/30">
              <Search size={18} className="text-slate-400" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 dark:text-slate-100"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by college name or course (e.g., B.Tech, B.Com)…"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Location
            </label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950/30">
              <Filter size={18} className="text-slate-400" />
              <select
                className="w-full bg-transparent text-sm outline-none dark:text-slate-100"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {collegeLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          Showing <b>{filtered.length}</b> results
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          : filtered.map((c) => (
              <div key={c.id} className="card p-6">
                <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {c.name}
                </div>
                <div className="mt-1 text-sm font-bold text-indigo-600 dark:text-indigo-300">
                  {c.location}
                </div>

                <div className="mt-4 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Courses offered
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {c.courses.map((x) => (
                    <span
                      key={x}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-200"
                    >
                      {x}
                    </span>
                  ))}
                </div>

                <div className="mt-4 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Eligibility
                </div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {c.eligibility}
                </div>

                <button
                  type="button"
                  className="btn-primary mt-5 w-full"
                  onClick={() => {
                    alert(
                      'Demo: Application flow is not implemented (no backend).',
                    )
                  }}
                >
                  <Send size={16} />
                  Apply
                </button>
              </div>
            ))}
      </div>
    </div>
  )
}

