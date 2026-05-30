import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <span className="text-gray-400 text-lg">Chargement...</span>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function RoleRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <span className="text-gray-400 text-lg">Chargement...</span>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <span className="text-5xl">🚫</span>
      <p className="text-xl font-semibold text-gray-700">Vous n'avez pas les droits pour accéder à cette page.</p>
    </div>
  );
  return children;
}
