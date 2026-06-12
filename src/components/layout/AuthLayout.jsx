import { Link, Outlet } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500">
      <div className="container-app flex min-h-screen items-center justify-center py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-soft lg:grid-cols-2">
          <div className="hidden bg-brand-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-brand-100">EPF Marketplace</p>
              <h1 className="mt-4 text-3xl font-bold leading-tight">
                Trusted Products.
                <br />
                Stronger Workforce.
              </h1>
            </div>
            <p className="text-sm text-brand-100">
              Connectez-vous pour gérer vos produits, commandes et votre espace vendeur ou admin.
            </p>
          </div>
          <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <Link to={ROUTES.HOME} className="text-lg font-bold text-brand-900">
                EPF MARKETPLACE
              </Link>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
