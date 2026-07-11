import React from 'react'
import {
  DataTable,
  Column,
  FilterConfig,
} from '@/components/organisms/DataTable'
import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { InitialsAvatar } from '@/components/molecules/initialsAvatar'
import { Pencil, UserX, Trash2, ShieldOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { UserProfile } from '@/api/types/user.type'
import { UserData } from '@/types/users.type'
import { formatDateTimeCompact } from '@/utils/format'

interface UserTableProps {
  users: UserProfile[]
  totalItems: number
  loading: boolean
  filterValues: Record<string, unknown>
  onFilterChange: (newFilters: Record<string, unknown>) => void
  onEdit: (user: UserProfile) => void
  onDelete: (user: UserProfile) => void
  onRemoveBroker: (user: UserProfile) => void
  onClearMembership: (user: UserProfile) => void
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
  onClearMembership,
}) => {
  const t = useTranslations('admin.users')

  // Transform API data to match UI format
  const transformedUsers: UserData[] = users.map((user) => ({
    id: user.userId,
    name: `${user.firstName} ${user.lastName}`,
    avatar: user.avatarUrl,
    type: user.isBroker ? 'broker' : 'normal_user',
    joinDate: user.createdAt || '-',
  }))

  const columns: Column<UserData>[] = [
    {
      id: 'id',
      header: t('table.headers.userId'),
      accessor: 'id',
      defaultHidden: true,
      render: (value) => (
        <div className='text-sm font-medium text-foreground'>
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
        <div className='flex items-center justify-end gap-3 lg:justify-start'>
          <InitialsAvatar name={row.name} src={row.avatar} size='md' />
          <span className='font-medium text-foreground'>{row.name}</span>
        </div>
      ),
    },
    {
      id: 'type',
      header: t('table.headers.type'),
      accessor: 'type',
      render: (value) => (
        <Badge variant={(value as string) === 'broker' ? 'info' : 'secondary'}>
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
        <span className='text-sm text-muted-foreground'>
          {formatDateTimeCompact(value as string | null)}
        </span>
      ),
    },
  ]

  const filterConfig: FilterConfig[] = [
    {
      id: 'firstName',
      type: 'search',
      label: t('filters.firstName'),
      placeholder: t('filters.firstNamePlaceholder'),
      isFilterField: true,
    },
    {
      id: 'lastName',
      type: 'search',
      label: t('filters.lastName'),
      placeholder: t('filters.lastNamePlaceholder'),
      isFilterField: true,
    },
    {
      id: 'email',
      type: 'search',
      label: t('filters.email'),
      placeholder: t('filters.emailPlaceholder'),
      isFilterField: true,
    },
    {
      id: 'phoneNumber',
      type: 'search',
      label: t('filters.phoneNumber'),
      placeholder: t('filters.phoneNumberPlaceholder'),
      isFilterField: true,
    },
    {
      id: 'isBroker',
      type: 'select',
      label: t('filters.userType'),
      options: [
        { value: 'true', label: t('filters.broker') },
        { value: 'false', label: t('filters.normalUser') },
      ],
      isFilterField: true,
    },
  ]

  return (
    <DataTable
      data={transformedUsers}
      columns={columns}
      filters={filterConfig}
      fillHeight
      filterMode='api'
      filterValues={filterValues}
      onFilterChange={onFilterChange}
      totalItems={totalItems}
      itemsPerPageOptions={[5, 10, 20, 50]}
      sortable
      defaultSort={{ key: 'joinDate', direction: 'desc' }}
      loading={loading}
      emptyMessage={loading ? t('table.loading') : t('table.noUsersFound')}
      getRowKey={(row) => row.id}
      actions={(row) => {
        const user = users.find((u) => u.userId === row.id)

        return (
          <div className='flex items-center justify-center gap-0.5'>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground'
              title={t('table.actions.edit')}
              onClick={() => {
                if (user) onEdit(user)
              }}
            >
              <Pencil className='h-4 w-4' />
            </Button>
            {user?.isBroker && (
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 text-muted-foreground hover:bg-warning/15 hover:text-warning-foreground'
                title={t('table.actions.removeBroker')}
                onClick={() => {
                  if (user) onRemoveBroker(user)
                }}
              >
                <UserX className='h-4 w-4' />
              </Button>
            )}
            <Button
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0 text-muted-foreground hover:bg-warning/15 hover:text-warning-foreground'
              title={t('table.actions.clearMembership')}
              onClick={() => {
                if (user) onClearMembership(user)
              }}
            >
              <ShieldOff className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
              title={t('table.actions.delete')}
              onClick={() => {
                if (user) onDelete(user)
              }}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        )
      }}
    />
  )
}
