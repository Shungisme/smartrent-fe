'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Popover } from '@/components/atoms/popover'
import { Filter, Plus, X, Trash2 } from 'lucide-react'
import type { FilterOption, FilterConfig } from './types'

export interface FilterDialogProps {
  filterConfig: FilterConfig[]
  currentFilters: Record<string, any>
  onFilterChange: (filters: Record<string, string | string[]>) => void
  onClear: () => void
}

export function FilterDialog({
  filterConfig,
  currentFilters,
  onFilterChange,
  onClear,
}: FilterDialogProps) {
  const t = useTranslations('dataTable')
  const [open, setOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<
    Array<{ key: string; value: string }>
  >(
    Object.entries(currentFilters)
      .filter(
        ([key, value]) =>
          // Only pre-populate rows for configured filter fields.
          // Pagination keys (page/pageSize) and other non-filter keys are excluded.
          filterConfig.some((f) => f.id === key) &&
          value !== undefined &&
          value !== null &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0),
      )
      .map(([key, value]) => ({
        key,
        value: Array.isArray(value) ? value.join(',') : String(value),
      })),
  )

  const handleAddFilter = () => {
    setActiveFilters([...activeFilters, { key: '', value: '' }])
  }

  const handleRemoveFilter = (index: number) => {
    const newFilters = activeFilters.filter((_, i) => i !== index)
    setActiveFilters(newFilters)
  }

  const handleFilterKeyChange = (index: number, newKey: string) => {
    const newFilters = [...activeFilters]
    newFilters[index].key = newKey
    newFilters[index].value = ''
    setActiveFilters(newFilters)
  }

  const handleFilterValueChange = (index: number, newValue: string) => {
    const newFilters = [...activeFilters]
    newFilters[index].value = newValue
    setActiveFilters(newFilters)
  }

  const getFilterConfigByKey = (key: string): FilterConfig | undefined => {
    return filterConfig.find((f) => f.id === key)
  }

  const getOptionsForKey = (key: string): FilterOption[] => {
    const config = getFilterConfigByKey(key)
    return config?.options || []
  }

  const isKeyValid = (key: string): boolean => {
    return filterConfig.some((f) => f.id === key)
  }

  const handleApplyFilters = () => {
    const newFilters: Record<string, string | string[]> = {}

    activeFilters.forEach(({ key, value }) => {
      if (key && value && isKeyValid(key)) {
        const config = getFilterConfigByKey(key)
        if (config?.allowMultiple && value.includes(',')) {
          newFilters[key] = value.split(',').map((v) => v.trim())
        } else {
          newFilters[key] = value
        }
      }
    })

    onFilterChange(newFilters)
    setOpen(false)
  }

  const handleClearFilters = () => {
    setActiveFilters([])
    onClear()
  }

  const hasFilters = activeFilters.some((f) => f.key && f.value)

  const triggerButton = (
    <Button
      variant={hasFilters ? 'default' : 'outline'}
      size='sm'
      className='flex items-center gap-2'
    >
      <Filter className='h-4 w-4' />
      {t('filterButton') || 'Filter'}
      {hasFilters && (
        <span className='ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full'>
          {activeFilters.filter((f) => f.key && f.value).length}
        </span>
      )}
    </Button>
  )

  return (
    <Popover
      isOpen={open}
      onOpenChange={setOpen}
      trigger={triggerButton}
      align='start'
    >
      <div className='p-4 space-y-3'>
        {activeFilters.length === 0 ? (
          // Show only "Add Filter" button when no filters
          <Button
            variant='outline'
            size='sm'
            onClick={handleAddFilter}
            className='flex items-center gap-2 w-full'
          >
            <Plus className='h-4 w-4' />
            {t('addFilter') || 'Add Filter'}
          </Button>
        ) : (
          // Show all filter rows
          <>
            {activeFilters.map((filter, index) => (
              <div key={index} className='flex gap-2 items-end'>
                {/* Key Select */}
                <div className='flex-1'>
                  <label className='block text-xs font-medium text-gray-700 mb-1'>
                    {t('filterKey') || 'Field'}
                  </label>
                  <select
                    value={filter.key}
                    onChange={(e) =>
                      handleFilterKeyChange(index, e.target.value)
                    }
                    className='w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100'
                  >
                    <option value=''>
                      {t('selectField') || 'Select a field...'}
                    </option>
                    {filterConfig.map((config) => (
                      <option key={config.id} value={config.id}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Value Input/Select */}
                <div className='flex-1'>
                  <label className='block text-xs font-medium text-gray-700 mb-1'>
                    {t('filterValue') || 'Value'}
                  </label>
                  {filter.key && getOptionsForKey(filter.key).length > 0 ? (
                    <select
                      value={filter.value}
                      onChange={(e) =>
                        handleFilterValueChange(index, e.target.value)
                      }
                      className='w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100'
                    >
                      <option value=''>
                        {t('selectField') || 'Select a value...'}
                      </option>
                      {getOptionsForKey(filter.key).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type='text'
                      placeholder={t('enterValue') || 'Enter value...'}
                      value={filter.value}
                      onChange={(e) =>
                        handleFilterValueChange(index, e.target.value)
                      }
                      className='rounded-lg border border-gray-200'
                    />
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => handleRemoveFilter(index)}
                  className='h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50'
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            ))}

            {/* Add Filter Button */}
            <div className='pt-2 border-t'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleAddFilter}
                className='flex items-center gap-2 w-full'
              >
                <Plus className='h-4 w-4' />
                {t('addFilter') || 'Add Filter'}
              </Button>
            </div>

            {/* Actions */}
            <div className='flex gap-2 justify-end pt-2 border-t'>
              {hasFilters && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleClearFilters}
                  className='flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50'
                >
                  <Trash2 className='h-4 w-4' />
                  {t('clearFilters') || 'Clear'}
                </Button>
              )}
              <Button
                variant='outline'
                size='sm'
                onClick={() => setOpen(false)}
              >
                {t('cancel') || 'Cancel'}
              </Button>
              <Button size='sm' onClick={handleApplyFilters}>
                {t('apply') || 'Apply'}
              </Button>
            </div>
          </>
        )}
      </div>
    </Popover>
  )
}
