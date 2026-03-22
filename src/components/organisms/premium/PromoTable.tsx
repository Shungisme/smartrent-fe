import React from 'react'
import { Tag, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { DataTable, type Column } from '@/components/organisms/DataTable'
import { useTranslations } from 'next-intl'
import { PromotionalCode } from '@/types/premium.type'
import { cn } from '@/lib/utils'
import { getPromoStatusColor } from '@/utils/premium.utils'

interface PromoTableProps {
  promotions: PromotionalCode[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export const PromoTable: React.FC<PromoTableProps> = ({
  promotions,
  onEdit,
  onDelete,
}) => {
  const t = useTranslations('premium')

  const columns: Column<PromotionalCode>[] = [
    {
      id: 'code',
      header: t('promotions.table.code'),
      accessor: 'code',
      render: (_, promo) => (
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100'>
            <Tag className='h-5 w-5 text-purple-600' />
          </div>
          <div>
            <div className='font-mono font-semibold text-gray-900'>
              {promo.code}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'type',
      header: t('promotions.table.type'),
      accessor: 'type',
      render: (_, promo) => (
        <Badge variant='outline' className='text-xs'>
          {t(`promotions.types.${promo.type}`)}
        </Badge>
      ),
    },
    {
      id: 'target',
      header: t('promotions.table.target'),
      accessor: 'target',
      render: (_, promo) => (
        <span className='text-sm text-gray-700'>
          {t(`promotions.targets.${promo.target}`)}
        </span>
      ),
    },
    {
      id: 'discount',
      header: t('promotions.table.discount'),
      accessor: 'discount',
      render: (_, promo) => (
        <span className='text-sm font-medium text-blue-600'>
          {promo.discount}
        </span>
      ),
    },
    {
      id: 'usage',
      header: t('promotions.table.usage'),
      accessor: (promo) => promo.usage.current,
      render: (_, promo) => (
        <div>
          <div className='text-sm font-semibold text-gray-900'>
            {promo.usage.current} / {promo.usage.limit}
          </div>
          <div className='mt-1 h-2 w-32 overflow-hidden rounded-full bg-gray-200'>
            <div
              className='h-full rounded-full bg-blue-600'
              style={{
                width: `${(promo.usage.current / promo.usage.limit) * 100}%`,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'validUntil',
      header: t('promotions.table.validUntil'),
      accessor: 'validUntil',
      render: (_, promo) => (
        <span className='text-sm text-gray-700'>{promo.validUntil}</span>
      ),
    },
    {
      id: 'status',
      header: t('promotions.table.status'),
      accessor: 'status',
      render: (_, promo) => (
        <Badge
          variant='outline'
          className={cn('text-xs', getPromoStatusColor(promo.status))}
        >
          {t(`promotions.statuses.${promo.status}`)}
        </Badge>
      ),
    },
  ]

  return (
    <DataTable
      data={promotions}
      columns={columns}
      emptyMessage='No promotional codes found'
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
