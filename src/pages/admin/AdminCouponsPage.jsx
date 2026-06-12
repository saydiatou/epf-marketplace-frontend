import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { adminService } from '../../services/admin.service'
import { CouponForm } from '../../components/admin/CouponForm'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Pagination } from '../../components/ui/Pagination'
import { Spinner } from '../../components/ui/Spinner'
import { formatDate } from '../../utils/formatDate'
import { getErrorMessage } from '../../utils/errorMessage'

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 })
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function load(page = 1) {
    setLoading(true)
    try {
      const { data } = await adminService.getCoupons({ page, per_page: 10 })
      setCoupons(data.data ?? [])
      setPagination(data.pagination ?? { current_page: 1, last_page: 1 })
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(1)
  }, [])

  async function handleSubmit(values) {
    setSubmitting(true)
    try {
      const payload = {
        ...values,
        usage_limit: values.usage_limit || null,
        min_order_total: values.min_order_total || null,
        starts_at: values.starts_at || null,
        ends_at: values.ends_at || null,
        is_active: Boolean(values.is_active),
      }

      if (editing) {
        await adminService.updateCoupon(editing.id, payload)
        toast.success('Coupon mis à jour')
      } else {
        await adminService.createCoupon(payload)
        toast.success('Coupon créé')
      }

      setModalOpen(false)
      setEditing(null)
      load(pagination.current_page)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer ce coupon ?')) return
    try {
      await adminService.deleteCoupon(id)
      toast.success('Coupon supprimé')
      load(pagination.current_page)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Coupons</h1>
          <p className="mt-2 text-slate-600">Créez et gérez les codes promotionnels.</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
        >
          Nouveau coupon
        </Button>
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
                  <th className="px-4 py-3 text-left">Code</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Valeur</th>
                  <th className="px-4 py-3 text-left">Utilisations</th>
                  <th className="px-4 py-3 text-left">Validité</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium">{coupon.code}</td>
                    <td className="px-4 py-3">{coupon.type}</td>
                    <td className="px-4 py-3">{coupon.value}</td>
                    <td className="px-4 py-3">
                      {coupon.used_count ?? 0}
                      {coupon.usage_limit ? ` / ${coupon.usage_limit}` : ''}
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(coupon.starts_at)} → {formatDate(coupon.ends_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setEditing(coupon)
                            setModalOpen(true)
                          }}
                        >
                          Modifier
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(coupon.id)}>
                          Suppr.
                        </Button>
                      </div>
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

      <Modal
        open={modalOpen}
        title={editing ? 'Modifier le coupon' : 'Nouveau coupon'}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
      >
        <CouponForm initialData={editing} onSubmit={handleSubmit} isSubmitting={submitting} />
      </Modal>
    </div>
  )
}
