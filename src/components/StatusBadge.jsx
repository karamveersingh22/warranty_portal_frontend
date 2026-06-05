export default function StatusBadge({ status, size = 'md' }) {
  const label = status ? status.replaceAll('_', ' ') : 'Unknown'

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  const statusClasses = {
    active: 'bg-green-100 text-green-700 border border-green-300',
    expired: 'bg-red-100 text-red-700 border border-red-300',
    pending: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    in_progress: 'bg-blue-100 text-blue-700 border border-blue-300',
    solved: 'bg-green-100 text-green-700 border border-green-300',
    inactive: 'bg-gray-100 text-gray-700 border border-gray-300',
  }

  return (
    <span className={`inline-block rounded-full font-medium ${sizeClasses[size]} ${statusClasses[status] || 'bg-gray-100 text-gray-700'}`}>
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </span>
  )
}
