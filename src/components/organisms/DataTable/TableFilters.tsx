import React from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/atoms/input'
import { Button } from '@/components/atoms/button'
import { Search, X } from 'lucide-react'
import { FilterDialog } from './FilterDialog'
import type { TableFiltersProps, FilterConfig } from './types'

export function TableFilters({
  filters,
  values,
  onChange,
  onChangeMultiple,
  onClear,
}: TableFiltersProps) {
  const t = useTranslations('dataTable')

  if (!filters || filters.length === 0) return null

  // Check if there are filter fields meant for FilterDialog
  const filterDialogFilters = filters.filter((f) => f.isFilterField)
  const hasFilterDialog = filterDialogFilters.length > 0

  const hasActiveFilters = Object.values(values).some((value) => {
    if (Array.isArray(value)) return value.length > 0

    return (
      value !== undefined && value !== null && value !== '' && value !== 'all'
    )
  })

  // If we have FilterDialog filters, show only the FilterDialog
  if (hasFilterDialog) {
    return (
      <FilterDialog
        filterConfig={filterDialogFilters}
        currentFilters={values}
        onFilterChange={(newFilters) => {
          if (onChangeMultiple) {
            onChangeMultiple(newFilters)
          } else {
            Object.entries(newFilters).forEach(([key, value]) => {
              onChange(key, value)
            })
          }
        }}
        onClear={() => onClear?.()}
      />
    )
  }

  // Original filter rendering for backward compatibility
  const renderFilter = (filter: FilterConfig) => {
    const value = Object.prototype.hasOwnProperty.call(values, filter.id)
      ? values[filter.id]
      : (filter.defaultValue ?? '')
    const stringValue = typeof value === 'string' ? value : String(value || '')

    // Custom render function
    if (filter.render) {
      return (
        <div key={filter.id}>
          {filter.render({
            value,
            onChange: (newValue) => onChange(filter.id, newValue),
            filter,
          })}
        </div>
      )
    }

    // Search filter
    if (filter.type === 'search') {
      return (
        <div key={filter.id} className='relative flex-1 min-w-[200px]'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            type='text'
            placeholder={filter.placeholder || filter.label}
            value={stringValue}
            onChange={(e) => onChange(filter.id, e.target.value)}
            className={`w-full pl-10 ${filter.className || ''}`}
          />
        </div>
      )
    }

    // Select filter
    if (filter.type === 'select') {
      return (
        <select
          key={filter.id}
          value={stringValue}
          onChange={(e) => onChange(filter.id, e.target.value)}
          className={`h-10 rounded-md border border-border bg-card px-3 text-sm text-foreground shadow-xs focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30 ${filter.className || ''}`}
        >
          <option value=''>{filter.label}</option>
          {filter.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    // Multi-select filter
    if (filter.type === 'multi-select') {
      const selectedValues = Array.isArray(value) ? value : []

      return (
        <div key={filter.id} className={`relative ${filter.className || ''}`}>
          <select
            multiple
            value={selectedValues}
            onChange={(e) => {
              const options = Array.from(
                e.target.selectedOptions,
                (option) => option.value,
              )
              onChange(filter.id, options)
            }}
            className='h-10 rounded-md border border-border bg-card px-3 text-sm text-foreground shadow-xs focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30'
          >
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )
    }

    // Date range filter (placeholder - can be enhanced with date picker)
    if (filter.type === 'date-range') {
      return (
        <Input
          key={filter.id}
          type='text'
          placeholder={filter.placeholder || filter.label}
          value={stringValue}
          onChange={(e) => onChange(filter.id, e.target.value)}
          className={`${filter.className || ''}`}
        />
      )
    }

    return null
  }

  return (
    <div className='flex flex-col flex-wrap items-stretch gap-2 sm:flex-row sm:items-center'>
      {filters.map((filter) => renderFilter(filter))}

      {hasActiveFilters && onClear && (
        <Button
          variant='ghost'
          size='sm'
          onClick={onClear}
          className='flex items-center gap-2 text-muted-foreground'
        >
          <X className='h-4 w-4' />
          {t('clearFilters')}
        </Button>
      )}
    </div>
  )
}
