import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/layouts/AdminLayout'
import { Button } from '@/components/atoms/button'
import type { NextPageWithLayout } from '@/types/next-page'
import { useTranslations } from 'next-intl'
import { getAdminList } from '@/api/services/admin.service'
import { AdminProfile } from '@/api/types/admin.type'
import { AdminTable } from '@/components/organisms/admins/AdminTable'
import { AdminCreateDialog } from '@/components/organisms/admins/AdminCreateDialog'
import { AdminEditDialog } from '@/components/organisms/admins/AdminEditDialog'
import { AdminDeleteDialog } from '@/components/organisms/admins/AdminDeleteDialog'

const AdminManagement: NextPageWithLayout = () => {
  const t = useTranslations('admin.admins')

  // State for admin list
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  // Edit/Delete modal state
  const [editingAdmin, setEditingAdmin] = useState<AdminProfile | null>(null)
  const [showDelete, setShowDelete] = useState<AdminProfile | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Fetch admins from API
  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getAdminList({
          page: currentPage,
          size: pageSize,
        })
        if (response.success && response.data) {
          setAdmins(response.data.data)
          setTotalPages(response.data.totalPages)
          setTotalItems(response.data.totalElements)
        } else {
          setError(response.message || 'Failed to load admins')
        }
      } catch (err: unknown) {
        const error = err as { message?: string }
        setError(error.message || 'An error occurred while loading admins')
        console.error('Error fetching admins:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAdmins()
  }, [currentPage, pageSize])

  return (
    <div>
      <div className='space-y-6'>
        {/* Header Section */}
        <div className='flex flex-col lg:flex-row items-start lg:items-start justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
              {t('title')}
            </h1>
            <p className='mt-1 text-sm text-gray-600'>{t('subtitle')}</p>
          </div>
        </div>

        {/* Header with Create Button */}
        <div className='flex items-center justify-end'>
          <Button
            className='bg-blue-600 hover:bg-blue-700 text-white'
            onClick={() => setCreateDialogOpen(true)}
          >
            + {t('createNewAdmin')}
          </Button>
        </div>

        {/* DataTable Component */}
        <AdminTable
          admins={admins}
          loading={loading}
          onEdit={setEditingAdmin}
          onDelete={setShowDelete}
          pagination={{
            totalItems,
            itemsPerPage: pageSize,
            currentPage,
            onPageChange: setCurrentPage,
            onPageSizeChange: setPageSize,
          }}
        />

        {/* Modals */}
        <AdminCreateDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={(newAdmin) => setAdmins((prev) => [newAdmin, ...prev])}
        />

        <AdminEditDialog
          admin={editingAdmin}
          open={!!editingAdmin}
          onOpenChange={(open) => !open && setEditingAdmin(null)}
          onSuccess={(updatedAdmin) =>
            setAdmins((prev) =>
              prev.map((a) =>
                a.adminId === updatedAdmin.adminId ? updatedAdmin : a,
              ),
            )
          }
        />

        <AdminDeleteDialog
          admin={showDelete}
          open={!!showDelete}
          onOpenChange={(open) => !open && setShowDelete(null)}
          onSuccess={(adminId) =>
            setAdmins((prev) => prev.filter((a) => a.adminId !== adminId))
          }
        />
      </div>
    </div>
  )
}

AdminManagement.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout activeItem='admin'>{page}</AdminLayout>
}

export default AdminManagement
