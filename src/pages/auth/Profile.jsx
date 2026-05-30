import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm();

  useEffect(() => {
    if (user) reset({ name: user.name, email: user.email, city: user.city || '', bio: user.bio || '' });
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await authService.updateProfile(data);
      updateUser(res.data.user || res.data);
      toast.success('Profil mis à jour !');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour.');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Mon profil</h1>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl font-bold text-purple-600">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{user.name}</p>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            user.role === 'admin' ? 'bg-red-100 text-red-600' :
            user.role === 'seller' ? 'bg-amber-100 text-amber-700' :
            'bg-green-100 text-green-700'
          }`}>
            {user.role === 'admin' ? 'Administrateur' : user.role === 'seller' ? 'Vendeur' : 'Acheteur'}
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              {...register('name', { required: 'Requis' })} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              {...register('email', { required: 'Requis' })} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
          <input type="text" placeholder="Ex: Dakar" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            {...register('city')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea rows={3} placeholder="Quelques mots sur vous..." className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition resize-none"
            {...register('bio')} />
        </div>
        <button type="submit" disabled={isSubmitting || !isDirty}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold px-6 py-2.5 rounded-lg transition">
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
}
