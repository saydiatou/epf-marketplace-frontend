import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { ROUTES } from '../../constants/routes'

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-app flex h-16 items-center justify-between">
          <Link to={ROUTES.HOME} className="text-lg font-bold text-brand-900">
            EPF MARKETPLACE
          </Link>
          <Link to={ROUTES.PRODUCTS} className="text-sm text-brand-700 hover:underline">
            Retour au catalogue
          </Link>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
