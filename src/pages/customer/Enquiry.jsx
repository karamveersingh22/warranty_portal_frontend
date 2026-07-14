import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Loader2, MessageSquare, Send } from 'lucide-react'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge'

const ISSUE_TYPES = [
  { value: 'manufacturing_defect', label: 'Manufacturing Defect' },
  { value: 'hardness_issue', label: 'Hardness Issue' },
  { value: 'damage', label: 'Damage' },
  { value: 'exchange', label: 'Exchange' },
  { value: 'other', label: 'Other' },
]

function formatDate(value) {
  if (!value) return 'N/A'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function Enquiry() {
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('piece') ? 'raise' : 'history')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [enquiries, setEnquiries] = useState([])
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({
    piece: searchParams.get('piece') || '',
    issue_type: 'manufacturing_defect',
    description: '',
  })

  useEffect(() => {
    let active = true

    async function fetchData() {
      try {
        const [productsResponse, enquiriesResponse] = await Promise.all([
          api.get('/warranty/my-products'),
          api.get('/enquiry/my'),
        ])
        if (!active) return
        setProducts(productsResponse.data.products || [])
        setEnquiries(enquiriesResponse.data.enquiries || [])
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to load enquiries')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchData()
    return () => {
      active = false
    }
  }, [])

  const selectedProduct = useMemo(
    () => products.find((product) => product.piece === form.piece),
    [products, form.piece]
  )

  const refreshEnquiries = async () => {
    const response = await api.get('/enquiry/my')
    setEnquiries(response.data.enquiries || [])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.piece.trim() || !form.description.trim()) {
      toast.error('Enter the piece number and describe the issue')
      return
    }

    setSubmitting(true)
    try {
      await api.post('/enquiry/', {
        piece: form.piece.trim(),
        item_name: selectedProduct?.item_name || '',
        issue_type: form.issue_type,
        description: form.description.trim(),
      })
      toast.success('Enquiry submitted')
      setForm({ piece: '', issue_type: 'manufacturing_defect', description: '' })
      await refreshEnquiries()
      setTab('history')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit enquiry')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <LoadingSpinner text="Loading enquiries" />
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-surface-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Customer</p>
          <h1 className="mt-2 text-3xl font-bold text-surface-950">Enquiries</h1>
          <p className="mt-1 text-sm text-surface-500">Raise warranty enquiries and track admin updates.</p>
        </div>
        <div className="flex rounded-lg border border-surface-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setTab('raise')}
            className={`rounded-md px-4 py-2 text-sm font-medium ${tab === 'raise' ? 'bg-brand-600 text-white' : 'text-surface-600 hover:bg-surface-100'}`}
          >
            Raise Enquiry
          </button>
          <button
            type="button"
            onClick={() => setTab('history')}
            className={`rounded-md px-4 py-2 text-sm font-medium ${tab === 'history' ? 'bg-brand-600 text-white' : 'text-surface-600 hover:bg-surface-100'}`}
          >
            View Enquiries
          </button>
        </div>
      </div>

      {tab === 'raise' && (
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-surface-800">Piece Number</span>
                <input
                  list="customer-product-pieces"
                  value={form.piece}
                  onChange={(event) => setForm((current) => ({ ...current, piece: event.target.value }))}
                  className="input"
                  placeholder="Enter the mattress piece number"
                  required
                />
                <datalist id="customer-product-pieces">
                  {products.map((product) => (
                    <option key={product.id || product.piece} value={product.piece}>
                      {product.piece} - {product.item_name}
                    </option>
                  ))}
                </datalist>
                <p className="mt-2 text-xs text-surface-500">Older products that are not eligible for online warranty can still be submitted here for manual support.</p>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-surface-800">Issue Type</span>
                <select
                  value={form.issue_type}
                  onChange={(event) => setForm((current) => ({ ...current, issue_type: event.target.value }))}
                  className="input"
                >
                  {ISSUE_TYPES.map((issue) => (
                    <option key={issue.value} value={issue.value}>{issue.label}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-surface-800">Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  rows="6"
                  className="input min-h-36"
                  placeholder="Describe the warranty issue"
                  required
                />
              </label>

              <button type="submit" disabled={submitting || !form.piece.trim()} className="btn-primary">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit Enquiry
              </button>
            </div>
          </div>

          <aside className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-surface-950">Selected Product</h2>
            {selectedProduct ? (
              <div className="mt-4 space-y-3 text-sm">
                <Info label="Item" value={selectedProduct.item_name} />
                <Info label="Piece" value={selectedProduct.piece} />
                <Info label="Warranty Status" value={<StatusBadge status={selectedProduct.status} size="sm" />} />
                <Info label="Remaining" value={`${selectedProduct.remaining_days ?? 0} days`} />
              </div>
            ) : form.piece.trim() ? (
              <div className="mt-4 rounded-lg bg-surface-50 p-4">
                <Info label="Piece" value={form.piece.trim()} />
                <p className="mt-3 text-sm text-surface-600">The backend will verify this piece and route older products for manual handling.</p>
              </div>
            ) : (
              <div className="mt-4 rounded-lg bg-surface-50 p-4">
                <p className="text-sm text-surface-600">Enter a piece number to raise an enquiry. Registered products also appear as suggestions.</p>
              </div>
            )}
          </aside>
        </form>
      )}

      {tab === 'history' && (
        enquiries.length ? (
          <div className="grid gap-4">
            {enquiries.map((enquiry) => (
              <article key={enquiry.id} className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-surface-950">{enquiry.item_name || 'Product Enquiry'}</h2>
                    <p className="mt-1 text-sm text-surface-500">Piece: {enquiry.piece}</p>
                  </div>
                  <StatusBadge status={enquiry.status} />
                </div>
                <p className="mt-4 text-sm text-surface-700">{enquiry.description}</p>
                {enquiry.admin_note && (
                  <div className="mt-4 rounded-lg bg-brand-50 p-3 text-sm text-brand-900">
                    <p className="font-semibold">Admin note</p>
                    <p className="mt-1">{enquiry.admin_note}</p>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-surface-500">
                  <span>Issue: {enquiry.issue_type?.replaceAll('_', ' ')}</span>
                  <span>Raised: {formatDate(enquiry.created_at)}</span>
                  <span>Updated: {formatDate(enquiry.updated_at)}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-surface-300 bg-white p-10 text-center shadow-sm">
            <MessageSquare className="mx-auto h-10 w-10 text-surface-400" />
            <p className="mt-4 text-sm font-medium text-surface-900">No enquiries submitted yet.</p>
            <button type="button" onClick={() => setTab('raise')} className="btn-primary mt-5">
              <Send className="h-4 w-4" />
              Raise Enquiry
            </button>
          </div>
        )
      )}
    </section>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-surface-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-surface-500">{label}</p>
      <div className="mt-1 break-words font-medium text-surface-900">{value || 'N/A'}</div>
    </div>
  )
}
