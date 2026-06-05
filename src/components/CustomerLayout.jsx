import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
