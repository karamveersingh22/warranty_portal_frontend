import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BookOpen, ExternalLink, FileText, FileUp, Loader2, Upload } from 'lucide-react'
import api from '../../api/axios'

const MAX_FILE_SIZE = 25 * 1024 * 1024

function formatBytes(bytes) {
  if (!bytes) return '0 MB'
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function CatalogueAdmin() {
  const [file, setFile] = useState(null)
  const [catalogue, setCatalogue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const loadCatalogue = async () => {
    try {
      const response = await api.get('/catalogue/status')
      setCatalogue(response.data)
    } catch {
      toast.error('Could not load catalogue status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCatalogue() }, [])

  const chooseFile = (event) => {
    const selected = event.target.files?.[0]
    if (!selected) return
    if (!selected.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF files are allowed')
      event.target.value = ''
      return
    }
    if (selected.size > MAX_FILE_SIZE) {
      toast.error('The catalogue PDF must be 25 MB or smaller')
      event.target.value = ''
      return
    }
    setFile(selected)
  }

  const upload = async (event) => {
    event.preventDefault()
    if (!file) return
    setUploading(true)
    setProgress(0)
    try {
      const formData = new FormData()
      formData.append('catalogue_file', file)
      const response = await api.post('/catalogue', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
        },
      })
      setCatalogue(response.data)
      setFile(null)
      toast.success('Catalogue updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Catalogue upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="border-b border-surface-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Admin</p>
        <h1 className="mt-2 text-3xl font-bold text-surface-950">E-catalogue</h1>
        <p className="mt-1 text-sm text-surface-500">Upload the PDF customers see on the public catalogue page.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form onSubmit={upload} className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
          <label htmlFor="catalogue-file" className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-surface-300 bg-surface-50 p-6 text-center transition hover:border-brand-400 hover:bg-brand-50">
            <FileUp className="h-10 w-10 text-surface-400" />
            <span className="mt-4 font-semibold text-surface-900">{file?.name || 'Choose catalogue PDF'}</span>
            <span className="mt-1 text-xs text-surface-500">PDF only, maximum 25 MB</span>
          </label>
          <input id="catalogue-file" type="file" accept="application/pdf,.pdf" onChange={chooseFile} className="hidden" />
          <button type="submit" disabled={!file || uploading} className="btn-primary mt-5">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? `Uploading ${progress}%` : catalogue?.available ? 'Replace catalogue' : 'Upload catalogue'}
          </button>
          <p className="mt-3 text-xs leading-5 text-surface-500">Uploading a new PDF automatically replaces and removes the previous catalogue.</p>
        </form>

        <aside className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-brand-700" /><h2 className="font-semibold text-surface-950">Current catalogue</h2></div>
          {loading ? (
            <div className="mt-6 flex items-center gap-2 text-sm text-surface-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading status</div>
          ) : catalogue?.available ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-lg bg-surface-50 p-4"><FileText className="h-6 w-6 text-brand-600" /><p className="mt-3 break-words text-sm font-semibold text-surface-900">{catalogue.filename}</p><p className="mt-1 text-xs text-surface-500">{formatBytes(catalogue.size)}</p></div>
              <a href="/catalogue" target="_blank" rel="noreferrer" className="btn-secondary w-full"><ExternalLink className="h-4 w-4" /> View customer page</a>
            </div>
          ) : <p className="mt-4 text-sm text-surface-500">No catalogue has been uploaded yet.</p>}
        </aside>
      </div>
    </section>
  )
}
