import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, ShieldCheck } from 'lucide-react'
import api from '../../api/axios'
import ProductCard from '../../components/ProductCard'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function MyProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function fetchProducts() {
      try {
        const response = await api.get('/warranty/my-products')
        if (active) setProducts(response.data.products || [])
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to load products')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchProducts()
    return () => {
      active = false
    }
  }, [])

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

      {products.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id || product.piece} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-surface-300 bg-white p-10 text-center shadow-sm">
          <ShieldCheck className="mx-auto h-10 w-10 text-surface-400" />
          <p className="mt-4 text-sm font-medium text-surface-900">No products registered yet.</p>
          <p className="mt-1 text-sm text-surface-500">Register your first product to start warranty tracking.</p>
          <Link to="/customer/register-product" className="btn-primary mt-5">
            <Plus className="h-4 w-4" />
            Register First Product
          </Link>
        </div>
      )}
    </section>
  )
}
