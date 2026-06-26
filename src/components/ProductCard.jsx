import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'

export default function ProductCard({ product }) {
  const percent = Math.min(Math.max(Number(product.percent_elapsed ?? product.percentage_used ?? 0), 0), 100)
  const isExpired = product.status === 'expired'

  return (
    <Link to={`/customer/product/${product.piece}`}>
      <div className="h-full rounded-2xl border border-surface-200/80 bg-white p-5 shadow-card transition duration-200 hover:border-brand-200 hover:shadow-glass">
        <div className="flex justify-between items-start mb-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 font-semibold text-surface-950">{product.item_name || 'Product'}</h3>
            <p className="mt-1 truncate text-sm text-surface-500">Piece: {product.piece}</p>
          </div>
          <StatusBadge status={product.status} size="sm" />
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-xs text-surface-600 mb-1">
            <span>Warranty Used</span>
            <span>{Math.round(percent)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-200">
            <div
              className={`h-2 rounded-full transition-all ${
                isExpired ? 'bg-danger-500' : 'bg-brand-600'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-surface-50 p-3">
            <div className="font-semibold text-surface-950">{product.remaining_months ?? 0}</div>
            <div className="text-surface-600">Months Left</div>
          </div>
          <div className="rounded-lg bg-surface-50 p-3">
            <div className="font-semibold text-surface-950">{product.remaining_days ?? 0}</div>
            <div className="text-surface-600">Days Left</div>
          </div>
        </div>
      </div>
    </Link>
  )
}
