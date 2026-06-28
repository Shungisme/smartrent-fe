'use client'

import { useTranslations } from 'next-intl'
import {
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  RotateCcw,
  Activity,
  type LucideIcon,
} from 'lucide-react'
import { TransactionTimeline } from '@/types/transaction.type'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/utils/format'

interface TransactionTimelineProps {
  timeline: TransactionTimeline[] | undefined
}

type Tone = {
  icon: LucideIcon
  dot: string
  chip: string
  iconColor: string
}

const TONES: Record<string, Tone> = {
  PENDING: {
    icon: Clock,
    dot: 'bg-warning',
    chip: 'bg-warning/15 ring-warning/30',
    iconColor: 'text-warning-foreground',
  },
  SUCCESS: {
    icon: CheckCircle2,
    dot: 'bg-success',
    chip: 'bg-success/15 ring-success/30',
    iconColor: 'text-success-foreground',
  },
  COMPLETED: {
    icon: CheckCircle2,
    dot: 'bg-success',
    chip: 'bg-success/15 ring-success/30',
    iconColor: 'text-success-foreground',
  },
  FAILED: {
    icon: XCircle,
    dot: 'bg-destructive',
    chip: 'bg-destructive/12 ring-destructive/25',
    iconColor: 'text-destructive',
  },
  CANCELLED: {
    icon: Ban,
    dot: 'bg-muted-foreground/60',
    chip: 'bg-muted ring-border',
    iconColor: 'text-muted-foreground',
  },
  REFUNDED: {
    icon: RotateCcw,
    dot: 'bg-primary',
    chip: 'bg-primary/12 ring-primary/25',
    iconColor: 'text-primary',
  },
}

const FALLBACK_TONE: Tone = {
  icon: Activity,
  dot: 'bg-muted-foreground/60',
  chip: 'bg-muted ring-border',
  iconColor: 'text-muted-foreground',
}

export const TransactionTimelineComponent = ({
  timeline,
}: TransactionTimelineProps) => {
  const t = useTranslations('transactions')

  if (!timeline || timeline.length === 0) {
    return null
  }

  return (
    <section className='rounded-xl border border-border/70 bg-card p-6 shadow-sm'>
      <header className='mb-6 flex items-center gap-2 text-base font-semibold text-foreground'>
        <Activity className='h-4 w-4 text-primary' />
        {t('detail.timeline')}
      </header>

      <ol className='relative'>
        {timeline.map((item, index) => {
          const tone = TONES[item.status] ?? FALLBACK_TONE
          const Icon = tone.icon
          const isLast = index === timeline.length - 1
          const isFirst = index === 0

          return (
            <li key={index} className='relative flex gap-4 pb-6 last:pb-0'>
              {!isLast && (
                <span
                  aria-hidden
                  className='absolute left-[18px] top-9 bottom-0 w-px bg-border'
                />
              )}

              <span
                className={cn(
                  'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ring-inset',
                  tone.chip,
                )}
              >
                <Icon className={cn('h-4 w-4', tone.iconColor)} />
                {isFirst && (
                  <span
                    aria-hidden
                    className={cn(
                      'absolute -inset-1.5 -z-10 animate-pulse rounded-full opacity-40',
                      tone.dot,
                    )}
                    style={{ filter: 'blur(8px)' }}
                  />
                )}
              </span>

              <div className='min-w-0 flex-1 pt-0.5'>
                <div className='flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5'>
                  <p className='text-sm font-semibold text-foreground'>
                    {t('timeline.transaction')} {t(`status.${item.status}`)}
                  </p>
                  <time
                    dateTime={item.at}
                    className='text-xs text-muted-foreground'
                  >
                    {formatDateTime(item.at)}
                  </time>
                </div>

                <p className='mt-1 text-xs text-muted-foreground'>
                  {t('timeline.by')}{' '}
                  <span className='font-medium text-foreground/80'>
                    {t(`timeline.actor.${item.actorType}`)}
                  </span>
                </p>

                {item.note && (
                  <div className='mt-3 rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-sm leading-relaxed text-foreground/80'>
                    {item.note}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
