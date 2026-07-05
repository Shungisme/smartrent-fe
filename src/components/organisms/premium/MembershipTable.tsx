import React from 'react'
import { Crown, Eye, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { DataTable, type Column } from '@/components/organisms/DataTable'
import { useTranslations } from 'next-intl'
import { MembershipPackage } from '@/types/premium.type'

interface MembershipTableProps {
  memberships: MembershipPackage[]
  loading: boolean
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string, currentStatus: string) => void
}

export const MembershipTable: React.FC<MembershipTableProps> = ({
  memberships,
  loading,
  onView,
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
        <div className='flex items-center justify-end gap-3 lg:justify-start'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 ring-1 ring-amber-200/70 dark:from-amber-500/15 dark:to-amber-500/5 dark:text-amber-300 dark:ring-amber-500/20'>
            <Crown className='h-5 w-5' />
          </div>
          <div className='leading-tight'>
            <div className='font-medium text-foreground'>{pkg.name}</div>
            <div className='text-xs text-muted-foreground'>{pkg.id}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'price',
      header: t('membership.table.price'),
      accessor: 'price',
      render: (_, pkg) => (
        <div className='font-medium tabular-nums text-foreground'>
          {pkg.price}
        </div>
      ),
    },
    {
      id: 'description',
      header: t('membership.table.description'),
      accessor: 'description',
      maxWidth: 220,
      render: (_, pkg) => (
        <p
          className='truncate text-sm text-muted-foreground'
          title={pkg.description}
        >
          {pkg.description || '—'}
        </p>
      ),
    },
    {
      id: 'features',
      header: t('membership.table.features'),
      accessor: 'features',
      render: (_, pkg) => (
        <div className='flex flex-wrap justify-end gap-1 lg:justify-start'>
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
          <Badge variant='success'>-{pkg.discount}%</Badge>
        ) : (
          <span className='text-sm text-muted-foreground/70'>
            {t('membership.table.noDiscount')}
          </span>
        ),
    },
    {
      id: 'status',
      header: t('membership.table.status'),
      accessor: 'status',
      render: (_, pkg) => {
        const isActive = pkg.status === 'active'
        return (
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              type='checkbox'
              className='peer sr-only'
              checked={isActive}
              onChange={() => onToggleStatus(pkg.id, pkg.status)}
            />
            <div
              className={`h-5 w-9 rounded-full border transition-colors ${isActive ? 'border-primary bg-primary' : 'border-border bg-muted'} peer-focus-visible:ring-2 peer-focus-visible:ring-ring/30`}
            />
            <span
              className={`pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`}
            />
          </label>
        )
      },
    },
  ]

  return (
    <DataTable
      data={memberships}
      columns={columns}
      loading={loading}
      emptyMessage={t('noMembershipPackages')}
      pagination
      itemsPerPage={10}
      getRowKey={(row) => row.id}
      actions={(row) => (
        <div className='flex items-center justify-center gap-0.5'>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground'
            title={t('actions.view')}
            onClick={() => onView(row.id)}
          >
            <Eye className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground'
            title={t('actions.edit')}
            onClick={() => onEdit(row.id)}
          >
            <Pencil className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
            title={t('actions.delete')}
            onClick={() => onDelete(row.id)}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      )}
    />
  )
}
