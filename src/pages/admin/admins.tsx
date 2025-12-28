import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import AdminLayout from '@/components/layouts/AdminLayout'
import Breadcrumb from '@/components/molecules/breadcrumb'
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
import { getRoles } from '@/api/services/role.service'
import {
  getAdminList,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from '@/api/services/admin.service'
import { AdminProfile, UpdateAdminRequest } from '@/api/types/admin.type'
import { Role } from '@/api/types/role.type'

type AdminRole = 'support' | 'moderator' | 'admin' | 'super_admin'

// Real admin data state
type AdminRow = {
  id: string
  name: string
  email: string
  avatar?: string
  role: string[]
  joinDate: string
  lastOnline: string
  status: string
}

const getRoleBadgeClass = (role: AdminRole): string => {
  const classes: Record<AdminRole, string> = {
    support: 'bg-blue-100 text-blue-800 border-blue-200',
    moderator: 'bg-purple-100 text-purple-800 border-purple-200',
    admin: 'bg-orange-100 text-orange-800 border-orange-200',
    super_admin: 'bg-red-100 text-red-800 border-red-200',
  }
  return classes[role]
}

const AdminManagement: NextPageWithLayout = () => {
  const t = useTranslations('admin.admins')

  // State for roles
  const [roles, setRoles] = useState<Role[]>([])
  const [rolesLoading, setRolesLoading] = useState(true)

  // State for admin list
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentPage, setCurrentPage] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalPages, setTotalPages] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageSize, setPageSize] = useState(10)

  // Edit/Delete modal state
  const [editingAdmin, setEditingAdmin] = useState<AdminProfile | null>(null)
  const [editForm, setEditForm] = useState<Partial<UpdateAdminRequest>>({})
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [showDelete, setShowDelete] = useState<AdminProfile | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // State for create admin dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    phoneCode: '+84',
    phoneNumber: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    roles: [] as string[],
  })

  // Fetch roles on mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles()
        if (response.success) {
          setRoles(response.data.data)
        }
      } catch (error) {
        console.error('Failed to fetch roles:', error)
      } finally {
        setRolesLoading(false)
      }
    }
    fetchRoles()
  }, [])

  // Fetch admins from API
  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getAdminList({
          page: currentPage + 1,
          size: pageSize,
        })
        if (response.success && response.data) {
          setAdmins(response.data.data)
          setTotalPages(response.data.totalPages)
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

  // Handle create admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const response = await createAdmin(formData)
      if (response.success && response.data) {
        alert(
          `Admin created successfully!\nTemporary Password: ${response.data.password}\n\nPlease save this password securely.`,
        )
        setCreateDialogOpen(false)
        setFormData({
          phoneCode: '+84',
          phoneNumber: '',
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          roles: [],
        })
        // Map CreateAdminResponse to AdminProfile shape for state
        setAdmins((prev) => [
          {
            adminId: response.data.adminId,
            phoneCode: response.data.phoneCode,
            phoneNumber: response.data.phoneNumber,
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            roles: response.data.roles,
            idDocument: null,
            taxNumber: null,
          },
          ...prev,
        ])
      } else {
        alert(`Error: ${response.message}`)
      }
    } catch (error: unknown) {
      const err = error as { message?: string }
      alert(`Failed to create admin: ${err.message}`)
    } finally {
      setCreating(false)
    }
  }

  const breadcrumbItems = [
    { label: 'Admin Dashboard', href: '/admin' },
    { label: t('breadcrumb.dashboard') }, // Current page
  ]

  // Transform API data to match UI format
  const transformedAdmins: AdminRow[] = admins.map((admin) => ({
    id: admin.adminId,
    name: `${admin.firstName} ${admin.lastName}`,
    email: admin.email,
    avatar: undefined, // No avatar in API
    role: admin.roles,
    joinDate: '', // No join date in API
    lastOnline: '', // No last online in API
    status: 'active', // No status in API
  }))

  // Define columns for DataTable
  const columns: Column<AdminRow>[] = [
    {
      id: 'id',
      header: t('table.headers.adminId'),
      accessor: 'id',
      render: (value) => (
        <div className='text-sm font-medium text-gray-900'>
          {value as React.ReactNode}
        </div>
      ),
    },
    {
      id: 'admin',
      header: t('table.headers.admin'),
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
          <div className='flex flex-col'>
            <span className='font-medium text-gray-900'>{row.name}</span>
            <span className='text-sm text-gray-500'>{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'role',
      header: t('table.headers.role'),
      accessor: 'role',
      render: (value) =>
        (value as string[]).map((role: string) => (
          <Badge
            key={role}
            variant='outline'
            className={cn(
              'px-3 py-1 font-medium',
              getRoleBadgeClass(role as AdminRole),
            )}
          >
            {`${role}`}
          </Badge>
        )),
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
      id: 'status',
      header: t('table.headers.status'),
      accessor: 'status',
      render: (value) => (
        <Badge
          className={cn(
            'px-3 py-1',
            value === 'active'
              ? 'bg-green-100 text-green-800 border-green-200'
              : 'bg-gray-100 text-gray-800 border-gray-200',
          )}
        >
          {t(`table.statuses.${value}`)}
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
              const admin = admins.find((a) => a.adminId === row.id)
              if (admin) {
                setEditingAdmin(admin)
                setEditForm({
                  email: admin.email,
                  firstName: admin.firstName,
                  lastName: admin.lastName,
                  phoneCode: admin.phoneCode,
                  phoneNumber: admin.phoneNumber,
                  roles: admin.roles,
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
              const admin = admins.find((a) => a.adminId === row.id)
              if (admin) setShowDelete(admin)
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
      id: 'role',
      type: 'select',
      label: t('filters.allRoles'),
      options: [
        { value: 'support', label: t('filters.support') },
        { value: 'moderator', label: t('filters.moderator') },
        { value: 'admin', label: t('filters.admin') },
        { value: 'super_admin', label: t('filters.superAdmin') },
      ],
    },
    {
      id: 'status',
      type: 'select',
      label: t('filters.allStatuses'),
      options: [
        { value: 'active', label: t('filters.active') },
        { value: 'inactive', label: t('filters.inactive') },
      ],
    },
  ]

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />

      <div className='space-y-6'>
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
        <DataTable
          data={transformedAdmins}
          columns={columns}
          filters={filters}
          filterMode='frontend'
          pagination
          itemsPerPage={pageSize}
          itemsPerPageOptions={[10, 20, 50]}
          sortable
          defaultSort={{ key: 'joinDate', direction: 'desc' }}
          emptyMessage={loading ? 'Loading admins...' : 'No admins found'}
          getRowKey={(row) => row.id}
        />
        {/* Edit Admin Modal */}
        {editingAdmin && (
          <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'>
              <h2 className='text-lg font-semibold mb-4'>
                {t('edit.title') || 'Edit Admin'}
              </h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  setEditLoading(true)
                  setEditError(null)
                  try {
                    const resp = await updateAdmin(
                      editingAdmin.adminId,
                      editForm,
                    )
                    if (resp.success && resp.data) {
                      setEditingAdmin(null)
                      setAdmins((prev) =>
                        prev.map((a) =>
                          a.adminId === resp.data.adminId ? resp.data : a,
                        ),
                      )
                    } else {
                      setEditError(resp.message || 'Failed to update admin')
                    }
                  } catch (err: unknown) {
                    const error = err as { message?: string }
                    setEditError(error.message || 'Error updating admin')
                  } finally {
                    setEditLoading(false)
                  }
                }}
              >
                <div className='space-y-3'>
                  <input
                    className='w-full border rounded px-3 py-2'
                    placeholder='Email'
                    value={editForm.email || ''}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, email: e.target.value }))
                    }
                    required
                    type='email'
                  />
                  <input
                    className='w-full border rounded px-3 py-2'
                    placeholder='First Name'
                    value={editForm.firstName || ''}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, firstName: e.target.value }))
                    }
                    required
                  />
                  <input
                    className='w-full border rounded px-3 py-2'
                    placeholder='Last Name'
                    value={editForm.lastName || ''}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, lastName: e.target.value }))
                    }
                    required
                  />
                  <input
                    className='w-full border rounded px-3 py-2'
                    placeholder='Phone Code'
                    value={editForm.phoneCode || ''}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, phoneCode: e.target.value }))
                    }
                    required
                  />
                  <input
                    className='w-full border rounded px-3 py-2'
                    placeholder='Phone Number'
                    value={editForm.phoneNumber || ''}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        phoneNumber: e.target.value,
                      }))
                    }
                    required
                  />
                  <div>
                    <label className='block mb-1'>Roles</label>
                    {rolesLoading ? (
                      <p className='text-sm text-gray-500'>Loading roles...</p>
                    ) : (
                      <div className='space-y-2 mt-2'>
                        {roles.map((role) => (
                          <label
                            key={role.roleId}
                            className='flex items-center gap-2'
                          >
                            <input
                              type='checkbox'
                              checked={
                                editForm.roles?.includes(role.roleId) || false
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setEditForm((f) => ({
                                    ...f,
                                    roles: [...(f.roles || []), role.roleId],
                                  }))
                                } else {
                                  setEditForm((f) => ({
                                    ...f,
                                    roles: (f.roles || []).filter(
                                      (r) => r !== role.roleId,
                                    ),
                                  }))
                                }
                              }}
                              className='rounded border-gray-300'
                            />
                            <span className='text-sm'>{role.roleName}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {editError && (
                    <div className='text-red-600 text-sm'>{editError}</div>
                  )}
                </div>
                <div className='flex justify-end gap-2 mt-6'>
                  <button
                    type='button'
                    className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
                    onClick={() => setEditingAdmin(null)}
                    disabled={editLoading}
                  >
                    {t('edit.cancel') || 'Cancel'}
                  </button>
                  <button
                    type='submit'
                    className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                    disabled={editLoading}
                  >
                    {editLoading
                      ? t('edit.saving') || 'Saving...'
                      : t('edit.save') || 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Admin Modal */}
        {showDelete && (
          <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-sm'>
              <h2 className='text-lg font-semibold mb-4'>
                {t('delete.title') || 'Delete Admin'}
              </h2>
              <p className='mb-4'>
                {t('delete.confirm') ||
                  'Are you sure you want to delete this admin?'}
                <br />
                <span className='font-semibold'>{showDelete.email}</span>
              </p>
              {deleteError && (
                <div className='text-red-600 text-sm mb-2'>{deleteError}</div>
              )}
              <div className='flex justify-end gap-2'>
                <button
                  className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
                  onClick={() => setShowDelete(null)}
                  disabled={deleteLoading}
                >
                  {t('delete.cancel') || 'Cancel'}
                </button>
                <button
                  className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
                  disabled={deleteLoading}
                  onClick={async () => {
                    setDeleteLoading(true)
                    setDeleteError(null)
                    try {
                      const resp = await deleteAdmin(showDelete.adminId)
                      if (resp.success) {
                        setShowDelete(null)
                        setAdmins((prev) =>
                          prev.filter((a) => a.adminId !== showDelete.adminId),
                        )
                      } else {
                        setDeleteError(resp.message || 'Failed to delete admin')
                      }
                    } catch (err: unknown) {
                      const error = err as { message?: string }
                      setDeleteError(error.message || 'Error deleting admin')
                    } finally {
                      setDeleteLoading(false)
                    }
                  }}
                >
                  {deleteLoading
                    ? t('delete.deleting') || 'Deleting...'
                    : t('delete.delete') || 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Admin Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className='max-w-md max-h-[50vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Create New Admin</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateAdmin} className='space-y-4'>
              <div>
                <Label htmlFor='firstName'>First Name *</Label>
                <Input
                  id='firstName'
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor='lastName'>Last Name *</Label>
                <Input
                  id='lastName'
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor='email'>Email *</Label>
                <Input
                  id='email'
                  type='email'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className='grid grid-cols-3 gap-2'>
                <div>
                  <Label htmlFor='phoneCode'>Code *</Label>
                  <Input
                    id='phoneCode'
                    value={formData.phoneCode}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneCode: e.target.value })
                    }
                    required
                  />
                </div>
                <div className='col-span-2'>
                  <Label htmlFor='phoneNumber'>Phone Number *</Label>
                  <Input
                    id='phoneNumber'
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor='password'>Password *</Label>
                <Input
                  id='password'
                  type='password'
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  minLength={8}
                />
              </div>

              <div>
                <Label>Roles * (Select at least one)</Label>
                {rolesLoading ? (
                  <p className='text-sm text-gray-500'>Loading roles...</p>
                ) : (
                  <div className='space-y-2 mt-2'>
                    {roles.map((role) => (
                      <label
                        key={role.roleId}
                        className='flex items-center gap-2'
                      >
                        <input
                          type='checkbox'
                          checked={formData.roles.includes(role.roleId)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                roles: [...formData.roles, role.roleId],
                              })
                            } else {
                              setFormData({
                                ...formData,
                                roles: formData.roles.filter(
                                  (r) => r !== role.roleId,
                                ),
                              })
                            }
                          }}
                          className='rounded border-gray-300'
                        />
                        <span className='text-sm'>{role.roleName}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className='flex gap-3 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setCreateDialogOpen(false)}
                  disabled={creating}
                  className='flex-1'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={creating || formData.roles.length === 0}
                  className='flex-1 bg-blue-600 hover:bg-blue-700'
                >
                  {creating ? 'Creating...' : 'Create Admin'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

AdminManagement.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout activeItem='admin'>{page}</AdminLayout>
}

export default AdminManagement
