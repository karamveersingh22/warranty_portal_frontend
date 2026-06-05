import { AlertCircle, Check, Clock } from 'lucide-react'

export default function WarrantyTimer({ product }) {
  const { remaining_days, remaining_months, status, warranty_start, warranty_end } = product
  const percent = Math.min(Math.max(Number(product.percent_elapsed ?? product.percentage_used ?? 0), 0), 100)

  const isExpired = status === 'expired'
  const isActive = status === 'active'

  // Circular progress ring
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-surface-900">{product.item_name}</h3>
          <p className="text-sm text-surface-500 mt-0.5">Piece: {product.piece}</p>
        </div>
        <span className={isExpired ? 'badge-danger' : 'badge-success'}>
          {isExpired && <AlertCircle className="w-3 h-3" />}
          {isActive && <Check className="w-3 h-3" />}
          {isExpired ? 'Expired' : 'Active'}
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular Progress */}
        <div className="relative shrink-0">
          <svg width="100" height="100" className="-rotate-90">
            <circle
              cx="50" cy="50" r={radius}
              stroke="#e2e8f0"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50" cy="50" r={radius}
              stroke={isExpired ? '#ef4444' : '#6366f1'}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-surface-900">
              {Math.round(percent)}%
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div className="bg-brand-50 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-brand-700">{remaining_days}</div>
            <div className="text-xs text-surface-500 mt-0.5">Days Left</div>
          </div>
          <div className="bg-brand-50 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-brand-700">{remaining_months}</div>
            <div className="text-xs text-surface-500 mt-0.5">Months Left</div>
          </div>
          <div className="bg-surface-50 rounded-xl p-3 text-center col-span-2">
            <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-surface-700">
              <Clock className="w-3.5 h-3.5" />
              Expires {new Date(warranty_end).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Linear progress bar */}
      <div className="mt-4">
        <div className="w-full bg-surface-200 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              isExpired ? 'bg-danger-500' : 'bg-gradient-to-r from-brand-500 to-brand-400'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-surface-400 mt-1.5">
          <span>{new Date(warranty_start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span>{new Date(warranty_end).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  )
}
