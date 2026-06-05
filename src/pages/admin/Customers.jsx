import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Eye, Search, Users } from 'lucide-react'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'

function formatDate(value) {
  if (!value) return 'N/A'
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchCustomers = async (query = search) => {
    setLoading(true)
    try {
      const params = query.trim() ? { search: query.trim(), limit: 100 } : { limit: 100 }
      const response = await api.get('/customer/all', { params })
      setCustomers(response.data.customers || [])
      setTotal(response.data.total || 0)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers('')
  }, [])

  const submit = (event) => {
    event.preventDefault()
    fetchCustomers(search)
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-surface-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-surface-950">Customers</h1>
          <p className="mt-1 text-sm text-surface-500">Search customer profiles and open registered-product history.</p>
        </div>
        <div className="rounded-lg border border-surface-200 bg-white px-5 py-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-surface-950">{total}</p>
          <p className="text-xs text-surface-500">Total Matches</p>
        </div>
      </div>

      <form onSubmit={submit} className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="input" placeholder="Search by name, email, or city" />
          <button type="submit" className="btn-primary sm:min-w-32"><Search className="h-4 w-4" />Search</button>
        </div>
      </form>

      <div className="rounded-lg border border-surface-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[260px] items-center justify-center"><LoadingSpinner text="Loading customers" /></div>
        ) : customers.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead className="bg-surface-50 text-xs uppercase tracking-wide text-surface-500">
                <tr>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">City</th>
                  <th className="px-5 py-3">Products</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-surface-50">
                    <td className="px-5 py-3">
                      <p className="text-sm font-semibold text-surface-950">{customer.name || 'N/A'}</p>
                      <p className="mt-1 text-xs text-surface-500">{customer.email}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-surface-700">{customer.phone || 'N/A'}</td>
                    <td className="px-5 py-3 text-sm text-surface-700">{customer.city || 'N/A'}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-surface-950">{customer.registered_products || 0}</td>
                    <td className="px-5 py-3 text-sm text-surface-700">{formatDate(customer.created_at)}</td>
                    <td className="px-5 py-3">
                      <Link to={`/admin/customer/${customer.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <Users className="mx-auto h-10 w-10 text-surface-400" />
            <p className="mt-4 text-sm text-surface-500">No customers found.</p>
          </div>
        )}
      </div>
    </section>
  )
}
