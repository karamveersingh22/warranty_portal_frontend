import { useState } from 'react'
import toast from 'react-hot-toast'
import { AlertTriangle, CheckCircle2, Database, FileUp, Loader2, Trash2, Upload } from 'lucide-react'
import api from '../../api/axios'

function metricValue(result, key) {
  return result?.report?.summary?.[key] ?? result?.report?.[key] ?? result?.[key] ?? 0
}

export default function UploadDBF() {
  const [booksale, setBooksale] = useState(null)
  const [serials, setSerials] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [job, setJob] = useState(null)
  const [resetting, setResetting] = useState(false)

  const handleReset = async () => {
    if (!window.confirm('This will DELETE all product pieces, registered products, enquiries, warranty rules, and import history. This cannot be undone. Are you sure?')) return
    if (!window.confirm('FINAL WARNING: All data will be permanently deleted. Continue?')) return

    setResetting(true)
    try {
      const response = await api.delete('/upload/reset-data')
      toast.success(response.data.message || 'Data reset complete')
      setResult(null)
      setJob(null)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to reset data')
    } finally {
      setResetting(false)
    }
  }

  const setFile = (event, type) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.dbf')) {
      toast.error('Only .dbf files are allowed')
      return
    }
    if (type === 'booksale') setBooksale(file)
    if (type === 'serials') setSerials(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!booksale || !serials) {
      toast.error('Select BOOKSALE.dbf and SERIALS.dbf')
      return
    }

    setLoading(true)
    setResult(null)
    setJob(null)
    setUploadProgress(0)
    try {
      const formData = new FormData()
      formData.append('booksale_file', booksale)
      formData.append('serials_file', serials)
      const response = await api.post('/upload/dbf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return
          setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
        },
      })
      const jobId = response.data.job_id
      setJob({ job_id: jobId, status: response.data.status, message: response.data.message })
      const completedJob = await waitForImportJob(jobId, setJob)
      setResult(completedJob.result || completedJob)
      setBooksale(null)
      setSerials(null)
      toast.success('DBF import completed')
    } catch (error) {
      toast.error(error.response?.data?.detail || error.message || 'DBF upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-surface-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-surface-950">Upload DBF</h1>
          <p className="mt-1 text-sm text-surface-500">Import BOOKSALE and SERIALS files into the product master.</p>
        </div>
        <button
          onClick={handleReset}
          disabled={resetting || loading}
          className="flex items-center gap-2 rounded-lg border border-danger-200 bg-danger-50 px-4 py-2 text-sm font-medium text-danger-700 hover:bg-danger-100 disabled:opacity-50"
        >
          {resetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Reset All Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <FilePicker id="booksale" title="BOOKSALE.dbf" file={booksale} onChange={(event) => setFile(event, 'booksale')} />
            <FilePicker id="serials" title="SERIALS.dbf" file={serials} onChange={(event) => setFile(event, 'serials')} />
          </div>
          <button type="submit" disabled={loading || !booksale || !serials} className="btn-primary mt-6">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {loading ? 'Processing Import' : 'Upload and Process'}
          </button>

          {(loading || job) && (
            <ImportProgress uploadProgress={uploadProgress} job={job} />
          )}
        </div>

        <aside className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-surface-950">Import Result</h2>
          {result ? (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 rounded-lg bg-success-50 p-3 text-success-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-semibold">{result.message || 'DBF import completed'}</span>
              </div>
              <Metric label="Booksale Rows" value={metricValue(result, 'booksale_rows')} />
              <Metric label="Serials Rows" value={metricValue(result, 'serials_rows')} />
              <Metric label="Pieces Inserted" value={metricValue(result, 'inserted_count') || metricValue(result, 'pieces_inserted')} />
              <Metric label="Pieces Updated" value={metricValue(result, 'updated_count') || metricValue(result, 'pieces_updated')} />
              <Metric label="Pieces Failed" value={metricValue(result, 'failed_count') || metricValue(result, 'pieces_failed')} />
            </div>
          ) : (
            <p className="mt-3 text-sm text-surface-500">The latest import summary will appear here after processing.</p>
          )}
        </aside>
      </form>
    </section>
  )
}

async function waitForImportJob(jobId, setJob) {
  while (jobId) {
    const response = await api.get(`/upload/jobs/${jobId}`)
    const currentJob = response.data
    setJob(currentJob)

    if (currentJob.status === 'completed') {
      return currentJob
    }

    if (currentJob.status === 'failed') {
      throw new Error(currentJob.error || 'DBF import failed')
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}

function phaseLabel(phase) {
  const labels = {
    queued: 'Queued',
    starting: 'Starting import',
    parsing_booksale: 'Reading BOOKSALE',
    parsing_serials: 'Reading SERIALS',
    joining_records: 'Matching records',
    database_import: 'Writing to database',
    completed: 'Completed',
    failed: 'Failed',
  }
  return labels[phase] || 'Processing'
}

function ImportProgress({ uploadProgress, job }) {
  const dbProgress = job?.progress_percent || 0
  const processedRows = job?.processed_rows || 0
  const totalRows = job?.total_rows || 0
  const isDatabaseActive = job && !['queued', 'starting'].includes(job.phase)

  return (
    <div className="mt-6 rounded-lg border border-surface-200 bg-surface-50 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-surface-950">
        <Database className="h-4 w-4 text-brand-600" />
        <span>{job?.message || 'Uploading files'}</span>
      </div>

      <div className="mt-4 space-y-4">
        <ProgressBar label="File upload" value={uploadProgress} />
        <ProgressBar
          label={isDatabaseActive ? phaseLabel(job.phase) : 'Database import'}
          value={dbProgress}
          muted={!isDatabaseActive}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MiniMetric label="Rows Processed" value={totalRows ? `${processedRows}/${totalRows}` : processedRows} />
        <MiniMetric label="Inserted" value={job?.inserted_count || 0} />
        <MiniMetric label="Updated" value={job?.updated_count || 0} />
        <MiniMetric label="Skipped" value={job?.ignored_count || 0} />
      </div>

      {job?.status === 'running' && (
        <p className="mt-3 text-xs text-surface-500">
          Keep this page open while the import is running. Large SERIALS files can take a few minutes.
        </p>
      )}
    </div>
  )
}

function ProgressBar({ label, value, muted = false }) {
  const percent = Math.max(0, Math.min(Number(value) || 0, 100))
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-surface-600">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-surface-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${muted ? 'bg-surface-400' : 'bg-brand-600'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-lg bg-white px-3 py-2">
      <p className="text-xs text-surface-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-surface-950">{value}</p>
    </div>
  )
}

function FilePicker({ id, title, file, onChange }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-surface-800">{title}</p>
      <label htmlFor={id} className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-surface-300 bg-surface-50 p-6 text-center transition hover:border-brand-400 hover:bg-brand-50">
        <FileUp className="h-8 w-8 text-surface-400" />
        <span className="mt-3 text-sm font-medium text-surface-900">{file?.name || 'Choose DBF file'}</span>
        <span className="mt-1 text-xs text-surface-500">.dbf only</span>
      </label>
      <input id={id} type="file" accept=".dbf" onChange={onChange} className="hidden" />
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-surface-50 px-4 py-3">
      <span className="text-sm text-surface-600">{label}</span>
      <span className="font-bold text-surface-950">{value || 0}</span>
    </div>
  )
}
