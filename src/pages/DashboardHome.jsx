import { Link } from 'react-router-dom'
import { Bell, BookOpen, Compass, Target } from 'lucide-react'
import { PageHeader } from '../components/PageHeader.jsx'
import { useAuth } from '../routes/AuthContext.jsx'

const cards = [
  {
    title: 'Take Aptitude Test',
    description: 'Answer quick MCQs and discover your strengths.',
    to: '/dashboard/test',
    icon: Target,
    tint: 'bg-indigo-500/10 text-indigo-400',
  },
  {
    title: 'View Recommendations',
    description: 'Personalized career paths based on your profile.',
    to: '/dashboard/recommendations',
    icon: Compass,
    tint: 'bg-blue-500/10 text-blue-400',
  },
  {
    title: 'Explore Colleges',
    description: 'Find top government colleges by stream.',
    to: '/dashboard/colleges',
    icon: BookOpen,
    tint: 'bg-sky-500/10 text-sky-400',
  },
  {
    title: 'Alerts & Updates',
    description: 'Stay updated with exams & opportunities.',
    to: '/dashboard/alerts',
    icon: Bell,
    tint: 'bg-emerald-500/10 text-emerald-400',
  },
]

export function DashboardHome() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">

      <PageHeader
        title={`Welcome${user?.name ? `, ${user.name}` : ''} 👋`}
        subtitle="Your personalized career dashboard"
      />

      {/* ACTION CARDS */}
      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.title}
            to={c.to}
            className="group rounded-2xl bg-slate-800/60 backdrop-blur p-6 border border-slate-700 hover:border-indigo-500 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-bold text-white group-hover:text-indigo-400">
                  {c.title}
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  {c.description}
                </div>
              </div>

              <div className={`grid h-12 w-12 place-items-center rounded-xl ${c.tint}`}>
                <c.icon size={20} />
              </div>
            </div>

            <div className="mt-5 text-sm font-semibold text-indigo-400 opacity-80 group-hover:opacity-100">
              Open →
            </div>
          </Link>
        ))}
      </div>

      {/* LOWER SECTION */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* PROFILE */}
        <div className="rounded-2xl bg-slate-800 p-6 border border-slate-700 shadow">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Profile
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Email</span>
              <span className="font-semibold text-white">{user?.email || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Class</span>
              <span className="font-semibold text-white">{user?.grade || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location</span>
              <span className="font-semibold text-white">{user?.location || '—'}</span>
            </div>
          </div>

          <Link to="/dashboard/profile" className="btn-primary mt-5 w-full">
            Edit Profile
          </Link>
        </div>

        {/* TIP SECTION */}
        <div className="rounded-2xl bg-slate-800 p-6 border border-slate-700 lg:col-span-2 shadow">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Tip of the Day
          </div>

          <div className="mt-3 text-lg font-bold text-white">
            Choose a path based on your strengths, not trends.
          </div>

          <p className="mt-2 text-sm text-slate-400">
            Start with the aptitude test, then explore recommendations tailored to your interests.
          </p>

          <div className="mt-5 flex gap-3">
            <Link to="/dashboard/test" className="btn-primary">
              Take Test
            </Link>
            <Link to="/dashboard/recommendations" className="btn-ghost">
              View Recommendations
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
