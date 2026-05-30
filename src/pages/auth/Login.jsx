import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      toast.success(`Bienvenue ${user.name} !`);
      if (user.role === 'seller') navigate('/seller/dashboard');
      else if (user.role === 'admin') navigate('/admin/stats');
      else navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">EPF Marketplace</h1>
          <p className="text-gray-500 mt-2">Connexion à votre compte</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" placeholder="email@exemple.com"
              className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-purple-400 transition`}
              {...register('email', { required: 'L\'email est requis', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' } })} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input type="password" placeholder="••••••••"
              className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-purple-400 transition`}
              {...register('password', { required: 'Le mot de passe est requis' })} />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-2.5 rounded-lg transition mt-2">
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ? <Link to="/register" className="text-purple-600 hover:underline font-medium">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
