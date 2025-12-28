import React from 'react'
import type { TableMobileProps, Column } from './types'

export function TableMobile<T = any>({
  data,
  columns,
  actions,
  customRender,
  getRowKey,
  emptyMessage = 'No data found',
}: TableMobileProps<T>) {
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
      <div className='lg:hidden rounded-2xl border border-gray-200 bg-white px-4 py-12 text-center text-gray-500'>
        {emptyMessage}
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
              className='rounded-2xl border border-gray-200 bg-white p-4 space-y-3'
            >
              {customRender(row, index)}

              {/* Actions */}
              {actions && (
                <div className='pt-3 border-t border-gray-100'>
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
            className='rounded-2xl border border-gray-200 bg-white p-4 space-y-4'
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
                  <div className='text-xs font-medium text-gray-500 flex-shrink-0'>
                    {column.mobileLabel || column.header}
                  </div>

                  {/* Column value */}
                  <div className='text-sm text-gray-900 flex flex-col items-end flex-1'>
                    {cellContent as React.ReactNode}
                  </div>
                </div>
              )
            })}

            {/* Actions */}
            {actions && (
              <div className='pt-3 border-t border-gray-100'>
                {actions(row, index)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
