import toast from 'react-hot-toast'
import { orderService } from '../../services/order.service'
import { getErrorMessage } from '../../utils/errorMessage'
import { formatPrice } from '../../utils/formatPrice'
import { formatDateTime } from '../../utils/formatDate'
import { OrderStatusBadge } from '../order/OrderStatusBadge'
import { Select } from '../ui/Select'
import { ORDER_STATUS_LABELS, SELLER_ORDER_TRANSITIONS } from '../../constants/orderStatus'

export function SellerOrdersTable({ orders = [], onUpdated }) {
  async function handleStatusChange(orderId, status) {
    try {
      await orderService.updateStatus(orderId, status)
      toast.success('Statut mis à jour')
      onUpdated?.()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="card overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">Commande</th>
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">Montant</th>
            <th className="px-4 py-3">Statut</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-slate-100">
              <td className="px-4 py-3 font-medium">{order.order_number}</td>
              <td className="px-4 py-3">{order.buyer?.name ?? '—'}</td>
              <td className="px-4 py-3">{formatPrice(order.total_amount)}</td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3">{formatDateTime(order.created_at)}</td>
              <td className="px-4 py-3">
                <Select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) handleStatusChange(order.id, e.target.value)
                  }}
                >
                  <option value="">Changer...</option>
                  {SELLER_ORDER_TRANSITIONS.map((status) => (
                    <option key={status} value={status}>
                      {ORDER_STATUS_LABELS[status] ?? status}
                    </option>
                  ))}
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
