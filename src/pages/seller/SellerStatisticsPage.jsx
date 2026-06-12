import { useEffect, useState } from 'react'
import { sellerService } from '../../services/seller.service'
import { StatsCard } from '../../components/admin/StatsCard'
import { Spinner } from '../../components/ui/Spinner'

export default function SellerStatisticsPage() {
  const [stats, setStats] = useState(null)
  const [period, setPeriod] = useState('month')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    sellerService
      .getStatistics({ period })
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false))
  }, [period])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Statistiques</h1>
          <p className="mt-2 text-slate-600">Performance de votre boutique.</p>
        </div>
        <select className="input w-auto" value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="week">7 jours</option>
          <option value="month">30 jours</option>
          <option value="year">12 mois</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard title="Vues produits" value={stats?.total_views ?? 0} />
        <StatsCard title="Taux de conversion" value={`${stats?.conversion_rate ?? 0}%`} />
        <StatsCard title="Panier moyen" value={Number(stats?.average_order_value ?? 0)} />
        <StatsCard title="Satisfaction client" value={`${stats?.customer_satisfaction ?? 0} / 5`} />
        <StatsCard title="Clics estimés" value={stats?.total_clicks ?? 0} />
        <StatsCard title="Croissance" value={`${stats?.growth_rate ?? 0}%`} />
      </div>
    </div>
  )
}
