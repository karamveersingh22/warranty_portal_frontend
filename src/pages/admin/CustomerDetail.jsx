import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge'

function formatDate(value) {
  if (!value) return 'N/A'
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function CustomerDetail() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function fetchCustomer() {
      try {
        const response = await api.get(`/customer/${id}`)
        if (active) setData(response.data)
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to load customer')
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchCustomer()
    return () => {
      active = false
    }
  }, [id])

  if (loading) return <div className="flex min-h-[360px] items-center justify-center"><LoadingSpinner text="Loading customer" /></div>
  if (!data) return <div className="rounded-lg bg-white p-8 text-center">Customer not found.</div>

  const { customer, products = [], enquiries = [] } = data

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-surface-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-surface-950">{customer.name || 'Customer'}</h1>
          <p className="mt-1 text-sm text-surface-500">Customer detail and warranty activity.</p>
        </div>
        <Link to="/admin/customers" className="btn-secondary"><ArrowLeft className="h-4 w-4" />Customers</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-surface-950">Profile</h2>
          <div className="mt-4 space-y-3 text-sm">
            <Line icon={Mail} value={customer.email} />
            <Line icon={Phone} value={customer.phone || 'N/A'} />
            <Line icon={MapPin} value={`${customer.city || 'N/A'}, ${customer.state || ''}`} />
          </div>
          <div className="mt-5 rounded-lg bg-surface-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-surface-500">Address</p>
            <p className="mt-1 text-sm text-surface-800">{customer.address || 'N/A'}</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Mini label="Products" value={products.length} />
            <Mini label="Enquiries" value={enquiries.length} />
          </div>
        </aside>

        <div className="space-y-6">
          <DataTable title="Registered Products" empty="No registered products." columns={['Piece', 'Item', 'Dealer Bill', 'Dealer Bill Date', 'Warranty', 'Registered', 'Action']}>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-surface-200">
                <td className="px-4 py-3 text-sm font-semibold text-surface-950">{product.piece}</td>
                <td className="px-4 py-3 text-sm text-surface-700">{product.item_name || 'N/A'}</td>
                <td className="px-4 py-3 text-sm text-surface-700">{product.dealer_bill_number || 'N/A'}</td>
                <td className="px-4 py-3 text-sm text-surface-700">{formatDate(product.dealer_bill_date)}</td>
                <td className="px-4 py-3"><StatusBadge status={product.status || 'inactive'} size="sm" /></td>
                <td className="px-4 py-3 text-sm text-surface-700">{formatDate(product.registered_at)}</td>
                <td className="px-4 py-3"><Link to={`/admin/piece/${encodeURIComponent(product.piece)}`} className="text-sm font-semibold text-brand-700">Open</Link></td>
              </tr>
            ))}
          </DataTable>

          <DataTable title="Enquiries" empty="No enquiries." columns={['Piece', 'Issue', 'Status', 'Created', 'Action']}>
            {enquiries.map((enquiry) => (
              <tr key={enquiry.id} className="border-t border-surface-200">
                <td className="px-4 py-3 text-sm font-semibold text-surface-950">{enquiry.piece}</td>
                <td className="px-4 py-3 text-sm capitalize text-surface-700">{enquiry.issue_type?.replaceAll('_', ' ') || 'N/A'}</td>
                <td className="px-4 py-3"><StatusBadge status={enquiry.status} size="sm" /></td>
                <td className="px-4 py-3 text-sm text-surface-700">{formatDate(enquiry.created_at)}</td>
                <td className="px-4 py-3"><Link to={`/admin/enquiry/${enquiry.id}`} className="text-sm font-semibold text-brand-700">Open</Link></td>
              </tr>
            ))}
          </DataTable>
        </div>
      </div>
    </section>
  )
}

function Line({ icon: Icon, value }) {
  return <div className="flex items-center gap-3 text-surface-700"><Icon className="h-4 w-4 text-surface-400" /><span className="break-words">{value}</span></div>
}

function Mini({ label, value }) {
  return <div className="rounded-lg bg-surface-50 p-3 text-center"><p className="text-xl font-bold text-surface-950">{value}</p><p className="text-xs text-surface-500">{label}</p></div>
}

function DataTable({ title, columns, children, empty }) {
  const hasRows = Array.isArray(children) ? children.length > 0 : Boolean(children)
  return (
    <div className="overflow-hidden rounded-lg border border-surface-200 bg-white shadow-sm">
      <div className="border-b border-surface-200 px-5 py-4"><h2 className="font-semibold text-surface-950">{title}</h2></div>
      {hasRows ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            <thead className="bg-surface-50 text-xs uppercase tracking-wide text-surface-500"><tr>{columns.map((column) => <th key={column} className="px-4 py-3">{column}</th>)}</tr></thead>
            <tbody>{children}</tbody>
          </table>
        </div>
      ) : <div className="p-8 text-center text-sm text-surface-500">{empty}</div>}
    </div>
  )
}
