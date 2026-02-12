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
import { UserProfile } from '@/api/types/user.type'
import { UserData } from '@/types/users.type'

interface UserTableProps {
  users: UserProfile[]
  loading: boolean
  onEdit: (user: UserProfile) => void
  onDelete: (user: UserProfile) => void
  pagination?: {
    totalItems: number
    itemsPerPage: number
    currentPage: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
  }
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  onEdit,
  onDelete,
  pagination,
}) => {
  const t = useTranslations('admin.users')

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
              if (user) onEdit(user)
            }}
          >
            {t('table.actions.edit') || 'Edit'}
          </button>
          <button
            className='px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200'
            onClick={() => {
              const user = users.find((u) => u.userId === row.id)
              if (user) onDelete(user)
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
      id: 'type',
      type: 'select',
      label: t('filters.allUsers'),
      options: [
        { value: 'landlord', label: t('filters.landlord') },
        { value: 'tenant', label: t('filters.tenant') },
      ],
    },
  ]

  return (
    <DataTable
      data={transformedUsers}
      columns={columns}
      filters={filters}
      filterMode='frontend'
      pagination={!!pagination}
      totalItems={pagination?.totalItems}
      itemsPerPage={pagination?.itemsPerPage}
      itemsPerPageOptions={[5, 10, 20, 50]}
      onPageChange={pagination?.onPageChange}
      onItemsPerPageChange={pagination?.onPageSizeChange}
      sortable
      defaultSort={{ key: 'joinDate', direction: 'desc' }}
      loading={loading}
      emptyMessage={loading ? 'Loading users...' : 'No users found'}
      getRowKey={(row) => row.id}
    />
  )
}
