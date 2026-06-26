/**
 * Safrina Mattress brand lockup: monogram mark + wordmark + tagline.
 * Purely presentational — used across navbar, sidebar, auth, and landing.
 */

export function BrandMark({ className = 'h-10 w-10', rounded = 'rounded-xl' }) {
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className} ${rounded} bg-gradient-brand text-white shadow-glow`}
    >
      <span className="font-display text-[1.1em] font-semibold leading-none">S</span>
      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent-400 ring-2 ring-white/70" />
    </span>
  )
}

export default function Brand({
  variant = 'dark', // 'dark' text on light bg, 'light' text on dark bg
  showTagline = true,
  size = 'md',
  className = '',
}) {
  const isLight = variant === 'light'
  const markSize = size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  const nameSize = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-lg'

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <BrandMark className={markSize} />
      <div className="leading-tight">
        <p className={`font-display font-semibold tracking-tight ${nameSize} ${isLight ? 'text-white' : 'text-surface-950'}`}>
          Safrina
        </p>
        {showTagline && (
          <p className={`text-[11px] font-medium uppercase tracking-[0.18em] ${isLight ? 'text-brand-100/80' : 'text-accent-600'}`}>
            Pamper yourself
          </p>
        )}
      </div>
    </div>
  )
}
