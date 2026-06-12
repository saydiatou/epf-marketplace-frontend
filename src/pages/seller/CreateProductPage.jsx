import { useNavigate } from 'react-router-dom'
import { ProductForm } from '../../components/seller/ProductForm'
import { ROUTES } from '../../constants/routes'

export default function CreateProductPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Nouveau produit</h1>
        <p className="mt-2 text-slate-600">Ajoutez un produit avec image, galerie et promo flash.</p>
      </div>
      <ProductForm onSuccess={() => navigate(ROUTES.SELLER.PRODUCTS)} />
    </div>
  )
}
