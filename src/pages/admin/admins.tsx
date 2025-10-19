import React from 'react'
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
import { cn } from '@/lib/utils'
import type { NextPageWithLayout } from '@/types/next-page'
import { useTranslations } from 'next-intl'

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
          <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
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
      </div>
    </div>
  )
}

AdminManagement.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout activeItem='admin'>{page}</AdminLayout>
}

export default AdminManagement
