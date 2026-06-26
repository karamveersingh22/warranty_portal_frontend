import { Link } from 'react-router-dom'
import Brand from './Brand'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-surface-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Brand size="sm" />
          <p className="mt-3 max-w-sm text-sm text-surface-500">
            Premium mattress warranty registration, tracking, and support — crafted for restful nights.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-surface-500">
          <Link to="/customer/warranty-rules" className="hover:text-brand-700">Warranty Rules</Link>
          <Link to="/customer/support" className="hover:text-brand-700">Support</Link>
          <Link to="/login" className="hover:text-brand-700">Login</Link>
        </div>
      </div>
      <div className="border-t border-surface-100 py-4">
        <p className="text-center text-xs text-surface-400">
          © {year} Safrina Mattress. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
