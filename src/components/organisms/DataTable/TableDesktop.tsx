import React from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, SearchX } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { EmptyState } from '@/components/molecules/emptyState'
import type { TableDesktopProps, Column } from './types'

// Shared width for every table's actions column. Sized for ~3 icon buttons
// (h-8 w-8 each + gap + horizontal padding) so every page lines up.
const ACTIONS_COLUMN_WIDTH = '7.5rem'

const isActionsColumn = <T,>(column: Column<T>) => column.id === 'actions'

const toCssLength = (
  value: string | number | undefined,
): string | undefined => {
  if (value === undefined) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

const buildColumnStyle = <T,>(column: Column<T>): React.CSSProperties => {
  const style: React.CSSProperties = {}
  const width = toCssLength(column.width)
  const maxWidth = toCssLength(column.maxWidth)
  const minWidth = toCssLength(column.minWidth)
  if (width) style.width = width
  if (maxWidth) style.maxWidth = maxWidth
  if (minWidth) style.minWidth = minWidth

  // Apply the shared actions column width unless explicitly overridden.
  if (isActionsColumn(column)) {
    if (!width) style.width = ACTIONS_COLUMN_WIDTH
    if (!minWidth) style.minWidth = ACTIONS_COLUMN_WIDTH
  }

  return style
}

const resolveAlign = <T,>(column: Column<T>): 'left' | 'center' | 'right' => {
  if (column.align) return column.align
  if (isActionsColumn(column)) return 'center'
  return 'left'
}

const alignClass = (align: 'left' | 'center' | 'right') => {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return 'text-left'
}

const buildContentWrapperStyle = <T,>(
  column: Column<T>,
): React.CSSProperties | undefined => {
  if (column.maxWidth === undefined) return undefined
  return { maxWidth: toCssLength(column.maxWidth) }
}

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

  const actionsStyle: React.CSSProperties = {
    width: ACTIONS_COLUMN_WIDTH,
    minWidth: ACTIONS_COLUMN_WIDTH,
  }

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

              {columns.map((column) => {
                const align = resolveAlign(column)
                return (
                  <th
                    key={column.id}
                    style={buildColumnStyle(column)}
                    className={`border-b border-border/70 px-5 py-3 ${alignClass(align)} text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground ${
                      column.sortable
                        ? 'cursor-pointer select-none hover:text-foreground'
                        : ''
                    } ${column.className || ''}`}
                    onClick={() =>
                      column.sortable && onSort(column.id as keyof T)
                    }
                  >
                    <div
                      className={`flex items-center gap-1.5 ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : ''}`}
                    >
                      <span>{column.header}</span>
                      {column.sortable && renderSortIcon(column.id)}
                    </div>
                  </th>
                )
              })}

              {actions && (
                <th
                  style={actionsStyle}
                  className='border-b border-border/70 px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground'
                >
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
                      const wrapperStyle = buildContentWrapperStyle(column)
                      const align = resolveAlign(column)

                      return (
                        <td
                          key={column.id}
                          style={buildColumnStyle(column)}
                          className={`px-5 py-3.5 align-middle text-sm text-foreground ${alignClass(align)} ${isLast ? '' : 'border-b border-border/50'} ${column.className || ''}`}
                          title={
                            column.maxWidth !== undefined &&
                            typeof cellContent === 'string'
                              ? cellContent
                              : undefined
                          }
                        >
                          {wrapperStyle ? (
                            <div style={wrapperStyle} className='truncate'>
                              {cellContent as React.ReactNode}
                            </div>
                          ) : (
                            (cellContent as React.ReactNode)
                          )}
                        </td>
                      )
                    })}

                    {actions && (
                      <td
                        style={actionsStyle}
                        className={`px-4 py-3.5 text-center ${isLast ? '' : 'border-b border-border/50'}`}
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
