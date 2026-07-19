import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AlertTriangle, Eye, Loader2, Search, Trash2, Users, X } from 'lucide-react'
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
  const [customerToDelete, setCustomerToDelete] = useState(null)
  const [confirmationEmail, setConfirmationEmail] = useState('')
  const [deleting, setDeleting] = useState(false)

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

  const openDeleteConfirmation = (customer) => {
    setCustomerToDelete(customer)
    setConfirmationEmail('')
  }

  const closeDeleteConfirmation = () => {
    if (deleting) return
    setCustomerToDelete(null)
    setConfirmationEmail('')
  }

  const deleteCustomer = async () => {
    if (!customerToDelete || confirmationEmail.trim().toLowerCase() !== customerToDelete.email.toLowerCase()) return
    setDeleting(true)
    try {
      const response = await api.delete(`/customer/${customerToDelete.id}`, {
        data: { confirmation_email: confirmationEmail.trim() },
      })
      toast.success(response.data.message || 'Customer data permanently deleted')
      closeDeleteConfirmation()
      await fetchCustomers(search)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete customer')
    } finally {
      setDeleting(false)
      setCustomerToDelete(null)
      setConfirmationEmail('')
    }
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
                      <div className="flex items-center gap-4">
                        <Link to={`/admin/customer/${customer.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => openDeleteConfirmation(customer)}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-danger-600 transition hover:text-danger-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
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

      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-customer-title">
          <div className="w-full max-w-lg rounded-xl border border-danger-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-surface-200 p-5">
              <div className="flex gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-danger-100 text-danger-700">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <h2 id="delete-customer-title" className="text-xl font-bold text-surface-950">Permanently delete customer?</h2>
                  <p className="mt-1 text-sm text-surface-500">This action cannot be undone.</p>
                </div>
              </div>
              <button type="button" onClick={closeDeleteConfirmation} disabled={deleting} className="rounded-lg p-2 text-surface-400 hover:bg-surface-100 hover:text-surface-700" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-lg border border-danger-200 bg-danger-50 p-4 text-sm text-danger-800">
                <p className="font-semibold">Once deleted, this customer's data will not be saved and cannot be recovered.</p>
                <p className="mt-2">The profile, bought/registered products, registration requests, enquiries, feedback, and temporary OTP records will be deleted. Imported product pieces will remain available for future registration.</p>
              </div>

              <div className="rounded-lg bg-surface-50 p-4">
                <p className="font-semibold text-surface-950">{customerToDelete.name || 'Customer'}</p>
                <p className="mt-1 text-sm text-surface-600">{customerToDelete.email}</p>
                <p className="mt-1 text-xs text-surface-500">{customerToDelete.registered_products || 0} registered product(s)</p>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-surface-800">
                  Type <strong>{customerToDelete.email}</strong> to confirm
                </span>
                <input
                  type="email"
                  value={confirmationEmail}
                  onChange={(event) => setConfirmationEmail(event.target.value)}
                  className="input"
                  placeholder="Customer email address"
                  autoFocus
                  disabled={deleting}
                />
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-surface-200 p-5 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeDeleteConfirmation} disabled={deleting} className="btn-secondary">Cancel</button>
              <button
                type="button"
                onClick={deleteCustomer}
                disabled={deleting || confirmationEmail.trim().toLowerCase() !== customerToDelete.email.toLowerCase()}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-danger-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-danger-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete customer permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
