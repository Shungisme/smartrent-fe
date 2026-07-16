import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import type {
  DataTableContextValue,
  SortConfig,
  PaginationConfig,
  FilterMode,
  FilterConfig,
} from './types'

const DataTableContext = createContext<DataTableContextValue | null>(null)

// Pagination state is kept in the same record as the filter values so API mode
// can forward it in one payload. Frontend filtering must skip these keys — they
// are not row fields, and matching them against `item[key]` drops every row.
const PAGINATION_KEYS = new Set(['page', 'pageSize'])

// Match one row against one active filter value. The filter's declared type
// decides the strategy: only free-text search is a substring match, everything
// else compares whole values — a `select` for status 'PENDING' must not match a
// row whose status merely contains that text.
function matchesFilter(
  itemValue: unknown,
  value: unknown,
  filter?: FilterConfig,
): boolean {
  if (Array.isArray(value)) {
    return value.some((v) => String(itemValue) === String(v))
  }

  // CSV values (e.g. role:SA,UA) stand for "any of these".
  if (filter?.allowMultiple && typeof value === 'string') {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
      .some((v) => String(itemValue) === v)
  }

  if (filter?.type === 'search' && typeof value === 'string') {
    return String(itemValue).toLowerCase().includes(value.toLowerCase())
  }

  if (typeof value === 'string') {
    return String(itemValue).toLowerCase() === value.toLowerCase()
  }

  return itemValue === value
}

export const useDataTable = <T = any,>() => {
  const context = useContext(
    DataTableContext,
  ) as DataTableContextValue<T> | null
  if (!context) {
    throw new Error('useDataTable must be used within DataTableProvider')
  }
  return context
}

interface DataTableProviderProps<T> {
  children: React.ReactNode
  data: T[]
  /** Filter definitions, used by frontend mode to pick a match strategy per field. */
  filterConfig?: FilterConfig[]
  filterMode?: FilterMode
  filterValues?: Record<string, any> // External filter values for controlled mode
  onFilterChange?: (filters: Record<string, any>) => void
  onSortChange?: (sort: SortConfig<T>) => void
  onPageChange?: (page: number) => void
  defaultSort?: SortConfig<T>
  itemsPerPage?: number
  totalItems?: number // For API mode
  loading?: boolean
}

export function DataTableProvider<T = any>({
  children,
  data,
  filterConfig,
  filterMode = 'frontend',
  filterValues: externalFilterValues,
  onFilterChange,
  onSortChange,
  onPageChange,
  defaultSort,
  itemsPerPage: initialItemsPerPage = 20,
  totalItems: externalTotalItems,
  loading = false,
}: DataTableProviderProps<T>) {
  // State management
  const [filters, setFilters] = useState<Record<string, any>>(
    externalFilterValues || {},
  )
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(
    defaultSort || { key: null, direction: null },
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage)
  const [selectedRows, setSelectedRows] = useState<T[]>([])

  // Filter data (frontend mode only)
  const filteredData = useMemo(() => {
    if (filterMode === 'api') {
      return data // API handles filtering
    }

    let result = [...data]

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (PAGINATION_KEYS.has(key)) return
      if (!value || value === '' || value === 'all') return
      if (Array.isArray(value) && value.length === 0) return

      const filter = filterConfig?.find((f) => f.id === key)

      result = result.filter((item: any) =>
        matchesFilter(item[key], value, filter),
      )
    })

    return result
  }, [data, filters, filterMode, filterConfig])

  // Sort data (frontend mode only)
  const sortedData = useMemo(() => {
    if (filterMode === 'api' || !sortConfig.key || !sortConfig.direction) {
      return filteredData
    }

    const sorted = [...filteredData].sort((a: any, b: any) => {
      const aValue = a[sortConfig.key as keyof T]
      const bValue = b[sortConfig.key as keyof T]

      if (aValue === bValue) return 0

      const comparison = aValue > bValue ? 1 : -1
      return sortConfig.direction === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [filteredData, sortConfig, filterMode])

  // Pagination
  const totalItems =
    filterMode === 'api' && externalTotalItems
      ? externalTotalItems
      : sortedData.length

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const paginatedData = useMemo(() => {
    if (filterMode === 'api') {
      return data // API handles pagination
    }

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return sortedData.slice(startIndex, endIndex)
  }, [sortedData, currentPage, itemsPerPage, data, filterMode])

  const pagination: PaginationConfig = {
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
  }

  // Filter handlers
  const setFilter = useCallback(
    (key: string, value: any) => {
      const updated = { ...filters, [key]: value, page: 1 }

      setFilters(updated)
      // Reset to page 1 when filtering
      setCurrentPage(1)

      // Notify parent if in API mode
      if (filterMode === 'api' && onFilterChange) {
        onFilterChange(updated)
      }
    },
    [filterMode, onFilterChange, filters],
  )

  const clearFilters = useCallback(() => {
    const clearedFilters: Record<string, any> = {
      page: 1,
      pageSize: itemsPerPage,
    }
    setFilters(clearedFilters)
    setCurrentPage(1)

    if (filterMode === 'api' && onFilterChange) {
      onFilterChange(clearedFilters)
    }
  }, [filterMode, onFilterChange, itemsPerPage])

  // Replace all filter values at once. Used when applying a full set of
  // filters from the FilterDialog so that keys no longer present are
  // actually removed from state (not just overwritten).
  const replaceFilters = useCallback(
    (newFilters: Record<string, any>) => {
      const next: Record<string, any> = {
        ...newFilters,
        page: 1,
        pageSize: itemsPerPage,
      }

      setFilters(next)
      setCurrentPage(1)

      if (filterMode === 'api' && onFilterChange) {
        onFilterChange(next)
      }
    },
    [filterMode, onFilterChange, itemsPerPage],
  )

  // Sort handler
  const handleSort = useCallback(
    (key: keyof T) => {
      let direction: 'asc' | 'desc' | null = 'asc'

      if (sortConfig.key === key) {
        if (sortConfig.direction === 'asc') direction = 'desc'
        else if (sortConfig.direction === 'desc') direction = null
      }

      const newSort = { key: direction ? key : null, direction }
      setSortConfig(newSort)

      // Notify parent if in API mode
      if (filterMode === 'api' && onSortChange) {
        onSortChange(newSort)
      }
    },
    [filterMode, onSortChange, sortConfig],
  )

  // Pagination handlers
  const handleSetCurrentPage = useCallback(
    (page: number) => {
      setCurrentPage(page)

      if (filterMode === 'api') {
        if (onPageChange) {
          onPageChange(page)
        }
        // Also update filters with new page
        if (onFilterChange) {
          const updated = { ...filters, page }
          onFilterChange(updated)
        }
      }
    },
    [filterMode, onPageChange, onFilterChange, filters],
  )

  const handleSetItemsPerPage = useCallback(
    (perPage: number) => {
      setItemsPerPage(perPage)
      setCurrentPage(1) // Reset to first page

      if (filterMode === 'api') {
        if (onPageChange) {
          onPageChange(1)
        }
        // Also update filters with new pageSize and reset page
        if (onFilterChange) {
          const updated = { ...filters, page: 1, pageSize: perPage }
          onFilterChange(updated)
        }
      }
    },
    [filterMode, onPageChange, onFilterChange, filters],
  )

  // Selection handlers
  const toggleRowSelection = useCallback((row: T) => {
    setSelectedRows((prev) => {
      const isSelected = prev.includes(row)
      return isSelected ? prev.filter((r) => r !== row) : [...prev, row]
    })
  }, [])

  const toggleAllRows = useCallback(() => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows([...paginatedData])
    }
  }, [selectedRows.length, paginatedData])

  const clearSelection = useCallback(() => {
    setSelectedRows([])
  }, [])

  // Sync internal filters with external values (for controlled mode)
  useEffect(() => {
    if (externalFilterValues) {
      setFilters(externalFilterValues)
      // Sync page if provided
      if (
        externalFilterValues.page &&
        typeof externalFilterValues.page === 'number'
      ) {
        setCurrentPage(externalFilterValues.page)
      }
      // Sync pageSize if provided
      if (
        externalFilterValues.pageSize &&
        typeof externalFilterValues.pageSize === 'number'
      ) {
        setItemsPerPage(externalFilterValues.pageSize)
      }
    }
  }, [externalFilterValues])

  // Reset page when data changes in API mode
  useEffect(() => {
    if (filterMode === 'api' && currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage, filterMode])

  const value: DataTableContextValue<T> = {
    data,
    filteredData,
    paginatedData,
    filters,
    setFilter,
    replaceFilters,
    clearFilters,
    sortConfig,
    handleSort,
    pagination,
    setCurrentPage: handleSetCurrentPage,
    setItemsPerPage: handleSetItemsPerPage,
    selectedRows,
    toggleRowSelection,
    toggleAllRows,
    clearSelection,
    loading,
  }

  return (
    <DataTableContext.Provider value={value as DataTableContextValue}>
      {children}
    </DataTableContext.Provider>
  )
}
