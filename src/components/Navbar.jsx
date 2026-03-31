import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogIn, LogOut, UserPlus } from 'lucide-react'
import { Logo } from './Logo.jsx'
import { DarkModeToggle } from './DarkModeToggle.jsx'
import { useAuth } from '../routes/AuthContext.jsx'

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-xl px-3 py-2 text-sm font-semibold transition ${
          isActive
            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200'
            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export function Navbar({ variant = 'marketing' }) {
  const { isAuthed, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        {variant === 'marketing' && (
          <nav className="hidden items-center gap-1 md:flex">
            <NavItem to="/#about">About</NavItem>
            <NavItem to="/#features">Features</NavItem>
            <NavItem to="/#testimonials">Testimonials</NavItem>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <DarkModeToggle compact />

          {!isAuthed ? (
            <>
              <Link to="/login" className="btn-ghost hidden sm:inline-flex">
                <LogIn size={16} />
                Login
              </Link>
              <Link to="/signup" className="btn-primary">
                <UserPlus size={16} />
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="btn-ghost hidden sm:inline-flex">
                Dashboard
              </Link>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  logout()
                  navigate('/')
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

