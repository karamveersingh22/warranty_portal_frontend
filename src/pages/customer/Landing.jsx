import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'

export default function Landing() {
  return (
    <main className="min-h-screen bg-surface-50">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-12 sm:px-6">
        <div className="max-w-3xl">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600 text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Warranty Portal</p>
          <h1 className="mt-3 text-4xl font-bold text-surface-950 sm:text-5xl">Mattress warranty registration and support</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-surface-600">
            Register products by unique piece number, track warranty coverage, and raise support enquiries from one secure OTP account.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login" className="rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
              Login
            </Link>
            <Link to="/customer/register" className="rounded-lg border border-surface-300 px-5 py-3 text-sm font-semibold text-surface-800 hover:bg-white">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
