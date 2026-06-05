import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { History } from 'lucide-react'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'

function formatDate(value) {
  if (!value) return 'N/A'
  return new Date(value).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function ImportHistory() {
  const [batches, setBatches] = useState([])
  const [limit, setLimit] = useState(25)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function fetchHistory() {
      setLoading(true)
      try {
        const response = await api.get('/upload/batches', { params: { limit } })
        if (active) setBatches(response.data.batches || [])
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to load import history')
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchHistory()
    return () => {
      active = false
    }
  }, [limit])

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-surface-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-surface-950">Import History</h1>
          <p className="mt-1 text-sm text-surface-500">DBF upload batches and import counts.</p>
        </div>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-surface-800">Rows</span>
          <select value={limit} onChange={(event) => setLimit(Number(event.target.value))} className="input w-36">
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>

      <div className="rounded-lg border border-surface-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[260px] items-center justify-center"><LoadingSpinner text="Loading imports" /></div>
        ) : batches.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left">
              <thead className="bg-surface-50 text-xs uppercase tracking-wide text-surface-500">
                <tr>
                  <th className="px-5 py-3">Uploaded</th>
                  <th className="px-5 py-3">Uploaded By</th>
                  <th className="px-5 py-3">Booksale Rows</th>
                  <th className="px-5 py-3">Serials Rows</th>
                  <th className="px-5 py-3">Inserted</th>
                  <th className="px-5 py-3">Updated</th>
                  <th className="px-5 py-3">Failed</th>
                  <th className="px-5 py-3">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-surface-50">
                    <td className="px-5 py-3 text-sm font-semibold text-surface-950">{formatDate(batch.uploaded_at)}</td>
                    <td className="px-5 py-3 text-sm text-surface-700">{batch.uploaded_by || 'N/A'}</td>
                    <td className="px-5 py-3 text-sm text-surface-700">{batch.booksale_rows || 0}</td>
                    <td className="px-5 py-3 text-sm text-surface-700">{batch.serials_rows || 0}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-success-700">{batch.pieces_inserted || 0}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-brand-700">{batch.pieces_updated || 0}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-danger-700">{batch.pieces_failed || 0}</td>
                    <td className="px-5 py-3 text-sm text-surface-700">{batch.source || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <History className="mx-auto h-10 w-10 text-surface-400" />
            <p className="mt-4 text-sm text-surface-500">No import batches yet.</p>
          </div>
        )}
      </div>
    </section>
  )
}
