export default function StatsCard({ icon: Icon, label, value, color = 'brand', trend }) {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-600',
    success: 'bg-success-50 text-success-600',
    danger: 'bg-danger-50 text-danger-600',
    warning: 'bg-warning-50 text-warning-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-surface-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-surface-900">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 font-medium ${trend > 0 ? 'text-success-600' : 'text-danger-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}
