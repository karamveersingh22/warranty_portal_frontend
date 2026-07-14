import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, MailCheck, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import OTPInput from '../../components/OTPInput'
import { useAuth } from '../../hooks/useAuth'
import AuthShell from '../../components/AuthShell'

export default function OTPVerification() {
  const navigate = useNavigate()
  const location = useLocation()
  const { verifyOTP, sendOTP, token, user, loading, error, clearError } = useAuth()
  const email = location.state?.email || ''
  const role = location.state?.role || null
  const requestedPath = location.state?.from?.pathname
  const [otp, setOtp] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(location.state?.expiresInSeconds || 600)

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
    const seconds = String(secondsLeft % 60).padStart(2, '0')
    return `${minutes}:${seconds}`
  }, [secondsLeft])

  useEffect(() => {
    if (secondsLeft <= 0) return undefined
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(value - 1, 0))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [secondsLeft])

  if (!email) {
    return <Navigate to="/login" replace />
  }

  if (token && user?.role === 'customer') {
    return <Navigate to={user.feedback_required ? '/customer/feedback' : user?.profile_complete ? '/customer/my-products' : '/customer/profile'} replace />
  }

  if (token && user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleVerify = async (event) => {
    event.preventDefault()
    clearError()

    if (otp.length !== 6) {
      toast.error('Enter the 6 digit OTP')
      return
    }

    const result = await verifyOTP(email, otp, role)
    if (result.ok) {
      const verifiedRole = result.user?.role
      const isAdminRequest = requestedPath?.startsWith('/admin')

      let redirectTo
      if (verifiedRole === 'admin') {
        redirectTo = isAdminRequest ? requestedPath : '/admin/dashboard'
      } else if (result.user?.feedback_required) {
        redirectTo = '/customer/feedback'
      } else if (!result.user?.profile_complete) {
        // Customers must finish their profile before anything else.
        redirectTo = '/customer/profile'
      } else {
        redirectTo = isAdminRequest ? '/customer/my-products' : (requestedPath || '/customer/my-products')
      }

      toast.success('Login successful')
      navigate(redirectTo, {
        replace: true,
        state: !result.user?.profile_complete && requestedPath ? { from: requestedPath } : undefined,
      })
    }
  }

  const handleResend = async () => {
    clearError()
    const result = await sendOTP(email)
    if (result.ok) {
      setOtp('')
      setSecondsLeft(result.data?.expires_in_seconds || 600)
      toast.success('New OTP sent')
    }
  }

  return (
    <AuthShell>
      <div className="rounded-2xl border border-surface-200/80 bg-white p-8 shadow-glass">
        <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-surface-950">
          <ArrowLeft className="h-4 w-4" />
          Change email
        </Link>

        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <MailCheck className="h-7 w-7" />
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold text-surface-950">Verify your code</h1>
          <p className="mt-2 text-sm leading-6 text-surface-500">
            Enter the 6-digit code sent to <span className="font-semibold text-surface-900">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="mt-7 space-y-5">
          <OTPInput value={otp} onChange={setOtp} />

          <div className="text-center text-sm text-surface-500">
            {secondsLeft > 0 ? `OTP expires in ${formattedTime}` : 'OTP expired. Request a new code.'}
          </div>

          {error && <div className="rounded-xl bg-danger-50 px-3 py-2 text-sm text-danger-700">{error}</div>}

          <button type="submit" disabled={loading || otp.length !== 6 || secondsLeft === 0} className="btn-primary w-full py-3 text-base">
            {loading ? 'Verifying...' : 'Verify and Login'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          disabled={loading}
          className="btn-secondary mt-3 w-full"
        >
          <RotateCcw className="h-4 w-4" />
          Resend OTP
        </button>
      </div>
    </AuthShell>
  )
}
