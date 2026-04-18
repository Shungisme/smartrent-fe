'use client'

import * as React from 'react'
import * as RechartsPrimitive from 'recharts'
import { cn } from '@/lib/utils'

export type ChartConfig = Record<
  string,
  {
    label?: string
    color?: string
  }
>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

const useChart = () => {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />')
  }

  return context
}

type ChartContainerProps = React.ComponentProps<'div'> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >['children']
}

export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: ChartContainerProps) {
  const uniqueId = React.useId().replace(/:/g, '')
  const chartId = `chart-${id || uniqueId}`

  const chartStyle = React.useMemo(() => {
    const colorVariables = Object.entries(config)
      .filter(([, item]) => item.color)
      .map(([key, item]) => `--color-${key}: ${item.color};`)
      .join(' ')

    if (!colorVariables) {
      return ''
    }

    return `[data-chart='${chartId}'] { ${colorVariables} }`
  }, [chartId, config])

  return (
    <ChartContext.Provider value={{ config }}>
      <div data-chart={chartId} className={cn('w-full', className)} {...props}>
        {chartStyle && (
          <style dangerouslySetInnerHTML={{ __html: chartStyle }} />
        )}
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

export const ChartTooltip = RechartsPrimitive.Tooltip
export const ChartLegend = RechartsPrimitive.Legend

type TooltipPayloadItem = {
  dataKey?: string | number
  name?: string | number
  value?: string | number
  color?: string
}

type ChartTooltipContentProps = React.ComponentProps<'div'> & {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string | number
  hideLabel?: boolean
  formatter?: (value: string | number, name: string) => React.ReactNode
}

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(
  (
    { active, payload, className, label, hideLabel = false, formatter },
    ref,
  ) => {
    const { config } = useChart()

    if (!active || !payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          'grid min-w-[8rem] gap-2 rounded-lg border border-border/70 bg-background/95 px-3 py-2 text-xs shadow-md backdrop-blur-sm',
          className,
        )}
      >
        {!hideLabel && label !== undefined && (
          <div className='font-medium text-foreground'>{label}</div>
        )}

        <div className='grid gap-1.5'>
          {payload.map((item, index) => {
            const itemKey = String(item.dataKey ?? item.name ?? index)
            const itemConfig = config[itemKey]
            const itemName = String(itemConfig?.label ?? item.name ?? itemKey)
            const itemValue = item.value ?? '-'
            const itemColor = item.color || `var(--color-${itemKey})`

            return (
              <div
                key={`${itemKey}-${index}`}
                className='flex items-center gap-2'
              >
                <span
                  className='h-2.5 w-2.5 shrink-0 rounded-[2px]'
                  style={{ backgroundColor: itemColor }}
                />
                <span className='text-muted-foreground'>{itemName}</span>
                <span className='ml-auto font-semibold text-foreground'>
                  {formatter
                    ? formatter(itemValue, itemName)
                    : typeof itemValue === 'number'
                      ? itemValue.toLocaleString('vi-VN')
                      : itemValue}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
)

ChartTooltipContent.displayName = 'ChartTooltipContent'

type LegendPayloadItem = {
  dataKey?: string | number
  value?: string | number
  color?: string
}

type ChartLegendContentProps = React.ComponentProps<'div'> & {
  payload?: LegendPayloadItem[]
}

export function ChartLegendContent({
  payload,
  className,
}: ChartLegendContentProps) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-4 pt-2 text-xs',
        className,
      )}
    >
      {payload.map((item, index) => {
        const itemKey = String(item.dataKey ?? item.value ?? index)
        const itemConfig = config[itemKey]
        const label = String(itemConfig?.label ?? item.value ?? itemKey)

        return (
          <div key={`${itemKey}-${index}`} className='flex items-center gap-2'>
            <span
              className='h-2.5 w-2.5 rounded-[2px]'
              style={{
                backgroundColor: item.color || `var(--color-${itemKey})`,
              }}
            />
            <span className='text-muted-foreground'>{label}</span>
          </div>
        )
      })}
    </div>
  )
}
