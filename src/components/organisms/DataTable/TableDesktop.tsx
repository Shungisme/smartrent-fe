import React from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, SearchX } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { EmptyState } from '@/components/molecules/emptyState'
import type { TableDesktopProps, Column } from './types'

export function TableDesktop<T = any>({
  columns,
  data,
  sortConfig,
  onSort,
  actions,
  getRowKey,
  emptyMessage,
  selectable,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  maxHeightClassName,
}: TableDesktopProps<T>) {
  const t = useTranslations('dataTable')
  const getValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row)
    }
    return row[column.accessor as keyof T]
  }

  const renderSortIcon = (columnId: string) => {
    if (sortConfig.key === columnId) {
      if (sortConfig.direction === 'asc') {
        return <ChevronUp className='h-3.5 w-3.5 text-foreground' />
      }
      if (sortConfig.direction === 'desc') {
        return <ChevronDown className='h-3.5 w-3.5 text-foreground' />
      }
    }
    return <ChevronsUpDown className='h-3.5 w-3.5 text-muted-foreground/50' />
  }

  const allSelected =
    selectable && data.length > 0 && selectedRows.length === data.length

  return (
    <div className='table-surface hidden lg:block'>
      <div
        className={`overflow-y-auto ${
          maxHeightClassName || 'h-[50vh] xl:h-[56vh] 2xl:h-[60vh]'
        }`}
      >
        <table className='w-full min-w-[800px] border-separate border-spacing-0'>
          <thead className='sticky top-0 z-10 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80'>
            <tr>
              {selectable && (
                <th className='w-12 border-b border-border/70 px-5 py-3 text-left'>
                  <input
                    type='checkbox'
                    checked={allSelected}
                    onChange={onSelectAll}
                    className='h-4 w-4 rounded border-border text-primary focus:ring-primary'
                  />
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`border-b border-border/70 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground ${
                    column.sortable
                      ? 'cursor-pointer select-none hover:text-foreground'
                      : ''
                  } ${column.className || ''}`}
                  onClick={() =>
                    column.sortable && onSort(column.id as keyof T)
                  }
                >
                  <div className='flex items-center gap-1.5'>
                    <span>{column.header}</span>
                    {column.sortable && renderSortIcon(column.id)}
                  </div>
                </th>
              ))}

              {actions && (
                <th className='border-b border-border/70 px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground'>
                  {t('actions')}
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)
                  }
                  className='p-0'
                >
                  <EmptyState
                    icon={SearchX}
                    title={emptyMessage ?? t('noData')}
                    description={t('tryAdjustFilters')}
                  />
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const rowKey = getRowKey(row, index)
                const isSelected = selectable && selectedRows.includes(row)
                const isLast = index === data.length - 1

                return (
                  <tr
                    key={rowKey}
                    className={`group transition-colors hover:bg-muted/40 ${isSelected ? 'bg-primary/6' : ''}`}
                  >
                    {selectable && (
                      <td
                        className={`px-5 py-3.5 ${isLast ? '' : 'border-b border-border/50'}`}
                      >
                        <input
                          type='checkbox'
                          checked={isSelected}
                          onChange={() => onRowSelect?.(row)}
                          className='h-4 w-4 rounded border-border text-primary focus:ring-primary'
                        />
                      </td>
                    )}

                    {columns.map((column) => {
                      const value = getValue(row, column)
                      const cellContent = column.render
                        ? column.render(value, row)
                        : value

                      return (
                        <td
                          key={column.id}
                          className={`px-5 py-3.5 align-middle text-sm text-foreground ${isLast ? '' : 'border-b border-border/50'} ${column.className || ''}`}
                        >
                          {cellContent as React.ReactNode}
                        </td>
                      )
                    })}

                    {actions && (
                      <td
                        className={`px-5 py-3.5 text-right ${isLast ? '' : 'border-b border-border/50'}`}
                      >
                        {actions(row, index)}
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
