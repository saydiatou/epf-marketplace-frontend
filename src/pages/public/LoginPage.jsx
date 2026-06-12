import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage } from '../../utils/errorMessage'
import { ROUTES } from '../../constants/routes'
import { getDashboardHomeRoute } from '../../components/layout/Sidebar'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values) {
    try {
      const data = await login(values)
      toast.success(data.message || 'Connexion réussie')
      const redirect = from || getDashboardHomeRoute(data.user.role)
      navigate(redirect, { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error, 'Connexion impossible'))
    }
  }

  return (
    <div>
      <h2 className="page-title">Connexion</h2>
      <p className="mt-2 text-sm text-slate-600">Accédez à votre espace acheteur, vendeur ou admin.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
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
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Pas encore de compte ?{' '}
        <Link to={ROUTES.REGISTER} className="font-medium text-brand-700 hover:underline">
          S&apos;inscrire
        </Link>
      </p>
    </div>
  )
}
