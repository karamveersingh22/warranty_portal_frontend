import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Clock, Database, MessageSquare, PackageCheck, ShieldCheck, Upload, Users } from 'lucide-react'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge'

function formatDate(value) {
  if (!value) return 'N/A'
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function fetchStats() {
      try {
        const response = await api.get('/admin/stats')
        if (active) setStats(response.data)
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to load dashboard')
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchStats()
    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return <div className="flex min-h-[360px] items-center justify-center"><LoadingSpinner text="Loading dashboard" /></div>
  }

  const data = stats || {}

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-surface-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-surface-950">Dashboard</h1>
          <p className="mt-1 text-sm text-surface-500">Live warranty operations overview from backend APIs.</p>
        </div>
        <Link to="/admin/upload-dbf" className="btn-primary">
          <Upload className="h-4 w-4" />
          Upload DBF
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Database} label="Imported Pieces" value={data.total_pieces || 0} />
        <Stat icon={PackageCheck} label="Registered Warranties" value={data.total_registered_products || 0} />
        <Stat icon={Users} label="Customers" value={data.total_customers || 0} />
        <Stat icon={MessageSquare} label="Total Enquiries" value={data.total_enquiries || 0} />
        <Stat icon={ShieldCheck} label="Active Warranties" value={data.active_warranties || 0} />
        <Stat icon={Clock} label="Expired Warranties" value={data.expired_warranties || 0} tone="danger" />
        <Stat icon={MessageSquare} label="Pending Enquiries" value={data.pending_enquiries || 0} tone="warning" />
        <Stat icon={Database} label="Unregistered Pieces" value={data.unregistered_pieces || 0} tone="neutral" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-lg border border-surface-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-200 px-5 py-4">
            <h2 className="font-semibold text-surface-950">Recent Enquiries</h2>
            <Link to="/admin/enquiries" className="text-sm font-semibold text-brand-700">View all</Link>
          </div>
          <div className="divide-y divide-surface-200">
            {(data.recent_enquiries || []).length ? data.recent_enquiries.map((enquiry) => (
              <Link key={enquiry.id} to={`/admin/enquiry/${enquiry.id}`} className="grid gap-2 px-5 py-4 hover:bg-surface-50 sm:grid-cols-[1fr_130px]">
                <div>
                  <p className="text-sm font-semibold text-surface-950">{enquiry.item_name || 'Product enquiry'}</p>
                  <p className="mt-1 text-xs text-surface-500">{enquiry.customer_email} - {enquiry.piece}</p>
                </div>
                <div className="sm:text-right">
                  <StatusBadge status={enquiry.status} size="sm" />
                  <p className="mt-1 text-xs text-surface-500">{formatDate(enquiry.created_at)}</p>
                </div>
              </Link>
            )) : <Empty label="No enquiries yet" />}
          </div>
        </div>

        <div className="rounded-lg border border-surface-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-200 px-5 py-4">
            <h2 className="font-semibold text-surface-950">Recent Imports</h2>
            <Link to="/admin/import-history" className="text-sm font-semibold text-brand-700">History</Link>
          </div>
          <div className="divide-y divide-surface-200">
            {(data.recent_imports || []).length ? data.recent_imports.map((batch) => (
              <div key={batch.id} className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_190px]">
                <div>
                  <p className="text-sm font-semibold text-surface-950">{formatDate(batch.uploaded_at)}</p>
                  <p className="mt-1 text-xs text-surface-500">{batch.uploaded_by || 'Admin'} - {batch.source || 'dbf_upload'}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <Mini label="Inserted" value={batch.pieces_inserted} />
                  <Mini label="Updated" value={batch.pieces_updated} />
                  <Mini label="Failed" value={batch.pieces_failed} />
                </div>
              </div>
            )) : <Empty label="No imports yet" />}
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ icon: Icon, label, value, tone = 'brand' }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-700',
    danger: 'bg-danger-50 text-danger-700',
    warning: 'bg-warning-50 text-warning-600',
    neutral: 'bg-surface-100 text-surface-700',
  }
  return (
    <div className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tones[tone]}`}><Icon className="h-5 w-5" /></div>
      <p className="mt-4 text-2xl font-bold text-surface-950">{value}</p>
      <p className="mt-1 text-sm text-surface-500">{label}</p>
    </div>
  )
}

function Mini({ label, value }) {
  return <div className="rounded bg-surface-50 p-2"><p className="font-bold text-surface-950">{value || 0}</p><p className="text-surface-500">{label}</p></div>
}

function Empty({ label }) {
  return <div className="px-5 py-10 text-center text-sm text-surface-500">{label}</div>
}
