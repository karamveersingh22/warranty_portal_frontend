import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge'

function formatDateTime(value) {
  if (!value) return 'N/A'
  return new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function EnquiryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [enquiry, setEnquiry] = useState(null)
  const [trace, setTrace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('pending')
  const [adminNote, setAdminNote] = useState('')

  useEffect(() => {
    let active = true

    async function fetchDetail() {
      try {
        const response = await api.get(`/enquiry/${id}`)
        if (!active) return
        setEnquiry(response.data)
        setStatus(response.data.status || 'pending')
        setAdminNote(response.data.admin_note || '')

        try {
          const traceResponse = await api.get(`/pieces/trace/${encodeURIComponent(response.data.piece)}`)
          if (active) setTrace(traceResponse.data)
        } catch {
          if (active) setTrace(null)
        }
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Enquiry not found')
        navigate('/admin/enquiries')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchDetail()
    return () => {
      active = false
    }
  }, [id, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const response = await api.patch(`/enquiry/${id}/status`, {
        status,
        admin_note: adminNote,
      })
      const updated = response.data.enquiry
      if (updated) {
        setEnquiry(updated)
        setStatus(updated.status || status)
        setAdminNote(updated.admin_note || '')
      }
      toast.success('Enquiry updated')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update enquiry')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <LoadingSpinner text="Loading enquiry" />
      </div>
    )
  }

  if (!enquiry) return null
  const customer = enquiry.customer || trace?.customer || {}
  const customerPhone = enquiry.customer_phone || customer.phone

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-surface-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-surface-950">Enquiry Details</h1>
          <p className="mt-1 text-sm text-surface-500">Piece: {enquiry.piece}</p>
        </div>
        <Link to="/admin/enquiries" className="btn-secondary">
          <ArrowLeft className="h-4 w-4" />
          Back to Enquiries
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-surface-950">{enquiry.item_name || 'Product Enquiry'}</h2>
                <p className="mt-1 text-sm text-surface-500">{customerPhone || enquiry.customer_email}</p>
              </div>
              <StatusBadge status={enquiry.status} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Info label="Issue Type" value={enquiry.issue_type?.replaceAll('_', ' ')} />
              <Info label="Created" value={formatDateTime(enquiry.created_at)} />
              <Info label="Updated" value={formatDateTime(enquiry.updated_at)} />
              <Info label="Customer Name" value={customer.name} />
              <Info label="Customer Phone" value={customerPhone} />
              <Info label="Customer Email" value={enquiry.customer_email} />
            </div>

            <div className="mt-5 rounded-lg bg-surface-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-surface-500">Customer Description</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-surface-800">{enquiry.description || 'N/A'}</p>
            </div>

            {enquiry.admin_note && (
              <div className="mt-4 rounded-lg bg-brand-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Current Admin Note</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-brand-950">{enquiry.admin_note}</p>
              </div>
            )}
          </div>

          {trace && (
            <div className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-surface-950">Traceability</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Info label="Item Code" value={trace.product?.i_code} />
                <Info label="Bill" value={trace.product?.bill} />
                <Info label="Warranty Status" value={trace.warranty?.status} />
                <Info label="Remaining Warranty" value={trace.warranty ? `${trace.warranty.remaining_days ?? 0} days` : null} />
                <Info label="Dealer" value={trace.dealer?.name} />
                <Info label="Distributor" value={trace.distributor?.name} />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-surface-950">Update Enquiry</h2>
          <p className="mt-1 text-sm text-surface-500">Set status and add an admin note. No uploads are used.</p>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-medium text-surface-800">Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="input">
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="solved">Solved</option>
            </select>
          </label>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-medium text-surface-800">Admin Notes</span>
            <textarea
              value={adminNote}
              onChange={(event) => setAdminNote(event.target.value)}
              rows="7"
              className="input min-h-44"
              placeholder="Add handling notes for this enquiry"
            />
          </label>

          <button type="submit" disabled={saving} className="btn-primary mt-5 w-full">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Update Enquiry
          </button>
        </form>
      </div>
    </section>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-surface-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-surface-500">{label}</p>
      <div className="mt-1 break-words text-sm font-medium capitalize text-surface-900">{value || 'N/A'}</div>
    </div>
  )
}
