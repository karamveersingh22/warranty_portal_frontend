import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CheckCircle2, Clock, Plus, ShieldCheck, XCircle } from 'lucide-react'
import api from '../../api/axios'
import ProductCard from '../../components/ProductCard'
import LoadingSpinner from '../../components/LoadingSpinner'

function RequestBanner({ request }) {
  const status = request.status
  const styles = {
    pending: {
      icon: Clock,
      box: 'border-amber-200 bg-amber-50',
      iconColor: 'text-amber-600',
      label: 'Pending Approval',
    },
    declined: {
      icon: XCircle,
      box: 'border-danger-200 bg-danger-50',
      iconColor: 'text-danger-600',
      label: 'Declined',
    },
    approved: {
      icon: CheckCircle2,
      box: 'border-success-200 bg-success-50',
      iconColor: 'text-success-600',
      label: 'Approved',
    },
  }[status] || {}

  const Icon = styles.icon || Clock

  return (
    <div className={`flex items-start gap-3 rounded-lg border p-4 ${styles.box}`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${styles.iconColor}`} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-surface-950">{request.item_name || 'Product'}</p>
          <span className="text-xs font-medium text-surface-500">Piece: {request.piece}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${styles.iconColor}`}>{styles.label}</span>
        </div>
        <p className="mt-1 text-sm text-surface-700">{request.message}</p>
      </div>
    </div>
  )
}

export default function MyProducts() {
  const [products, setProducts] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function fetchData() {
      try {
        const [productsRes, requestsRes] = await Promise.all([
          api.get('/warranty/my-products'),
          api.get('/warranty/my-requests'),
        ])
        if (active) {
          setProducts(productsRes.data.products || [])
          setRequests(requestsRes.data.requests || [])
        }
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to load products')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchData()
    return () => {
      active = false
    }
  }, [])

  // Show only pending and declined requests here; approved ones already appear as products.
  const openRequests = requests.filter((r) => r.status === 'pending' || r.status === 'declined')

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <LoadingSpinner text="Loading products" />
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-surface-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Customer</p>
          <h1 className="mt-2 text-3xl font-bold text-surface-950">My Products</h1>
          <p className="mt-1 text-sm text-surface-500">Total: {products.length} product{products.length === 1 ? '' : 's'}</p>
        </div>
        <Link to="/customer/register-product" className="btn-primary">
          <Plus className="h-4 w-4" />
          Register New
        </Link>
      </div>

      {openRequests.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-surface-500">Registration Requests</h2>
          {openRequests.map((request) => (
            <RequestBanner key={request.id} request={request} />
          ))}
        </div>
      )}

      {products.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id || product.piece} product={product} />
          ))}
        </div>
      ) : (
        !openRequests.length && (
          <div className="rounded-lg border border-dashed border-surface-300 bg-white p-10 text-center shadow-sm">
            <ShieldCheck className="mx-auto h-10 w-10 text-surface-400" />
            <p className="mt-4 text-sm font-medium text-surface-900">No products registered yet.</p>
            <p className="mt-1 text-sm text-surface-500">Register your first product to start warranty tracking.</p>
            <Link to="/customer/register-product" className="btn-primary mt-5">
              <Plus className="h-4 w-4" />
              Register First Product
            </Link>
          </div>
        )
      )}
    </section>
  )
}
