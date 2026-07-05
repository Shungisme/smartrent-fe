import React from 'react'
import {
  DataTable,
  Column,
  FilterConfig,
} from '@/components/organisms/DataTable'
import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { InitialsAvatar } from '@/components/molecules/initialsAvatar'
import { Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { AdminProfile } from '@/api/types/admin.type'
import { AdminRow } from '@/types/admins.type'
import { formatDateTimeCompact } from '@/utils/format'

type AdminRole = 'SA' | 'UA' | 'CM' | 'SPA' | 'FA' | 'MA'

// Subtle tinted role pills — quiet enough for a dense table, semantic enough to scan.
const getRoleBadgeClass = (role: string): string => {
  const classes: Record<AdminRole, string> = {
    SA: 'border-rose-200/70 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300',
    UA: 'border-orange-200/70 bg-orange-50 text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300',
    CM: 'border-purple-200/70 bg-purple-50 text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300',
    SPA: 'border-blue-200/70 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300',
    FA: 'border-emerald-200/70 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
    MA: 'border-pink-200/70 bg-pink-50 text-pink-700 dark:border-pink-500/30 dark:bg-pink-500/10 dark:text-pink-300',
  }
  return (
    classes[role as AdminRole] || 'border-border bg-muted text-foreground/80'
  )
}

interface AdminTableProps {
  admins: AdminProfile[]
  totalItems: number
  loading: boolean
  filterValues: Record<string, unknown>
  onFilterChange: (newFilters: Record<string, unknown>) => void
  onEdit: (admin: AdminProfile) => void
  onDelete: (admin: AdminProfile) => void
}

export const AdminTable: React.FC<AdminTableProps> = ({
  admins,
  totalItems,
  loading,
  filterValues,
  onFilterChange,
  onEdit,
  onDelete,
}) => {
  const t = useTranslations('admin.admins')
  const roleLabels: Record<AdminRole, string> = {
    SA: t('table.roles.SA'),
    UA: t('table.roles.UA'),
    CM: t('table.roles.CM'),
    SPA: t('table.roles.SPA'),
    FA: t('table.roles.FA'),
    MA: t('table.roles.MA'),
  }

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
      id: 'role',
      type: 'select',
      label: t('filters.role'),
      options: [
        { value: 'SA', label: roleLabels.SA },
        { value: 'UA', label: roleLabels.UA },
        { value: 'CM', label: roleLabels.CM },
        { value: 'SPA', label: roleLabels.SPA },
        { value: 'FA', label: roleLabels.FA },
        { value: 'MA', label: roleLabels.MA },
      ],
      allowMultiple: true,
      isFilterField: true,
    },
  ]

  // Transform API data to match UI format
  const transformedAdmins: AdminRow[] = admins.map((admin) => ({
    id: admin.adminId,
    name: `${admin.firstName} ${admin.lastName}`,
    email: admin.email,
    avatar: undefined, // No avatar in API
    role: admin.roles,
    joinDate: admin.createdAt || '-',
  }))

  const columns: Column<AdminRow>[] = [
    {
      id: 'id',
      header: t('table.headers.adminId'),
      accessor: 'id',
      defaultHidden: true,
      render: (value) => (
        <div className='text-sm font-medium text-foreground'>
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
        <div className='flex items-center justify-end gap-3 lg:justify-start'>
          <InitialsAvatar name={row.name} src={row.avatar} size='md' />
          <div className='min-w-0 flex-col leading-tight'>
            <div className='truncate font-medium text-foreground'>
              {row.name}
            </div>
            <div className='truncate text-xs text-muted-foreground'>
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'role',
      header: t('table.headers.role'),
      accessor: 'role',
      render: (value) => (
        <div className='flex flex-wrap items-center justify-end gap-1 lg:justify-start'>
          {(value as string[]).map((role: string) => (
            <Badge
              key={role}
              variant='outline'
              className={cn('font-medium', getRoleBadgeClass(role))}
            >
              {roleLabels[role as AdminRole] || role}
            </Badge>
          ))}
        </div>
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

  return (
    <DataTable
      data={transformedAdmins}
      columns={columns}
      filters={filterConfig}
      filterMode='api'
      filterValues={filterValues}
      onFilterChange={onFilterChange}
      totalItems={totalItems}
      itemsPerPageOptions={[10, 20, 50]}
      sortable
      defaultSort={{ key: 'joinDate', direction: 'desc' }}
      loading={loading}
      emptyMessage={loading ? t('table.loading') : t('table.noAdminsFound')}
      getRowKey={(row) => row.id}
      actions={(row) => (
        <div className='flex items-center justify-center gap-0.5'>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground'
            title={t('table.actions.edit')}
            onClick={() => {
              const admin = admins.find((a) => a.adminId === row.id)
              if (admin) onEdit(admin)
            }}
          >
            <Pencil className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
            title={t('table.actions.delete')}
            onClick={() => {
              const admin = admins.find((a) => a.adminId === row.id)
              if (admin) onDelete(admin)
            }}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      )}
    />
  )
}
