import React, { useState, useEffect } from 'react'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu'
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
import { createAdmin } from '@/api/services/admin.service'
import { Role } from '@/api/types/role.type'

type AdminRole = 'support' | 'moderator' | 'admin' | 'super_admin'
type AdminStatus = 'active' | 'inactive'

type AdminData = {
  id: string
  name: string
  email: string
  avatar?: string
  role: AdminRole
  joinDate: string
  lastOnline: string
  status: AdminStatus
}

// Mock data for 5 admins
const mockAdmins: AdminData[] = [
  {
    id: 'a004',
    name: 'David Rodriguez',
    email: 'david.rodriguez@smartrent.com',
    avatar: '/images/default-image.jpg',
    role: 'support',
    joinDate: '05/01/2024',
    lastOnline: '18/01/2025',
    status: 'active',
  },
  {
    id: 'a003',
    name: 'Emma Thompson',
    email: 'emma.thompson@smartrent.com',
    avatar: '/images/default-image.jpg',
    role: 'moderator',
    joinDate: '10/11/2023',
    lastOnline: '19/01/2025',
    status: 'active',
  },
  {
    id: 'a005',
    name: 'Lisa Park',
    email: 'lisa.park@smartrent.com',
    avatar: '/images/default-image.jpg',
    role: 'moderator',
    joinDate: '18/03/2024',
    lastOnline: '15/01/2025',
    status: 'inactive',
  },
  {
    id: 'a002',
    name: 'Michael Chen',
    email: 'michael.chen@smartrent.com',
    avatar: '/images/default-image.jpg',
    role: 'admin',
    joinDate: '22/08/2023',
    lastOnline: '20/01/2025',
    status: 'active',
  },
  {
    id: 'a001',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@smartrent.com',
    avatar: '/images/default-image.jpg',
    role: 'super_admin',
    joinDate: '15/06/2023',
    lastOnline: '20/01/2025',
    status: 'active',
  },
]

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
          setRoles(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch roles:', error)
      } finally {
        setRolesLoading(false)
      }
    }
    fetchRoles()
  }, [])

  // Handle create admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const response = await createAdmin(formData)
      if (response.success) {
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
        // Refresh page to show new admin (in production, you would refetch the list)
        window.location.reload()
      } else {
        alert(`Error: ${response.message}`)
      }
    } catch (error: any) {
      alert(`Failed to create admin: ${error.message}`)
    } finally {
      setCreating(false)
    }
  }

  const breadcrumbItems = [
    { label: 'Admin Dashboard', href: '/admin' },
    { label: t('breadcrumb.dashboard') }, // Current page
  ]

  // Define columns for DataTable
  const columns: Column<AdminData>[] = [
    {
      id: 'id',
      header: t('table.headers.adminId'),
      accessor: 'id',
      render: (value) => (
        <div className='text-sm font-medium text-gray-900'>{value}</div>
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
            <img
              src={row.avatar || '/images/default-image.jpg'}
              alt={row.name}
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
      render: (value) => (
        <Badge
          variant='outline'
          className={cn('px-3 py-1 font-medium', getRoleBadgeClass(value))}
        >
          {t(`table.roles.${value}`)}
        </Badge>
      ),
    },
    {
      id: 'joinDate',
      header: t('table.headers.joinDate'),
      accessor: 'joinDate',
      sortable: true,
      render: (value) => <div className='text-sm text-gray-900'>{value}</div>,
    },
    {
      id: 'lastOnline',
      header: t('table.headers.lastOnline'),
      accessor: 'lastOnline',
      sortable: true,
      render: (value) => <div className='text-sm text-gray-900'>{value}</div>,
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
          data={mockAdmins}
          columns={columns}
          filters={filters}
          filterMode='frontend'
          pagination
          itemsPerPage={10}
          itemsPerPageOptions={[10, 20, 50]}
          sortable
          defaultSort={{ key: 'joinDate', direction: 'desc' }}
          actions={() => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                  <span className='text-gray-500'>⋮</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem>
                  {t('table.actions.viewDetails')}
                </DropdownMenuItem>
                <DropdownMenuItem>{t('table.actions.edit')}</DropdownMenuItem>
                <DropdownMenuItem>
                  {t('table.actions.changeRole')}
                </DropdownMenuItem>
                <DropdownMenuItem className='text-red-600'>
                  {t('table.actions.deactivate')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          emptyMessage='No admins found'
          getRowKey={(row) => row.id}
        />

        {/* Create Admin Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className='max-w-md'>
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
