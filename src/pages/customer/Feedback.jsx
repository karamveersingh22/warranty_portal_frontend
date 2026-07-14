import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Check, Heart, Loader2, MessageCircleHeart, Send, Sparkles } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../hooks/useAuth'

const RATING = ['Very Good', 'Good', 'Fair', 'Poor']
const YES_NO = ['Yes', 'No']
const OPTION_MARKS = { 'Very Good': '😍', Good: '😊', Fair: '😐', Poor: '🙁', Yes: '✓', No: '×', 'Shop Keeper': '🏪', Advertisement: '📣', Retailer: '🤝', 'Visit at Shop': '🚶' }
const SECTIONS = [
  { title: 'First impressions', subtitle: 'The product and your discovery journey', tint: 'from-violet-500 to-fuchsia-500', questions: [
    ['q1', 'How would you rate your overall experience about the look of the Mattress?', RATING],
    ['q2', 'From which source you came to know about our products?', ['Shop Keeper', 'Advertisement', 'Retailer', 'Visit at Shop']],
    ['q3', 'How do you look about our products?', RATING],
    ['q4', 'Did you get proper information about our products from the shopkeeper or dealer?', YES_NO],
  ]},
  { title: 'Your buying experience', subtitle: 'Help us understand what worked well', tint: 'from-orange-400 to-rose-500', questions: [
    ['q5', 'How would you rate your overall experience with our service?', RATING],
    ['q6', 'How would you rate our prices?', RATING],
    ['q7', 'Overall Quality of our Products', RATING],
    ['q8', 'How satisfied are you with the timeliness of order delivery?', RATING],
    ['q9', 'How satisfied are you with the Customer Support?', RATING],
  ]},
  { title: 'One last pulse check', subtitle: 'Two quick answers and you are nearly done', tint: 'from-emerald-400 to-cyan-500', questions: [
    ['q10', 'Do you recommend our Products/Services to other People?', YES_NO],
    ['q11', 'Have you reported any problem to the Management before?', YES_NO],
  ]},
]
const TEXT_QUESTIONS = [
  ['q12', 'What should we change in order to live up to your expectations? Please mention below:'],
  ['q13', 'Have you experienced any service-related problem? If yes, please mention below:'],
  ['q14', 'Any additional comments or recommendations for improvement? Please mention below:'],
]

function ChoiceQuestion({ number, name, question, options, value, onChange }) {
  return <fieldset className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
    <legend className="sr-only">Question {number}</legend>
    <div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">{number}</span><p className="pt-1 text-sm font-semibold leading-6 text-slate-900">{question}</p></div>
    <div className={`mt-4 grid gap-2 ${options.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
      {options.map((option) => <label key={option} className={`group relative cursor-pointer rounded-xl border px-3 py-3 text-center transition duration-200 ${value === option ? 'scale-[1.02] border-violet-500 bg-violet-50 text-violet-900 shadow-sm ring-2 ring-violet-200' : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50/50'}`}>
        <input type="radio" name={name} value={option} checked={value === option} onChange={() => onChange(option)} className="sr-only" />
        <span className="block text-lg leading-none">{OPTION_MARKS[option]}</span><span className="mt-1.5 block text-xs font-semibold">{option}</span>
        {value === option && <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-white"><Check className="h-3 w-3" /></span>}
      </label>)}
    </div>
  </fieldset>
}

export default function Feedback() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const piece = user?.pending_feedback_piece || location.state?.piece
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const answered = useMemo(() => SECTIONS.flatMap((section) => section.questions).filter(([key]) => answers[key]).length, [answers])
  const complete = answered === 11
  const progress = Math.round((answered / 11) * 100)

  if (!piece) return <Navigate to="/customer/my-products" replace />

  async function submit(event) {
    event.preventDefault()
    if (!complete) return toast.error(`Just ${11 - answered} required question${11 - answered === 1 ? '' : 's'} left to answer`)
    setSubmitting(true)
    try { await api.post('/feedback', { piece, ...answers }); await refreshUser(); toast.success('Thank you — your feedback means a lot!'); navigate('/customer/my-products', { replace: true }) }
    catch (error) { toast.error(error.response?.data?.detail || 'Failed to submit feedback') }
    finally { setSubmitting(false) }
  }

  return <section className="mx-auto max-w-6xl">
    <div className="overflow-hidden rounded-[28px] bg-slate-950 shadow-2xl shadow-violet-200/40">
      <div className="relative overflow-hidden px-6 py-9 text-white sm:px-10">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-fuchsia-500/30 blur-3xl" /><div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold"><Sparkles className="h-3.5 w-3.5 text-yellow-300" />A quick moment, a better Safrina</span><h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Tell us how it really felt.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Your honest experience helps us improve the product, the dealer journey and everything around it. Feedback for piece <strong className="text-white">{piece}</strong>.</p></div><div className="min-w-64 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"><div className="flex justify-between text-xs font-semibold"><span>{answered} of 11 answered</span><span>{progress}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-gradient-to-r from-yellow-300 via-orange-400 to-fuchsia-400 transition-all duration-500" style={{ width: `${progress}%` }} /></div></div></div>
      </div>
      <form onSubmit={submit} className="space-y-8 bg-gradient-to-br from-violet-50 via-rose-50 to-orange-50 p-4 sm:p-8">
        {SECTIONS.map((section, sectionIndex) => <section key={section.title}><div className="mb-4 flex items-center gap-3"><span className={`h-10 w-1.5 rounded-full bg-gradient-to-b ${section.tint}`} /><div><p className="text-lg font-black text-slate-900">{section.title}</p><p className="text-xs text-slate-500">{section.subtitle}</p></div></div><div className="grid gap-4 lg:grid-cols-2">{section.questions.map(([key, question, options], index) => <ChoiceQuestion key={key} number={SECTIONS.slice(0, sectionIndex).reduce((sum, item) => sum + item.questions.length, 0) + index + 1} name={key} question={question} options={options} value={answers[key]} onChange={(value) => setAnswers((current) => ({ ...current, [key]: value }))} />)}</div></section>)}
        <section><div className="mb-4 flex items-center gap-3"><Heart className="h-7 w-7 fill-rose-400 text-rose-500" /><div><p className="text-lg font-black text-slate-900">In your own words</p><p className="text-xs text-slate-500">Optional, but always valuable</p></div></div><div className="grid gap-4 lg:grid-cols-3">{TEXT_QUESTIONS.map(([key, question], index) => <label key={key} className="rounded-2xl border border-white bg-white/90 p-5 shadow-sm"><span className="text-sm font-semibold leading-6 text-slate-900">{index + 12}. {question}</span><textarea value={answers[key] || ''} onChange={(event) => setAnswers((current) => ({ ...current, [key]: event.target.value }))} rows="5" maxLength="3000" className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100" placeholder="Type here if you would like to share…" /></label>)}</div></section>
        <div className="sticky bottom-3 z-10 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-xl backdrop-blur sm:flex sm:items-center sm:justify-between"><div className="hidden items-center gap-3 sm:flex"><MessageCircleHeart className="h-6 w-6 text-fuchsia-500" /><p className="text-sm font-semibold text-slate-700">{complete ? 'Perfect — you are ready to send!' : `${11 - answered} required answer${11 - answered === 1 ? '' : 's'} remaining`}</p></div><button type="submit" disabled={submitting} className={`flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-bold text-white shadow-lg transition sm:w-auto ${complete ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-500 hover:-translate-y-0.5 hover:shadow-fuchsia-300' : 'bg-slate-700 hover:bg-slate-800'}`}>{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{complete ? 'Send my feedback' : 'Complete required answers'}</button></div>
      </form>
    </div>
  </section>
}
