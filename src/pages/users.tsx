import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/layouts/AdminLayout'
import { Button } from '@/components/atoms/button'
import type { NextPageWithLayout } from '@/types/next-page'
import { useTranslations } from 'next-intl'
import { getUserList } from '@/api/services/user.service'
import { UserProfile } from '@/api/types/user.type'
import { UserTable } from '@/components/organisms/users/UserTable'
import { UserCreateDialog } from '@/components/organisms/users/UserCreateDialog'
import { UserEditDialog } from '@/components/organisms/users/UserEditDialog'
import { UserDeleteDialog } from '@/components/organisms/users/UserDeleteDialog'

const UserManagement: NextPageWithLayout = () => {
  // Modal states
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [showDelete, setShowDelete] = useState<UserProfile | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const t = useTranslations('admin.users')

  // State for API data
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getUserList(currentPage, pageSize)
        if (response.success && response.data) {
          setUsers(response.data.data)
          setTotalPages(response.data.totalPages)
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
    }

    fetchUsers()
  }, [currentPage, pageSize])

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
        {/* Header Section */}
        <div className='flex flex-col lg:flex-row items-start lg:items-start justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
              {t('title')}
            </h1>
            <p className='mt-1 text-sm text-gray-600'>
              {t('breadcrumb.dashboard')}
            </p>
          </div>
        </div>

        <div className='flex justify-end'>
          <Button
            className='bg-blue-600 hover:bg-blue-700 text-white'
            onClick={() => setShowCreate(true)}
          >
            + {t('create.button') || 'Create User'}
          </Button>
        </div>

        {/* User Table Component */}
        <UserTable
          users={users}
          loading={loading}
          onEdit={setEditingUser}
          onDelete={setShowDelete}
          pagination={{
            totalItems,
            itemsPerPage: pageSize,
            currentPage,
            onPageChange: setCurrentPage,
            onPageSizeChange: setPageSize,
          }}
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

UserManagement.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout activeItem='users'>{page}</AdminLayout>
}

export default UserManagement
