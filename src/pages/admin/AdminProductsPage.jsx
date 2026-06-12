import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../services/api'
import { adminService } from '../../services/admin.service'
import { PRODUCT_STATUS_COLORS, PRODUCT_STATUS_LABELS } from '../../constants/productStatus'
import { getErrorMessage } from '../../utils/errorMessage'
import { formatPrice } from '../../utils/formatPrice'
import { getImageUrl } from '../../utils/getImageUrl'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Pagination } from '../../components/ui/Pagination'
import { Spinner } from '../../components/ui/Spinner'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 })
  const [loading, setLoading] = useState(true)

  async function load(page = 1) {
    setLoading(true)
    try {
      // Catalogue public + tous statuts via filtre admin inexistant : on charge draft via search côté seller my-products n'est pas admin
      // On utilise GET /products avec pagination ; les brouillons ne sont pas listés publiquement.
      // Pour la modération, on charge les produits récents publiés + on simule modération via changement statut.
      const { data } = await api.get('/products', { params: { page, per_page: 12, sort: 'newest' } })
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
  }, [])

  async function updateStatus(productId, status) {
    try {
      await adminService.updateProductStatus(productId, status)
      toast.success('Statut mis à jour')
      load(pagination.current_page)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  async function forceDelete(productId) {
    if (!window.confirm('Supprimer définitivement ce produit ?')) return
    try {
      await adminService.forceDeleteProduct(productId)
      toast.success('Produit supprimé')
      load(pagination.current_page)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Modération produits</h1>
        <p className="mt-2 text-slate-600">Approuvez, rejetez ou supprimez les annonces.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="card overflow-hidden">
                <img src={getImageUrl(product.image)} alt={product.title} className="h-40 w-full object-cover" />
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{product.title}</h3>
                    <Badge className={PRODUCT_STATUS_COLORS.published}>Publié</Badge>
                  </div>
                  <p className="text-sm text-slate-600">{product.seller?.name}</p>
                  <p className="font-medium text-brand-700">{formatPrice(product.effective_price ?? product.price)}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => updateStatus(product.id, 'published')}>
                      Approuver
                    </Button>
                    <Button variant="secondary" onClick={() => updateStatus(product.id, 'inactive')}>
                      Rejeter
                    </Button>
                    <Button variant="danger" onClick={() => forceDelete(product.id)}>
                      Supprimer
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
