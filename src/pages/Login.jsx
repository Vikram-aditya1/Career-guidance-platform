import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2 } from 'lucide-react'
import { AuthLayout } from '../components/AuthLayout.jsx'
import { useAuth } from '../routes/AuthContext.jsx'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/dashboard'

  const [email, setEmail] = useState('student@example.com')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Login"
      subtitle="Welcome back. Continue to your dashboard."
      footer={
        <>
          Don’t have an account?{' '}
          <Link className="font-bold text-indigo-600" to="/signup">
            Sign up
          </Link>
        </>
      }
    >
      {error ? (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
          <AlertCircle size={18} className="mt-0.5" />
          <div className="min-w-0">
            <div className="font-extrabold">Couldn’t log you in</div>
            <div className="mt-0.5">{error}</div>
            <div className="mt-2 text-xs text-rose-700/80 dark:text-rose-200/80">
              Tip: Sign up first (demo stores account in localStorage).
            </div>
          </div>
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Email
          </label>
          <input
            className="input mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Password
          </label>
          <input
            className="input mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Logging in…
            </>
          ) : (
            'Login'
          )}
        </button>

        <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-400">
          Demo credentials are prefilled. Use <b>Sign up</b> to create an
          account and then login.
        </div>
      </form>
    </AuthLayout>
  )
}

