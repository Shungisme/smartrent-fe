'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/atoms/button'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { getAdminList } from '@/api/services/admin.service'
import { useDebounce } from '@/hooks/useDebounce'
import { AdminProfile } from '@/api/types/admin.type'
import { AdminTable } from '@/components/organisms/admins/AdminTable'
import { AdminCreateDialog } from '@/components/organisms/admins/AdminCreateDialog'
import { AdminEditDialog } from '@/components/organisms/admins/AdminEditDialog'
import { AdminDeleteDialog } from '@/components/organisms/admins/AdminDeleteDialog'

const AdminManagement = () => {
  const t = useTranslations('admin.admins')

  // State for admin list
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null)

  // Filters/pagination state (controlled by DataTable in API mode)
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({
    page: 1,
    pageSize: 10,
  })
  const debouncedSearchTerm = useDebounce(filterValues.search || '', 500)
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
          page: filterValues.page ? Number(filterValues.page) : 1,
          size: filterValues.pageSize ? Number(filterValues.pageSize) : 10,
          keyword: debouncedSearchTerm
            ? String(debouncedSearchTerm)
            : undefined,
          role: filterValues.role ? String(filterValues.role) : undefined,
          status: filterValues.status ? String(filterValues.status) : undefined,
        })
        if (response.success && response.data) {
          setAdmins(response.data.data)
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
  }, [
    debouncedSearchTerm,
    filterValues.page,
    filterValues.pageSize,
    filterValues.role,
    filterValues.status,
  ])

  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    setFilterValues(newFilters)
  }

  return (
    <div>
      <div className='space-y-6'>
        {/* Header with Create Button */}
        <div className='flex items-center justify-stretch sm:justify-end'>
          <Button
            className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white'
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className='h-4 w-4' />
            {t('createNewAdmin')}
          </Button>
        </div>

        {/* DataTable Component */}
        <AdminTable
          admins={admins}
          totalItems={totalItems}
          loading={loading}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onEdit={setEditingAdmin}
          onDelete={setShowDelete}
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

export default AdminManagement
