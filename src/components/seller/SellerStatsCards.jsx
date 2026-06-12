import { StatsCard } from '../admin/StatsCard'
import { formatPrice } from '../../utils/formatPrice'

export function SellerStatsCards({ data }) {
  if (!data) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard title="Ventes totales" value={Number(data.total_sales)} />
      <StatsCard title="Commandes" value={data.total_orders} hint={`${data.pending_orders} en attente`} />
      <StatsCard title="Produits actifs" value={`${data.active_products}/${data.total_products}`} />
      <StatsCard title="Note moyenne" value={`${data.average_rating ?? '0'} / 5`} />
    </div>
  )
}

export function SellerMonthlyChart({ monthly = [] }) {
  const max = Math.max(...monthly.map((m) => Number(m.amount)), 1)

  return (
    <div className="card p-6">
      <h3 className="font-semibold text-slate-900">Ventes mensuelles</h3>
      <div className="mt-6 flex h-48 items-end gap-3">
        {monthly.length === 0 && <p className="text-sm text-slate-500">Aucune donnée pour le moment.</p>}
        {monthly.map((item) => (
          <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-lg bg-brand-600"
              style={{ height: `${(Number(item.amount) / max) * 100}%`, minHeight: '8px' }}
              title={formatPrice(item.amount)}
            />
            <span className="text-[10px] text-slate-500">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
