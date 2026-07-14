import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Loader2, MessageSquare, Send } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../hooks/useAuth'

const RATING = ['Very Good', 'Good', 'Fair', 'Poor']
const YES_NO = ['Yes', 'No']
const QUESTIONS = [
  ['q1', 'How would you rate your overall experience about the look of the Mattress?', RATING],
  ['q2', 'From which source you came to know about our products?', ['Shop Keeper', 'Advertisement', 'Retailer', 'Visit at Shop']],
  ['q3', 'How do you look about our products?', RATING],
  ['q4', 'Did you get proper information about our products from the shopkeeper or dealer?', YES_NO],
  ['q5', 'How would you rate your overall experience with our service?', RATING],
  ['q6', 'How would you rate our prices?', RATING],
  ['q7', 'Overall Quality of our Products', RATING],
  ['q8', 'How satisfied are you with the timeliness of order delivery?', RATING],
  ['q9', 'How satisfied are you with the Customer Support?', RATING],
  ['q10', 'Do you recommend our Products/Services to other People?', YES_NO],
  ['q11', 'Have you reported any problem to the Management before?', YES_NO],
]
const TEXT_QUESTIONS = [
  ['q12', 'What should we change in order to live up to your expectations? Please mention below:'],
  ['q13', 'Have you experienced any service-related problem? If yes, please mention below:'],
  ['q14', 'Any additional comments or recommendations for improvement? Please mention below:'],
]

export default function Feedback() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const piece = user?.pending_feedback_piece || location.state?.piece
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const complete = useMemo(() => QUESTIONS.every(([key]) => answers[key]), [answers])

  if (!piece) return <Navigate to="/customer/my-products" replace />

  async function submit(event) {
    event.preventDefault()
    if (!complete) return toast.error('Please answer all multiple-choice questions')
    setSubmitting(true)
    try {
      await api.post('/feedback', { piece, ...answers })
      await refreshUser()
      toast.success('Thank you for your feedback')
      navigate('/customer/my-products', { replace: true })
    } catch (error) { toast.error(error.response?.data?.detail || 'Failed to submit feedback') }
    finally { setSubmitting(false) }
  }

  return <section className="mx-auto max-w-4xl space-y-6">
    <div className="border-b border-surface-200 pb-5 text-center"><MessageSquare className="mx-auto h-11 w-11 text-brand-700" /><h1 className="mt-3 text-3xl font-bold text-surface-950">Customer Feedback</h1><p className="mt-2 text-sm text-surface-600">Please share your buying experience for piece <strong>{piece}</strong>. All multiple-choice questions are required.</p></div>
    <form onSubmit={submit} className="space-y-4">
      {QUESTIONS.map(([key, question, options], index) => <fieldset key={key} className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm"><legend className="px-1 text-sm font-semibold text-surface-900">Q{index + 1}: {question}</legend><div className="mt-3 flex flex-wrap gap-3">{options.map((option) => <label key={option} className={`cursor-pointer rounded-lg border px-4 py-2 text-sm transition ${answers[key] === option ? 'border-brand-600 bg-brand-50 font-semibold text-brand-800' : 'border-surface-200 text-surface-700 hover:border-brand-300'}`}><input type="radio" name={key} value={option} checked={answers[key] === option} onChange={() => setAnswers((current) => ({ ...current, [key]: option }))} className="sr-only" />{option}</label>)}</div></fieldset>)}
      {TEXT_QUESTIONS.map(([key, question], index) => <label key={key} className="block rounded-lg border border-surface-200 bg-white p-5 shadow-sm"><span className="text-sm font-semibold text-surface-900">Q{index + 12}: {question}</span><span className="ml-2 text-xs text-surface-400">Optional</span><textarea value={answers[key] || ''} onChange={(event) => setAnswers((current) => ({ ...current, [key]: event.target.value }))} rows="4" maxLength="3000" className="input mt-3 min-h-28" /></label>)}
      <button type="submit" disabled={submitting} className="btn-primary w-full py-3">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Submit Feedback</button>
    </form>
  </section>
}
