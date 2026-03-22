import React from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import type { TableDesktopProps, Column } from './types'

export function TableDesktop<T = any>({
  columns,
  data,
  sortConfig,
  onSort,
  actions,
  getRowKey,
  emptyMessage = 'No data found',
  selectable,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  maxHeightClassName,
}: TableDesktopProps<T>) {
  const getValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row)
    }
    return row[column.accessor as keyof T]
  }

  const renderSortIcon = (columnId: string) => {
    if (sortConfig.key === columnId) {
      if (sortConfig.direction === 'asc') {
        return <ChevronUp className='h-4 w-4' />
      }
      if (sortConfig.direction === 'desc') {
        return <ChevronDown className='h-4 w-4' />
      }
    }
    return <ChevronsUpDown className='h-4 w-4 text-gray-400' />
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
        <table className='w-full min-w-[800px]'>
          {/* Table Header */}
          <thead className='sticky top-0 z-10 border-b border-border/70 bg-muted/65 backdrop-blur'>
            <tr>
              {/* Selection checkbox */}
              {selectable && (
                <th className='w-12 px-5 py-3.5 text-left'>
                  <input
                    type='checkbox'
                    checked={allSelected}
                    onChange={onSelectAll}
                    className='h-4 w-4 rounded border-border text-primary focus:ring-primary'
                  />
                </th>
              )}

              {/* Column headers */}
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`px-5 py-3.5 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase ${
                    column.sortable ? 'cursor-pointer hover:bg-muted/80' : ''
                  } ${column.className || ''}`}
                  onClick={() =>
                    column.sortable && onSort(column.id as keyof T)
                  }
                >
                  <div className='flex items-center gap-2'>
                    <span>{column.header}</span>
                    {column.sortable && renderSortIcon(column.id)}
                  </div>
                </th>
              ))}

              {/* Actions column */}
              {actions && (
                <th className='px-5 py-3.5 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase'>
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)
                  }
                  className='px-5 py-14 text-center text-sm text-muted-foreground'
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const rowKey = getRowKey(row, index)
                const isSelected = selectable && selectedRows.includes(row)

                return (
                  <tr
                    key={rowKey}
                    className={`border-b border-border/60 transition-colors hover:bg-accent/55 ${isSelected ? 'bg-primary/8' : ''}`}
                  >
                    {/* Selection checkbox */}
                    {selectable && (
                      <td className='px-5 py-4'>
                        <input
                          type='checkbox'
                          checked={isSelected}
                          onChange={() => onRowSelect?.(row)}
                          className='h-4 w-4 rounded border-border text-primary focus:ring-primary'
                        />
                      </td>
                    )}

                    {/* Column data */}
                    {columns.map((column) => {
                      const value = getValue(row, column)
                      const cellContent = column.render
                        ? column.render(value, row)
                        : value

                      return (
                        <td
                          key={column.id}
                          className={`px-5 py-4 text-sm text-foreground ${column.className || ''}`}
                        >
                          {cellContent as React.ReactNode}
                        </td>
                      )
                    })}

                    {/* Actions */}
                    {actions && (
                      <td className='px-5 py-4 text-right'>
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
