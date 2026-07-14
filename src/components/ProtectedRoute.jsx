import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { token, user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/customer/my-products'} replace />
  }

  if (user.role === 'customer' && user.terms_required && !user.onboarding_terms_accepted) {
    const allowedBeforeAcceptance = ['/customer/terms', '/customer/logout']
    if (!allowedBeforeAcceptance.includes(location.pathname)) {
      return <Navigate to="/customer/terms" replace />
    }
  }

  // Customers must complete their profile before accessing any other screen.
  // Only the profile and logout routes are reachable while it is incomplete.
  if (user.role === 'customer' && !user.profile_complete) {
    const allowedWhileIncomplete = ['/customer/profile', '/customer/terms', '/customer/logout']
    if (!allowedWhileIncomplete.includes(location.pathname)) {
      return <Navigate to="/customer/profile" replace state={{ from: location.pathname }} />
    }
  }

  return children || <Outlet />
}
