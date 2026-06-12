import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { adminService } from '../../services/admin.service'
import { ROLE_LABELS } from '../../constants/roles'
import { formatDate } from '../../utils/formatDate'
import { getErrorMessage } from '../../utils/errorMessage'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Pagination } from '../../components/ui/Pagination'
import { Spinner } from '../../components/ui/Spinner'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 })
  const [roleFilter, setRoleFilter] = useState('')
  const [loading, setLoading] = useState(true)

  async function load(page = 1) {
    setLoading(true)
    try {
      const params = { page, per_page: 15 }
      if (roleFilter) params.role = roleFilter
      const { data } = await adminService.getUsers(params)
      setUsers(data.data ?? [])
      setPagination(data.pagination ?? { current_page: 1, last_page: 1 })
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(1)
  }, [roleFilter])

  async function toggleSuspend(user) {
    try {
      if (user.suspended_at) {
        await adminService.activateUser(user.id)
        toast.success('Utilisateur réactivé')
      } else {
        await adminService.suspendUser(user.id)
        toast.success('Utilisateur suspendu')
      }
      load(pagination.current_page)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Utilisateurs</h1>
        <p className="mt-2 text-slate-600">Gérez les comptes acheteurs, vendeurs et admins.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['', 'buyer', 'seller', 'admin'].map((role) => (
          <Button
            key={role || 'all'}
            variant={roleFilter === role ? 'primary' : 'secondary'}
            onClick={() => setRoleFilter(role)}
          >
            {role ? ROLE_LABELS[role] : 'Tous'}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left">Nom</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Rôle</th>
                  <th className="px-4 py-3 text-left">Inscription</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{ROLE_LABELS[user.role] ?? user.role}</td>
                    <td className="px-4 py-3">{formatDate(user.created_at)}</td>
                    <td className="px-4 py-3">
                      <Badge className={user.suspended_at ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                        {user.suspended_at ? 'Suspendu' : 'Actif'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant={user.suspended_at ? 'primary' : 'danger'} onClick={() => toggleSuspend(user)}>
                        {user.suspended_at ? 'Activer' : 'Suspendre'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            onPageChange={load}
          />
        </>
      )}
    </div>
  )
}
