import React from 'react'
import { SearchX } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { EmptyState } from '@/components/molecules/emptyState'
import type { TableMobileProps, Column } from './types'

export function TableMobile<T = any>({
  data,
  columns,
  actions,
  customRender,
  getRowKey,
  emptyMessage,
}: TableMobileProps<T>) {
  const t = useTranslations('dataTable')
  const getValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row)
    }
    return row[column.accessor as keyof T]
  }

  // Filter out columns that should be hidden on mobile
  const visibleColumns = columns.filter((col) => !col.hideOnMobile)

  if (data.length === 0) {
    return (
      <div className='table-surface lg:hidden'>
        <EmptyState
          icon={SearchX}
          title={emptyMessage ?? t('noData')}
          description={t('tryAdjustFilters')}
        />
      </div>
    )
  }

  return (
    <div className='lg:hidden space-y-4'>
      {data.map((row, index) => {
        const rowKey = getRowKey(row, index)

        // Use custom render if provided
        if (customRender) {
          return (
            <div
              key={rowKey}
              className='rounded-2xl border border-border/70 bg-card p-4 space-y-3 shadow-xs'
            >
              {customRender(row, index)}

              {/* Actions */}
              {actions && (
                <div className='pt-3 border-t border-border/60'>
                  {actions(row, index)}
                </div>
              )}
            </div>
          )
        }

        // Default card layout
        return (
          <div
            key={rowKey}
            className='rounded-2xl border border-border/70 bg-card p-4 space-y-4 shadow-xs'
          >
            {/* Render each visible column as a row */}
            {visibleColumns.map((column) => {
              const value = getValue(row, column)
              const cellContent = column.render
                ? column.render(value, row)
                : value

              // Skip empty values
              if (
                cellContent === null ||
                cellContent === undefined ||
                cellContent === ''
              ) {
                return null
              }

              return (
                <div
                  key={column.id}
                  className='flex justify-between items-start gap-3'
                >
                  {/* Column label */}
                  <div className='text-xs font-medium text-muted-foreground flex-shrink-0'>
                    {column.mobileLabel || column.header}
                  </div>

                  {/* Column value */}
                  <div className='text-sm text-foreground min-w-0 flex-1 text-right'>
                    {cellContent as React.ReactNode}
                  </div>
                </div>
              )
            })}

            {/* Actions */}
            {actions && (
              <div className='pt-3 border-t border-border/60'>
                {actions(row, index)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
