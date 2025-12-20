import { ReactNode } from 'react'

// Column configuration for the table
export interface Column<T = any> {
  id: string
  header: string
  accessor: keyof T | ((row: T) => any)
  render?: (value: any, row: T) => ReactNode
  sortable?: boolean
  mobileLabel?: string // Label hiển thị trên mobile card
  hideOnMobile?: boolean // Ẩn column này trên mobile
  className?: string // Custom CSS class cho column
}

// Filter configuration types
export type FilterType =
  | 'search'
  | 'select'
  | 'date-range'
  | 'multi-select'
  | 'custom'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterConfig {
  id: string
  type: FilterType
  label: string
  placeholder?: string
  options?: FilterOption[]
  defaultValue?: any
  render?: (props: FilterRenderProps) => ReactNode
  className?: string
}

export interface FilterRenderProps {
  value: any
  onChange: (value: any) => void
  filter: FilterConfig
}

// Filter mode: frontend hoặc API
export type FilterMode = 'frontend' | 'api'

// Sort configuration
export interface SortConfig<T = any> {
  key: keyof T | null
  direction: 'asc' | 'desc' | null
}

// Pagination configuration
export interface PaginationConfig {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

// Main DataTable props
export interface DataTableProps<T = any> {
  // Required props
  data: T[]
  columns: Column<T>[]

  // Filter configuration
  filters?: FilterConfig[]
  filterMode?: FilterMode // Default: 'frontend'
  filterValues?: Record<string, any> // External filter values for controlled mode
  onFilterChange?: (filters: Record<string, any>) => void

  // Pagination
  pagination?: boolean
  itemsPerPage?: number
  itemsPerPageOptions?: number[]
  onPageChange?: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
  totalItems?: number // For API mode

  // Sorting
  sortable?: boolean
  onSortChange?: (sort: SortConfig<T>) => void
  defaultSort?: SortConfig<T>

  // UI customization
  emptyMessage?: string
  loading?: boolean
  loadingMessage?: string

  // Mobile card customization
  mobileCardRender?: (row: T, index: number) => ReactNode

  // Row actions
  actions?: (row: T, index: number) => ReactNode

  // Additional features
  selectable?: boolean // Checkbox để chọn nhiều rows
  onSelectionChange?: (selectedRows: T[]) => void

  // Styling
  className?: string
  tableClassName?: string

  // Key extractor
  getRowKey?: (row: T, index: number) => string | number
}

// Context state type
export interface DataTableContextValue<T = any> {
  // Data
  data: T[]
  filteredData: T[]
  paginatedData: T[]

  // Filters
  filters: Record<string, any>
  setFilter: (key: string, value: any) => void
  clearFilters: () => void

  // Sorting
  sortConfig: SortConfig<T>
  handleSort: (key: keyof T) => void

  // Pagination
  pagination: PaginationConfig
  setCurrentPage: (page: number) => void
  setItemsPerPage: (itemsPerPage: number) => void

  // Selection
  selectedRows: T[]
  toggleRowSelection: (row: T) => void
  toggleAllRows: () => void
  clearSelection: () => void

  // Loading
  loading: boolean
}

// Props for sub-components
export interface TableDesktopProps<T = any> {
  columns: Column<T>[]
  data: T[]
  sortConfig: SortConfig<T>
  onSort: (key: keyof T) => void
  actions?: (row: T, index: number) => ReactNode
  getRowKey: (row: T, index: number) => string | number
  emptyMessage?: string
  selectable?: boolean
  selectedRows?: T[]
  onRowSelect?: (row: T) => void
  onSelectAll?: () => void
}

export interface TableMobileProps<T = any> {
  data: T[]
  columns: Column<T>[]
  actions?: (row: T, index: number) => ReactNode
  customRender?: (row: T, index: number) => ReactNode
  getRowKey: (row: T, index: number) => string | number
  emptyMessage?: string
}

export interface TableFiltersProps {
  filters: FilterConfig[]
  values: Record<string, any>
  onChange: (key: string, value: any) => void
  onClear?: () => void
  mode?: FilterMode
}
