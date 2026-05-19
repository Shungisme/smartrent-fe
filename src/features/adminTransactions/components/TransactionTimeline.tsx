'use client'

import { useTranslations } from 'next-intl'
import { TransactionTimeline } from '../types/transaction.type'
import { formatDateTime } from '../utils/formatters'

interface TransactionTimelineProps {
  timeline: TransactionTimeline[] | undefined
}

/**
 * Transaction Timeline Component
 * Displays status change history
 */
export const TransactionTimelineComponent = ({
  timeline,
}: TransactionTimelineProps) => {
  const t = useTranslations('transactions')

  if (!timeline || timeline.length === 0) {
    return null
  }

  const getStatusIcon = (status: string): string => {
    const icons: Record<string, string> = {
      PENDING: '⏳',
      SUCCESS: '✅',
      FAILED: '❌',
      CANCELLED: '🚫',
      REFUNDED: '🔄',
    }
    return icons[status] || '•'
  }

  return (
    <div className='rounded-lg border border-gray-200 p-6 bg-white'>
      <h3 className='text-lg font-semibold text-gray-900 mb-6'>
        {t('detail.timeline')}
      </h3>

      <div className='space-y-4'>
        {timeline.map((item, index) => (
          <div key={index} className='flex gap-4'>
            {/* Timeline line and icon */}
            <div className='flex flex-col items-center'>
              <div className='text-2xl'>{getStatusIcon(item.status)}</div>
              {index < timeline.length - 1 && (
                <div className='w-0.5 h-12 bg-gray-300 my-2'></div>
              )}
            </div>

            {/* Timeline content */}
            <div className='flex-1 pb-4'>
              <div className='flex items-start justify-between'>
                <div>
                  <p className='font-semibold text-gray-900'>
                    {t('timeline.transaction')} {t(`status.${item.status}`)}
                  </p>
                  <p className='text-sm text-gray-600 mt-1'>
                    {t('timeline.by')} {t(`timeline.actor.${item.actorType}`)}{' '}
                    {t('timeline.at')} {formatDateTime(item.at)}
                  </p>
                  {item.note && (
                    <p className='text-sm text-gray-700 mt-2 italic'>
                      &quot;{item.note}&quot;
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
