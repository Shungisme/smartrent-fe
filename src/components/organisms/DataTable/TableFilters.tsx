import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/atoms/input'
import { Button } from '@/components/atoms/button'
import { Search, X } from 'lucide-react'
import { FilterDialog } from './FilterDialog'
import type { TableFiltersProps, FilterConfig } from './types'

// Debounced search input. Keeps a local value and only pushes it upstream after
// a short pause, so API-mode tables don't refetch on every keystroke. Re-syncs
// when the external value changes (e.g. cleared via the filter dialog or reset).
function SearchFilterInput({
  filter,
  value,
  onChange,
}: {
  filter: FilterConfig
  value: string
  onChange: (value: string) => void
}) {
  const [local, setLocal] = useState(value)

  // Re-sync when the value changes from outside (clear/reset).
  useEffect(() => {
    setLocal(value)
  }, [value])

  // Debounce pushing the typed value upstream. The `local === value` guard makes
  // the mount and re-sync runs no-ops, so only real typing schedules a change.
  useEffect(() => {
    if (local === value) return
    const id = setTimeout(() => onChange(local), 300)
    return () => clearTimeout(id)
  }, [local])

  return (
    <div className='relative flex-1 min-w-[200px]'>
      <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
      <Input
        type='text'
        placeholder={filter.placeholder || filter.label}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        className={`w-full pl-10 ${filter.className || ''}`}
      />
    </div>
  )
}

export function TableFilters({
  filters,
  values,
  onChange,
  onChangeMultiple,
  onClear,
}: TableFiltersProps) {
  const t = useTranslations('dataTable')

  if (!filters || filters.length === 0) return null

  // Inline filters render directly in the toolbar (e.g. a visible search box);
  // isFilterField filters are collected into the "Bộ lọc" dialog. A table can
  // use either or both.
  const inlineFilters = filters.filter((f) => !f.isFilterField)
  const filterDialogFilters = filters.filter((f) => f.isFilterField)
  const hasFilterDialog = filterDialogFilters.length > 0

  const hasActiveFilters = Object.values(values).some((value) => {
    if (Array.isArray(value)) return value.length > 0

    return (
      value !== undefined && value !== null && value !== '' && value !== 'all'
    )
  })

  // When applying dialog filters, preserve the inline filter values (e.g. the
  // search box). FilterDialog only returns its own configured fields and the
  // DataTable replaces the whole filter set, which would otherwise drop the
  // inline search term.
  const applyDialogFilters = (newFilters: Record<string, unknown>) => {
    const preserved: Record<string, unknown> = {}
    inlineFilters.forEach((f) => {
      const v = values[f.id]
      if (v !== undefined && v !== null && v !== '') {
        preserved[f.id] = v
      }
    })
    const merged = { ...preserved, ...newFilters }

    if (onChangeMultiple) {
      onChangeMultiple(merged)
    } else {
      Object.entries(merged).forEach(([key, value]) => {
        onChange(key, value)
      })
    }
  }

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

    // Search filter (debounced)
    if (filter.type === 'search') {
      return (
        <SearchFilterInput
          key={filter.id}
          filter={filter}
          value={stringValue}
          onChange={(newValue) => onChange(filter.id, newValue)}
        />
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
      {inlineFilters.map((filter) => renderFilter(filter))}

      {hasFilterDialog && (
        <FilterDialog
          filterConfig={filterDialogFilters}
          currentFilters={values}
          onFilterChange={applyDialogFilters}
          onClear={() => onClear?.()}
        />
      )}

      {!hasFilterDialog && hasActiveFilters && onClear && (
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
