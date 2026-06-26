import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { BookOpen, Headset, Home, LogOut, Menu, MessageSquare, Package, PackagePlus, User, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Brand from './Brand'

const CUSTOMER_NAV = [
  { path: '/customer/dashboard', label: 'Dashboard', icon: Home },
  { path: '/customer/register-product', label: 'Register Product', icon: PackagePlus },
  { path: '/customer/my-products', label: 'My Products', icon: Package },
  { path: '/customer/enquiry', label: 'Enquiries', icon: MessageSquare },
  { path: '/customer/warranty-rules', label: 'Rules', icon: BookOpen },
  { path: '/customer/support', label: 'Support', icon: Headset },
  { path: '/customer/profile', label: 'Profile', icon: User },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/customer/dashboard">
          <Brand size="sm" showTagline={false} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100"
          >
            <Home className="h-4 w-4" />
            Home
          </NavLink>
          {CUSTOMER_NAV.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-surface-600 hover:bg-surface-100'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden max-w-[180px] truncate rounded-lg border border-surface-200 px-3 py-1.5 text-xs text-surface-600 sm:block">
            {user?.email || 'Customer'}
          </span>
          <button onClick={handleLogout} className="rounded-lg p-2 text-surface-500 hover:bg-surface-100" title="Logout">
            <LogOut className="h-4 w-4" />
          </button>
          <button onClick={() => setMobileOpen((open) => !open)} className="rounded-lg p-2 text-surface-600 hover:bg-surface-100 md:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-surface-200 bg-white px-4 py-3 md:hidden">
          <div className="space-y-1">
            {CUSTOMER_NAV.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-surface-600 hover:bg-surface-100'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
