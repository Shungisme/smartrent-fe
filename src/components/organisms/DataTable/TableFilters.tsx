import React from 'react'
import { Input } from '@/components/atoms/input'
import { Button } from '@/components/atoms/button'
import { Search, X } from 'lucide-react'
import type { TableFiltersProps, FilterConfig } from './types'

export function TableFilters({
  filters,
  values,
  onChange,
  onClear,
}: TableFiltersProps) {
  if (!filters || filters.length === 0) return null

  const hasActiveFilters = Object.values(values).some(
    (value) => value && value !== '' && value !== 'all',
  )

  const renderFilter = (filter: FilterConfig) => {
    const value = values[filter.id] || filter.defaultValue || ''
    const stringValue = typeof value === 'string' ? value : String(value || '')

    // Custom render function
    if (filter.render) {
      return filter.render({
        value,
        onChange: (newValue) => onChange(filter.id, newValue),
        filter,
      })
    }

    // Search filter
    if (filter.type === 'search') {
      return (
        <div key={filter.id} className='relative flex-1 min-w-[200px]'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
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
          className={`rounded-lg border border-gray-100 bg-white px-4 py-2 text-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 ${filter.className || ''}`}
        >
          <option value='all'>{filter.label}</option>
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
            className='rounded-lg border border-gray-100 bg-white px-4 py-2 text-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100'
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
    <div className='space-y-4 rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm'>
      {/* Filters */}
      <div className='flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3'>
        {filters.map((filter) => renderFilter(filter))}

        {/* Clear filters button */}
        {hasActiveFilters && onClear && (
          <Button
            variant='outline'
            size='sm'
            onClick={onClear}
            className='flex items-center gap-2'
          >
            <X className='h-4 w-4' />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
