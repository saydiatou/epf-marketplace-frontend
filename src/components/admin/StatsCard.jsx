import { formatPrice } from '../../utils/formatPrice'

export function StatsCard({ title, value, hint, trend }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">
        {typeof value === 'number' ? formatPrice(value) : value}
      </p>
      {(hint || trend) && (
        <p className={`mt-2 text-sm ${trend?.startsWith('+') ? 'text-green-600' : 'text-slate-500'}`}>
          {trend || hint}
        </p>
      )}
    </div>
  )
}
