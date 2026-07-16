import React from 'react'
import { DataTableProvider, useDataTable } from './context'
import { TableFilters } from './TableFilters'
import { TableDesktop } from './TableDesktop'
import { TableMobile } from './TableMobile'
import { TablePagination } from './TablePagination'
import { ViewsButton } from './ViewsButton'
import { TableSkeleton } from '@/components/molecules/tableSkeleton'
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
  toolbarActions,
}: Omit<DataTableProps<T>, 'data'>) {
  const {
    paginatedData,
    filters: filterValues,
    setFilter,
    replaceFilters,
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

  // Handler for batch filter updates (from FilterDialog).
  // Uses replaceFilters so keys that are no longer in `newFilters` are
  // actually removed from state — otherwise stale filter conditions
  // (e.g. an old firstName) keep leaking into API queries.
  const handleChangeMultiple = React.useCallback(
    (newFilters: Record<string, unknown>) => {
      replaceFilters(newFilters)
    },
    [replaceFilters],
  )

  // Column visibility state — initialised from each column's defaultHidden flag
  const initialHidden = React.useMemo(() => {
    const map: Record<string, boolean> = {}
    columns.forEach((c) => {
      if (c.defaultHidden && !c.alwaysVisible) {
        map[c.id] = true
      }
    })
    return map
  }, [columns])

  const [hiddenColumns, setHiddenColumns] =
    React.useState<Record<string, boolean>>(initialHidden)

  const toggleColumn = React.useCallback((columnId: string) => {
    setHiddenColumns((prev) => ({ ...prev, [columnId]: !prev[columnId] }))
  }, [])

  const showAllColumns = React.useCallback(() => {
    setHiddenColumns({})
  }, [])

  const resetColumns = React.useCallback(() => {
    setHiddenColumns(initialHidden)
  }, [initialHidden])

  const visibleColumns = React.useMemo(
    () => columns.filter((c) => c.alwaysVisible || !hiddenColumns[c.id]),
    [columns, hiddenColumns],
  )

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
      {/* Toolbar: filters + views on the left, actions on the right */}
      {(filters && filters.length > 0) ||
      columns.length > 0 ||
      toolbarActions ? (
        <div className='flex flex-wrap items-center gap-2'>
          {filters && filters.length > 0 && (
            <TableFilters
              filters={filters}
              values={filterValues}
              onChange={setFilter}
              onChangeMultiple={handleChangeMultiple}
              onClear={clearFilters}
              mode={filterMode}
            />
          )}
          <ViewsButton
            columns={columns}
            hiddenColumns={hiddenColumns}
            onToggleColumn={toggleColumn}
            onShowAll={showAllColumns}
            onReset={resetColumns}
          />
          {toolbarActions && (
            <div className='ml-auto flex items-center gap-2'>
              {toolbarActions}
            </div>
          )}
        </div>
      ) : null}

      {/* Loading state */}
      {loading ? (
        <TableSkeleton
          columns={visibleColumns.length}
          rows={Math.min(pagination.itemsPerPage || 8, 8)}
          selectable={selectable}
          actions={!!actions}
        />
      ) : (
        <>
          {/* Desktop Table */}
          <TableDesktop
            columns={visibleColumns}
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
            columns={visibleColumns}
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
    filters,
    filterMode = 'frontend',
    filterValues,
    onFilterChange,
    onSortChange,
    onPageChange,
    defaultSort,
    itemsPerPage = 20,
    totalItems,
    loading = false,
    ...contentProps
  } = props

  return (
    <DataTableProvider
      data={data}
      filterConfig={filters}
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
      <DataTableContent<T>
        {...contentProps}
        filters={filters}
        filterMode={filterMode}
      />
    </DataTableProvider>
  )
}

// Re-export types for convenience
export type { DataTableProps, Column, FilterConfig } from './types'
