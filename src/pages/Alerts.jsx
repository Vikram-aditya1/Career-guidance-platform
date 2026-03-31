import { useEffect, useMemo, useState } from 'react'
import { Bell, GraduationCap, Landmark } from 'lucide-react'
import { PageHeader } from '../components/PageHeader.jsx'
import { CardSkeleton } from '../components/Skeleton.jsx'
import { alerts } from '../data/alerts.js'

const iconByType = {
  Admissions: GraduationCap,
  Scholarships: Bell,
  'Government schemes': Landmark,
}

export function Alerts() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const grouped = useMemo(() => {
    const out = {}
    for (const a of alerts) {
      out[a.type] = out[a.type] || []
      out[a.type].push(a)
    }
    return out
  }, [])

  return (
    <div>
      <PageHeader
        title="Alerts & Notifications"
        subtitle="Admissions, scholarships, and government scheme updates (dummy)."
      />

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([type, items]) => {
            const Icon = iconByType[type] || Bell
            return (
              <section key={type}>
                <div className="flex items-center gap-2">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {type}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {items.length} notification(s)
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((a) => (
                    <div key={a.id} className="card p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                          {a.title}
                        </div>
                        <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                          {a.date}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                        {a.description}
                      </p>
                      <button
                        type="button"
                        className="btn-ghost mt-5 w-full"
                        onClick={() => alert('Demo: Reminder saved locally (not implemented).')}
                      >
                        Set reminder (demo)
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

