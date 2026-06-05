import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function CustomerLogout() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    logout()
    const timer = window.setTimeout(() => navigate('/login', { replace: true }), 800)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <section className="mx-auto max-w-md rounded-lg border border-surface-200 bg-white p-8 text-center shadow-sm">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
        <LogOut className="h-6 w-6" />
      </span>
      <h1 className="mt-4 text-2xl font-bold text-surface-950">Signed out</h1>
      <p className="mt-2 text-sm text-surface-600">Your customer session has been cleared.</p>
      <Link to="/login" className="btn-primary mt-6">Login again</Link>
    </section>
  )
}
