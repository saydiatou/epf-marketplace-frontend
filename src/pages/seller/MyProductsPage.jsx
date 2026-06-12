import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { productService } from '../../services/product.service'
import { ROUTES } from '../../constants/routes'
import { PRODUCT_STATUS_COLORS, PRODUCT_STATUS_LABELS } from '../../constants/productStatus'
import { getErrorMessage } from '../../utils/errorMessage'
import { formatPrice } from '../../utils/formatPrice'
import { getImageUrl } from '../../utils/getImageUrl'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Pagination } from '../../components/ui/Pagination'
import { Spinner } from '../../components/ui/Spinner'
import { EmptyState } from '../../components/ui/EmptyState'

export default function MyProductsPage() {
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 })
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)

  async function load(page = 1) {
    setLoading(true)
    try {
      const params = { page, per_page: 12 }
      if (statusFilter) params.status = statusFilter
      const { data } = await productService.getMyProducts(params)
      setProducts(data.data ?? [])
      setPagination(data.pagination ?? { current_page: 1, last_page: 1 })
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(1)
  }, [statusFilter])

  async function handleDelete(id) {
    if (!window.confirm('Supprimer ce produit ?')) return
    try {
      await productService.remove(id)
      toast.success('Produit supprimé')
      load(pagination.current_page)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Mes produits</h1>
          <p className="mt-2 text-slate-600">Gérez votre catalogue vendeur.</p>
        </div>
        <Link to={ROUTES.SELLER.CREATE_PRODUCT}>
          <Button>Nouveau produit</Button>
        </Link>
      </div>

      <div className="flex gap-2">
        {['', 'draft', 'published', 'sold'].map((status) => (
          <Button
            key={status || 'all'}
            variant={statusFilter === status ? 'primary' : 'secondary'}
            onClick={() => setStatusFilter(status)}
          >
            {status ? PRODUCT_STATUS_LABELS[status] : 'Tous'}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="Aucun produit"
          description="Commencez par créer votre premier produit."
          action={
            <Link to={ROUTES.SELLER.CREATE_PRODUCT}>
              <Button>Créer un produit</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="card overflow-hidden">
                <img src={getImageUrl(product.image)} alt={product.title} className="h-44 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900">{product.title}</h3>
                    <Badge className={PRODUCT_STATUS_COLORS[product.status]}>
                      {PRODUCT_STATUS_LABELS[product.status]}
                    </Badge>
                  </div>
                  <p className="mt-2 text-brand-700">{formatPrice(product.price)}</p>
                  <p className="mt-1 text-sm text-slate-500">Stock: {product.quantity} · Vues: {product.views}</p>
                  <div className="mt-4 flex gap-2">
                    <Link to={ROUTES.SELLER.EDIT_PRODUCT(product.id)} className="flex-1">
                      <Button variant="secondary" className="w-full">
                        Modifier
                      </Button>
                    </Link>
                    <Button variant="danger" onClick={() => handleDelete(product.id)}>
                      Suppr.
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
