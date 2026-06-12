import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { adminService } from '../../services/admin.service'
import { StatsCard } from '../../components/admin/StatsCard'
import { Spinner } from '../../components/ui/Spinner'
import { getErrorMessage } from '../../utils/errorMessage'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService
      .getStats()
      .then(({ data }) => setStats(data))
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">Administration</h1>
        <p className="mt-2 text-slate-600">Vue d&apos;ensemble de la plateforme EPF Marketplace.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Utilisateurs" value={stats?.users_count ?? 0} />
        <StatsCard title="Produits" value={stats?.products_count ?? 0} />
        <StatsCard title="Commandes" value={stats?.orders_count ?? 0} />
        <StatsCard title="Revenu total" value={Number(stats?.total_revenue ?? 0)} />
      </div>
    </div>
  )
}
