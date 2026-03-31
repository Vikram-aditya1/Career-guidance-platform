import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Navbar } from '../components/Navbar.jsx'
import { Footer } from '../components/Footer.jsx'
import { features } from '../data/features.js'
import { testimonials } from '../data/testimonials.js'
import { useAuth } from '../routes/AuthContext.jsx'

export function Home() {
  const { isAuthed } = useAuth()

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-white dark:from-indigo-950/40 dark:via-slate-950 dark:to-slate-950" />
          <div className="container-page py-14 sm:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-200">
                  <CheckCircle2 size={16} />
                  One-Stop Personalized Career & Education Advisor
                </div>

                <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  Choose the right path after Class 10 & 12 — with clarity.
                </h1>
                <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  Explore streams, courses, and career options. Take an aptitude
                  test, discover recommendations, and find government colleges —
                  all in one modern, student-friendly platform.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    to={isAuthed ? '/dashboard' : '/signup'}
                    className="btn-primary"
                  >
                    Get Started <ArrowRight size={16} />
                  </Link>
                  <a href="#features" className="btn-ghost">
                    Explore features
                  </a>
                </div>

                <div className="mt-8 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/30">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Built for
                    </div>
                    <div className="mt-1 font-bold">Class 10 & 12 students</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/30">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Focus
                    </div>
                    <div className="mt-1 font-bold">Government colleges</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/30">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Setup
                    </div>
                    <div className="mt-1 font-bold">No backend required</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Your next steps
                    </div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Demo flow
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3">
                    {[
                      'Create your profile',
                      'Take the aptitude test',
                      'View recommendations',
                      'Find colleges & track alerts',
                    ].map((t) => (
                      <div
                        key={t}
                        className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/30"
                      >
                        <div className="mt-0.5 text-indigo-600 dark:text-indigo-300">
                          <CheckCircle2 size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {t}
                          </div>
                          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            A guided experience designed to reduce confusion and
                            help you decide with confidence.
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pointer-events-none absolute -right-10 -top-10 hidden h-40 w-40 rounded-full bg-indigo-200/40 blur-2xl dark:bg-indigo-900/40 lg:block" />
                <div className="pointer-events-none absolute -bottom-12 -left-12 hidden h-40 w-40 rounded-full bg-blue-200/40 blur-2xl dark:bg-blue-900/40 lg:block" />
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="container-page py-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                About the platform
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">
                After Class 10 or 12, it’s common to feel unsure. This platform
                helps you explore options logically — streams, courses, and
                career paths — and connects you with a simple college directory
                and alerts for important opportunities.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  'Student-first explanations',
                  'Clear next steps',
                  'Mobile-friendly UI',
                  'Fast, lightweight app',
                ].map((x) => (
                  <div key={x} className="flex items-center gap-2 text-sm">
                    <span className="text-indigo-600 dark:text-indigo-300">
                      <CheckCircle2 size={16} />
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {x}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                What you’ll get
              </div>
              <div className="mt-3 grid gap-3">
                {features.map((f) => (
                  <div
                    key={f.title}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/30"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200">
                      <f.icon size={18} />
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white">
                        {f.title}
                      </div>
                      <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {f.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="container-page py-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Features
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Everything you need to move from confusion to clarity.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="card p-6">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200">
                  <f.icon size={20} />
                </div>
                <div className="mt-4 text-lg font-extrabold text-slate-900 dark:text-white">
                  {f.title}
                </div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {f.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="testimonials"
          className="border-y border-slate-200 bg-slate-50 py-14 dark:border-slate-800 dark:bg-slate-950/50"
        >
          <div className="container-page">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Testimonials
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Dummy feedback to preview the experience.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.name} className="card p-6">
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    “{t.quote}”
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white">
                        {t.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {t.grade}
                      </div>
                    </div>
                    <div className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200">
                      Verified (demo)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

