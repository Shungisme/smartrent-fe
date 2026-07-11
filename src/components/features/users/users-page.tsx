'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/atoms/button'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { getUserList } from '@/api/services/user.service'
import { BrokerService } from '@/api/services/broker.service'
import { UserProfile } from '@/api/types/user.type'
import { UserTable } from '@/components/organisms/users/UserTable'
import { UserCreateDialog } from '@/components/organisms/users/UserCreateDialog'
import { UserEditDialog } from '@/components/organisms/users/UserEditDialog'
import { UserDeleteDialog } from '@/components/organisms/users/UserDeleteDialog'
import { UserClearMembershipDialog } from '@/components/organisms/users/UserClearMembershipDialog'
import { ConfirmDialog } from '@/components/molecules/confirmDialog'

const UserManagement = () => {
  // Modal states
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [showDelete, setShowDelete] = useState<UserProfile | null>(null)
  const [showClearMembership, setShowClearMembership] =
    useState<UserProfile | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [removeBrokerUser, setRemoveBrokerUser] = useState<UserProfile | null>(
    null,
  )
  const [removingBroker, setRemovingBroker] = useState(false)
  const t = useTranslations('admin.users')
  const tCommon = useTranslations('common')

  // State for API data
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters/pagination state (controlled by DataTable in API mode)
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({
    page: 1,
    pageSize: 20,
  })
  const [totalItems, setTotalItems] = useState(0)

  const fetchUsers = useCallback(async () => {
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
      if (filterValues.isBroker) {
        filterArray.push(`isBroker:${filterValues.isBroker}`)
      }

      const response = await getUserList({
        page: filterValues.page ? Number(filterValues.page) : 1,
        size: filterValues.pageSize ? Number(filterValues.pageSize) : 10,
        filter: filterArray.length > 0 ? filterArray : undefined,
      })
      if (response.success && response.data) {
        setUsers(response.data.data)
        setTotalItems(response.data.totalElements)
      } else {
        setError(response.message || t('table.loadError'))
      }
    } catch (err: unknown) {
      const error = err as { message?: string }
      setError(error.message || 'An error occurred while loading users')
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }, [filterValues])

  // Fetch users from API
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    setFilterValues((prev) => ({
      ...newFilters,
      // DataTable resets page to 1 inside setFilter when filters change; for
      // page-only updates (pagination clicks) the new page comes through here.
      page: (newFilters.page as number | undefined) ?? 1,
      pageSize:
        (newFilters.pageSize as number | undefined) ?? prev.pageSize ?? 20,
    }))
  }

  const removeBrokerName = removeBrokerUser
    ? `${removeBrokerUser.firstName} ${removeBrokerUser.lastName}`.trim() ||
      removeBrokerUser.userId
    : ''

  const confirmRemoveBroker = async () => {
    if (!removeBrokerUser) return
    setRemovingBroker(true)
    try {
      const response = await BrokerService.removeBroker(removeBrokerUser.userId)

      if (response.success) {
        toast.success(t('table.actions.removeBrokerSuccess'))
        setRemoveBrokerUser(null)
        await fetchUsers()
      } else {
        toast.error(response.message || t('table.actions.removeBrokerError'))
      }
    } catch (err) {
      console.error('Error removing broker role:', err)
      toast.error(t('table.actions.removeBrokerError'))
    } finally {
      setRemovingBroker(false)
    }
  }

  // Show error state
  if (error) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='max-w-sm space-y-3 rounded-xl border border-destructive/25 bg-destructive/6 p-6 text-center'>
          <p className='text-sm text-destructive'>{error}</p>
          <Button
            variant='outline'
            size='sm'
            onClick={() => window.location.reload()}
          >
            {tCommon('retry')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className='space-y-6'>
        {/* User Table Component */}
        <UserTable
          users={users}
          totalItems={totalItems}
          loading={loading}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onEdit={setEditingUser}
          onDelete={setShowDelete}
          onRemoveBroker={(user) => setRemoveBrokerUser(user)}
          onClearMembership={setShowClearMembership}
          toolbarActions={
            <Button size='sm' onClick={() => setShowCreate(true)}>
              <Plus className='h-4 w-4' />
              {t('create.button')}
            </Button>
          }
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

      {/* Clear Membership Modal */}
      <UserClearMembershipDialog
        user={showClearMembership}
        open={!!showClearMembership}
        onOpenChange={(open) => !open && setShowClearMembership(null)}
        onSuccess={() => {
          toast.success(t('clearMembership.success'))
          setShowClearMembership(null)
        }}
      />

      {/* Remove Broker Confirmation */}
      <ConfirmDialog
        open={!!removeBrokerUser}
        onOpenChange={(open) => !open && setRemoveBrokerUser(null)}
        title={t('table.actions.removeBroker')}
        description={t('table.actions.removeBrokerConfirm', {
          name: removeBrokerName,
        })}
        confirmLabel={t('table.actions.removeBroker')}
        cancelLabel={tCommon('cancel')}
        onConfirm={confirmRemoveBroker}
        loading={removingBroker}
        destructive
      />
    </div>
  )
}

export default UserManagement
