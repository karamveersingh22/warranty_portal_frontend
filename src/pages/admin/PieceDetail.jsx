import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge'

function formatDate(value) {
  if (!value) return 'N/A'
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function PieceDetail() {
  const { piece } = useParams()
  const [trace, setTrace] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function fetchTrace() {
      try {
        const response = await api.get(`/pieces/trace/${encodeURIComponent(piece)}`)
        if (active) setTrace(response.data)
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to load piece')
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchTrace()
    return () => {
      active = false
    }
  }, [piece])

  if (loading) return <div className="flex min-h-[360px] items-center justify-center"><LoadingSpinner text="Loading product" /></div>
  if (!trace) return <div className="rounded-lg bg-white p-8 text-center">Piece not found.</div>

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-surface-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-surface-950">Piece Traceability</h1>
          <p className="mt-1 text-sm text-surface-500">Piece: {trace.piece}</p>
        </div>
        <Link to="/admin/products" className="btn-secondary"><ArrowLeft className="h-4 w-4" />Products</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Product">
          <Info label="Item" value={trace.product?.item_name} />
          <Info label="Item Code" value={trace.product?.i_code} />
          <Info label="Description" value={trace.product?.describe} />
          <Info label="Company Dispatch Bill" value={trace.product?.bill} />
          <Info label="Company Dispatch Date" value={formatDate(trace.product?.bill_date)} />
          <Info label="Booksale Match" value={trace.product?.has_booksale_match ? 'Yes' : 'No'} />
        </Panel>
        <Panel title="Warranty">
          {trace.warranty ? (
            <>
              <Info label="Customer" value={trace.customer?.name || trace.warranty.customer_email} />
              <Info label="Customer Phone" value={trace.customer?.phone} />
              <Info label="Customer Email" value={trace.warranty.customer_email} />
              <Info label="Status" value={<StatusBadge status={trace.warranty.status} size="sm" />} />
              <Info label="Category" value={trace.warranty.category} />
              <Info label="Dealer Bill Number" value={trace.warranty.dealer_bill_number} />
              <Info label="Dealer Bill Date" value={formatDate(trace.warranty.dealer_bill_date)} />
              <Info label="Duration" value={`${trace.warranty.warranty_months || 0} months`} />
              <Info label="Remaining" value={`${trace.warranty.remaining_days ?? 0} days`} />
              <Info label="Registered" value={formatDate(trace.warranty.registered_at)} />
            </>
          ) : <p className="text-sm text-surface-500">This piece is not registered.</p>}
        </Panel>
        <Panel title="Dealer">
          <Info label="Name" value={trace.dealer?.name} />
          <Info label="Code" value={trace.dealer?.code} />
          <Info label="City" value={trace.dealer?.city} />
          <Info label="State" value={trace.dealer?.state} />
          <Info label="Phone" value={trace.dealer?.phone} />
          <Info label="Address" value={trace.dealer?.address} />
        </Panel>
        <Panel title="Distributor">
          <Info label="Name" value={trace.distributor?.name} />
          <Info label="Code" value={trace.distributor?.code} />
          <Info label="City" value={trace.distributor?.city} />
          <Info label="Address" value={trace.distributor?.address} />
        </Panel>
      </div>

      <Panel title={`Enquiries (${trace.enquiries_count || 0})`}>
        {(trace.enquiries || []).length ? trace.enquiries.map((enquiry) => (
          <Link key={enquiry.id} to={`/admin/enquiry/${enquiry.id}`} className="block rounded-lg bg-surface-50 p-4 hover:bg-surface-100">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold capitalize text-surface-900">{enquiry.issue_type?.replaceAll('_', ' ')}</p>
              <StatusBadge status={enquiry.status} size="sm" />
            </div>
            <p className="mt-2 text-sm text-surface-600">{enquiry.description}</p>
          </Link>
        )) : <p className="text-sm text-surface-500">No enquiries for this piece.</p>}
      </Panel>
    </section>
  )
}

function Panel({ title, children }) {
  return <div className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm"><h2 className="mb-4 font-semibold text-surface-950">{title}</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div></div>
}

function Info({ label, value }) {
  return <div className="rounded-lg bg-surface-50 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-surface-500">{label}</p><div className="mt-1 break-words text-sm font-medium text-surface-900">{value || 'N/A'}</div></div>
}
