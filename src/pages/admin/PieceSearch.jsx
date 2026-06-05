import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Eye, Filter, Search, SlidersHorizontal } from 'lucide-react'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge'

const initialFilters = {
  piece: '',
  item_name: '',
  i_code: '',
  bill: '',
  main_key: '',
  dealer_code: '',
  dealer_name: '',
  distributor_code: '',
  distributor_name: '',
  city: '',
  registered: '',
  has_booksale_match: '',
  bill_date_from: '',
  bill_date_to: '',
  sort_by: 'piece',
  sort_dir: 'asc',
}

function product(result) {
  return result.product_information || {}
}

function formatDate(value) {
  if (!value) return 'N/A'
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function PieceSearch() {
  const [filters, setFilters] = useState(initialFilters)
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const params = useMemo(() => {
    const next = { limit: 100, sort_by: filters.sort_by, sort_dir: filters.sort_dir }
    Object.entries(filters).forEach(([key, value]) => {
      if (['sort_by', 'sort_dir', 'registered', 'has_booksale_match'].includes(key)) return
      if (value.trim()) next[key] = value.trim()
    })
    if (filters.registered) next.registered = filters.registered === 'true'
    if (filters.has_booksale_match) next.has_booksale_match = filters.has_booksale_match === 'true'
    return next
  }, [filters])

  async function fetchProducts(nextParams = params) {
    setLoading(true)
    try {
      const response = await api.get('/pieces/search', { params: nextParams })
      setResults(response.data.results || [])
      setTotal(response.data.total || 0)
      setSearched(true)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to search pieces')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function submit(event) {
    event.preventDefault()
    fetchProducts(params)
  }

  function clearFilters() {
    setFilters(initialFilters)
    setResults([])
    setTotal(0)
    setSearched(false)
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-surface-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-surface-950">Piece Search</h1>
          <p className="mt-1 text-sm text-surface-500">Advanced traceability lookup by piece, bill, item, dealer, distributor, and DBF join fields.</p>
        </div>
        <Link to="/admin/products" className="btn-secondary">
          <SlidersHorizontal className="h-4 w-4" />
          Products
        </Link>
      </div>

      <form onSubmit={submit} className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Piece Number" value={filters.piece} onChange={(value) => setFilters((current) => ({ ...current, piece: value }))} placeholder="Exact or partial piece" />
          <Field label="Item Name" value={filters.item_name} onChange={(value) => setFilters((current) => ({ ...current, item_name: value }))} />
          <Field label="Item Code" value={filters.i_code} onChange={(value) => setFilters((current) => ({ ...current, i_code: value }))} />
          <Field label="Bill" value={filters.bill} onChange={(value) => setFilters((current) => ({ ...current, bill: value }))} />
          <Field label="Main Key" value={filters.main_key} onChange={(value) => setFilters((current) => ({ ...current, main_key: value }))} />
          <Field label="Dealer Code" value={filters.dealer_code} onChange={(value) => setFilters((current) => ({ ...current, dealer_code: value }))} />
          <Field label="Dealer Name" value={filters.dealer_name} onChange={(value) => setFilters((current) => ({ ...current, dealer_name: value }))} />
          <Field label="Distributor Code" value={filters.distributor_code} onChange={(value) => setFilters((current) => ({ ...current, distributor_code: value }))} />
          <Field label="Distributor Name" value={filters.distributor_name} onChange={(value) => setFilters((current) => ({ ...current, distributor_name: value }))} />
          <Field label="City" value={filters.city} onChange={(value) => setFilters((current) => ({ ...current, city: value }))} />
          <Field label="Bill Date From" type="date" value={filters.bill_date_from} onChange={(value) => setFilters((current) => ({ ...current, bill_date_from: value }))} />
          <Field label="Bill Date To" type="date" value={filters.bill_date_to} onChange={(value) => setFilters((current) => ({ ...current, bill_date_to: value }))} />
          <Select label="Registered" value={filters.registered} onChange={(value) => setFilters((current) => ({ ...current, registered: value }))} options={[['', 'All'], ['true', 'Registered'], ['false', 'Unregistered']]} />
          <Select label="DBF Match" value={filters.has_booksale_match} onChange={(value) => setFilters((current) => ({ ...current, has_booksale_match: value }))} options={[['', 'All'], ['true', 'Matched'], ['false', 'Unmatched']]} />
          <Select label="Sort By" value={filters.sort_by} onChange={(value) => setFilters((current) => ({ ...current, sort_by: value }))} options={[['piece', 'Piece'], ['item_name', 'Item'], ['bill_date', 'Bill Date'], ['dealer_name', 'Dealer'], ['distributor_name', 'Distributor']]} />
          <Select label="Order" value={filters.sort_dir} onChange={(value) => setFilters((current) => ({ ...current, sort_dir: value }))} options={[['asc', 'Ascending'], ['desc', 'Descending']]} />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-surface-500">
            <Filter className="h-4 w-4" />
            Empty fields are ignored. Results are limited to 100 rows.
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={clearFilters} className="btn-secondary">Clear</button>
            <button type="submit" className="btn-primary">
              <Search className="h-4 w-4" />
              Search Pieces
            </button>
          </div>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-surface-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-surface-200 px-5 py-4">
          <h2 className="font-semibold text-surface-950">Search Results</h2>
          <span className="text-sm text-surface-500">{total.toLocaleString('en-IN')} total matches</span>
        </div>

        {loading ? (
          <div className="flex min-h-[260px] items-center justify-center"><LoadingSpinner text="Searching pieces" /></div>
        ) : results.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left">
              <thead className="bg-surface-50 text-xs uppercase tracking-wide text-surface-500">
                <tr>
                  <th className="px-5 py-3">Piece</th>
                  <th className="px-5 py-3">Item</th>
                  <th className="px-5 py-3">Code</th>
                  <th className="px-5 py-3">Bill</th>
                  <th className="px-5 py-3">Bill Date</th>
                  <th className="px-5 py-3">Dealer</th>
                  <th className="px-5 py-3">Distributor</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {results.map((result) => {
                  const info = product(result)
                  return (
                    <tr key={result.piece} className="hover:bg-surface-50">
                      <td className="px-5 py-3 text-sm font-semibold text-surface-950">{result.piece}</td>
                      <td className="max-w-[260px] px-5 py-3 text-sm text-surface-700">{info.item_name || 'N/A'}</td>
                      <td className="px-5 py-3 text-sm text-surface-600">{info.i_code || 'N/A'}</td>
                      <td className="px-5 py-3 text-sm text-surface-600">{info.bill || 'N/A'}</td>
                      <td className="px-5 py-3 text-sm text-surface-600">{formatDate(info.bill_date)}</td>
                      <td className="px-5 py-3 text-sm text-surface-600">{result.dealer_information?.name || 'N/A'}</td>
                      <td className="px-5 py-3 text-sm text-surface-600">{result.distributor_information?.name || 'N/A'}</td>
                      <td className="px-5 py-3"><StatusBadge status={result.is_registered ? 'active' : 'inactive'} size="sm" /></td>
                      <td className="px-5 py-3">
                        <Link to={`/admin/piece/${encodeURIComponent(result.piece)}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
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
          <div className="p-10 text-center text-sm text-surface-500">{searched ? 'No pieces match the selected filters.' : 'Enter filters and run a search.'}</div>
        )}
      </div>
    </section>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-surface-800">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="input" />
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
