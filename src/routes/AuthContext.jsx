import api from "../api"
import { createContext, useContext, useMemo, useState } from 'react'
import { clearAuth, loadAuth, saveAuth } from './storage.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadAuth())

  const value = useMemo(() => {
    const user = auth?.user ?? null
    const token = auth?.token ?? null

    return {
      user,
      isAuthed: Boolean(user && token),

      // ✅ LOGIN
      async login({ email, password }) {
        if (!email || !password) {
          throw new Error('Email and password are required.')
        }

        try {
          const res = await api.post("/login", {
            email,
            password
          })

          const { token, user } = res.data

          const next = {
            token,
            user
          }

          saveAuth(next)
          setAuth(next)

          return user

        } catch (err) {
          throw new Error(err.response?.data?.message || "Login failed")
        }
      },

      // ✅ SIGNUP
      async signup({ name, email, password }) {
        if (!name || !email || !password) {
          throw new Error('All fields are required.')
        }

        await api.post("/signup", {
          name,
          email,
          password
        })

        const next = {
          token: null, // no token until login
          user: { name, email }
        }

        saveAuth(next)
        setAuth(next)

        return next.user
      },

      // ✅ LOGOUT
      logout() {
        clearAuth()
        setAuth(null)
      },

      // ✅ UPDATE PROFILE
      updateProfile(patch) {
        const next = {
          token: token || null,
          user: { ...(user || {}), ...patch }
        }
        saveAuth(next)
        setAuth(next)
      },
    }
  }, [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}