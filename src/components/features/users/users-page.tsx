'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/atoms/button'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { getUserList } from '@/api/services/user.service'
import { BrokerService } from '@/api/services/broker.service'
import { useDebounce } from '@/hooks/useDebounce'
import { UserProfile } from '@/api/types/user.type'
import { UserTable } from '@/components/organisms/users/UserTable'
import { UserCreateDialog } from '@/components/organisms/users/UserCreateDialog'
import { UserEditDialog } from '@/components/organisms/users/UserEditDialog'
import { UserDeleteDialog } from '@/components/organisms/users/UserDeleteDialog'

const UserManagement = () => {
  // Modal states
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [showDelete, setShowDelete] = useState<UserProfile | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const t = useTranslations('admin.users')

  // State for API data
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters/pagination state (controlled by DataTable in API mode)
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({
    page: 1,
    pageSize: 10,
  })
  const debouncedSearchTerm = useDebounce(filterValues.search || '', 500)
  const [totalItems, setTotalItems] = useState(0)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const selectedType =
        typeof filterValues.type === 'string' ? filterValues.type : undefined

      const response = await getUserList({
        page: filterValues.page ? Number(filterValues.page) : 1,
        size: filterValues.pageSize ? Number(filterValues.pageSize) : 10,
        keyword: debouncedSearchTerm ? String(debouncedSearchTerm) : undefined,
        isBroker:
          selectedType === 'broker'
            ? true
            : selectedType === 'normal_user'
              ? false
              : undefined,
        status: filterValues.status ? String(filterValues.status) : undefined,
      })
      if (response.success && response.data) {
        setUsers(response.data.data)
        setTotalItems(response.data.totalElements)
      } else {
        setError(response.message || 'Failed to load users')
      }
    } catch (err: unknown) {
      const error = err as { message?: string }
      setError(error.message || 'An error occurred while loading users')
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }, [
    debouncedSearchTerm,
    filterValues.page,
    filterValues.pageSize,
    filterValues.type,
    filterValues.status,
  ])

  // Fetch users from API
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    setFilterValues(newFilters)
  }

  const handleRemoveBroker = async (user: UserProfile) => {
    const displayName =
      `${user.firstName} ${user.lastName}`.trim() || user.userId
    const confirmed = window.confirm(
      t('table.actions.removeBrokerConfirm', { name: displayName }),
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await BrokerService.removeBroker(user.userId)

      if (response.success) {
        toast.success(t('table.actions.removeBrokerSuccess'))
        await fetchUsers()
      } else {
        toast.error(response.message || t('table.actions.removeBrokerError'))
      }
    } catch (err) {
      console.error('Error removing broker role:', err)
      toast.error(t('table.actions.removeBrokerError'))
    }
  }

  // Show error state
  if (error) {
    return (
      <div>
        <div className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <p className='text-red-600 mb-4'>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className='space-y-6'>
        <div className='flex justify-stretch sm:justify-end'>
          <Button
            className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white'
            onClick={() => setShowCreate(true)}
          >
            <Plus className='h-4 w-4' />
            {t('create.button') || 'Create User'}
          </Button>
        </div>

        {/* User Table Component */}
        <UserTable
          users={users}
          totalItems={totalItems}
          loading={loading}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onEdit={setEditingUser}
          onDelete={setShowDelete}
          onRemoveBroker={handleRemoveBroker}
        />
      </div>

      {/* Create User Modal */}
      <UserCreateDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onSuccess={(newUser) => setUsers((prev) => [newUser, ...prev])}
      />

      {/* Edit User Modal */}
      <UserEditDialog
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        onSuccess={(updatedUser) =>
          setUsers((prev) =>
            prev.map((u) =>
              u.userId === updatedUser.userId ? updatedUser : u,
            ),
          )
        }
      />

      {/* Delete User Modal */}
      <UserDeleteDialog
        user={showDelete}
        open={!!showDelete}
        onOpenChange={(open) => !open && setShowDelete(null)}
        onSuccess={(userId) =>
          setUsers((prev) => prev.filter((u) => u.userId !== userId))
        }
      />
    </div>
  )
}

export default UserManagement
