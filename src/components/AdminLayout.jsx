import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import { useAuth } from '../hooks/useAuth'

export default function AdminLayout() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-surface-50">
      <AdminSidebar />
      <main className="ml-[68px] min-h-screen transition-all duration-300 md:ml-[250px]">
        <header className="sticky top-0 z-30 border-b border-surface-200 bg-white">
          <div className="flex h-16 items-center justify-between px-6 md:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Admin</p>
              <h1 className="text-base font-bold text-surface-950">Warranty Operations</h1>
            </div>
            <span className="max-w-[220px] truncate rounded-lg border border-surface-200 px-3 py-1.5 text-xs text-surface-600">
              {user?.email || 'Admin'}
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
