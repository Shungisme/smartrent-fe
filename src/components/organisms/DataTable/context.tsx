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
} from './types'

const DataTableContext = createContext<DataTableContextValue | null>(null)

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
  filterMode = 'frontend',
  filterValues: externalFilterValues,
  onFilterChange,
  onSortChange,
  onPageChange,
  defaultSort,
  itemsPerPage: initialItemsPerPage = 10,
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
      if (!value || value === '' || value === 'all') return

      result = result.filter((item: any) => {
        const itemValue = item[key]

        if (typeof value === 'string') {
          // Search filter - case insensitive
          return String(itemValue).toLowerCase().includes(value.toLowerCase())
        }

        if (Array.isArray(value)) {
          // Multi-select filter
          return value.includes(itemValue)
        }

        // Exact match filter
        return itemValue === value
      })
    })

    return result
  }, [data, filters, filterMode])

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
      setFilters((prev) => {
        const updated = { ...prev, [key]: value }

        // Notify parent if in API mode
        if (filterMode === 'api' && onFilterChange) {
          onFilterChange(updated)
        }

        // Reset to page 1 when filtering
        setCurrentPage(1)

        return updated
      })
    },
    [filterMode, onFilterChange],
  )

  const clearFilters = useCallback(() => {
    setFilters({})
    setCurrentPage(1)

    if (filterMode === 'api' && onFilterChange) {
      onFilterChange({})
    }
  }, [filterMode, onFilterChange])

  // Sort handler
  const handleSort = useCallback(
    (key: keyof T) => {
      setSortConfig((prev) => {
        let direction: 'asc' | 'desc' | null = 'asc'

        if (prev.key === key) {
          if (prev.direction === 'asc') direction = 'desc'
          else if (prev.direction === 'desc') direction = null
        }

        const newSort = { key: direction ? key : null, direction }

        // Notify parent if in API mode
        if (filterMode === 'api' && onSortChange) {
          onSortChange(newSort)
        }

        return newSort
      })
    },
    [filterMode, onSortChange],
  )

  // Pagination handlers
  const handleSetCurrentPage = useCallback(
    (page: number) => {
      setCurrentPage(page)

      if (filterMode === 'api' && onPageChange) {
        onPageChange(page)
      }
    },
    [filterMode, onPageChange],
  )

  const handleSetItemsPerPage = useCallback(
    (perPage: number) => {
      setItemsPerPage(perPage)
      setCurrentPage(1) // Reset to first page

      if (filterMode === 'api' && onPageChange) {
        onPageChange(1)
      }
    },
    [filterMode, onPageChange],
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
