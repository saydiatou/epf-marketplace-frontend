import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import { ProductForm } from '../../components/seller/ProductForm'
import { ROUTES } from '../../constants/routes'
import { Spinner } from '../../components/ui/Spinner'

export default function EditProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProduct() {
      const { data } = await api.get('/products/my-products', { params: { per_page: 100 } })
      const item = (data.data ?? []).find((p) => String(p.id) === String(id))
      if (!item) return null

      if (item.status === 'published') {
        try {
          const { data: detail } = await api.get(`/products/${id}`)
          return detail
        } catch {
          return item
        }
      }

      return item
    }

    loadProduct()
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )
  }

  if (!product) {
    return <p className="text-red-600">Produit introuvable.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Modifier le produit</h1>
        <p className="mt-2 text-slate-600">{product.title}</p>
      </div>
      <ProductForm initialData={product} onSuccess={() => navigate(ROUTES.SELLER.PRODUCTS)} />
    </div>
  )
}
