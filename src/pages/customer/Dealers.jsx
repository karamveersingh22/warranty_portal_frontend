import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { ExternalLink, MapPin, Navigation, Phone, Store } from 'lucide-react'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'

function mapsUrl(dealer) {
  const query = [dealer.name, dealer.address, dealer.city, dealer.state].filter(Boolean).join(', ')
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

function mapsEmbedUrl(dealer) {
  const query = [dealer.name, dealer.address, dealer.city, dealer.state].filter(Boolean).join(', ')
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
}

export default function Dealers() {
  const [result, setResult] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api.get('/dealers/nearby')
      .then((response) => {
        if (active) setResult(response.data)
      })
      .catch((error) => {
        if (active) toast.error(error.response?.data?.detail || 'Could not find nearby dealers')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  const dealers = result?.dealers || []
  const selectedDealer = useMemo(() => dealers[selectedIndex] || dealers[0], [dealers, selectedIndex])

  if (loading) {
    return <div className="flex min-h-[360px] items-center justify-center"><LoadingSpinner text="Finding nearby dealers" /></div>
  }

  return (
    <section className="space-y-6">
      <div className="border-b border-surface-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Dealer locator</p>
        <h1 className="mt-2 text-3xl font-bold text-surface-950">Dealers near you</h1>
        <p className="mt-1 text-sm text-surface-500">
          Based on your saved city: <span className="font-semibold text-surface-700">{result?.city || 'Not available'}</span>
          {result?.state ? `, ${result.state}` : ''}.
        </p>
      </div>

      {dealers.length ? (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-brand-50/70 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm"><Store className="h-5 w-5" /></span>
              <div><p className="text-2xl font-bold text-brand-800">{result.total}</p><p className="text-sm text-brand-700">nearby authorised dealer{result.total === 1 ? '' : 's'} in {result.city}</p></div>
            </div>
            <p className="max-w-sm text-sm text-brand-700">Choose a dealer to preview the approximate location and open directions in Google Maps.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <div className="space-y-3">
              {dealers.map((dealer, index) => (
                <button
                  type="button"
                  key={`${dealer.code || 'dealer'}-${dealer.name}-${dealer.address}`}
                  onClick={() => setSelectedIndex(index)}
                  className={`w-full rounded-2xl border p-5 text-left transition ${index === selectedIndex ? 'border-brand-400 bg-brand-50 shadow-card' : 'border-surface-200 bg-white hover:border-brand-200 hover:shadow-card'}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm"><MapPin className="h-5 w-5" /></span>
                    <span className="min-w-0 flex-1"><span className="block font-semibold text-surface-950">{dealer.name}</span><span className="mt-1 block text-sm leading-5 text-surface-600">{dealer.address || dealer.city}</span>{dealer.phone && <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700"><Phone className="h-4 w-4" />{dealer.phone}</span>}</span>
                  </div>
                </button>
              ))}
            </div>

            {selectedDealer && <div className="overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-card">
              <iframe title={`Map for ${selectedDealer.name}`} src={mapsEmbedUrl(selectedDealer)} className="h-[330px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0"><p className="truncate font-semibold text-surface-950">{selectedDealer.name}</p><p className="truncate text-sm text-surface-500">Approximate dealer location</p></div>
                <a className="btn-primary shrink-0" href={mapsUrl(selectedDealer)} target="_blank" rel="noreferrer"><Navigation className="h-4 w-4" /> Open Maps <ExternalLink className="h-3.5 w-3.5" /></a>
              </div>
            </div>}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-surface-300 bg-white p-12 text-center">
          <MapPin className="mx-auto h-10 w-10 text-surface-400" />
          <h2 className="mt-4 text-lg font-semibold text-surface-900">No dealer is listed for {result?.city || 'your city'} yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-surface-500">Please contact Safrina support, or update your profile if your city is incorrect.</p>
        </div>
      )}
    </section>
  )
}
