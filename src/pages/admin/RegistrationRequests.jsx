import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AlertTriangle, Check, Clock, Loader2, Settings2, ShieldCheck, X } from 'lucide-react'
import api from '../../api/axios'

const FILTERS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'declined', label: 'Declined' },
  { key: 'all', label: 'All' },
]

function formatDate(value) {
  if (!value) return 'N/A'
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function DetailBlock({ title, rows }) {
  return (
    <div className="rounded-lg border border-surface-200 bg-surface-50 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-surface-500">{title}</p>
      <dl className="space-y-1">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3 text-sm">
            <dt className="text-surface-500">{label}</dt>
            <dd className="text-right font-medium text-surface-900 break-words">{value || 'N/A'}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function RequestCard({ request, onApprove, onDecline, acting }) {
  const flagged = request.is_flagged
  const isPending = request.status === 'pending'

  return (
    <article
      className={`rounded-lg border bg-white p-5 shadow-sm ${
        flagged ? 'border-danger-300 ring-1 ring-danger-200' : 'border-surface-200'
      }`}
    >
      <div className="flex flex-col gap-3 border-b border-surface-100 pb-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-surface-950">{request.item.item_name || 'Product'}</h2>
            <span className="rounded-full bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-600">
              {request.item.category}{request.item.size ? ` · ${request.item.size}` : ''}
            </span>
            <span className="text-xs text-surface-500">Piece: {request.item.piece}</span>
          </div>
          <p className="mt-1 text-sm text-surface-500">
            Buyer: <span className="font-medium text-surface-800">{request.buyer.name || request.buyer.email}</span>
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 lg:items-end">
          {flagged ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-danger-200 bg-danger-50 px-3 py-1 text-sm font-semibold text-danger-700">
              <AlertTriangle className="h-4 w-4" />
              Old stock — {request.months_old} months old
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-200 bg-surface-50 px-3 py-1 text-sm font-medium text-surface-600">
              <Clock className="h-4 w-4" />
              {request.days_old != null ? `${request.days_old} days old` : 'Age unknown'}
            </span>
          )}
          <span className="text-xs capitalize text-surface-500">Status: {request.status}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <DetailBlock
          title="Buyer Details"
          rows={[
            ['Name', request.buyer.name],
            ['Email', request.buyer.email],
            ['Phone', request.buyer.phone],
            ['City', request.buyer.city],
            ['State', request.buyer.state],
          ]}
        />
        <DetailBlock
          title="Dealer Details"
          rows={[
            ['Code', request.dealer.code],
            ['Name', request.dealer.name],
            ['City', request.dealer.city],
            ['State', request.dealer.state],
            ['Phone', request.dealer.phone],
          ]}
        />
        <DetailBlock
          title="Distributor Details"
          rows={[
            ['Code', request.distributor.code],
            ['Name', request.distributor.name],
            ['City', request.distributor.city],
          ]}
        />
        <DetailBlock
          title="Item Details"
          rows={[
            ['Item Name', request.item.item_name],
            ['Item Code', request.item.i_code],
            ['Category', request.item.category],
            ['Size', request.item.size],
          ]}
        />
        <DetailBlock
          title="Dealer Bill Details"
          rows={[
            ['Dealer Bill No.', request.dealer_bill?.bill_number],
            ['Dealer Bill Date', formatDate(request.dealer_bill?.bill_date)],
            ['Registration Date', formatDate(request.dealer_bill?.registration_date)],
            ['Product Age', request.days_old != null ? `${request.days_old} days (~${request.months_old} months)` : 'N/A'],
          ]}
        />
        <DetailBlock
          title="Company Dispatch Traceability"
          rows={[
            ['Company Bill No.', request.company_dispatch?.bill_number],
            ['Company Bill Date', formatDate(request.company_dispatch?.bill_date)],
          ]}
        />
        {request.status !== 'pending' && (
          <DetailBlock
            title="Review"
            rows={[
              ['Reviewed by', request.reviewed_by],
              ['Reviewed at', formatDate(request.reviewed_at)],
              ['Decline reason', request.decline_reason],
            ]}
          />
        )}
      </div>

      {isPending && (
        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={() => onApprove(request)} disabled={acting} className="btn-primary">
            {acting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Approve
          </button>
          <button
            onClick={() => onDecline(request)}
            disabled={acting}
            className="flex items-center gap-2 rounded-lg border border-danger-200 bg-danger-50 px-4 py-2 text-sm font-medium text-danger-700 hover:bg-danger-100 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Decline
          </button>
        </div>
      )}
    </article>
  )
}

export default function RegistrationRequests() {
  const [filter, setFilter] = useState('pending')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState(null)
  const [flaggedCount, setFlaggedCount] = useState(0)
  const [flagDays, setFlagDays] = useState(60)
  const [flagInput, setFlagInput] = useState('60')
  const [savingFlag, setSavingFlag] = useState(false)

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get('/registrations', { params: { status: filter } })
      setRequests(response.data.requests || [])
      setFlaggedCount(response.data.flagged_count || 0)
      if (response.data.old_product_flag_days != null) {
        setFlagDays(response.data.old_product_flag_days)
        setFlagInput(String(response.data.old_product_flag_days))
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to load requests')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  async function saveFlagDays() {
    const days = Number(flagInput)
    if (!days || days < 1) {
      toast.error('Enter a valid number of days')
      return
    }
    setSavingFlag(true)
    try {
      await api.put('/registrations/settings', { old_product_flag_days: days })
      toast.success('Product age threshold updated')
      fetchRequests()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update threshold')
    } finally {
      setSavingFlag(false)
    }
  }

  async function handleApprove(request) {
    setActingId(request.id)
    try {
      await api.post(`/registrations/${request.id}/approve`)
      toast.success('Registration approved')
      fetchRequests()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to approve')
    } finally {
      setActingId(null)
    }
  }

  async function handleDecline(request) {
    const reason = window.prompt('Reason for declining (optional):', '')
    if (reason === null) return // cancelled
    setActingId(request.id)
    try {
      await api.post(`/registrations/${request.id}/decline`, { reason })
      toast.success('Registration declined')
      fetchRequests()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to decline')
    } finally {
      setActingId(null)
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-surface-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-surface-950">Registration Requests</h1>
          <p className="mt-1 text-sm text-surface-500">
            Review and approve customer warranty registrations.
            {flaggedCount > 0 && filter === 'pending' && (
              <span className="ml-1 font-semibold text-danger-600">
                {flaggedCount} flagged as old stock.
              </span>
            )}
          </p>
        </div>

        <div className="rounded-lg border border-surface-200 bg-surface-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-surface-800">
            <Settings2 className="h-4 w-4 text-brand-600" />
            Old-stock flag threshold
          </div>
          <p className="mt-1 text-xs text-surface-500">
            Flag a request if this many days have passed between the dealer bill date and registration request.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={flagInput}
              onChange={(e) => setFlagInput(e.target.value)}
              className="input w-24"
            />
            <span className="text-sm text-surface-600">days</span>
            <button onClick={saveFlagDays} disabled={savingFlag || Number(flagInput) === flagDays} className="btn-primary">
              {savingFlag ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Save
            </button>
          </div>
          <p className="mt-2 text-xs text-surface-400">Current: {flagDays} days (~{Math.round((flagDays / 30) * 10) / 10} months)</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === f.key ? 'bg-brand-600 text-white' : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-700" />
        </div>
      ) : requests.length ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              acting={actingId === request.id}
              onApprove={handleApprove}
              onDecline={handleDecline}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-surface-300 bg-white p-10 text-center shadow-sm">
          <ShieldCheck className="mx-auto h-10 w-10 text-surface-400" />
          <p className="mt-4 text-sm font-medium text-surface-900">No {filter === 'all' ? '' : filter} registration requests.</p>
        </div>
      )}
    </section>
  )
}
