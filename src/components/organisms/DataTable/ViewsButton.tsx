'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Eye } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import { Popover } from '@/components/atoms/popover'
import type { Column } from './types'

export interface ViewsButtonProps<T = Record<string, unknown>> {
  columns: Column<T>[]
  hiddenColumns: Record<string, boolean>
  onToggleColumn: (columnId: string) => void
  onShowAll: () => void
  onReset: () => void
}

export function ViewsButton<T = Record<string, unknown>>({
  columns,
  hiddenColumns,
  onToggleColumn,
  onShowAll,
  onReset,
}: ViewsButtonProps<T>) {
  const t = useTranslations('dataTable')
  const [open, setOpen] = useState(false)

  // Exclude columns that must always render (e.g. actions)
  const toggleableColumns = columns.filter((c) => !c.alwaysVisible)
  const hiddenCount = toggleableColumns.filter(
    (c) => hiddenColumns[c.id],
  ).length

  const trigger = (
    <Button variant='outline' size='sm' className='flex items-center gap-2'>
      <Eye className='h-4 w-4' />
      {t('viewsButton')}
      {hiddenCount > 0 && (
        <span className='ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/12 px-1.5 text-[11px] font-semibold text-primary'>
          {hiddenCount}
        </span>
      )}
    </Button>
  )

  return (
    <Popover
      isOpen={open}
      onOpenChange={setOpen}
      trigger={trigger}
      align='start'
      contentClassName='w-[260px]'
    >
      <div className='p-3 space-y-2'>
        <div className='text-xs font-semibold text-gray-700 uppercase tracking-wide pb-2 border-b'>
          {t('viewsTitle')}
        </div>

        <div className='max-h-72 overflow-y-auto space-y-1'>
          {toggleableColumns.map((column) => {
            const isHidden = !!hiddenColumns[column.id]
            return (
              <label
                key={column.id}
                className='flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer text-sm'
              >
                <input
                  type='checkbox'
                  checked={!isHidden}
                  onChange={() => onToggleColumn(column.id)}
                  className='h-4 w-4 rounded border-border text-primary focus:ring-primary'
                />
                <span className='text-gray-700'>{column.header}</span>
              </label>
            )
          })}
        </div>

        <div className='flex gap-2 justify-end pt-2 border-t'>
          <Button variant='ghost' size='sm' onClick={onShowAll}>
            {t('viewsShowAll')}
          </Button>
          <Button variant='outline' size='sm' onClick={onReset}>
            {t('viewsReset')}
          </Button>
        </div>
      </div>
    </Popover>
  )
}
