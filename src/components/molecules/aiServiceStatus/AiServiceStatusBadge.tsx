'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AiVerificationService } from '@/api/services/ai-verification.service'

type StatusState = 'checking' | 'online' | 'offline'

interface AiServiceStatusBadgeProps {
  className?: string
  /** Show a manual refresh button next to the status. Default true. */
  refreshable?: boolean
  /** Called whenever availability is resolved. */
  onStatusChange?: (available: boolean) => void
}

/**
 * Compact indicator for the Python AI service reachability.
 * Calls GET /v1/ai/listings/service-status on mount and on manual refresh.
 */
export const AiServiceStatusBadge: React.FC<AiServiceStatusBadgeProps> = ({
  className,
  refreshable = true,
  onStatusChange,
}) => {
  const t = useTranslations('posts')
  const [state, setState] = useState<StatusState>('checking')
  const [checkedAt, setCheckedAt] = useState<string | null>(null)

  const check = useCallback(async () => {
    setState('checking')
    try {
      const res = await AiVerificationService.getServiceStatus()
      const available = !!(res.success && res.data?.available)
      setState(available ? 'online' : 'offline')
      setCheckedAt(res.data?.checked_at ?? null)
      onStatusChange?.(available)
    } catch {
      setState('offline')
      onStatusChange?.(false)
    }
  }, [onStatusChange])

  useEffect(() => {
    check()
  }, [check])

  const dotColor =
    state === 'online'
      ? 'bg-green-500'
      : state === 'offline'
        ? 'bg-red-500'
        : 'bg-gray-400'

  const label =
    state === 'online'
      ? t('aiAnalysis.serviceOnline')
      : state === 'offline'
        ? t('aiAnalysis.serviceOffline')
        : t('aiAnalysis.serviceChecking')

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700',
        className,
      )}
      title={
        checkedAt
          ? `${t('aiAnalysis.lastChecked')}: ${new Date(
              checkedAt,
            ).toLocaleString()}`
          : undefined
      }
    >
      {state === 'checking' ? (
        <Loader2 className='h-3 w-3 animate-spin text-gray-400' />
      ) : (
        <span className={cn('h-2 w-2 rounded-full', dotColor)} />
      )}
      <span>{label}</span>
      {refreshable && state !== 'checking' && (
        <button
          type='button'
          onClick={check}
          className='ml-0.5 text-gray-400 transition-colors hover:text-gray-700'
          aria-label={t('aiAnalysis.refreshStatus')}
        >
          <RefreshCw className='h-3 w-3' />
        </button>
      )}
    </div>
  )
}
