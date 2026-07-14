import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Eye, MessageSquare } from 'lucide-react'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge'

const FILTERS = ['all', 'pending', 'in_progress', 'solved']

function formatDate(value) {
  if (!value) return 'N/A'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    let active = true

    async function fetchEnquiries() {
      setLoading(true)
      try {
        const params = filter === 'all' ? {} : { status: filter }
        const response = await api.get('/enquiry/all', { params })
        if (active) setEnquiries(response.data.enquiries || [])
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to load enquiries')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchEnquiries()
    return () => {
      active = false
    }
  }, [filter])

  const counts = useMemo(() => {
    return enquiries.reduce(
      (acc, enquiry) => {
        acc[enquiry.status] = (acc[enquiry.status] || 0) + 1
        return acc
      },
      { pending: 0, in_progress: 0, solved: 0 }
    )
  }, [enquiries])

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-surface-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-surface-950">Enquiries</h1>
          <p className="mt-1 text-sm text-surface-500">Review customer warranty enquiries and manage status.</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <MiniCount label="Pending" value={counts.pending} />
          <MiniCount label="In Progress" value={counts.in_progress} />
          <MiniCount label="Solved" value={counts.solved} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === status
                ? 'bg-brand-600 text-white'
                : 'border border-surface-200 bg-white text-surface-700 hover:bg-surface-100'
            }`}
          >
            {status.replaceAll('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex min-h-[260px] items-center justify-center">
          <LoadingSpinner text="Loading enquiries" />
        </div>
      ) : enquiries.length ? (
        <div className="overflow-hidden rounded-lg border border-surface-200 bg-white shadow-sm">
          <div className="hidden grid-cols-[1.3fr_1fr_1fr_120px_120px_90px] gap-4 border-b border-surface-200 bg-surface-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-surface-500 lg:grid">
            <span>Customer</span>
            <span>Product</span>
            <span>Issue Type</span>
            <span>Status</span>
            <span>Date</span>
            <span>Action</span>
          </div>
          <div className="divide-y divide-surface-200">
            {enquiries.map((enquiry) => (
              <div key={enquiry.id} className="grid gap-3 px-5 py-4 lg:grid-cols-[1.3fr_1fr_1fr_120px_120px_90px] lg:items-center lg:gap-4">
                <div>
                  <p className="break-words text-sm font-semibold text-surface-950">{enquiry.customer_email}</p>
                  <p className="mt-1 text-xs text-surface-500">Updated {formatDate(enquiry.updated_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-900">{enquiry.item_name || 'Product'}</p>
                  <p className="mt-1 text-xs text-surface-500">Piece: {enquiry.piece}</p>
                  {enquiry.manual_handling_required && <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">Manual handling</span>}
                </div>
                <p className="text-sm capitalize text-surface-700">{enquiry.issue_type?.replaceAll('_', ' ') || 'N/A'}</p>
                <StatusBadge status={enquiry.status} size="sm" />
                <p className="text-sm text-surface-600">{formatDate(enquiry.created_at)}</p>
                <Link to={`/admin/enquiry/${enquiry.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800">
                  <Eye className="h-4 w-4" />
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-surface-300 bg-white p-10 text-center shadow-sm">
          <MessageSquare className="mx-auto h-10 w-10 text-surface-400" />
          <p className="mt-4 text-sm font-medium text-surface-900">No enquiries found.</p>
          <p className="mt-1 text-sm text-surface-500">Try another status filter.</p>
        </div>
      )}
    </section>
  )
}

function MiniCount({ label, value }) {
  return (
    <div className="rounded-lg border border-surface-200 bg-white px-4 py-2 shadow-sm">
      <p className="text-lg font-bold text-surface-950">{value}</p>
      <p className="text-surface-500">{label}</p>
    </div>
  )
}
