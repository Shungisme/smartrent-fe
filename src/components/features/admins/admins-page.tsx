'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/atoms/button'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { getAdminList } from '@/api/services/admin.service'
import { AdminProfile } from '@/api/types/admin.type'
import { AdminTable } from '@/components/organisms/admins/AdminTable'
import { AdminCreateDialog } from '@/components/organisms/admins/AdminCreateDialog'
import { AdminEditDialog } from '@/components/organisms/admins/AdminEditDialog'
import { AdminDeleteDialog } from '@/components/organisms/admins/AdminDeleteDialog'
import { PageHeader } from '@/components/molecules/pageHeader'

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
    pageSize: 20,
  })
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
        // Build filter array from filterValues
        const filterArray: string[] = []

        if (filterValues.firstName) {
          filterArray.push(`firstName:${filterValues.firstName}`)
        }
        if (filterValues.lastName) {
          filterArray.push(`lastName:${filterValues.lastName}`)
        }
        if (filterValues.email) {
          filterArray.push(`email:${filterValues.email}`)
        }
        if (filterValues.phoneNumber) {
          filterArray.push(`phoneNumber:${filterValues.phoneNumber}`)
        }
        if (filterValues.role) {
          const roleValue = Array.isArray(filterValues.role)
            ? filterValues.role.join(',')
            : filterValues.role
          filterArray.push(`role:${roleValue}`)
        }

        const response = await getAdminList({
          page: filterValues.page ? Number(filterValues.page) : 1,
          size: filterValues.pageSize ? Number(filterValues.pageSize) : 10,
          filter: filterArray.length > 0 ? filterArray : undefined,
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
  }, [filterValues])

  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    setFilterValues({
      ...newFilters,
      page: (newFilters.page as number | undefined) ?? 1,
      pageSize:
        (newFilters.pageSize as number | undefined) ??
        (filterValues.pageSize as number | undefined) ??
        20,
    })
  }

  return (
    <div>
      <div className='space-y-6'>
        <PageHeader
          title={t('title')}
          description={t('subtitle')}
          actions={
            <Button
              className='w-full sm:w-auto'
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className='h-4 w-4' />
              {t('createNewAdmin')}
            </Button>
          }
        />

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
