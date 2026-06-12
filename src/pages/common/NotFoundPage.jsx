import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { Button } from '../../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-slate-900">404</h1>
      <p className="mt-3 text-slate-600">La page demandée est introuvable.</p>
      <Link to={ROUTES.HOME} className="mt-6">
        <Button>Retour à l&apos;accueil</Button>
      </Link>
    </div>
  )
}
