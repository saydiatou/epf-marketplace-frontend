import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const user = await registerUser(data);
      toast.success('Compte créé avec succès !');
      if (user.role === 'seller') navigate('/seller/dashboard');
      else if (user.role === 'admin') navigate('/admin/stats');
      else navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">EPF Marketplace</h1>
          <p className="text-gray-500 mt-2">Créer un compte</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input type="text" placeholder="Saydiatou Fall"
              className={`w-full px-4 py-2.5 rounded-lg border ${errors.name ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-purple-400 transition`}
              {...register('name', { required: 'Le nom est requis', minLength: { value: 2, message: 'Minimum 2 caractères' } })} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" placeholder="email@exemple.com"
              className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-purple-400 transition`}
              {...register('email', { required: 'L\'email est requis', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' } })} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Je suis</label>
            <select className={`w-full px-4 py-2.5 rounded-lg border ${errors.role ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-purple-400 transition bg-white`}
              {...register('role', { required: 'Veuillez choisir un rôle' })}>
              <option value="">-- Choisir un rôle --</option>
              <option value="buyer">Acheteur</option>
              <option value="seller">Vendeur</option>
            </select>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input type="password" placeholder="••••••••"
              className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-purple-400 transition`}
              {...register('password', { required: 'Requis', minLength: { value: 8, message: 'Minimum 8 caractères' } })} />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
            <input type="password" placeholder="••••••••"
              className={`w-full px-4 py-2.5 rounded-lg border ${errors.password_confirmation ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-purple-400 transition`}
              {...register('password_confirmation', { required: 'Requis', validate: (val) => val === password || 'Les mots de passe ne correspondent pas' })} />
            {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-2.5 rounded-lg transition mt-2">
            {isSubmitting ? 'Inscription en cours...' : 'Créer mon compte'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ? <Link to="/login" className="text-purple-600 hover:underline font-medium">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
