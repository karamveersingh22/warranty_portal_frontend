import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowRight, Package, PackagePlus, ShieldCheck, Timer, TriangleAlert } from 'lucide-react'
import api from '../../api/axios'
import ProductCard from '../../components/ProductCard'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function CustomerDashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function fetchDashboard() {
      try {
        const response = await api.get('/warranty/my-products')
        if (active) setProducts(response.data.products || [])
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to load dashboard')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchDashboard()
    return () => {
      active = false
    }
  }, [])

  const stats = useMemo(() => {
    const active = products.filter((product) => product.status === 'active').length
    const expired = products.filter((product) => product.status === 'expired').length
    const nearest = products
      .filter((product) => product.status === 'active')
      .sort((a, b) => Number(a.remaining_days ?? 0) - Number(b.remaining_days ?? 0))[0]

    return {
      total: products.length,
      active,
      expired,
      nearestDays: nearest?.remaining_days ?? 0,
    }
  }, [products])

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <LoadingSpinner text="Loading dashboard" />
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-surface-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-600">Welcome to Safrina</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-surface-950">Dashboard</h1>
          <p className="mt-1 text-sm text-surface-500">Track product warranties, status, and remaining coverage.</p>
        </div>
        <Link to="/customer/register-product" className="btn-primary">
          <PackagePlus className="h-4 w-4" />
          Register Product
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Registered Products" value={stats.total} tone="brand" />
        <StatCard icon={ShieldCheck} label="Active Warranties" value={stats.active} tone="success" />
        <StatCard icon={TriangleAlert} label="Expired Warranties" value={stats.expired} tone="danger" />
        <StatCard icon={Timer} label="Nearest Expiry" value={`${stats.nearestDays} days`} tone="warning" />
      </div>

      <div className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-surface-950">Product Cards</h2>
            <p className="text-sm text-surface-500">Warranty timer, remaining warranty, status, and progress are live from the API.</p>
          </div>
          <Link to="/customer/my-products" className="btn-secondary">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {products.length ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id || product.piece} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-dashed border-surface-300 bg-surface-50 p-8 text-center">
            <p className="text-sm font-medium text-surface-900">No products registered yet.</p>
            <p className="mt-1 text-sm text-surface-500">Register a product by entering its unique piece number.</p>
            <Link to="/customer/register-product" className="btn-primary mt-4">
              <PackagePlus className="h-4 w-4" />
              Register First Product
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

function StatCard({ icon: Icon, label, value, tone }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-700',
    success: 'bg-success-50 text-success-700',
    danger: 'bg-danger-50 text-danger-700',
    warning: 'bg-warning-50 text-warning-600',
  }

  return (
    <div className="rounded-2xl border border-surface-200/80 bg-white p-5 shadow-card transition duration-200 hover:border-brand-200 hover:shadow-glass">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 font-display text-3xl font-semibold text-surface-950">{value}</p>
      <p className="mt-1 text-sm text-surface-500">{label}</p>
    </div>
  )
}
