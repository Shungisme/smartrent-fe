import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import AdminLayout from '@/components/layouts/AdminLayout'
import {
  DataTable,
  Column,
  FilterConfig,
} from '@/components/organisms/DataTable'
import { Avatar } from '@/components/atoms/avatar'
import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { cn } from '@/lib/utils'
import type { NextPageWithLayout } from '@/types/next-page'
import { useTranslations } from 'next-intl'
import {
  getUserList,
  updateUser,
  deleteUser,
  createUser,
} from '@/api/services/user.service'
import {
  UserProfile,
  UserUpdateRequest,
  CreateUserRequest,
} from '@/api/types/user.type'

type UserData = {
  id: string
  name: string
  avatar?: string
  type: 'landlord' | 'tenant'
  joinDate: string
  lastOnline: string
  posts: number | null
  status: 'normal' | 'banned'
}

const UserManagement: NextPageWithLayout = () => {
  // Edit/Delete modal state
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [editForm, setEditForm] = useState<Partial<UserUpdateRequest>>({})
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [showDelete, setShowDelete] = useState<UserProfile | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const t = useTranslations('admin.users')

  // Create user modal state
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState<
    Partial<CreateUserRequest & { password: string }>
  >({})
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // State for API data
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentPage, setCurrentPage] = useState(0)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalPages, setTotalPages] = useState(0)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageSize, setPageSize] = useState(10)

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        // API uses 1-indexed pages, frontend uses 0-indexed
        const response = await getUserList(currentPage + 1, pageSize)
        if (response.success && response.data) {
          setUsers(response.data.data)
          setTotalPages(response.data.totalPages)
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

  // Transform API data to match UI format
  const transformedUsers: UserData[] = users.map((user) => ({
    id: user.userId,
    name: `${user.firstName} ${user.lastName}`,
    avatar: undefined, // API doesn't return avatar yet
    type: 'tenant', // API doesn't specify type yet, default to tenant
    joinDate: new Date(user.userId).toLocaleDateString('vi-VN'), // Temporary until API provides join date
    lastOnline: new Date().toLocaleDateString('vi-VN'), // Temporary until API provides last online
    posts: null, // API doesn't return posts count yet
    status: 'normal', // API doesn't return status yet, default to normal
  }))

  // Define columns for DataTable
  const columns: Column<UserData>[] = [
    {
      id: 'id',
      header: t('table.headers.userId'),
      accessor: 'id',
      render: (value) => (
        <div className='text-sm font-medium text-gray-900'>
          {value as React.ReactNode}
        </div>
      ),
    },
    {
      id: 'user',
      header: t('table.headers.user'),
      accessor: (row) => row.name,
      sortable: true,
      render: (_, row) => (
        <div className='flex items-center gap-3'>
          <Avatar className='w-10 h-10'>
            <Image
              src={row.avatar || '/images/default-image.jpg'}
              alt={row.name}
              width={40}
              height={40}
              className='w-full h-full object-cover'
            />
          </Avatar>
          <span className='font-medium text-gray-900'>{row.name}</span>
        </div>
      ),
    },
    {
      id: 'type',
      header: t('table.headers.type'),
      accessor: 'type',
      render: (value) => (
        <Badge
          variant={(value as string) === 'landlord' ? 'default' : 'secondary'}
          className={cn(
            'px-3 py-1',
            (value as string) === 'landlord'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800',
          )}
        >
          {t(`table.userTypes.${value as string}`)}
        </Badge>
      ),
    },
    {
      id: 'joinDate',
      header: t('table.headers.joinDate'),
      accessor: 'joinDate',
      sortable: true,
      render: (value) => (
        <div className='text-sm text-gray-900'>{value as React.ReactNode}</div>
      ),
    },
    {
      id: 'lastOnline',
      header: t('table.headers.lastOnline'),
      accessor: 'lastOnline',
      sortable: true,
      render: (value) => (
        <div className='text-sm text-gray-900'>{value as React.ReactNode}</div>
      ),
    },
    {
      id: 'posts',
      header: t('table.headers.posts'),
      accessor: 'posts',
      render: (value) =>
        value !== null ? (
          <Badge
            variant='outline'
            className='bg-green-50 text-green-800 border-green-200'
          >
            {value as React.ReactNode} {t('table.postsBadge')}
          </Badge>
        ) : (
          <Badge
            variant='outline'
            className='bg-gray-50 text-gray-500 border-gray-200'
          >
            {t('table.notApplicable')}
          </Badge>
        ),
    },
    {
      id: 'status',
      header: t('table.headers.status'),
      accessor: 'status',
      render: (value) => (
        <Badge
          className={cn(
            'px-3 py-1',
            (value as string) === 'normal'
              ? 'bg-black text-white'
              : 'bg-red-600 text-white',
          )}
        >
          {t(`table.statuses.${value as string}`)}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: t('table.headers.actions') || 'Actions',
      accessor: () => '',
      render: (_, row) => (
        <div className='flex gap-2'>
          <button
            className='px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200'
            onClick={() => {
              const user = users.find((u) => u.userId === row.id)
              if (user) {
                setEditingUser(user)
                setEditForm({
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  idDocument: user.idDocument,
                  taxNumber: user.taxNumber,
                  contactPhoneNumber: user.contactPhoneNumber,
                  isVerified:
                    (user as UserProfile & { isVerified?: boolean })
                      .isVerified ?? false,
                })
                setEditError(null)
              }
            }}
          >
            {t('table.actions.edit') || 'Edit'}
          </button>
          <button
            className='px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200'
            onClick={() => {
              const user = users.find((u) => u.userId === row.id)
              if (user) setShowDelete(user)
            }}
          >
            {t('table.actions.delete') || 'Delete'}
          </button>
        </div>
      ),
    },
  ]

  // Define filters for DataTable
  const filters: FilterConfig[] = [
    {
      id: 'search',
      type: 'search',
      label: t('search.placeholder'),
      placeholder: t('search.placeholder'),
    },
    {
      id: 'type',
      type: 'select',
      label: t('filters.allUsers'),
      options: [
        { value: 'landlord', label: t('filters.landlord') },
        { value: 'tenant', label: t('filters.tenant') },
      ],
    },
  ]

  // Show loading state
  if (loading && users.length === 0) {
    return (
      <div>
        <div className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-4 text-gray-600'>Loading users...</p>
          </div>
        </div>
      </div>
    )
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
            onClick={() => {
              setShowCreate(true)
              setCreateForm({})
              setCreateError(null)
            }}
          >
            + {t('create.button') || 'Create User'}
          </Button>
        </div>
        {/* DataTable Component */}
        <DataTable
          data={transformedUsers}
          columns={columns}
          filters={filters}
          filterMode='frontend'
          pagination
          itemsPerPage={pageSize}
          itemsPerPageOptions={[5, 10, 20, 50]}
          sortable
          defaultSort={{ key: 'joinDate', direction: 'desc' }}
          emptyMessage={loading ? 'Loading users...' : 'No users found'}
          getRowKey={(row) => row.id}
        />
      </div>

      {/* Create User Modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className='min-w-[40vw] max-w-md max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>{t('create.title') || 'Create User'}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setCreateLoading(true)
              setCreateError(null)
              try {
                const resp = await createUser(createForm as CreateUserRequest)
                if (resp.success && resp.data) {
                  setShowCreate(false)
                  setUsers((prev) => [resp.data, ...prev])
                } else {
                  setCreateError(resp.message || 'Failed to create user')
                }
              } catch (err: unknown) {
                const error = err as { message?: string }
                setCreateError(error.message || 'Error creating user')
              } finally {
                setCreateLoading(false)
              }
            }}
            className='space-y-2'
          >
            <div className='space-y-2'>
              <Label htmlFor='firstName'>{t('create.firstName')} *</Label>
              <Input
                id='firstName'
                value={createForm.firstName || ''}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, firstName: e.target.value }))
                }
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='lastName'>{t('create.lastName')} *</Label>
              <Input
                id='lastName'
                value={createForm.lastName || ''}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, lastName: e.target.value }))
                }
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>{t('create.email')} *</Label>
              <Input
                id='email'
                type='email'
                value={createForm.email || ''}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, email: e.target.value }))
                }
                required
              />
            </div>

            <div className='grid grid-cols-3 gap-2'>
              <div className='space-y-2'>
                <Label htmlFor='phoneCode'>{t('create.phoneCode')} *</Label>
                <Input
                  id='phoneCode'
                  value={createForm.phoneCode || ''}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, phoneCode: e.target.value }))
                  }
                  required
                />
              </div>
              <div className='col-span-2 space-y-2'>
                <Label htmlFor='phoneNumber'>{t('create.phoneNumber')} *</Label>
                <Input
                  id='phoneNumber'
                  value={createForm.phoneNumber || ''}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      phoneNumber: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>{t('create.password')} *</Label>
              <Input
                id='password'
                type='password'
                value={createForm.password || ''}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, password: e.target.value }))
                }
                required
                minLength={8}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='idDocument'>{t('create.idDocument')}</Label>
              <Input
                id='idDocument'
                value={createForm.idDocument || ''}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, idDocument: e.target.value }))
                }
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='taxNumber'>{t('create.taxNumber')}</Label>
              <Input
                id='taxNumber'
                value={createForm.taxNumber || ''}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, taxNumber: e.target.value }))
                }
              />
            </div>

            {createError && (
              <div className='text-red-600 text-sm'>{createError}</div>
            )}

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setShowCreate(false)}
                disabled={createLoading}
              >
                {t('create.cancel') || 'Cancel'}
              </Button>
              <Button
                type='submit'
                className='bg-blue-600 hover:bg-blue-700'
                disabled={createLoading}
              >
                {createLoading
                  ? t('create.creating') || 'Creating...'
                  : t('create.create') || 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      >
        <DialogContent className='min-w-[40vw] max-w-md max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>{t('edit.title') || 'Edit User'}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setEditLoading(true)
              setEditError(null)
              try {
                const resp = await updateUser(editingUser!.userId, editForm)
                if (resp.success && resp.data) {
                  setEditingUser(null)
                  // Refresh user list
                  setUsers((prev) =>
                    prev.map((u) =>
                      u.userId === resp.data.userId ? resp.data : u,
                    ),
                  )
                } else {
                  setEditError(resp.message || 'Failed to update user')
                }
              } catch (err: unknown) {
                const error = err as { message?: string }
                setEditError(error.message || 'Error updating user')
              } finally {
                setEditLoading(false)
              }
            }}
            className='space-y-2'
          >
            <div className='space-y-2'>
              <Label htmlFor='editEmail'>{t('edit.email') || 'Email'} *</Label>
              <Input
                id='editEmail'
                type='email'
                placeholder='Email'
                value={editForm.email || ''}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, email: e.target.value }))
                }
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='editFirstName'>
                {t('edit.firstName') || 'First Name'} *
              </Label>
              <Input
                id='editFirstName'
                placeholder='First Name'
                value={editForm.firstName || ''}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, firstName: e.target.value }))
                }
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='editLastName'>
                {t('edit.lastName') || 'Last Name'} *
              </Label>
              <Input
                id='editLastName'
                placeholder='Last Name'
                value={editForm.lastName || ''}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, lastName: e.target.value }))
                }
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='editIdDocument'>
                {t('edit.idDocument') || 'ID Document'}
              </Label>
              <Input
                id='editIdDocument'
                placeholder='ID Document'
                value={editForm.idDocument || ''}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, idDocument: e.target.value }))
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='editTaxNumber'>
                {t('edit.taxNumber') || 'Tax Number'}
              </Label>
              <Input
                id='editTaxNumber'
                placeholder='Tax Number'
                value={editForm.taxNumber || ''}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, taxNumber: e.target.value }))
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='editContactPhone'>
                {t('edit.contactPhone') || 'Contact Phone'}
              </Label>
              <Input
                id='editContactPhone'
                placeholder='Contact Phone'
                value={editForm.contactPhoneNumber || ''}
                onChange={(e) =>
                  setEditForm((f) => ({
                    ...f,
                    contactPhoneNumber: e.target.value,
                  }))
                }
              />
            </div>
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={!!editForm.isVerified}
                onChange={(e) =>
                  setEditForm((f) => ({
                    ...f,
                    isVerified: e.target.checked,
                  }))
                }
                className='rounded border-gray-300'
              />
              <span className='text-sm'>
                {t('edit.verified') || 'Verified'}
              </span>
            </label>
            {editError && (
              <div className='text-red-600 text-sm'>{editError}</div>
            )}
            <div className='flex justify-end gap-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setEditingUser(null)}
                disabled={editLoading}
              >
                {t('edit.cancel') || 'Cancel'}
              </Button>
              <Button
                type='submit'
                disabled={editLoading}
                className='bg-blue-600 hover:bg-blue-700'
              >
                {editLoading
                  ? t('edit.saving') || 'Saving...'
                  : t('edit.save') || 'Save'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete User Modal */}
      <Dialog
        open={!!showDelete}
        onOpenChange={(open) => !open && setShowDelete(null)}
      >
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>{t('delete.title') || 'Delete User'}</DialogTitle>
          </DialogHeader>
          <div className='space-y-2'>
            <p>
              {t('delete.confirm') ||
                'Are you sure you want to delete this user?'}
              <br />
              <span className='font-semibold'>{showDelete?.email}</span>
            </p>
            {deleteError && (
              <div className='text-red-600 text-sm'>{deleteError}</div>
            )}
            <div className='flex gap-3 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setShowDelete(null)}
                disabled={deleteLoading}
                className='flex-1'
              >
                {t('delete.cancel') || 'Cancel'}
              </Button>
              <Button
                disabled={deleteLoading}
                onClick={async () => {
                  setDeleteLoading(true)
                  setDeleteError(null)
                  try {
                    const resp = await deleteUser(showDelete!.userId)
                    if (resp.success) {
                      setShowDelete(null)
                      setUsers((prev) =>
                        prev.filter((u) => u.userId !== showDelete!.userId),
                      )
                    } else {
                      setDeleteError(resp.message || 'Failed to delete user')
                    }
                  } catch (err: unknown) {
                    const error = err as { message?: string }
                    setDeleteError(error.message || 'Error deleting user')
                  } finally {
                    setDeleteLoading(false)
                  }
                }}
                className='flex-1 bg-red-600 hover:bg-red-700'
              >
                {deleteLoading
                  ? t('delete.deleting') || 'Deleting...'
                  : t('delete.delete') || 'Delete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

UserManagement.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout activeItem='users'>{page}</AdminLayout>
}

export default UserManagement
