import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES } from './constants/routes'
import { ROLES } from './constants/roles'
import { ProtectedRoute } from './components/guards/ProtectedRoute'
import { RoleRoute } from './components/guards/RoleRoute'
import { AuthLayout } from './components/layout/AuthLayout'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { Spinner } from './components/ui/Spinner'

// ─── TON BLOC (Auth + Seller + Admin) ───
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'
import UnauthorizedPage from './pages/common/UnauthorizedPage'
import NotFoundPage from './pages/common/NotFoundPage'
import SellerDashboardPage from './pages/seller/SellerDashboardPage'
import MyProductsPage from './pages/seller/MyProductsPage'
import CreateProductPage from './pages/seller/CreateProductPage'
import EditProductPage from './pages/seller/EditProductPage'
import SellerOrdersPage from './pages/seller/SellerOrdersPage'
import SellerStatisticsPage from './pages/seller/SellerStatisticsPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminCouponsPage from './pages/admin/AdminCouponsPage'

// ─── BLOC BINÔME (lazy — à implémenter par ton binôme) ───
const HomePage = lazy(() => import('./pages/public/HomePage'))
const ProductsPage = lazy(() => import('./pages/public/ProductsPage'))
const ProductDetailPage = lazy(() => import('./pages/public/ProductDetailPage'))
const SellerProfilePage = lazy(() => import('./pages/public/SellerProfilePage'))
const CartPage = lazy(() => import('./pages/buyer/CartPage'))
const CheckoutPage = lazy(() => import('./pages/buyer/CheckoutPage'))
const MyOrdersPage = lazy(() => import('./pages/buyer/MyOrdersPage'))
const OrderDetailPage = lazy(() => import('./pages/buyer/OrderDetailPage'))
const FavoritesPage = lazy(() => import('./pages/buyer/FavoritesPage'))
const MessagesPage = lazy(() => import('./pages/buyer/MessagesPage'))
const ProfilePage = lazy(() => import('./pages/buyer/ProfilePage'))

function Lazy({ children }) {
  return <Suspense fallback={<div className="flex justify-center py-20"><Spinner /></div>}>{children}</Suspense>
}

export const router = createBrowserRouter([
  // Public catalogue (binôme)
  {
    path: ROUTES.HOME,
    element: <Lazy><HomePage /></Lazy>,
  },
  {
    path: ROUTES.PRODUCTS,
    element: <Lazy><ProductsPage /></Lazy>,
  },
  {
    path: ROUTES.PRODUCT_DETAIL(':id'),
    element: <Lazy><ProductDetailPage /></Lazy>,
  },
  {
    path: ROUTES.SELLER_PROFILE(':id'),
    element: <Lazy><SellerProfilePage /></Lazy>,
  },

  // Auth
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.REGISTER, element: <RegisterPage /> },
    ],
  },

  // Buyer (binôme) — routes protégées
  {
    element: <ProtectedRoute />,
    children: [
      { path: ROUTES.CART, element: <Lazy><CartPage /></Lazy> },
      { path: ROUTES.CHECKOUT, element: <Lazy><CheckoutPage /></Lazy> },
      { path: ROUTES.ORDERS, element: <Lazy><MyOrdersPage /></Lazy> },
      { path: ROUTES.ORDER_DETAIL(':id'), element: <Lazy><OrderDetailPage /></Lazy> },
      { path: ROUTES.FAVORITES, element: <Lazy><FavoritesPage /></Lazy> },
      { path: ROUTES.MESSAGES, element: <Lazy><MessagesPage /></Lazy> },
      { path: ROUTES.PROFILE, element: <Lazy><ProfilePage /></Lazy> },
    ],
  },

  // Seller
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute roles={[ROLES.SELLER, ROLES.ADMIN]} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: ROUTES.SELLER.DASHBOARD, element: <SellerDashboardPage /> },
              { path: ROUTES.SELLER.PRODUCTS, element: <MyProductsPage /> },
              { path: ROUTES.SELLER.CREATE_PRODUCT, element: <CreateProductPage /> },
              { path: ROUTES.SELLER.EDIT_PRODUCT(':id'), element: <EditProductPage /> },
              { path: ROUTES.SELLER.ORDERS, element: <SellerOrdersPage /> },
              { path: ROUTES.SELLER.STATISTICS, element: <SellerStatisticsPage /> },
            ],
          },
        ],
      },
    ],
  },

  // Admin
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute roles={[ROLES.ADMIN]} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: ROUTES.ADMIN.DASHBOARD, element: <AdminDashboardPage /> },
              { path: ROUTES.ADMIN.USERS, element: <AdminUsersPage /> },
              { path: ROUTES.ADMIN.PRODUCTS, element: <AdminProductsPage /> },
              { path: ROUTES.ADMIN.COUPONS, element: <AdminCouponsPage /> },
            ],
          },
        ],
      },
    ],
  },

  { path: ROUTES.UNAUTHORIZED, element: <UnauthorizedPage /> },
  { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
  { path: '*', element: <Navigate to={ROUTES.NOT_FOUND} replace /> },
])
