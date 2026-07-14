import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../hooks/useAuth'

export default function OnboardingTerms() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [terms, setTerms] = useState([])
  const [checked, setChecked] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { api.get('/onboarding-terms').then((response) => setTerms(response.data.terms || [])).catch((error) => toast.error(error.response?.data?.detail || 'Failed to load terms')).finally(() => setLoading(false)) }, [])
  if (user?.onboarding_terms_accepted) return <Navigate to={user.profile_complete ? '/customer/my-products' : '/customer/profile'} replace />

  async function accept() {
    if (!terms.length || checked.size !== terms.length) return toast.error('You need to accept all the terms to move further')
    setSaving(true)
    try { await api.post('/onboarding-terms/accept', { term_ids: terms.map((term) => term.id) }); const updated = await refreshUser(); toast.success('Terms and conditions accepted'); navigate(updated?.profile_complete ? '/customer/my-products' : '/customer/profile', { replace: true }) }
    catch (error) { toast.error(error.response?.data?.detail || 'Failed to accept terms') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="flex min-h-[360px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand-700" /></div>
  return <section className="mx-auto max-w-3xl space-y-6"><div className="text-center"><ShieldCheck className="mx-auto h-12 w-12 text-brand-700" /><h1 className="mt-4 text-3xl font-bold text-surface-950">Terms &amp; Conditions</h1><p className="mt-2 text-sm text-surface-600">Please read and accept every term before continuing to the Safrina warranty portal.</p></div><div className="space-y-3">{terms.map((term, index) => <label key={term.id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-surface-200 bg-white p-4 shadow-sm hover:border-brand-300"><input type="checkbox" checked={checked.has(term.id)} onChange={(event) => setChecked((current) => { const next = new Set(current); if (event.target.checked) next.add(term.id); else next.delete(term.id); return next })} className="mt-1 h-5 w-5 rounded border-surface-300 text-brand-600" /><span className="flex-1 text-sm leading-6 text-surface-800"><strong className="mr-2 text-brand-700">{index + 1}.</strong>{term.text}</span>{checked.has(term.id) && <CheckCircle2 className="mt-1 h-5 w-5 text-success-600" />}</label>)}</div>{!terms.length && <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Terms and conditions have not been configured yet. Please contact support.</div>}<button onClick={accept} disabled={saving || !terms.length} className="btn-primary w-full py-3">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}Accept all terms and continue</button></section>
}
