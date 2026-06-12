import { useForm } from 'react-hook-form'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'

export function CouponForm({ initialData = null, onSubmit, isSubmitting }) {
  const isEdit = Boolean(initialData?.id)

  const { register, handleSubmit } = useForm({
    defaultValues: initialData ?? {
      code: '',
      type: 'percent',
      value: '',
      usage_limit: '',
      min_order_total: '',
      starts_at: '',
      ends_at: '',
      is_active: true,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Code" {...register('code', { required: true })} />
      <div className="grid gap-4 md:grid-cols-2">
        <Select label="Type" {...register('type')}>
          <option value="percent">Pourcentage</option>
          <option value="fixed">Montant fixe</option>
        </Select>
        <Input label="Valeur" type="number" step="0.01" {...register('value', { required: true })} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Limite d'utilisation" type="number" {...register('usage_limit')} />
        <Input label="Montant minimum commande" type="number" step="0.01" {...register('min_order_total')} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Début" type="datetime-local" {...register('starts_at')} />
        <Input label="Fin" type="datetime-local" {...register('ends_at')} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register('is_active')} />
        Coupon actif
      </label>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer le coupon'}
      </Button>
    </form>
  )
}
