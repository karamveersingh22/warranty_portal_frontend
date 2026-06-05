import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CheckCircle2, Shield } from 'lucide-react'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function WarrantyRules() {
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function fetchRules() {
      try {
        const response = await api.get('/rules/')
        if (active) setRules(response.data.rules || [])
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to load warranty rules')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchRules()
    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <LoadingSpinner text="Loading warranty rules" />
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="border-b border-surface-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Customer</p>
        <h1 className="mt-2 text-3xl font-bold text-surface-950">Warranty Rules</h1>
        <p className="mt-1 text-sm text-surface-500">Active category rules and customer-visible coverage notes.</p>
      </div>

      {rules.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {rules.map((rule) => (
            <article key={rule.id} className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Shield className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-surface-950">{rule.category}</h2>
                      <p className="mt-1 text-sm font-semibold text-brand-700">{rule.warranty_months} months warranty</p>
                    </div>
                    <span className="badge-success">Active</span>
                  </div>

                  {rule.messages && (
                    <div className="mt-5 space-y-3">
                      {Object.entries(rule.messages).map(([key, message]) => (
                        <div key={key} className="rounded-lg bg-surface-50 p-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-success-600" />
                            <p className="text-sm font-semibold capitalize text-surface-900">{key.replaceAll('_', ' ')}</p>
                          </div>
                          <p className="mt-1 text-sm text-surface-600">{message || 'N/A'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-surface-300 bg-white p-10 text-center shadow-sm">
          <Shield className="mx-auto h-10 w-10 text-surface-400" />
          <p className="mt-4 text-sm font-medium text-surface-900">No active warranty rules available.</p>
          <p className="mt-1 text-sm text-surface-500">Rules will appear here after an admin creates them.</p>
        </div>
      )}
    </section>
  )
}
