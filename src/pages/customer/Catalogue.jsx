import { useEffect, useState } from 'react'
import { BookOpen, Download, ExternalLink, FileText } from 'lucide-react'
import Brand from '../../components/Brand'
import Footer from '../../components/Footer'
import LoadingSpinner from '../../components/LoadingSpinner'

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
const CATALOGUE_URL = `${API_BASE_URL}/catalogue/file`

export default function Catalogue() {
  const [available, setAvailable] = useState(null)

  useEffect(() => {
    let active = true
    fetch(`${API_BASE_URL}/catalogue/status`)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => { if (active) setAvailable(data) })
      .catch(() => { if (active) setAvailable(false) })
    return () => { active = false }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-mesh">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
        <a href="/"><Brand /></a>
        <a href="/" className="btn-secondary">Home</a>
      </header>
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge-info"><BookOpen className="h-3.5 w-3.5" /> Safrina e-catalogue</span>
          <h1 className="mt-4 text-4xl font-bold text-surface-950">Explore the Safrina collection</h1>
          <p className="mt-3 text-surface-600">Browse our latest mattress collection, models, and product details.</p>
        </div>

        {available === null ? (
          <div className="py-24"><LoadingSpinner text="Loading catalogue" /></div>
        ) : available?.available ? (
          <section className="mx-auto mt-8 max-w-6xl overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-200 px-5 py-4">
              <div className="flex items-center gap-3"><FileText className="h-5 w-5 text-brand-700" /><p className="font-semibold text-surface-900">{available.filename}</p></div>
              <div className="flex gap-2"><a className="btn-secondary" href={CATALOGUE_URL} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /> Open</a><a className="btn-primary" href={`${CATALOGUE_URL}?download=true`}><Download className="h-4 w-4" /> Download</a></div>
            </div>
            <iframe title="Safrina Mattress e-catalogue" src={`${CATALOGUE_URL}#view=FitH`} className="h-[72vh] min-h-[520px] w-full border-0" />
          </section>
        ) : (
          <section className="mx-auto mt-8 max-w-2xl rounded-2xl border border-dashed border-surface-300 bg-white p-12 text-center shadow-sm">
            <FileText className="mx-auto h-11 w-11 text-surface-400" />
            <h2 className="mt-4 text-xl font-semibold text-surface-900">Catalogue coming shortly</h2>
            <p className="mt-2 text-sm leading-6 text-surface-500">Our latest Safrina Mattress e-catalogue is being prepared. Please check back soon.</p>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
