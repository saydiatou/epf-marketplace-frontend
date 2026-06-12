import { Badge } from '../ui/Badge'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../constants/orderStatus'

export function OrderStatusBadge({ status }) {
  return (
    <Badge className={ORDER_STATUS_COLORS[status] ?? 'bg-slate-100 text-slate-700'}>
      {ORDER_STATUS_LABELS[status] ?? status}
    </Badge>
  )
}
