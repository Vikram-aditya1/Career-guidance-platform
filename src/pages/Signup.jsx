import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2 } from 'lucide-react'
import { AuthLayout } from '../components/AuthLayout.jsx'
import { useAuth } from '../routes/AuthContext.jsx'

export function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('Student')
  const [email, setEmail] = useState('student@example.com')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('') // ✅ NEW

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await signup({ name, email, password })

      setSuccess('Account created successfully!') // ✅ SHOW MESSAGE

      setTimeout(() => {
        navigate('/dashboard', { replace: true }) // ✅ DELAYED REDIRECT
      }, 1000)

    } catch (err) {
      setError(err?.message || 'Signup failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your personalized guidance journey in minutes."
      footer={
        <>
          Already have an account?{' '}
          <Link className="font-bold text-indigo-600" to="/login">
            Login
          </Link>
        </>
      }
    >

      {/* ✅ SUCCESS MESSAGE */}
      {success && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* ❌ ERROR MESSAGE */}
      {error ? (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
          <AlertCircle size={18} className="mt-0.5" />
          <div className="min-w-0">
            <div className="font-extrabold">Couldn’t create account</div>
            <div className="mt-0.5">{error}</div>
          </div>
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Name
          </label>
          <input
            className="input mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            type="text"
            autoComplete="name"
          />
        </div>

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
            placeholder="Create a password"
            type="password"
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Creating…
            </>
          ) : (
            'Sign up'
          )}
        </button>
      </form>
    </AuthLayout>
  )
}