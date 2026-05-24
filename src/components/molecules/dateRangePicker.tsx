'use client'

import * as React from 'react'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/atoms/button'
import { cn } from '@/lib/utils'

export interface DateRangeValue {
  from: string // YYYY-MM-DD
  to: string
}

interface DateRangePickerProps {
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
  className?: string
  align?: 'start' | 'end'
  /** Disallow dates after today. Defaults to true. */
  disableFuture?: boolean
}

const PRESET_KEYS = [
  'today',
  'yesterday',
  'last7',
  'last30',
  'thisMonth',
  'lastMonth',
] as const

type PresetKey = (typeof PRESET_KEYS)[number]

export const toIsoDate = (d: Date): string => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const parseIsoDate = (s: string): Date | null => {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return null
  const result = new Date(y, m - 1, d)
  if (isNaN(result.getTime())) return null
  return result
}

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate())

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)

const addMonths = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth() + n, 1)

const addDays = (d: Date, n: number) => {
  const out = new Date(d)
  out.setDate(out.getDate() + n)
  return out
}

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const compareDay = (a: Date, b: Date) =>
  startOfDay(a).getTime() - startOfDay(b).getTime()

const isSameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()

const buildPresetRange = (key: PresetKey, today: Date): DateRangeValue => {
  switch (key) {
    case 'today':
      return { from: toIsoDate(today), to: toIsoDate(today) }
    case 'yesterday': {
      const y = addDays(today, -1)
      return { from: toIsoDate(y), to: toIsoDate(y) }
    }
    case 'last7':
      return {
        from: toIsoDate(addDays(today, -6)),
        to: toIsoDate(today),
      }
    case 'last30':
      return {
        from: toIsoDate(addDays(today, -29)),
        to: toIsoDate(today),
      }
    case 'thisMonth':
      return {
        from: toIsoDate(startOfMonth(today)),
        to: toIsoDate(today),
      }
    case 'lastMonth': {
      const firstOfLast = addMonths(startOfMonth(today), -1)
      const lastOfLast = addDays(startOfMonth(today), -1)
      return { from: toIsoDate(firstOfLast), to: toIsoDate(lastOfLast) }
    }
  }
}

interface MonthGridProps {
  month: Date
  hovered: Date | null
  draftFrom: Date | null
  draftTo: Date | null
  onClick: (d: Date) => void
  onHover: (d: Date | null) => void
  weekdayLabels: string[]
  monthLabel: string
  onPrev?: () => void
  onNext?: () => void
  showArrows: { prev: boolean; next: boolean }
  today: Date
  disableFuture: boolean
}

const MonthGrid: React.FC<MonthGridProps> = ({
  month,
  hovered,
  draftFrom,
  draftTo,
  onClick,
  onHover,
  weekdayLabels,
  monthLabel,
  onPrev,
  onNext,
  showArrows,
  today,
  disableFuture,
}) => {
  const firstDay = startOfMonth(month)
  const startWeekday = (firstDay.getDay() + 6) % 7 // Monday=0
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate()

  const cells: (Date | null)[] = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), d))
  }
  while (cells.length % 7 !== 0) cells.push(null)

  const endpoint = draftTo || hovered
  const inRange = (d: Date) => {
    if (!draftFrom || !endpoint) return false
    const start = compareDay(draftFrom, endpoint) <= 0 ? draftFrom : endpoint
    const end = compareDay(draftFrom, endpoint) <= 0 ? endpoint : draftFrom
    return compareDay(d, start) >= 0 && compareDay(d, end) <= 0
  }
  const isEndpoint = (d: Date) =>
    (draftFrom && isSameDay(d, draftFrom)) || (draftTo && isSameDay(d, draftTo))

  return (
    <div className='flex w-[252px] flex-col gap-2 p-3'>
      <div className='flex items-center justify-between'>
        <button
          type='button'
          onClick={onPrev}
          className={cn(
            'rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground',
            !showArrows.prev && 'invisible',
          )}
          aria-label='Previous month'
        >
          <ChevronLeft className='h-4 w-4' />
        </button>
        <span className='text-sm font-semibold capitalize text-foreground'>
          {monthLabel}
        </span>
        <button
          type='button'
          onClick={onNext}
          className={cn(
            'rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground',
            !showArrows.next && 'invisible',
          )}
          aria-label='Next month'
        >
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>
      <div className='grid grid-cols-7 text-center'>
        {weekdayLabels.map((w) => (
          <div
            key={w}
            className='py-1 text-[11px] font-medium text-muted-foreground'
          >
            {w}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} className='h-9' />
          const selected = isEndpoint(d)
          const within = inRange(d) && !selected
          const isToday = isSameDay(d, today)
          const inFuture = disableFuture && compareDay(d, today) > 0
          const outsideMonth = !isSameMonth(d, month)

          return (
            <button
              key={d.toISOString()}
              type='button'
              disabled={inFuture}
              onMouseEnter={() => onHover(d)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onClick(d)}
              className={cn(
                'relative h-9 text-sm transition-colors',
                'disabled:cursor-not-allowed disabled:text-muted-foreground/40',
                within && 'bg-primary/15 text-foreground',
                !within && !selected && 'hover:bg-muted',
                outsideMonth && 'text-muted-foreground/60',
                isToday && !selected && 'font-bold text-primary',
              )}
            >
              <span
                className={cn(
                  'absolute inset-1 flex items-center justify-center rounded-md',
                  selected &&
                    'bg-primary font-semibold text-primary-foreground shadow-sm',
                )}
              >
                {d.getDate()}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  className,
  align = 'start',
  disableFuture = true,
}) => {
  const t = useTranslations('admin.analytics.filters.dateRangePicker')
  const locale = useLocale()
  const [open, setOpen] = React.useState(false)

  const containerRef = React.useRef<HTMLDivElement>(null)
  const popoverRef = React.useRef<HTMLDivElement>(null)

  const [draftFrom, setDraftFrom] = React.useState<Date | null>(null)
  const [draftTo, setDraftTo] = React.useState<Date | null>(null)
  const [hovered, setHovered] = React.useState<Date | null>(null)
  const [leftMonth, setLeftMonth] = React.useState<Date>(() => {
    const start = parseIsoDate(value.from) || new Date()
    return startOfMonth(start)
  })

  const today = React.useMemo(() => startOfDay(new Date()), [])

  React.useEffect(() => {
    if (open) {
      const fromDate = parseIsoDate(value.from)
      const toDate = parseIsoDate(value.to)
      setDraftFrom(fromDate)
      setDraftTo(toDate)
      setHovered(null)
      const anchor = fromDate || new Date()
      // Keep right calendar showing the selection's end month when possible.
      const candidate = startOfMonth(anchor)
      // If selection spans two months, show those two; otherwise default.
      if (toDate && !isSameMonth(anchor, toDate)) {
        setLeftMonth(addMonths(startOfMonth(toDate), -1))
      } else {
        setLeftMonth(candidate)
      }
    }
  }, [open, value.from, value.to])

  React.useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const handleDayClick = (d: Date) => {
    if (!draftFrom || (draftFrom && draftTo)) {
      setDraftFrom(d)
      setDraftTo(null)
      return
    }
    if (compareDay(d, draftFrom) < 0) {
      setDraftTo(draftFrom)
      setDraftFrom(d)
    } else {
      setDraftTo(d)
    }
  }

  const handleApply = () => {
    if (!draftFrom || !draftTo) return
    onChange({
      from: toIsoDate(draftFrom),
      to: toIsoDate(draftTo),
    })
    setOpen(false)
  }

  const handleClear = () => {
    setDraftFrom(null)
    setDraftTo(null)
    setHovered(null)
  }

  const applyPreset = (key: PresetKey) => {
    const range = buildPresetRange(key, today)
    const fromDate = parseIsoDate(range.from)
    const toDate = parseIsoDate(range.to)
    setDraftFrom(fromDate)
    setDraftTo(toDate)
    if (toDate) {
      setLeftMonth(addMonths(startOfMonth(toDate), -1))
    } else if (fromDate) {
      setLeftMonth(startOfMonth(fromDate))
    }
  }

  const rangeMatchesPreset = (key: PresetKey) => {
    const range = buildPresetRange(key, today)
    return range.from === value.from && range.to === value.to
  }

  const dateLocale = locale === 'vi' ? 'vi-VN' : 'en-US'

  const formatDisplay = (s: string) => {
    const d = parseIsoDate(s)
    if (!d) return ''
    return d.toLocaleDateString(dateLocale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const weekdayLabels =
    locale === 'vi'
      ? ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
      : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

  const monthLabel = (d: Date) =>
    d.toLocaleDateString(dateLocale, { month: 'long', year: 'numeric' })

  const rightMonth = addMonths(leftMonth, 1)
  const canGoNext = !disableFuture || compareDay(rightMonth, today) < 0

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <Button
        type='button'
        variant='outline'
        onClick={() => setOpen((prev) => !prev)}
        className='w-full justify-start font-normal sm:w-auto'
      >
        <Calendar className='h-4 w-4' />
        {value.from && value.to ? (
          <span className='flex items-center gap-1.5'>
            {formatDisplay(value.from)}
            <span className='text-muted-foreground'>→</span>
            {formatDisplay(value.to)}
          </span>
        ) : (
          <span className='text-muted-foreground'>{t('placeholder')}</span>
        )}
      </Button>

      {open && (
        <div
          ref={popoverRef}
          className={cn(
            'absolute z-50 mt-2 overflow-hidden rounded-lg border border-border bg-popover shadow-lg',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          <div className='flex flex-col lg:flex-row'>
            <div className='flex shrink-0 flex-col gap-1 p-2 lg:w-44 lg:border-r lg:border-border'>
              {PRESET_KEYS.map((key) => {
                const active = rangeMatchesPreset(key)
                return (
                  <button
                    key={key}
                    type='button'
                    onClick={() => applyPreset(key)}
                    className={cn(
                      'rounded-md px-3 py-1.5 text-left text-sm transition-colors hover:bg-muted',
                      active && 'bg-primary/10 font-semibold text-primary',
                    )}
                  >
                    {t(`presets.${key}`)}
                  </button>
                )
              })}
            </div>

            <div className='flex flex-col'>
              <div className='flex flex-col sm:flex-row sm:divide-x sm:divide-border'>
                <MonthGrid
                  month={leftMonth}
                  hovered={hovered}
                  draftFrom={draftFrom}
                  draftTo={draftTo}
                  onClick={handleDayClick}
                  onHover={setHovered}
                  weekdayLabels={weekdayLabels}
                  monthLabel={monthLabel(leftMonth)}
                  onPrev={() => setLeftMonth(addMonths(leftMonth, -1))}
                  showArrows={{ prev: true, next: false }}
                  today={today}
                  disableFuture={disableFuture}
                />
                <div className='hidden sm:block'>
                  <MonthGrid
                    month={rightMonth}
                    hovered={hovered}
                    draftFrom={draftFrom}
                    draftTo={draftTo}
                    onClick={handleDayClick}
                    onHover={setHovered}
                    weekdayLabels={weekdayLabels}
                    monthLabel={monthLabel(rightMonth)}
                    onNext={
                      canGoNext
                        ? () => setLeftMonth(addMonths(leftMonth, 1))
                        : undefined
                    }
                    showArrows={{ prev: false, next: canGoNext }}
                    today={today}
                    disableFuture={disableFuture}
                  />
                </div>
              </div>

              <div className='flex items-center justify-between gap-2 border-t border-border bg-muted/30 px-3 py-2'>
                <div className='text-xs text-muted-foreground'>
                  {draftFrom && draftTo ? (
                    <span className='font-medium text-foreground'>
                      {formatDisplay(toIsoDate(draftFrom))}
                      <span className='mx-1.5 text-muted-foreground'>→</span>
                      {formatDisplay(toIsoDate(draftTo))}
                    </span>
                  ) : draftFrom ? (
                    t('selectEnd')
                  ) : (
                    t('selectStart')
                  )}
                </div>
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={handleClear}
                    disabled={!draftFrom && !draftTo}
                  >
                    <X className='h-3.5 w-3.5' />
                    {t('clear')}
                  </Button>
                  <Button
                    type='button'
                    size='sm'
                    onClick={handleApply}
                    disabled={!draftFrom || !draftTo}
                  >
                    {t('apply')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangePicker

export const defaultDateRange = (daysBack = 30): DateRangeValue => {
  const today = new Date()
  const from = addDays(today, -(daysBack - 1))
  return { from: toIsoDate(from), to: toIsoDate(today) }
}
