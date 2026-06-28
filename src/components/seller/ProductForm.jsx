import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { categoryService } from '../../services/category.service'
import { productService } from '../../services/product.service'
import { getErrorMessage } from '../../utils/errorMessage'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { getImageUrl } from '../../utils/getImageUrl'

const defaultValues = {
  title: '',
  description: '',
  price: '',
  quantity: 1,
  category_id: '',
  status: 'draft',
  sale_price: '',
  sale_starts_at: '',
  sale_ends_at: '',
}

export function ProductForm({ initialData = null, onSuccess }) {
  const [categories, setCategories] = useState([])
  const [mainImage, setMainImage] = useState(null)
  const [gallery, setGallery] = useState([])
  const isEdit = Boolean(initialData?.id)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues })

  useEffect(() => {
    categoryService.getAll().then(({ data }) => setCategories(Array.isArray(data) ? data : data?.data ?? []))
  }, [])

  useEffect(() => {
    if (!initialData) return
    reset({
      title: initialData.title ?? '',
      description: initialData.description ?? '',
      price: initialData.price ?? '',
      quantity: initialData.quantity ?? 1,
      category_id: initialData.category?.id ?? '',
      status: initialData.status ?? 'draft',
      sale_price: initialData.sale_price ?? '',
      sale_starts_at: initialData.sale_starts_at?.slice(0, 16) ?? '',
      sale_ends_at: initialData.sale_ends_at?.slice(0, 16) ?? '',
    })
  }, [initialData, reset])

  const price = watch('price')

    async function onSubmit(values) {
    try {
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('description', values.description)
      formData.append('price', values.price)
      formData.append('quantity', values.quantity)
      formData.append('category_id', values.category_id)
      formData.append('status', values.status)

      if (values.sale_price) {
        formData.append('sale_price', values.sale_price)
        if (values.sale_starts_at) formData.append('sale_starts_at', values.sale_starts_at)
        if (values.sale_ends_at) formData.append('sale_ends_at', values.sale_ends_at)
      }

      if (mainImage) formData.append('image', mainImage)
      else if (!isEdit) {
        toast.error('Image principale requise')
        return
      }

      gallery.forEach((file) => formData.append('images[]', file))

      const response = isEdit
        ? await productService.update(initialData.id, formData)
        : await productService.create(formData)

      toast.success(response.data.message || 'Produit enregistré')
      onSuccess?.(response.data.product)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Input label="Titre" error={errors.title?.message} {...register('title', { required: 'Titre requis' })} />
        <Select
          label="Catégorie"
          error={errors.category_id?.message}
          {...register('category_id', { required: 'Catégorie requise' })}
        >
          <option value="">Choisir...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="label">Description</label>
        <textarea
          className="input min-h-32"
          {...register('description', { required: 'Description requise' })}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Input
          label="Prix (€)"
          type="number"
          step="0.01"
          error={errors.price?.message}
          {...register('price', { required: 'Prix requis', min: { value: 0, message: 'Prix invalide' } })}
        />
        <Input label="Stock" type="number" {...register('quantity', { min: 0 })} />
        <Select label="Statut" {...register('status')}>
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
        </Select>
      </div>

      <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-5">
        <h3 className="font-semibold text-brand-900">Promo flash (optionnel)</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Input
            label="Prix promo"
            type="number"
            step="0.01"
            {...register('sale_price', {
              validate: (value) =>
                !value || Number(value) < Number(price) || 'Doit être inférieur au prix normal',
            })}
            error={errors.sale_price?.message}
          />
          <Input label="Début" type="datetime-local" {...register('sale_starts_at')} />
          <Input label="Fin" type="datetime-local" {...register('sale_ends_at')} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label">Image principale {isEdit ? '(laisser vide pour conserver)' : '*'}</label>
          <input type="file" accept="image/*" onChange={(e) => setMainImage(e.target.files?.[0] ?? null)} />
          {initialData?.image && (
            <img src={getImageUrl(initialData.image)} alt="" className="mt-3 h-28 rounded-xl object-cover" />
          )}
        </div>
        <div>
          <label className="label">Galerie (max 10)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setGallery(Array.from(e.target.files ?? []).slice(0, 10))}
          />
          {initialData?.images?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {initialData.images.map((img) => (
                <img key={img} src={getImageUrl(img)} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ))}
            </div>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer le produit'}
      </Button>
    </form>
  )
}
