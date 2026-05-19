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

const formatDateTime = (value?: string | null): string => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'

  const pad = (input: number) => String(input).padStart(2, '0')
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())
  const day = pad(date.getDate())
  const month = pad(date.getMonth() + 1)
  const year = date.getFullYear()

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`
}

interface UserTableProps {
  users: UserProfile[]
  totalItems: number
  loading: boolean
  filterValues: Record<string, unknown>
  onFilterChange: (newFilters: Record<string, unknown>) => void
  onEdit: (user: UserProfile) => void
  onDelete: (user: UserProfile) => void
  onRemoveBroker: (user: UserProfile) => void
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  totalItems,
  loading,
  filterValues,
  onFilterChange,
  onEdit,
  onDelete,
  onRemoveBroker,
}) => {
  const t = useTranslations('admin.users')

  // Transform API data to match UI format
  const transformedUsers: UserData[] = users.map((user) => ({
    id: user.userId,
    name: `${user.firstName} ${user.lastName}`,
    avatar: undefined, // API doesn't return avatar yet
    type: user.isBroker ? 'broker' : 'normal_user',
    joinDate: user.createdAt || '-',
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
          variant={(value as string) === 'broker' ? 'default' : 'secondary'}
          className={cn(
            'px-3 py-1',
            (value as string) === 'broker'
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
        <div className='text-sm text-gray-900'>
          {formatDateTime(value as string | null)}
        </div>
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
      render: (_, row) => {
        const user = users.find((u) => u.userId === row.id)

        return (
          <div className='flex gap-2'>
            <button
              className='px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200'
              onClick={() => {
                if (user) onEdit(user)
              }}
            >
              {t('table.actions.edit') || 'Edit'}
            </button>
            {user?.isBroker && (
              <button
                className='px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200'
                onClick={() => {
                  if (user) onRemoveBroker(user)
                }}
              >
                {t('table.actions.removeBroker') || 'Remove Broker'}
              </button>
            )}
            <button
              className='px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200'
              onClick={() => {
                if (user) onDelete(user)
              }}
            >
              {t('table.actions.delete') || 'Delete'}
            </button>
          </div>
        )
      },
    },
  ]

  const filterConfig: FilterConfig[] = [
    {
      id: 'firstName',
      type: 'search',
      label: 'First Name',
      placeholder: 'e.g. John',
      isFilterField: true,
    },
    {
      id: 'lastName',
      type: 'search',
      label: 'Last Name',
      placeholder: 'e.g. Smith',
      isFilterField: true,
    },
    {
      id: 'email',
      type: 'search',
      label: 'Email',
      placeholder: 'e.g. user@gmail.com',
      isFilterField: true,
    },
    {
      id: 'phoneNumber',
      type: 'search',
      label: 'Phone Number',
      placeholder: 'e.g. 0912345678',
      isFilterField: true,
    },
    {
      id: 'userId',
      type: 'search',
      label: 'User ID',
      placeholder: 'e.g. user-123',
      isFilterField: true,
    },
    {
      id: 'isBroker',
      type: 'select',
      label: 'User Type',
      options: [
        { value: 'true', label: 'Broker' },
        { value: 'false', label: 'Normal User' },
      ],
      isFilterField: true,
    },
  ]

  return (
    <DataTable
      data={transformedUsers}
      columns={columns}
      filters={filterConfig}
      filterMode='api'
      filterValues={filterValues}
      onFilterChange={onFilterChange}
      totalItems={totalItems}
      itemsPerPageOptions={[5, 10, 20, 50]}
      sortable
      defaultSort={{ key: 'joinDate', direction: 'desc' }}
      loading={loading}
      emptyMessage={loading ? 'Loading users...' : 'No users found'}
      getRowKey={(row) => row.id}
    />
  )
}
