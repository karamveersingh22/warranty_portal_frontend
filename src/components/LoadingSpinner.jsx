export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-14 w-14 border-4',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-surface-200 border-t-brand-600 animate-spin`}
      />
      {text && <p className="text-sm text-surface-500 animate-pulse-soft">{text}</p>}
    </div>
  )
}
