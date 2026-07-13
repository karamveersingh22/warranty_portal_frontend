import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import AuthShell from '../../components/AuthShell'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { sendOTP, token, user, loading, error, clearError } = useAuth()
  const [email, setEmail] = useState(location.state?.email || '')

  if (token && user?.role === 'customer') {
    return <Navigate to={user.profile_complete ? (location.state?.from?.pathname || '/customer/my-products') : '/customer/profile'} replace />
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
    <AuthShell>
      <div className="rounded-2xl border border-surface-200/80 bg-white p-8 shadow-glass">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-600">Welcome back</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-surface-950">Login to your account</h1>
        <p className="mt-2 text-sm text-surface-500">
          Enter your email and we&apos;ll send you a one-time passcode.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-surface-800">
              Email address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
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

          {error && <div className="rounded-xl bg-danger-50 px-3 py-2 text-sm text-danger-700">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Sending OTP...' : 'Send OTP'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-surface-600">
          New customer?{' '}
          <Link to="/customer/register" className="font-semibold text-brand-700 hover:text-brand-800">
            Create an account
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
