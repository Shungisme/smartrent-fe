import React from 'react'
import Image from 'next/image'
import {
  DataTable,
  Column,
  FilterConfig,
} from '@/components/organisms/DataTable'
import { Avatar } from '@/components/atoms/avatar'
import { Badge } from '@/components/atoms/badge'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { AdminProfile } from '@/api/types/admin.type'
import { AdminRow } from '@/types/admins.type'

type AdminRole = 'support' | 'moderator' | 'admin' | 'super_admin'

const getRoleBadgeClass = (role: AdminRole): string => {
  const classes: Record<AdminRole, string> = {
    support: 'bg-blue-100 text-blue-800 border-blue-200',
    moderator: 'bg-purple-100 text-purple-800 border-purple-200',
    admin: 'bg-orange-100 text-orange-800 border-orange-200',
    super_admin: 'bg-red-100 text-red-800 border-red-200',
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

interface AdminTableProps {
  admins: AdminProfile[]
  loading: boolean
  onEdit: (admin: AdminProfile) => void
  onDelete: (admin: AdminProfile) => void
  pagination?: {
    totalItems: number
    itemsPerPage: number
    currentPage: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
  }
}

export const AdminTable: React.FC<AdminTableProps> = ({
  admins,
  loading,
  onEdit,
  onDelete,
  pagination,
}) => {
  const t = useTranslations('admin.admins')

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
              'px-3 py-1 font-medium mr-1',
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
              if (admin) onEdit(admin)
            }}
          >
            {t('table.actions.edit') || 'Edit'}
          </button>
          <button
            className='px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200'
            onClick={() => {
              const admin = admins.find((a) => a.adminId === row.id)
              if (admin) onDelete(admin)
            }}
          >
            {t('table.actions.delete') || 'Delete'}
          </button>
        </div>
      ),
    },
  ]

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
    <DataTable
      data={transformedAdmins}
      columns={columns}
      filters={filters}
      filterMode='frontend'
      pagination={!!pagination}
      totalItems={pagination?.totalItems}
      itemsPerPage={pagination?.itemsPerPage}
      itemsPerPageOptions={[10, 20, 50]}
      onPageChange={pagination?.onPageChange}
      onItemsPerPageChange={pagination?.onPageSizeChange}
      sortable
      defaultSort={{ key: 'joinDate', direction: 'desc' }}
      loading={loading}
      emptyMessage={loading ? 'Loading admins...' : 'No admins found'}
      getRowKey={(row) => row.id}
    />
  )
}
