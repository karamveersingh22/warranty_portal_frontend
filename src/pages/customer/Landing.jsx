import { Link } from 'react-router-dom'
import { ArrowRight, BedDouble, Clock, Headset, MapPin, MessageSquare, PackagePlus, ShieldCheck, Sparkles, UserPlus } from 'lucide-react'
import Brand from '../../components/Brand'
import Footer from '../../components/Footer'

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: '100% secure OTP login',
    text: 'Your account stays protected with email verification.',
  },
  {
    icon: PackagePlus,
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

const JOURNEYS = [
  {
    icon: PackagePlus,
    title: 'Register your product',
    text: 'Register your Safrina mattress and activate warranty tracking.',
    path: '/login',
    state: { from: { pathname: '/customer/register-product' } },
    action: 'Register product',
  },
  {
    icon: MessageSquare,
    title: 'Raise a complaint',
    text: 'Sign in securely to raise and track a warranty complaint.',
    path: '/login',
    state: { from: { pathname: '/customer/enquiry' } },
    action: 'Raise complaint',
  },
  {
    icon: MapPin,
    title: 'Find a local dealer',
    text: 'See authorised dealers near the city saved in your profile.',
    path: '/login',
    state: { from: { pathname: '/customer/dealers' } },
    action: 'Find dealer',
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
            Welcome to
            <br />
            <span className="text-gradient-brand">Pamper yourself with Safrina Mattress</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-surface-600">
            Welcome to the official Safrina Mattress warranty portal. Register your mattress,
            track your coverage, and reach our care team — all from one secure account.
          </p>
          <div className="mt-6 grid max-w-xl gap-2 sm:grid-cols-2">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-2.5 rounded-xl border border-white/80 bg-white/70 p-3 shadow-sm">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                <div>
                  <p className="text-sm font-semibold text-surface-900">{title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-surface-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-700"
            >
              Login
            </Link>
            <Link
              to="/customer/register"
              className="inline-flex items-center gap-2 rounded-xl border border-surface-200 bg-white px-6 py-3.5 text-sm font-semibold text-surface-800 transition hover:border-brand-300 hover:text-brand-700"
            >
              <UserPlus className="h-4 w-4" /> Create Account
            </Link>
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

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-700">Everything you need, in one place</p>
          <h2 className="mt-2 text-3xl font-bold text-surface-950">Explore our services</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {JOURNEYS.map(({ icon: Icon, title, text, path, state, action }) => (
            <Link key={title} to={path} state={state} className="group card-hover p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent-700"><Icon className="h-6 w-6" /></span>
              <h3 className="mt-4 text-xl font-semibold text-surface-950">{title}</h3>
              <p className="mt-2 min-h-[48px] text-sm leading-6 text-surface-600">{text}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">{action}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
