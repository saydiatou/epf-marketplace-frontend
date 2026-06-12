import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { sellerService } from '../../services/seller.service'
import { SellerOrdersTable } from '../../components/seller/SellerOrdersTable'
import { Pagination } from '../../components/ui/Pagination'
import { Spinner } from '../../components/ui/Spinner'
import { getErrorMessage } from '../../utils/errorMessage'

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 })
  const [loading, setLoading] = useState(true)

  async function load(page = 1) {
    setLoading(true)
    try {
      const { data } = await sellerService.getOrders({ page, per_page: 10 })
      setOrders(data.data ?? [])
      setPagination(data.pagination ?? { current_page: 1, last_page: 1 })
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(1)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Commandes vendeur</h1>
        <p className="mt-2 text-slate-600">Suivez et mettez à jour le statut de vos commandes.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <>
          <SellerOrdersTable orders={orders} onUpdated={() => load(pagination.current_page)} />
          <Pagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            onPageChange={load}
          />
        </>
      )}
    </div>
  )
}
