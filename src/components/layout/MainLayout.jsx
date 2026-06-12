import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { Button } from '../ui/Button'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-app flex h-16 items-center justify-between">
          <Link to={ROUTES.HOME} className="text-lg font-bold text-brand-900">
            EPF MARKETPLACE
          </Link>
          <div className="flex gap-2">
            <Link to={ROUTES.LOGIN}>
              <Button variant="secondary">Connexion</Button>
            </Link>
            <Link to={ROUTES.REGISTER}>
              <Button>Inscription</Button>
            </Link>
          </div>
        </div>
      </header>
      <main>
        {/* Outlet injecté par le router parent */}
      </main>
    </div>
  )
}
