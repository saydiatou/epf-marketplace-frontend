import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, RoleRoute } from './components/common/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
import ProductList   from './pages/catalogue/ProductList';
import ProductDetail from './pages/catalogue/ProductDetail';

const Cart            = () => <div className="p-8 text-gray-500">Panier — Ndoumbe</div>;
const Orders          = () => <div className="p-8 text-gray-500">Commandes — Ndoumbe</div>;
const SellerDashboard = () => <div className="p-8 text-gray-500">Dashboard vendeur — Saydiatou</div>;
const SellerProducts  = () => <div className="p-8 text-gray-500">Mes produits — Saydiatou</div>;
const SellerOrders    = () => <div className="p-8 text-gray-500">Commandes reçues — Saydiatou</div>;
const AdminStats      = () => <div className="p-8 text-gray-500">Stats admin — Saydiatou</div>;
const AdminUsers      = () => <div className="p-8 text-gray-500">Utilisateurs — Saydiatou</div>;
const AdminCoupons    = () => <div className="p-8 text-gray-500">Coupons — Saydiatou</div>;
const AdminProducts   = () => <div className="p-8 text-gray-500">Modération produits — Saydiatou</div>;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/seller/dashboard" element={<RoleRoute role="seller"><SellerDashboard /></RoleRoute>} />
          <Route path="/seller/products" element={<RoleRoute role="seller"><SellerProducts /></RoleRoute>} />
          <Route path="/seller/orders" element={<RoleRoute role="seller"><SellerOrders /></RoleRoute>} />
          <Route path="/admin/stats" element={<RoleRoute role="admin"><AdminStats /></RoleRoute>} />
          <Route path="/admin/users" element={<RoleRoute role="admin"><AdminUsers /></RoleRoute>} />
          <Route path="/admin/coupons" element={<RoleRoute role="admin"><AdminCoupons /></RoleRoute>} />
          <Route path="/admin/products" element={<RoleRoute role="admin"><AdminProducts /></RoleRoute>} />
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
              <p className="text-6xl font-bold text-gray-200">404</p>
              <p className="text-gray-500">Page introuvable</p>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
