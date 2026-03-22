import React from 'react'
import { Crown, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { DataTable, type Column } from '@/components/organisms/DataTable'
import { useTranslations } from 'next-intl'
import { MembershipPackage } from '@/types/premium.type'

interface MembershipTableProps {
  memberships: MembershipPackage[]
  loading: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string, currentStatus: string) => void
}

export const MembershipTable: React.FC<MembershipTableProps> = ({
  memberships,
  loading,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const t = useTranslations('premium')

  const columns: Column<MembershipPackage>[] = [
    {
      id: 'package',
      header: t('membership.table.package'),
      accessor: 'name',
      render: (_, pkg) => (
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100'>
            <Crown className='h-5 w-5 text-blue-600' />
          </div>
          <div>
            <div className='font-semibold text-gray-900'>{pkg.name}</div>
            <div className='text-xs text-gray-500'>{pkg.id}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'price',
      header: t('membership.table.price'),
      accessor: 'price',
      render: (_, pkg) => (
        <div>
          <div className='font-semibold text-gray-900'>{pkg.price}</div>
          <div className='text-xs text-gray-500'>
            {pkg.activeUsers} {t('membership.table.activeUsers')}
          </div>
        </div>
      ),
    },
    {
      id: 'features',
      header: t('membership.table.features'),
      accessor: 'features',
      render: (_, pkg) => (
        <div className='flex flex-wrap gap-1'>
          {pkg.features.slice(0, 2).map((feature, idx) => (
            <Badge key={idx} variant='outline' className='text-xs'>
              {feature}
            </Badge>
          ))}
          {pkg.features.length > 2 && (
            <Badge variant='outline' className='text-xs'>
              {t('membership.table.moreFeatures', {
                count: pkg.features.length - 2,
              })}
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: 'discount',
      header: t('membership.table.discount'),
      accessor: 'discount',
      render: (_, pkg) =>
        pkg.discount > 0 ? (
          <Badge className='bg-green-100 text-green-800'>{pkg.discount}%</Badge>
        ) : (
          <span className='text-sm text-gray-400'>
            {t('membership.table.noDiscount')}
          </span>
        ),
    },
    {
      id: 'status',
      header: t('membership.table.status'),
      accessor: 'status',
      render: (_, pkg) => (
        <label className='relative inline-flex cursor-pointer items-center'>
          <input
            type='checkbox'
            className='peer sr-only'
            checked={pkg.status === 'active'}
            onChange={() => onToggleStatus(pkg.id, pkg.status)}
          />
          <div className="h-6 w-11 rounded-full bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-['']"></div>
        </label>
      ),
    },
  ]

  return (
    <DataTable
      data={memberships}
      columns={columns}
      loading={loading}
      emptyMessage='No membership packages found'
      pagination
      itemsPerPage={10}
      getRowKey={(row) => row.id}
      actions={(row) => (
        <div className='flex items-center justify-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0'
            onClick={() => onEdit(row.id)}
          >
            <Pencil className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700'
            onClick={() => onDelete(row.id)}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      )}
    />
  )
}
