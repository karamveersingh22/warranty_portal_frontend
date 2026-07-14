import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, CalendarDays, ClipboardList, Package, ShieldCheck } from 'lucide-react'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge'
import WarrantyTimer from '../../components/WarrantyTimer'

function formatDate(value) {
  if (!value) return 'N/A'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function ProductDetail() {
  const { piece } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function fetchProduct() {
      try {
        const response = await api.get(`/warranty/product/${encodeURIComponent(piece)}`)
        if (active) setProduct(response.data)
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to load product')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchProduct()
    return () => {
      active = false
    }
  }, [piece])

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <LoadingSpinner text="Loading product" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="rounded-lg border border-surface-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-surface-600">Product not found in your registered products.</p>
        <Link to="/customer/my-products" className="btn-primary mt-4">
          <ArrowLeft className="h-4 w-4" />
          My Products
        </Link>
      </div>
    )
  }

  const info = product.product_information || {}

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-surface-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Warranty</p>
          <h1 className="mt-2 text-3xl font-bold text-surface-950">{product.item_name || 'Product Detail'}</h1>
          <p className="mt-1 text-sm text-surface-500">Piece: {product.piece}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/customer/my-products" className="btn-secondary">
            <ArrowLeft className="h-4 w-4" />
            My Products
          </Link>
          <Link to="/customer/enquiry" className="btn-primary">
            <ClipboardList className="h-4 w-4" />
            Enquiry
          </Link>
        </div>
      </div>

      <WarrantyTimer product={product} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Package className="h-5 w-5 text-brand-700" />
            <h2 className="text-base font-semibold text-surface-950">Product</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Info label="Item Code" value={product.i_code || info.i_code} />
            <Info label="Category" value={product.category} />
            <Info label="Dealer Bill Number" value={product.dealer_bill_number || info.dealer_bill_number} />
            <Info label="Dealer Bill Date" value={formatDate(product.dealer_bill_date || info.dealer_bill_date)} />
            <Info label="Dealer" value={info.dealer_name} />
          </div>
        </div>

        <div className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-brand-700" />
            <h2 className="text-base font-semibold text-surface-950">Warranty</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Info label="Status" value={<StatusBadge status={product.status} />} />
            <Info label="Duration" value={product.warranty_months ? `${product.warranty_months} months` : null} />
            <Info label="Remaining Days" value={product.remaining_days} />
            <Info label="Remaining Months" value={product.remaining_months} />
            <Info label="Started" value={formatDate(product.warranty_start)} />
            <Info label="Ends" value={formatDate(product.warranty_end)} />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-brand-700" />
          <h2 className="text-base font-semibold text-surface-950">Enquiries</h2>
        </div>
        {product.enquiries?.length ? (
          <div className="space-y-3">
            {product.enquiries.map((enquiry) => (
              <div key={enquiry.id} className="rounded-lg border border-surface-200 bg-surface-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-surface-900">{enquiry.issue_type?.replaceAll('_', ' ')}</p>
                  <StatusBadge status={enquiry.status} size="sm" />
                </div>
                <p className="mt-2 text-sm text-surface-600">{enquiry.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-surface-500">No enquiries recorded.</p>
        )}
      </div>
    </section>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-surface-200 bg-surface-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-surface-500">{label}</p>
      <div className="mt-1 break-words text-sm font-medium text-surface-900">{value || 'N/A'}</div>
    </div>
  )
}
