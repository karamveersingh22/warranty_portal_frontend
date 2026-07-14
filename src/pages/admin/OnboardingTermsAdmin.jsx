import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ArrowDown, ArrowUp, Edit2, Loader2, Plus, Save, Trash2, X } from 'lucide-react'
import api from '../../api/axios'

export default function OnboardingTermsAdmin() {
  const [terms, setTerms] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    try { const response = await api.get('/onboarding-terms'); setTerms(response.data.terms || []) }
    catch (error) { toast.error(error.response?.data?.detail || 'Failed to load terms') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function submit(event) {
    event.preventDefault()
    if (!text.trim()) return toast.error('Term text is required')
    setSaving(true)
    try {
      if (editing) await api.put(`/onboarding-terms/${editing.id}`, { text: text.trim() })
      else await api.post('/onboarding-terms', { text: text.trim() })
      toast.success(editing ? 'Term updated' : 'Term created')
      setText(''); setEditing(null); await load()
    } catch (error) { toast.error(error.response?.data?.detail || 'Failed to save term') }
    finally { setSaving(false) }
  }

  function edit(term) { setEditing(term); setText(term.text) }

  async function move(index, direction) {
    const target = index + direction
    if (target < 0 || target >= terms.length) return
    const reordered = [...terms]
    ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
    setTerms(reordered)
    try { await api.put('/onboarding-terms/reorder/all', { term_ids: reordered.map((term) => term.id) }) }
    catch (error) { toast.error(error.response?.data?.detail || 'Failed to reorder terms'); load() }
  }

  async function remove(term) {
    if (!window.confirm(`Are you 100% sure you want to permanently delete this onboarding term?\n\n“${term.text}”\n\nThis action cannot be undone.`)) return
    try { await api.delete(`/onboarding-terms/${term.id}`, { params: { confirm: true } }); toast.success('Term deleted'); load() }
    catch (error) { toast.error(error.response?.data?.detail || 'Failed to delete term') }
  }

  if (loading) return <div className="flex min-h-[360px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand-700" /></div>

  return <section className="space-y-6">
    <div className="border-b border-surface-200 pb-5"><p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Admin</p><h1 className="mt-2 text-3xl font-bold text-surface-950">Customer Terms &amp; Conditions</h1><p className="mt-1 text-sm text-surface-500">Manage the ordered terms that new customers must accept before using the portal.</p></div>
    <form onSubmit={submit} className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
      <label className="block text-sm font-medium text-surface-800">{editing ? 'Edit term' : 'New term'}</label>
      <textarea value={text} onChange={(event) => setText(event.target.value)} rows="3" maxLength="2000" className="input mt-2 min-h-24" placeholder="Enter one customer-friendly term" />
      <div className="mt-3 flex gap-2"><button className="btn-primary" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{editing ? 'Save changes' : 'Add term'}</button>{editing && <button type="button" className="btn-secondary" onClick={() => { setEditing(null); setText('') }}><X className="h-4 w-4" />Cancel</button>}</div>
    </form>
    <div className="space-y-3">{terms.map((term, index) => <article key={term.id} className="flex gap-4 rounded-lg border border-surface-200 bg-white p-4 shadow-sm"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">{index + 1}</span><p className="min-w-0 flex-1 whitespace-pre-wrap text-sm leading-6 text-surface-800">{term.text}</p><div className="flex shrink-0 gap-1"><button onClick={() => move(index, -1)} disabled={index === 0} className="rounded p-2 text-surface-600 hover:bg-surface-100 disabled:opacity-30" title="Move up"><ArrowUp className="h-4 w-4" /></button><button onClick={() => move(index, 1)} disabled={index === terms.length - 1} className="rounded p-2 text-surface-600 hover:bg-surface-100 disabled:opacity-30" title="Move down"><ArrowDown className="h-4 w-4" /></button><button onClick={() => edit(term)} className="rounded p-2 text-brand-700 hover:bg-brand-50" title="Edit"><Edit2 className="h-4 w-4" /></button><button onClick={() => remove(term)} className="rounded p-2 text-danger-700 hover:bg-danger-50" title="Delete"><Trash2 className="h-4 w-4" /></button></div></article>)}{!terms.length && <div className="rounded-lg border border-dashed border-surface-300 bg-white p-10 text-center text-sm text-surface-500">No onboarding terms configured.</div>}</div>
  </section>
}
