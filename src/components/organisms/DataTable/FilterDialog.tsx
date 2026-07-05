'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Popover } from '@/components/atoms/popover'
import DateRangePicker from '@/components/molecules/dateRangePicker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select'
import { ArrowRight, Filter, Plus, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FilterOption, FilterConfig } from './types'

const parseRange = (value: string): { from: string; to: string } => {
  if (!value) return { from: '', to: '' }
  const idx = value.indexOf('..')
  if (idx === -1) return { from: value, to: '' }
  return { from: value.slice(0, idx), to: value.slice(idx + 2) }
}

const buildRangeValue = (from: string, to: string): string => {
  const f = from.trim()
  const t = to.trim()
  if (!f && !t) return ''
  return `${f}..${t}`
}

// Native date inputs only open their calendar when the tiny picker-indicator
// icon is clicked exactly — most people click anywhere in the field instead.
// `showPicker()` (Chrome/Edge 99+) opens it on any click; older browsers just
// fall back to the default (icon-only) behavior.
const openDatePicker = (e: React.MouseEvent<HTMLInputElement>) => {
  const input = e.currentTarget
  if (typeof input.showPicker === 'function') {
    try {
      input.showPicker()
    } catch {
      // Ignore — e.g. thrown if the input is disabled or not user-activated.
    }
  }
}

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
    setActiveFilters(activeFilters.filter((_, i) => i !== index))
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

  const getFilterConfigByKey = (key: string): FilterConfig | undefined =>
    filterConfig.find((f) => f.id === key)

  const getOptionsForKey = (key: string): FilterOption[] =>
    getFilterConfigByKey(key)?.options || []

  const isKeyValid = (key: string): boolean =>
    filterConfig.some((f) => f.id === key)

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
    setOpen(false)
  }

  const activeCount = activeFilters.filter((f) => f.key && f.value).length
  const hasFilters = activeCount > 0

  // Compute remaining (un-used) fields so user doesn't see duplicates.
  const usedKeys = new Set(
    activeFilters.map((f) => f.key).filter((k): k is string => !!k),
  )

  const triggerButton = (
    <Button
      variant={hasFilters ? 'default' : 'outline'}
      size='sm'
      className='flex items-center gap-2'
    >
      <Filter className='h-4 w-4' />
      {t('filterButton') || 'Filter'}
      {hasFilters && (
        <span className='ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-foreground/20 px-1.5 text-[11px] font-semibold text-primary-foreground'>
          {activeCount}
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
      contentClassName='w-[calc(100vw-1rem)] sm:w-[600px] overflow-hidden'
    >
      {/* Header */}
      <div className='flex items-center justify-between border-b border-border/60 px-4 py-3'>
        <div className='flex items-center gap-2'>
          <span className='flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary'>
            <SlidersHorizontal className='h-3.5 w-3.5' />
          </span>
          <div className='leading-tight'>
            <div className='text-sm font-semibold text-foreground'>
              {t('filterButton') || 'Filter'}
            </div>
            <div className='text-[11px] text-muted-foreground'>
              {hasFilters
                ? t.has('filtersApplied')
                  ? t('filtersApplied', { count: activeCount })
                  : `${activeCount} filter${activeCount > 1 ? 's' : ''} applied`
                : t.has('filterDialogHint')
                  ? t('filterDialogHint')
                  : 'Refine results with one or more conditions'}
            </div>
          </div>
        </div>
        <button
          type='button'
          onClick={() => setOpen(false)}
          className='flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
          aria-label={t('cancel') || 'Close'}
        >
          <X className='h-4 w-4' />
        </button>
      </div>

      {/* Body */}
      <div className='max-h-[60vh] overflow-y-auto px-4 py-3'>
        {activeFilters.length === 0 ? (
          <div className='flex flex-col items-center gap-3 py-8 text-center'>
            <span className='flex h-10 w-10 items-center justify-center rounded-full bg-muted'>
              <Filter className='h-4 w-4 text-muted-foreground' />
            </span>
            <div className='space-y-1'>
              <div className='text-sm font-medium text-foreground'>
                {t.has('noFiltersTitle')
                  ? t('noFiltersTitle')
                  : 'No filters yet'}
              </div>
              <div className='text-xs text-muted-foreground'>
                {t.has('noFiltersHint')
                  ? t('noFiltersHint')
                  : 'Add a filter to narrow down the results.'}
              </div>
            </div>
            <Button
              size='sm'
              onClick={handleAddFilter}
              className='mt-1 gap-1.5'
            >
              <Plus className='h-3.5 w-3.5' />
              {t('addFilter') || 'Add filter'}
            </Button>
          </div>
        ) : (
          <div className='space-y-2.5'>
            {activeFilters.map((filter, index) => {
              const config = filter.key
                ? getFilterConfigByKey(filter.key)
                : undefined
              const options = filter.key ? getOptionsForKey(filter.key) : []
              const isRange =
                config?.type === 'range' || config?.type === 'date-range'

              return (
                <div
                  key={index}
                  className='group rounded-xl border border-border/70 bg-card/40 p-2.5 transition-colors hover:border-border'
                >
                  <div className='flex items-stretch gap-2'>
                    {/* Field selector */}
                    <div className='flex-1 min-w-0'>
                      <Select
                        value={filter.key}
                        onValueChange={(value) =>
                          handleFilterKeyChange(index, value)
                        }
                      >
                        <SelectTrigger
                          size='sm'
                          className={cn(
                            'w-full',
                            !filter.key &&
                              'text-muted-foreground data-[placeholder]:text-muted-foreground',
                          )}
                        >
                          <SelectValue
                            placeholder={t('selectField') || 'Select a field…'}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {filterConfig.map((conf) => {
                            const disabled =
                              conf.id !== filter.key && usedKeys.has(conf.id)
                            return (
                              <SelectItem
                                key={conf.id}
                                value={conf.id}
                                disabled={disabled}
                              >
                                {conf.label}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Operator arrow (visual cue) */}
                    <div className='flex items-center text-muted-foreground/60'>
                      <ArrowRight className='h-3.5 w-3.5' />
                    </div>

                    {/* Value */}
                    <div className='flex-1 min-w-0'>
                      {!filter.key ? (
                        <div className='flex h-9 items-center rounded-md border border-dashed border-border/60 bg-muted/30 px-3 text-xs text-muted-foreground'>
                          {t.has('pickFieldFirst')
                            ? t('pickFieldFirst')
                            : 'Pick a field first'}
                        </div>
                      ) : options.length > 0 ? (
                        <Select
                          value={filter.value}
                          onValueChange={(value) =>
                            handleFilterValueChange(index, value)
                          }
                        >
                          <SelectTrigger
                            size='sm'
                            className={cn(
                              'w-full',
                              !filter.value && 'text-muted-foreground',
                            )}
                          >
                            <SelectValue
                              placeholder={
                                t('selectValue') ||
                                t('selectField') ||
                                'Select a value…'
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {options.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : config?.type === 'date' ? (
                        <Input
                          type='date'
                          value={filter.value}
                          onChange={(e) =>
                            handleFilterValueChange(index, e.target.value)
                          }
                          onClick={openDatePicker}
                          className='h-9 cursor-pointer'
                        />
                      ) : isRange && config?.type === 'date-range' ? (
                        (() => {
                          const { from, to } = parseRange(filter.value)
                          return (
                            <DateRangePicker
                              value={{ from, to }}
                              onChange={(range) =>
                                handleFilterValueChange(
                                  index,
                                  buildRangeValue(range.from, range.to),
                                )
                              }
                              triggerClassName='h-9 w-full'
                            />
                          )
                        })()
                      ) : isRange ? (
                        (() => {
                          const { from, to } = parseRange(filter.value)
                          return (
                            <div className='flex items-center gap-1.5'>
                              <Input
                                type='number'
                                placeholder={t('rangeFrom') || 'From'}
                                value={from}
                                onChange={(e) =>
                                  handleFilterValueChange(
                                    index,
                                    buildRangeValue(e.target.value, to),
                                  )
                                }
                                className='h-9 flex-1 min-w-0'
                              />
                              <span className='text-[11px] font-medium text-muted-foreground/70 shrink-0'>
                                –
                              </span>
                              <Input
                                type='number'
                                placeholder={t('rangeTo') || 'To'}
                                value={to}
                                onChange={(e) =>
                                  handleFilterValueChange(
                                    index,
                                    buildRangeValue(from, e.target.value),
                                  )
                                }
                                className='h-9 flex-1 min-w-0'
                              />
                            </div>
                          )
                        })()
                      ) : (
                        <Input
                          type='text'
                          placeholder={
                            config?.placeholder ||
                            t('enterValue') ||
                            'Enter value…'
                          }
                          value={filter.value}
                          onChange={(e) =>
                            handleFilterValueChange(index, e.target.value)
                          }
                          className='h-9'
                        />
                      )}
                    </div>

                    {/* Remove */}
                    <button
                      type='button'
                      onClick={() => handleRemoveFilter(index)}
                      className='flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'
                      aria-label='Remove filter'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              )
            })}

            {/* Add another */}
            <button
              type='button'
              onClick={handleAddFilter}
              disabled={usedKeys.size >= filterConfig.length}
              className='group flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border/60 px-3 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary disabled:opacity-50 disabled:hover:border-border/60 disabled:hover:bg-transparent disabled:hover:text-muted-foreground'
            >
              <Plus className='h-3.5 w-3.5' />
              {t('addFilter') || 'Add filter'}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      {activeFilters.length > 0 && (
        <div className='flex items-center justify-between gap-2 border-t border-border/60 bg-muted/30 px-4 py-3'>
          <button
            type='button'
            onClick={handleClearFilters}
            disabled={!hasFilters}
            className='text-xs font-medium text-muted-foreground transition-colors hover:text-destructive disabled:opacity-40 disabled:hover:text-muted-foreground'
          >
            {t('clearFilters') || 'Clear all'}
          </button>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setOpen(false)}
              className='h-8'
            >
              {t('cancel') || 'Cancel'}
            </Button>
            <Button size='sm' onClick={handleApplyFilters} className='h-8'>
              {t('apply') || 'Apply'}
            </Button>
          </div>
        </div>
      )}
    </Popover>
  )
}
