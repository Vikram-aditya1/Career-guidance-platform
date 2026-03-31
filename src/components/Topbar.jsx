import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, LogOut } from 'lucide-react'
import { DarkModeToggle } from './DarkModeToggle.jsx'
import { useAuth } from '../routes/AuthContext.jsx'

export function Topbar({ onOpenMenu }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-ghost lg:hidden"
            onClick={onOpenMenu}
            aria-label="Open sidebar menu"
          >
            <Menu size={18} />
          </button>
          <div className="hidden sm:block">
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
              {location.pathname.startsWith('/dashboard')
                ? 'Student Dashboard'
                : 'App'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Welcome back{user?.name ? `, ${user.name}` : ''}.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DarkModeToggle compact />
          <Link to="/" className="btn-ghost hidden sm:inline-flex">
            Home
          </Link>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              logout()
              navigate('/login')
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

