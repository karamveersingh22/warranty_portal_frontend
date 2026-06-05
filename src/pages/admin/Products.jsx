import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Database, Eye, Filter, PackageCheck, Search, ShieldCheck, UploadCloud } from 'lucide-react'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge'

const initialFilters = {
  q: '',
  registered: '',
  has_booksale_match: '',
  city: '',
  sort_by: 'updated_at',
  sort_dir: 'desc',
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString('en-IN')
}

function formatDate(value) {
  if (!value) return 'N/A'
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function product(result) {
  return result.product_information || {}
}

export default function Products() {
  const [filters, setFilters] = useState(initialFilters)
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const params = useMemo(() => {
    const next = {
      limit: 75,
      sort_by: filters.sort_by,
      sort_dir: filters.sort_dir,
    }
    if (filters.q.trim()) next.q = filters.q.trim()
    if (filters.city.trim()) next.city = filters.city.trim()
    if (filters.registered) next.registered = filters.registered === 'true'
    if (filters.has_booksale_match) next.has_booksale_match = filters.has_booksale_match === 'true'
    return next
  }, [filters])

  async function fetchProducts(nextParams = params) {
    setLoading(true)
    try {
      const [productResponse, statsResponse] = await Promise.all([
        api.get('/pieces/search', { params: nextParams }),
        api.get('/admin/stats'),
      ])
      setProducts(productResponse.data.results || [])
      setTotal(productResponse.data.total || 0)
      setStats(statsResponse.data)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to load products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  function submit(event) {
    event.preventDefault()
    fetchProducts(params)
  }

  function clearFilters() {
    const nextParams = {
      limit: 75,
      sort_by: initialFilters.sort_by,
      sort_dir: initialFilters.sort_dir,
    }
    setFilters(initialFilters)
    fetchProducts(nextParams)
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-surface-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-surface-950">Products</h1>
          <p className="mt-1 text-sm text-surface-500">Operational product master with registration and DBF matching status.</p>
        </div>
        <Link to="/admin/upload-dbf" className="btn-primary">
          <UploadCloud className="h-4 w-4" />
          Upload DBF
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Database} label="Imported Pieces" value={formatNumber(stats?.total_pieces)} />
        <Stat icon={PackageCheck} label="Registered" value={formatNumber(stats?.total_registered_products)} tone="success" />
        <Stat icon={ShieldCheck} label="Active Warranties" value={formatNumber(stats?.active_warranties)} tone="brand" />
        <Stat icon={Database} label="Unregistered" value={formatNumber(stats?.unregistered_pieces)} tone="neutral" />
      </div>

      <form onSubmit={submit} className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_repeat(5,minmax(130px,1fr))]">
          <Field label="Search" value={filters.q} onChange={(value) => setFilters((current) => ({ ...current, q: value }))} placeholder="Piece, item, bill, dealer" />
          <Field label="City" value={filters.city} onChange={(value) => setFilters((current) => ({ ...current, city: value }))} placeholder="Dealer or distributor city" />
          <Select label="Registered" value={filters.registered} onChange={(value) => setFilters((current) => ({ ...current, registered: value }))} options={[['', 'All'], ['true', 'Registered'], ['false', 'Unregistered']]} />
          <Select label="DBF Match" value={filters.has_booksale_match} onChange={(value) => setFilters((current) => ({ ...current, has_booksale_match: value }))} options={[['', 'All'], ['true', 'Matched'], ['false', 'Unmatched']]} />
          <Select label="Sort By" value={filters.sort_by} onChange={(value) => setFilters((current) => ({ ...current, sort_by: value }))} options={[['updated_at', 'Updated'], ['piece', 'Piece'], ['item_name', 'Item'], ['bill_date', 'Bill Date']]} />
          <Select label="Order" value={filters.sort_dir} onChange={(value) => setFilters((current) => ({ ...current, sort_dir: value }))} options={[['desc', 'Newest'], ['asc', 'Oldest']]} />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-surface-500">
            <Filter className="h-4 w-4" />
            Showing up to 75 rows from real product APIs.
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={clearFilters} className="btn-secondary">Clear</button>
            <button type="submit" className="btn-primary">
              <Search className="h-4 w-4" />
              Apply Filters
            </button>
          </div>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-surface-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-surface-200 px-5 py-4">
          <h2 className="font-semibold text-surface-950">Product Table</h2>
          <span className="text-sm text-surface-500">{formatNumber(total)} matches</span>
        </div>

        {loading ? (
          <div className="flex min-h-[280px] items-center justify-center"><LoadingSpinner text="Loading products" /></div>
        ) : products.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] text-left">
              <thead className="bg-surface-50 text-xs uppercase tracking-wide text-surface-500">
                <tr>
                  <th className="px-5 py-3">Piece</th>
                  <th className="px-5 py-3">Item</th>
                  <th className="px-5 py-3">Bill</th>
                  <th className="px-5 py-3">Bill Date</th>
                  <th className="px-5 py-3">Dealer</th>
                  <th className="px-5 py-3">Distributor</th>
                  <th className="px-5 py-3">Registered</th>
                  <th className="px-5 py-3">DBF Match</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {products.map((row) => {
                  const info = product(row)
                  return (
                    <tr key={row.piece} className="hover:bg-surface-50">
                      <td className="px-5 py-3 text-sm font-semibold text-surface-950">{row.piece}</td>
                      <td className="max-w-[280px] px-5 py-3 text-sm text-surface-700">{info.item_name || 'N/A'}</td>
                      <td className="px-5 py-3 text-sm text-surface-600">{info.bill || 'N/A'}</td>
                      <td className="px-5 py-3 text-sm text-surface-600">{formatDate(info.bill_date)}</td>
                      <td className="px-5 py-3 text-sm text-surface-600">{row.dealer_information?.name || 'N/A'}</td>
                      <td className="px-5 py-3 text-sm text-surface-600">{row.distributor_information?.name || 'N/A'}</td>
                      <td className="px-5 py-3"><StatusBadge status={row.is_registered ? 'active' : 'inactive'} size="sm" /></td>
                      <td className="px-5 py-3"><StatusBadge status={info.has_booksale_match ? 'solved' : 'pending'} size="sm" /></td>
                      <td className="px-5 py-3">
                        <Link to={`/admin/piece/${encodeURIComponent(row.piece)}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                          <Eye className="h-4 w-4" />
                          Trace
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-sm text-surface-500">No products match the selected filters.</div>
        )}
      </div>
    </section>
  )
}

function Stat({ icon: Icon, label, value, tone = 'brand' }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-700',
    success: 'bg-success-50 text-success-700',
    neutral: 'bg-surface-100 text-surface-700',
  }

  return (
    <div className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tones[tone] || tones.brand}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-2xl font-bold text-surface-950">{value}</p>
      <p className="mt-1 text-sm text-surface-500">{label}</p>
    </div>
  )
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-surface-800">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="input" />
    </label>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-surface-800">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="input">
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  )
}
