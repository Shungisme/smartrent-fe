import React from 'react'
import { DataTableProvider, useDataTable } from './context'
import { TableFilters } from './TableFilters'
import { TableDesktop } from './TableDesktop'
import { TableMobile } from './TableMobile'
import { TablePagination } from './TablePagination'
import type { DataTableProps } from './types'

// Internal component that uses the context
function DataTableContent<T = any>({
  columns,
  filters,
  emptyMessage,
  actions,
  getRowKey,
  mobileCardRender,
  selectable,
  onSelectionChange,
  filterMode = 'frontend',
  itemsPerPageOptions,
}: Omit<DataTableProps<T>, 'data'>) {
  const {
    paginatedData,
    filters: filterValues,
    setFilter,
    clearFilters,
    sortConfig,
    handleSort,
    pagination,
    setCurrentPage,
    setItemsPerPage,
    selectedRows,
    toggleRowSelection,
    toggleAllRows,
    loading,
  } = useDataTable<T>()

  // Default row key extractor
  const defaultGetRowKey = (row: T, index: number) => {
    if (typeof row === 'object' && row !== null && 'id' in row) {
      return (row as any).id
    }
    return index
  }

  const rowKeyExtractor = getRowKey || defaultGetRowKey

  // Notify parent of selection changes
  React.useEffect(() => {
    if (selectable && onSelectionChange) {
      onSelectionChange(selectedRows)
    }
  }, [selectedRows, selectable, onSelectionChange])

  return (
    <div className='space-y-4'>
      {/* Filters */}
      {filters && filters.length > 0 && (
        <TableFilters
          filters={filters}
          values={filterValues}
          onChange={setFilter}
          onClear={clearFilters}
          mode={filterMode}
        />
      )}

      {/* Loading state */}
      {loading ? (
        <div className='rounded-2xl border border-gray-200 bg-white px-4 py-12 text-center text-gray-500'>
          <div className='flex flex-col items-center gap-3'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600'></div>
            <span>Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <TableDesktop
            columns={columns}
            data={paginatedData}
            sortConfig={sortConfig}
            onSort={handleSort}
            actions={actions}
            getRowKey={rowKeyExtractor}
            emptyMessage={emptyMessage}
            selectable={selectable}
            selectedRows={selectedRows}
            onRowSelect={toggleRowSelection}
            onSelectAll={toggleAllRows}
          />

          {/* Mobile Cards */}
          <TableMobile
            data={paginatedData}
            columns={columns}
            actions={actions}
            customRender={mobileCardRender}
            getRowKey={rowKeyExtractor}
            emptyMessage={emptyMessage}
          />
        </>
      )}

      {/* Pagination */}
      {pagination.totalItems > 0 && (
        <TablePagination
          pagination={pagination}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          itemsPerPageOptions={itemsPerPageOptions}
        />
      )}
    </div>
  )
}

// Main exported component with Provider
export function DataTable<T = any>(props: DataTableProps<T>) {
  const {
    data,
    filterMode = 'frontend',
    filterValues,
    onFilterChange,
    onSortChange,
    onPageChange,
    defaultSort,
    itemsPerPage = 10,
    totalItems,
    loading = false,
    ...contentProps
  } = props

  return (
    <DataTableProvider
      data={data}
      filterMode={filterMode}
      filterValues={filterValues}
      onFilterChange={onFilterChange}
      onSortChange={onSortChange}
      onPageChange={onPageChange}
      defaultSort={defaultSort}
      itemsPerPage={itemsPerPage}
      totalItems={totalItems}
      loading={loading}
    >
      <DataTableContent<T> {...contentProps} filterMode={filterMode} />
    </DataTableProvider>
  )
}

// Re-export types for convenience
export type { DataTableProps, Column, FilterConfig } from './types'
