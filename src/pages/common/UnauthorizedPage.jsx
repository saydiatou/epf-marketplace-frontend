import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { Button } from '../../components/ui/Button'

export default function UnauthorizedPage() {
  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-slate-900">Accès refusé</h1>
      <p className="mt-3 max-w-md text-slate-600">
        Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.
      </p>
      <Link to={ROUTES.HOME} className="mt-6">
        <Button>Retour à l&apos;accueil</Button>
      </Link>
    </div>
  )
}
