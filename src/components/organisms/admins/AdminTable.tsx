import React from 'react'
import Image from 'next/image'
import {
  DataTable,
  Column,
  FilterConfig,
} from '@/components/organisms/DataTable'
import { Avatar } from '@/components/atoms/avatar'
import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { AdminProfile } from '@/api/types/admin.type'
import { AdminRow } from '@/types/admins.type'

type AdminRole = 'SA' | 'UA' | 'CM' | 'SPA' | 'FA' | 'MA'

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

const getRoleBadgeClass = (role: string): string => {
  const classes: Record<AdminRole, string> = {
    SA: 'bg-red-100 text-red-800 border-red-200',
    UA: 'bg-orange-100 text-orange-800 border-orange-200',
    CM: 'bg-purple-100 text-purple-800 border-purple-200',
    SPA: 'bg-blue-100 text-blue-800 border-blue-200',
    FA: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    MA: 'bg-pink-100 text-pink-800 border-pink-200',
  }
  return classes[role as AdminRole] || 'bg-gray-100 text-gray-800'
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
      id: 'adminId',
      type: 'search',
      label: t('filters.adminId'),
      placeholder: t('filters.adminIdPlaceholder'),
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
              getRoleBadgeClass(role),
            )}
          >
            {roleLabels[role as AdminRole] || role}
          </Badge>
        )),
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
      id: 'actions',
      header: t('table.headers.actions'),
      accessor: () => '',
      render: (_, row) => (
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0'
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
            className='h-8 w-8 p-0 text-red-600 hover:text-red-700'
            title={t('table.actions.delete')}
            onClick={() => {
              const admin = admins.find((a) => a.adminId === row.id)
              if (admin) onDelete(admin)
            }}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
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
    />
  )
}
