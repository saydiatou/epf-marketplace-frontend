import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { authService } from '../../services/auth.service'
import { useAuth } from '../../hooks/useAuth'
import { BuyerTabs } from '../../components/layout/BuyerTabs'
import { Spinner } from '../../components/ui/Spinner'
import { ROLE_LABELS } from '../../constants/roles'
import { getErrorMessage } from '../../utils/errorMessage'

export default function ProfilePage() {
  const { user, fetchMe } = useAuth()
  const [loading, setLoading] = useState(true)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '', bio: '', phone: '', city: '' },
  })

  useEffect(() => {
    authService.me()
      .then(({ data }) => {
        const profile = data.user
        reset({
          name: profile.name || '',
          bio: profile.bio || '',
          phone: profile.phone || '',
          city: profile.city || '',
        })
        setAvatarPreview(profile.profile_image || null)
      })
      .catch(() => toast.error('Impossible de charger le profil'))
      .finally(() => setLoading(false))
  }, [reset])

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function onSubmit(values) {
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('bio', values.bio || '')
      formData.append('phone', values.phone || '')
      formData.append('city', values.city || '')
      if (avatarFile) formData.append('profile_image', avatarFile)

      const { data } = await authService.updateProfile(formData)
      await fetchMe()
      setAvatarFile(null)
      if (data.user?.profile_image) setAvatarPreview(data.user.profile_image)
      toast.success(data.message || 'Profil mis à jour')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erreur lors de la mise à jour'))
    }
  }

  if (loading) {
    return (
      <div style={{ background: '#f7f8fa', minHeight: '100vh' }}>
        <BuyerTabs />
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner /></div>
      </div>
    )
  }

  return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh' }}>
      <BuyerTabs />
      <div style={{ padding: '24px 16px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 20 }}>👤 Mon profil</h1>

          <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid #e2e8f0', padding: 28 }}>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, paddingBottom: 24, borderBottom: '0.5px solid #e2e8f0' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', background: '#f0b429', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {avatarPreview
                  ? <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e' }}>{(user?.name || 'U')[0].toUpperCase()}</span>
                }
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{user?.name}</p>
                <p style={{ fontSize: 12, color: '#718096', marginBottom: 8 }}>{user?.email}</p>
                <p style={{ fontSize: 11, color: '#a0aec0', marginBottom: 10 }}>
                  Rôle : {ROLE_LABELS[user?.role] || user?.role}
                </p>
                <label style={{ fontSize: 12, color: '#1a1a2e', fontWeight: 600, cursor: 'pointer', background: '#f7f8fa', border: '0.5px solid #e2e8f0', borderRadius: 8, padding: '6px 14px', display: 'inline-block' }}>
                  Changer la photo
                  <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: 6 }}>Nom complet</label>
                <input
                  {...register('name', { required: 'Nom requis' })}
                  style={{ width: '100%', border: `0.5px solid ${errors.name ? '#e53e3e' : '#e2e8f0'}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
                {errors.name && <p style={{ fontSize: 11, color: '#e53e3e', marginTop: 4 }}>{errors.name.message}</p>}
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: 6 }}>Bio</label>
                <textarea
                  {...register('bio')}
                  rows={3}
                  placeholder="Parlez de vous..."
                  style={{ width: '100%', border: '0.5px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: 6 }}>Téléphone</label>
                  <input
                    {...register('phone')}
                    placeholder="+221 77 000 00 00"
                    style={{ width: '100%', border: '0.5px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: 6 }}>Ville</label>
                  <input
                    {...register('city')}
                    placeholder="Dakar"
                    style={{ width: '100%', border: '0.5px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: 6 }}>Email</label>
                <input
                  value={user?.email || ''}
                  disabled
                  style={{ width: '100%', border: '0.5px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', fontSize: 13, background: '#f7f8fa', color: '#a0aec0', boxSizing: 'border-box' }}
                />
                <p style={{ fontSize: 10, color: '#a0aec0', marginTop: 4 }}>L&apos;email ne peut pas être modifié.</p>
              </div>

              <button type="submit" disabled={isSubmitting}
                style={{ background: '#f0b429', color: '#1a1a2e', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8, opacity: isSubmitting ? 0.6 : 1 }}>
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
