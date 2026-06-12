import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage } from '../../utils/errorMessage'
import { ROUTES } from '../../constants/routes'
import { getDashboardHomeRoute } from '../../components/layout/Sidebar'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      city: '',
      role: 'buyer',
    },
  })

  async function onSubmit(values) {
    try {
      const data = await registerUser(values)
      toast.success(data.message || 'Inscription réussie')
      navigate(getDashboardHomeRoute(data.user.role), { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error, 'Inscription impossible'))
    }
  }

  return (
    <div>
      <h2 className="page-title">Inscription</h2>
      <p className="mt-2 text-sm text-slate-600">Créez un compte acheteur ou vendeur.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <Input label="Nom complet" error={errors.name?.message} {...register('name', { required: 'Nom requis' })} />
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email', { required: 'Email requis' })}
        />
        <Input
          label="Mot de passe"
          type="password"
          error={errors.password?.message}
          {...register('password', { required: 'Mot de passe requis', minLength: { value: 6, message: '6 caractères minimum' } })}
        />
        <Input label="Téléphone" {...register('phone')} />
        <Input label="Ville" {...register('city')} />
        <Select label="Type de compte" {...register('role')}>
          <option value="buyer">Acheteur</option>
          <option value="seller">Vendeur</option>
        </Select>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Création...' : 'Créer mon compte'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Déjà inscrit ?{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-brand-700 hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
