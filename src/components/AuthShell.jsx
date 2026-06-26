import { Link } from 'react-router-dom'
import { BedDouble, Headset, ShieldCheck } from 'lucide-react'
import Brand from './Brand'

const HIGHLIGHTS = [
  { icon: ShieldCheck, text: 'Register and protect every mattress you own' },
  { icon: BedDouble, text: 'Track live warranty coverage at a glance' },
  { icon: Headset, text: 'Reach our care team whenever you need help' },
]

/**
 * Split-screen branded wrapper for authentication pages.
 * Left: Safrina brand panel (hidden on small screens). Right: the form card.
 */
export default function AuthShell({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-hero p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-300/10 blur-3xl" />

        <Link to="/">
          <Brand variant="light" size="lg" />
        </Link>

        <div className="relative">
          <h2 className="font-display text-4xl font-semibold leading-tight">
            Rest assured,
            <br />
            pamper yourself.
          </h2>
          <p className="mt-4 max-w-md text-brand-100/80">
            The official Safrina Mattress warranty portal — secure, simple, and built around you.
          </p>

          <ul className="mt-10 space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-brand-50">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-brand-100/60">© {new Date().getFullYear()} Safrina Mattress</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-gradient-mesh px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Link to="/">
              <Brand size="md" />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
