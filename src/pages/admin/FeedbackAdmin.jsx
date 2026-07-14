import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Loader2, MessageSquare, Search } from 'lucide-react'
import api from '../../api/axios'

const LABELS = {
  q1: 'Mattress look', q2: 'Discovery source', q3: 'Product impression', q4: 'Dealer information', q5: 'Service experience', q6: 'Prices', q7: 'Product quality', q8: 'Delivery timeliness', q9: 'Customer support', q10: 'Would recommend', q11: 'Previously reported problem', q12: 'Expectation improvements', q13: 'Service-related problem', q14: 'Additional comments',
}

function formatDate(value) { return value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A' }

export default function FeedbackAdmin() {
  const [feedbacks, setFeedbacks] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  async function load(q = search) {
    setLoading(true)
    try { const response = await api.get('/feedback', { params: q.trim() ? { q: q.trim() } : {} }); setFeedbacks(response.data.feedbacks || []); setTotal(response.data.total || 0) }
    catch (error) { toast.error(error.response?.data?.detail || 'Failed to load feedback') }
    finally { setLoading(false) }
  }
  useEffect(() => { load('') }, [])

  return <section className="space-y-6"><div className="border-b border-surface-200 pb-5"><p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Admin</p><h1 className="mt-2 text-3xl font-bold text-surface-950">Customer Feedback</h1><p className="mt-1 text-sm text-surface-500">{total} submitted feedback response{total === 1 ? '' : 's'}.</p></div><form onSubmit={(event) => { event.preventDefault(); load() }} className="flex gap-2 rounded-lg border border-surface-200 bg-white p-4 shadow-sm"><input value={search} onChange={(event) => setSearch(event.target.value)} className="input" placeholder="Search piece, customer, item or dealer" /><button className="btn-primary"><Search className="h-4 w-4" />Search</button></form>{loading ? <div className="flex min-h-72 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand-700" /></div> : feedbacks.length ? <div className="space-y-4">{feedbacks.map((feedback) => <article key={feedback.id} className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-2 border-b border-surface-100 pb-4 sm:flex-row sm:justify-between"><div><h2 className="font-semibold text-surface-950">{feedback.item_name || 'Product'} — {feedback.piece}</h2><p className="mt-1 text-sm text-surface-500">{feedback.customer_name || feedback.customer_email} · Dealer: {feedback.dealer_name || 'N/A'}</p></div><span className="text-xs text-surface-500">{formatDate(feedback.submitted_at)}</span></div><dl className="mt-4 grid gap-3 md:grid-cols-2">{Object.entries(LABELS).map(([key, label]) => feedback.answers?.[key] ? <div key={key} className="rounded-lg bg-surface-50 p-3"><dt className="text-xs font-semibold uppercase tracking-wide text-surface-500">{label}</dt><dd className="mt-1 whitespace-pre-wrap text-sm text-surface-900">{feedback.answers[key]}</dd></div> : null)}</dl></article>)}</div> : <div className="rounded-lg border border-dashed border-surface-300 bg-white p-10 text-center"><MessageSquare className="mx-auto h-10 w-10 text-surface-400" /><p className="mt-3 text-sm text-surface-600">No feedback found.</p></div>}</section>
}
