import { Link } from 'react-router-dom'
import { ArrowRight, BedDouble, Clock, Headset, ShieldCheck, Sparkles } from 'lucide-react'
import Brand from '../../components/Brand'
import Footer from '../../components/Footer'

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Effortless registration',
    text: 'Register your mattress with its unique piece number in seconds and lock in your coverage.',
  },
  {
    icon: Clock,
    title: 'Live warranty tracking',
    text: 'See exactly how much coverage remains, with clear timelines for every product you own.',
  },
  {
    icon: Headset,
    title: 'Dedicated support',
    text: 'Raise an enquiry and reach our care team directly whenever you need a hand.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Top bar */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
        <Brand />
        <Link
          to="/login"
          className="rounded-xl border border-surface-200 bg-white/70 px-4 py-2 text-sm font-semibold text-surface-800 backdrop-blur transition hover:bg-white"
        >
          Login
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-2 lg:pt-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-700">
            <Sparkles className="h-3.5 w-3.5" />
            Safrina Warranty Portal
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-surface-950 sm:text-5xl lg:text-6xl">
            Rest assured,
            <br />
            <span className="text-gradient-brand">pamper yourself.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-surface-600">
            Welcome to the official Safrina Mattress warranty portal. Register your mattress,
            track your coverage, and reach our care team — all from one secure account.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-700"
            >
              Register your mattress
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/customer/register"
              className="inline-flex items-center gap-2 rounded-xl border border-surface-200 bg-white px-6 py-3.5 text-sm font-semibold text-surface-800 transition hover:border-brand-300 hover:text-brand-700"
            >
              Create an account
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-6 text-sm text-surface-500">
            <div>
              <p className="font-display text-2xl font-semibold text-surface-900">100%</p>
              <p>Secure OTP login</p>
            </div>
            <div className="h-10 w-px bg-surface-200" />
            <div>
              <p className="font-display text-2xl font-semibold text-surface-900">Genuine</p>
              <p>Verified coverage</p>
            </div>
          </div>
        </div>

        {/* Hero visual */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-surface-200/80 bg-white p-8 shadow-glass">
            <div className="flex items-center justify-between">
              <Brand showTagline={false} size="sm" />
              <span className="badge-success">Active</span>
            </div>
            <div className="mt-6 flex items-center gap-4 rounded-2xl bg-gradient-hero p-6 text-white">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <BedDouble className="h-7 w-7" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-brand-100/80">Royalista+ · 72×75×6</p>
                <p className="font-display text-xl font-semibold">Warranty registered</p>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-xs font-medium text-surface-500">
                <span>Coverage remaining</span>
                <span>82%</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface-200">
                <div className="h-full w-[82%] rounded-full bg-gradient-brand" />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-surface-50 p-4">
                <p className="font-display text-2xl font-semibold text-surface-900">98</p>
                <p className="text-xs text-surface-500">Months left</p>
              </div>
              <div className="rounded-2xl bg-surface-50 p-4">
                <p className="font-display text-2xl font-semibold text-surface-900">0</p>
                <p className="text-xs text-surface-500">Open issues</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-surface-200/80 bg-white p-6 shadow-card transition duration-200 hover:border-brand-200 hover:shadow-glass"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-surface-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-surface-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
