'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Bot, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AiVerificationService } from '@/api/services/ai-verification.service'
import { useAuthStore } from '@/store/auth/index.store'

/**
 * Admin roles allowed to read/toggle the auto-moderation scheduler.
 *
 * The JWT's `user.roles` carries human-readable role names (e.g. "Super Admin"),
 * not the short codes the admin-list API returns ("SA"). We accept both so the
 * gate works regardless of which source populated the store.
 */
const ALLOWED_ROLES = [
  'SA',
  'UA',
  'SPA',
  'Super Admin',
  'User Admin',
  'Support Admin',
]

interface AiSchedulerControlProps {
  className?: string
}

/**
 * Admin control for the AI auto-moderation scheduler.
 *
 * Reads the current enabled/paused state on mount and lets allowed admins
 * (SA / UA / SPA) flip the background cronjob ON or OFF at runtime. The
 * backend flag is in-memory and resets to enabled on server restart, which is
 * surfaced to the admin via the helper copy.
 *
 * Renders nothing for admins whose roles are not permitted to manage it.
 */
export const AiSchedulerControl: React.FC<AiSchedulerControlProps> = ({
  className,
}) => {
  const t = useTranslations('posts')
  const roles = useAuthStore((s) => s.user?.roles)
  const canManage = !!roles?.some((r) => ALLOWED_ROLES.includes(r))

  const [enabled, setEnabled] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)

  const fetchStatus = useCallback(async () => {
    setLoading(true)
    try {
      const res = await AiVerificationService.getSchedulerStatus()
      if (res.success && res.data) {
        setEnabled(res.data.aiSchedulerEnabled)
      } else {
        setEnabled(null)
      }
    } catch {
      setEnabled(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (canManage) fetchStatus()
  }, [canManage, fetchStatus])

  const handleToggle = async () => {
    if (toggling || enabled === null) return
    const next = !enabled
    setToggling(true)
    // Optimistic update; revert on failure.
    setEnabled(next)
    try {
      const res = await AiVerificationService.toggleScheduler(next)
      if (res.success && res.data) {
        setEnabled(res.data.aiSchedulerEnabled)
        toast.success(
          next ? t('aiScheduler.enabledToast') : t('aiScheduler.disabledToast'),
        )
      } else {
        setEnabled(!next)
        toast.error(res.message || t('aiScheduler.toggleError'))
      }
    } catch {
      setEnabled(!next)
      toast.error(t('aiScheduler.toggleError'))
    } finally {
      setToggling(false)
    }
  }

  if (!canManage) return null

  const isOn = enabled === true

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/70 bg-muted/40 px-4 py-3',
        className,
      )}
    >
      <div className='flex items-start gap-3'>
        <span
          className={cn(
            'mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors',
            isOn
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground',
          )}
        >
          <Bot className='h-5 w-5' />
        </span>
        <div className='space-y-0.5'>
          <div className='flex items-center gap-2 text-sm font-semibold text-foreground'>
            {t('aiScheduler.title')}
            {!loading && enabled !== null && (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
                  isOn
                    ? 'bg-success/10 text-success-foreground dark:bg-success/20'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    isOn ? 'bg-success' : 'bg-muted-foreground',
                  )}
                />
                {isOn ? t('aiScheduler.statusOn') : t('aiScheduler.statusOff')}
              </span>
            )}
          </div>
          <p className='max-w-md text-xs text-muted-foreground'>
            {t('aiScheduler.description')}
          </p>
          <p className='text-[11px] text-muted-foreground/70'>
            {t('aiScheduler.restartNote')}
          </p>
        </div>
      </div>

      {loading ? (
        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          <Loader2 className='h-4 w-4 animate-spin' />
          {t('aiScheduler.loading')}
        </div>
      ) : enabled === null ? (
        <button
          type='button'
          onClick={fetchStatus}
          className='text-xs font-medium text-primary transition-colors hover:text-primary/80'
        >
          {t('aiScheduler.retry')}
        </button>
      ) : (
        <button
          type='button'
          role='switch'
          aria-checked={isOn}
          aria-label={t('aiScheduler.title')}
          onClick={handleToggle}
          disabled={toggling}
          className={cn(
            'relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-60',
            isOn ? 'bg-primary' : 'bg-muted-foreground/30',
          )}
        >
          <span
            className={cn(
              'inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-background shadow-sm transition-transform duration-200',
              isOn ? 'translate-x-5' : 'translate-x-0.5',
            )}
          >
            {toggling && (
              <Loader2 className='h-3 w-3 animate-spin text-muted-foreground' />
            )}
          </span>
        </button>
      )}
    </div>
  )
}
