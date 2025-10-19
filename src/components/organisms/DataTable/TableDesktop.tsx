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
    <div className='hidden lg:block rounded-2xl border border-gray-200 bg-white shadow-sm overflow-x-auto'>
      <table className='w-full min-w-[800px]'>
        {/* Table Header */}
        <thead className='bg-gray-50 border-b border-gray-100'>
          <tr>
            {/* Selection checkbox */}
            {selectable && (
              <th className='px-4 py-3 text-left w-12'>
                <input
                  type='checkbox'
                  checked={allSelected}
                  onChange={onSelectAll}
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
              </th>
            )}

            {/* Column headers */}
            {columns.map((column) => (
              <th
                key={column.id}
                className={`px-4 py-3 text-left text-sm font-semibold text-gray-700 ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                } ${column.className || ''}`}
                onClick={() => column.sortable && onSort(column.id as keyof T)}
              >
                <div className='flex items-center gap-2'>
                  <span>{column.header}</span>
                  {column.sortable && renderSortIcon(column.id)}
                </div>
              </th>
            ))}

            {/* Actions column */}
            {actions && (
              <th className='px-4 py-3 text-right text-sm font-semibold text-gray-700'>
                Actions
              </th>
            )}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className='divide-y divide-gray-100'>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={
                  columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)
                }
                className='px-4 py-12 text-center text-gray-500'
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
                  className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                >
                  {/* Selection checkbox */}
                  {selectable && (
                    <td className='px-4 py-4'>
                      <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={() => onRowSelect?.(row)}
                        className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
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
                        className={`px-4 py-4 text-sm text-gray-900 ${column.className || ''}`}
                      >
                        {cellContent}
                      </td>
                    )
                  })}

                  {/* Actions */}
                  {actions && (
                    <td className='px-4 py-4 text-right'>
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
  )
}
