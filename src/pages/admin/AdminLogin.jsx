import { Navigate, useLocation } from 'react-router-dom'

export default function AdminLogin() {
  const location = useLocation()
  return <Navigate to="/login" replace state={{ from: location.state?.from || { pathname: '/admin/dashboard' } }} />
}
