import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import { useAuth } from '../hooks/useAuth'

export default function AdminLayout() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-surface-50">
      <AdminSidebar />
      <main className="ml-[68px] min-h-screen transition-all duration-300 md:ml-[250px]">
        <header className="sticky top-0 z-30 border-b border-surface-200 bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-6 md:px-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-600">Safrina Admin</p>
              <h1 className="font-display text-lg font-semibold text-surface-950">Warranty Operations</h1>
            </div>
            <span className="flex items-center gap-2 rounded-xl border border-surface-200 bg-surface-50 px-3 py-1.5 text-xs font-medium text-surface-600">
              <span className="h-2 w-2 rounded-full bg-success-500" />
              <span className="max-w-[200px] truncate">{user?.email || 'Admin'}</span>
            </span>
          </div>
        </header>
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
