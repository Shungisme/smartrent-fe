'use client'

import React, { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Eye, EyeOff, RotateCcw, Search, Settings2 } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Popover } from '@/components/atoms/popover'
import { cn } from '@/lib/utils'
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
  const [query, setQuery] = useState('')

  // Exclude columns that must always render (e.g. actions)
  const toggleableColumns = useMemo(
    () => columns.filter((c) => !c.alwaysVisible),
    [columns],
  )
  const hiddenCount = toggleableColumns.filter(
    (c) => hiddenColumns[c.id],
  ).length
  const visibleCount = toggleableColumns.length - hiddenCount

  const filteredColumns = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return toggleableColumns
    return toggleableColumns.filter((c) => {
      const label =
        typeof c.header === 'string'
          ? c.header.toLowerCase()
          : c.id.toLowerCase()
      return label.includes(q) || c.id.toLowerCase().includes(q)
    })
  }, [toggleableColumns, query])

  const showSearch = toggleableColumns.length > 6

  const trigger = (
    <Button variant='outline' size='sm' className='flex items-center gap-2'>
      <Settings2 className='h-4 w-4' />
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
      contentClassName='w-[300px] overflow-hidden'
    >
      {/* Header */}
      <div className='border-b border-border/60 px-3 py-3'>
        <div className='flex items-center justify-between gap-2'>
          <div className='leading-tight'>
            <div className='text-sm font-semibold text-foreground'>
              {t('viewsTitle')}
            </div>
            <div className='text-[11px] text-muted-foreground'>
              {t.has('viewsCount')
                ? t('viewsCount', {
                    visible: visibleCount,
                    total: toggleableColumns.length,
                  })
                : `${visibleCount} of ${toggleableColumns.length} visible`}
            </div>
          </div>
          <button
            type='button'
            onClick={onShowAll}
            className='shrink-0 text-[11px] font-medium text-primary transition-colors hover:text-primary/80'
          >
            {t('viewsShowAll')}
          </button>
        </div>

        {showSearch && (
          <div className='relative mt-2.5'>
            <Search className='pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground' />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                t.has('viewsSearchPlaceholder')
                  ? t('viewsSearchPlaceholder')
                  : 'Search columns…'
              }
              className='h-8 pl-7 text-xs'
            />
          </div>
        )}
      </div>

      {/* List */}
      <div className='max-h-72 overflow-y-auto p-1.5'>
        {filteredColumns.length === 0 ? (
          <div className='px-3 py-6 text-center text-xs text-muted-foreground'>
            {t.has('viewsNoMatch')
              ? t('viewsNoMatch')
              : 'No columns match your search.'}
          </div>
        ) : (
          filteredColumns.map((column) => {
            const isHidden = !!hiddenColumns[column.id]
            return (
              <button
                key={column.id}
                type='button'
                onClick={() => onToggleColumn(column.id)}
                className={cn(
                  'group flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                  'hover:bg-accent',
                )}
              >
                <span
                  className={cn(
                    'flex items-center gap-2 truncate',
                    isHidden ? 'text-muted-foreground' : 'text-foreground',
                  )}
                >
                  {isHidden ? (
                    <EyeOff className='h-3.5 w-3.5 shrink-0 text-muted-foreground/70' />
                  ) : (
                    <Eye className='h-3.5 w-3.5 shrink-0 text-primary' />
                  )}
                  <span className='truncate'>{column.header}</span>
                </span>

                {/* Toggle switch */}
                <span
                  className={cn(
                    'relative inline-flex h-4 w-7 shrink-0 items-center rounded-full border transition-colors',
                    isHidden
                      ? 'border-border bg-muted'
                      : 'border-primary bg-primary',
                  )}
                  aria-hidden
                >
                  <span
                    className={cn(
                      'absolute h-3 w-3 rounded-full bg-card shadow-sm transition-transform',
                      isHidden ? 'translate-x-0.5' : 'translate-x-3.5',
                    )}
                  />
                </span>
              </button>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className='border-t border-border/60 px-2 py-2'>
        <button
          type='button'
          onClick={onReset}
          className='flex w-full items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
        >
          <RotateCcw className='h-3.5 w-3.5' />
          {t('viewsReset')}
        </button>
      </div>
    </Popover>
  )
}
