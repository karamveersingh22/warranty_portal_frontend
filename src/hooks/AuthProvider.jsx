import { createContext, useState, useEffect } from 'react'
import api from '../api/axios'

export const AuthContext = createContext(null)
const TOKEN_KEY = 'token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    const restoreSession = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const res = await api.get('/auth/me')
        if (active) {
          setUser(res.data)
        }
      } catch (err) {
        localStorage.removeItem(TOKEN_KEY)
        if (active) {
          setToken(null)
          setUser(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      active = false
    }
  }, [token])

  const persistToken = (newToken) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
    setToken(newToken)
  }

  const sendOTP = async (email, role = null) => {
    setLoading(true)
    setError(null)
    try {
      const payload = role ? { email, role } : { email }
      const res = await api.post('/auth/send-otp', payload)
      return { ok: true, data: res.data }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send OTP')
      return { ok: false }
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async (email, otp, role = null) => {
    setLoading(true)
    setError(null)
    try {
      const payload = role ? { email, otp, role } : { email, otp }
      const res = await api.post('/auth/verify-otp', payload)
      const newToken = res.data.access_token
      persistToken(newToken)
      setUser(res.data.user)
      return { ok: true, user: res.data.user }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to verify OTP')
      return { ok: false }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    persistToken(null)
    setUser(null)
    setError(null)
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider value={{ user, token, loading, error, sendOTP, verifyOTP, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}
