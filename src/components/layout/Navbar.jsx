import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-purple-600">EPF Marketplace</Link>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {user.role === 'buyer' && (
                <>
                  <Link to="/products" className="text-sm text-gray-600 hover:text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition">Produits</Link>
                  <Link to="/cart" className="text-sm text-gray-600 hover:text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition">Panier</Link>
                  <Link to="/orders" className="text-sm text-gray-600 hover:text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition">Commandes</Link>
                </>
              )}
              {user.role === 'seller' && (
                <>
                  <Link to="/seller/dashboard" className="text-sm text-gray-600 hover:text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition">Dashboard</Link>
                  <Link to="/seller/products" className="text-sm text-gray-600 hover:text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition">Mes produits</Link>
                  <Link to="/seller/orders" className="text-sm text-gray-600 hover:text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition">Commandes</Link>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/stats" className="text-sm text-gray-600 hover:text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition">Stats</Link>
                  <Link to="/admin/users" className="text-sm text-gray-600 hover:text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition">Utilisateurs</Link>
                  <Link to="/admin/coupons" className="text-sm text-gray-600 hover:text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition">Coupons</Link>
                </>
              )}
              <Link to="/profile" className="flex items-center gap-2 ml-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-600">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition">Connexion</Link>
              <Link to="/register" className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg transition">S'inscrire</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
