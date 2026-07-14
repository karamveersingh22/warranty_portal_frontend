import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  ClipboardCheck,
  ClipboardList,
  BookOpen,
  Database,
  Headset,
  History,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  Upload,
  Users,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { BrandMark } from './Brand'

const ADMIN_NAV = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/upload-dbf', label: 'Upload DBF', icon: Upload },
  { path: '/admin/import-history', label: 'Import History', icon: History },
  { path: '/admin/catalogue', label: 'E-catalogue', icon: BookOpen },
  { path: '/admin/registration-requests', label: 'Registration Requests', icon: ClipboardCheck },
  { path: '/admin/products', label: 'Products', icon: Database },
  { path: '/admin/piece-search', label: 'Piece Search', icon: Search },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { path: '/admin/warranty-rules', label: 'Warranty Rules', icon: Settings },
  { path: '/admin/support', label: 'Support Team', icon: Headset },
]

export default function AdminSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-gradient-hero text-white transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-[250px]'}`}>
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
        <BrandMark className="h-8 w-12" />
        {!collapsed && (
          <div className="leading-tight">
            <p className="font-display text-base font-semibold">Safrina</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-accent-300">Admin Console</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {ADMIN_NAV.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            title={collapsed ? label : ''}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-brand-100/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        {!collapsed && (
          <div className="mb-2 rounded-lg bg-white/5 px-3 py-2">
            <p className="truncate text-xs text-surface-300">{user?.email || 'Admin'}</p>
          </div>
        )}
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-surface-300 hover:bg-white/10 hover:text-white">
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button onClick={() => setCollapsed((value) => !value)} className="mt-2 flex w-full items-center justify-center rounded-lg px-3 py-2 text-xs text-surface-400 hover:bg-white/10">
          {collapsed ? <Database className="h-4 w-4" /> : <ClipboardList className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  )
}
