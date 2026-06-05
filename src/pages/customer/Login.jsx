import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Mail, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { sendOTP, token, user, loading, error, clearError } = useAuth()
  const [email, setEmail] = useState(location.state?.email || '')

  if (token && user?.role === 'customer') {
    return <Navigate to="/customer/my-products" replace />
  }

  if (token && user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    clearError()

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) {
      toast.error('Enter your email address')
      return
    }

    const result = await sendOTP(normalizedEmail)
    if (result.ok) {
      toast.success('OTP sent to your email')
      navigate('/verify-otp', {
        state: {
          email: normalizedEmail,
          role: result.data?.role,
          expiresInSeconds: result.data?.expires_in_seconds,
          from: location.state?.from,
        },
      })
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center px-4">
      <div className="w-full rounded-lg border border-surface-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-600 text-white">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Warranty Portal</p>
            <h1 className="text-xl font-bold text-surface-950">Login with OTP</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-surface-800">
              Email address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="input pl-10"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
          </div>

          {error && <div className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-surface-600">
          New customer?{' '}
          <Link to="/customer/register" className="font-semibold text-brand-700 hover:text-brand-800">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
