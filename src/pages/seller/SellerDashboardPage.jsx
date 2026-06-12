import { useEffect, useState } from 'react'
import { sellerService } from '../../services/seller.service'
import { useAuth } from '../../hooks/useAuth'
import { SellerStatsCards, SellerMonthlyChart } from '../../components/seller/SellerStatsCards'
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge'
import { Spinner } from '../../components/ui/Spinner'
import { formatPrice } from '../../utils/formatPrice'
import { formatDateTime } from '../../utils/formatDate'

export default function SellerDashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sellerService
      .getDashboard()
      .then(({ data: payload }) => setData(payload))
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
        <h1 className="page-title">Bienvenue, {user?.name} !</h1>
        <p className="mt-2 text-slate-600">Vue d&apos;ensemble de votre activité vendeur.</p>
      </div>

      <SellerStatsCards data={data} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="card overflow-hidden xl:col-span-2">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="font-semibold text-slate-900">Commandes récentes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left">N°</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recent_orders ?? []).map((order) => (
                  <tr key={order.order_number} className="border-t border-slate-100">
                    <td className="px-4 py-3">{order.order_number}</td>
                    <td className="px-4 py-3">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3">{formatDateTime(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-slate-900">Top produits</h2>
          <ul className="mt-4 space-y-3">
            {(data?.top_products ?? []).map((product) => (
              <li key={product.title} className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-800">{product.title}</span>
                <span className="text-slate-500">{product.sales_count} ventes</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <SellerMonthlyChart monthly={data?.monthly_sales ?? []} />
    </div>
  )
}
