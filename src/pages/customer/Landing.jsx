import { Link } from 'react-router-dom'
import { ArrowRight, BedDouble, BookOpen, Clock, Headset, LogIn, MapPin, MessageSquare, PackagePlus, ShieldCheck, Sparkles, UserPlus } from 'lucide-react'
import Brand from '../../components/Brand'
import Footer from '../../components/Footer'
import bedroomHero from '../../assets/safrina-bedroom-hero.webp'

const HIGHLIGHTS = [
  { icon: ShieldCheck, title: '100% secure OTP login', text: 'Protected access with email verification.' },
  { icon: PackagePlus, title: 'Effortless registration', text: 'Activate coverage with your piece number.' },
  { icon: Clock, title: 'Live warranty tracking', text: 'Clear timelines for every registered product.' },
  { icon: Headset, title: 'Dedicated support', text: 'Reach our care team whenever you need help.' },
]

const JOURNEYS = [
  { icon: BookOpen, title: 'Explore our e-catalogue', text: 'Browse the latest Safrina Mattress collection and product details.', path: '/catalogue', action: 'View catalogue' },
  { icon: PackagePlus, title: 'Register your product', text: 'Register your Safrina mattress and activate warranty tracking.', path: '/login', state: { from: { pathname: '/customer/register-product' } }, action: 'Register product' },
  { icon: MessageSquare, title: 'Raise a complaint', text: 'Sign in securely to raise and track a warranty complaint.', path: '/login', state: { from: { pathname: '/customer/enquiry' } }, action: 'Raise complaint' },
  { icon: MapPin, title: 'Find a local dealer', text: 'See authorised dealers near the city saved in your profile.', path: '/login', state: { from: { pathname: '/customer/dealers' } }, action: 'Find dealer' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#fbf8f6]">
      <header className="relative z-20 border-b border-[#B13250]/10 bg-white/95">
        <div className="relative mx-auto flex min-h-24 max-w-7xl items-center justify-center px-4 py-3 sm:min-h-28 sm:px-6">
          <Brand size="lg" className="h-20 w-56 sm:h-24 sm:w-64 lg:h-28 lg:w-72" />
          <Link to="/login" className="absolute right-4 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-[#B13250] transition hover:bg-[#B13250]/[0.07] focus:outline-none focus:ring-4 focus:ring-[#B13250]/15 sm:right-6 sm:rounded-xl sm:bg-[#B13250] sm:px-5 sm:py-2.5 sm:text-white sm:shadow-[0_8px_22px_rgba(177,50,80,0.22)] sm:hover:-translate-y-0.5 sm:hover:bg-[#92273f]">
            <LogIn className="h-4 w-4 sm:hidden" /> Login
          </Link>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden border-b border-[#B13250]/10">
          <img src={bedroomHero} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover object-[58%_center] lg:object-center" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#fffaf7]/[0.98] via-[#fffaf7]/90 to-[#fffaf7]/55 lg:via-[#fffaf7]/80 lg:to-white/25" />

          <div className="mx-auto grid max-w-7xl items-center gap-9 px-4 py-10 sm:px-6 sm:py-14 lg:min-h-[610px] lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:py-16">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#B13250]/20 bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#B13250] shadow-sm backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" /> Safrina Warranty Portal
              </span>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#29171c] sm:text-5xl lg:text-6xl">
                Pamper yourself with <span className="text-[#B13250]">Safrina Mattress</span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#604d52] sm:text-lg sm:leading-8 lg:mx-0">
                Welcome to the official Safrina Mattress warranty portal. Register your mattress, track your coverage, and reach our care team — all from one secure account.
              </p>
              <div className="mt-7 flex flex-row justify-center gap-3 lg:justify-start">
                <Link to="/login" className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#B13250] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(177,50,80,0.24)] transition hover:-translate-y-0.5 hover:bg-[#92273f] hover:shadow-[0_14px_30px_rgba(177,50,80,0.28)] focus:outline-none focus:ring-4 focus:ring-[#B13250]/20 sm:flex-none">Login</Link>
                <Link to="/customer/register" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#B13250] bg-white/70 px-5 py-3 text-sm font-semibold text-[#B13250] backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-[#B13250]/[0.06] focus:outline-none focus:ring-4 focus:ring-[#B13250]/15 sm:flex-none">
                  <UserPlus className="h-4 w-4" /> Create Account
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:mx-0">
              <div className="overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/95 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.10)] backdrop-blur-sm sm:p-8">
                <div className="flex items-center justify-between">
                  <Brand showTagline={false} size="sm" />
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Active</span>
                </div>
                <div className="mt-6 flex items-center gap-4 rounded-2xl bg-gradient-to-br from-[#5f192b] to-[#B13250] p-5 text-white sm:p-6">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15"><BedDouble className="h-7 w-7" /></span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/70">Royalista+ · 72×75×6</p>
                    <p className="font-display text-lg font-semibold sm:text-xl">Warranty registered</p>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="flex justify-between text-xs font-medium text-surface-500"><span>Coverage remaining</span><span>82%</span></div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#B13250]/10"><div className="h-full w-[82%] rounded-full bg-[#B13250]" /></div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[#fbf6f4] p-4"><p className="font-display text-2xl font-semibold text-[#29171c]">98</p><p className="text-xs text-[#746267]">Months left</p></div>
                  <div className="rounded-2xl bg-[#fbf6f4] p-4"><p className="font-display text-2xl font-semibold text-[#29171c]">0</p><p className="text-xs text-[#746267]">Open issues</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Why customers trust Safrina" className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:-mt-7 lg:pb-12 lg:pt-0">
          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-[#B13250]/10 bg-white shadow-[0_12px_35px_rgba(70,35,43,0.09)] lg:grid-cols-4 lg:divide-x lg:divide-[#B13250]/10">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex flex-col items-center px-3 py-5 text-center even:border-l even:border-[#B13250]/10 lg:flex-row lg:items-start lg:gap-3 lg:border-l-0 lg:px-5 lg:text-left">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B13250]/10 text-[#B13250]"><Icon className="h-5 w-5" /></span>
                <div className="mt-2 lg:mt-0"><p className="text-sm font-semibold text-[#29171c]">{title}</p><p className="mt-1 hidden text-xs leading-5 text-[#746267] sm:block">{text}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 sm:pb-20">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#B13250]">Everything you need, in one place</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#29171c] sm:text-4xl">Explore our services</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEYS.map(({ icon: Icon, title, text, path, state, action }, index) => (
              <Link key={title} to={path} state={state} className="group rounded-2xl border border-transparent bg-white p-6 shadow-[0_8px_24px_rgba(70,35,43,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#B13250] hover:shadow-[0_14px_34px_rgba(70,35,43,0.13)] focus:outline-none focus:ring-4 focus:ring-[#B13250]/15">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${index % 2 === 0 ? 'bg-[#B13250]' : 'bg-[#c49748]'}`}><Icon className="h-6 w-6" strokeWidth={2.4} /></span>
                <h3 className="mt-4 text-xl font-semibold text-[#29171c]">{title}</h3>
                <p className="mt-2 min-h-[48px] text-sm leading-6 text-[#746267]">{text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#B13250]">{action}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
