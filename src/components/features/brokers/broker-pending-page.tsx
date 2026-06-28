'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { BrokerService } from '@/api/services/broker.service'
import { ApiResponse } from '@/configs/axios/types'
import { AdminBrokerUserResponse } from '@/api/types/broker.type'
import { Button } from '@/components/atoms/button'
import { BrokerPendingTable } from '@/components/organisms/brokers/BrokerPendingTable'
import { BrokerReviewDialog } from '@/components/organisms/brokers/BrokerReviewDialog'

const DEFAULT_PAGE_SIZE = 10
const DOC_REFRESH_COOLDOWN_MS = 60 * 1000

type ActionKind = 'approve' | 'reject' | 'remove'

type BrokerFilterValues = {
  page: number
  pageSize: number
}

const BrokerPendingPage = () => {
  const t = useTranslations('moderation.brokerPending')

  const [brokers, setBrokers] = useState<AdminBrokerUserResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalItems, setTotalItems] = useState(0)
  const [filterValues, setFilterValues] = useState<BrokerFilterValues>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  })
  const [actionState, setActionState] = useState<
    Record<string, ActionKind | undefined>
  >({})
  const [reviewTarget, setReviewTarget] =
    useState<AdminBrokerUserResponse | null>(null)

  const lastDocRefreshRef = useRef(0)

  const setAction = (userId: string, action: ActionKind) => {
    setActionState((prev) => ({ ...prev, [userId]: action }))
  }

  const clearAction = (userId: string) => {
    setActionState((prev) => {
      const next = { ...prev }
      delete next[userId]
      return next
    })
  }

  const removeRow = useCallback((userId: string) => {
    setBrokers((prev) => prev.filter((user) => user.userId !== userId))
    setTotalItems((prev) => Math.max(0, prev - 1))
  }, [])

  const handleBrokerError = useCallback(
    (response: ApiResponse<unknown>, userId?: string) => {
      if (response.code === '4001' && userId) {
        toast.error(t('toasts.userNotFound'))
        removeRow(userId)
        return
      }

      if (response.code === '6001') {
        toast.error(t('toasts.accessDenied'))
        return
      }

      if (response.code === '17002') {
        console.error('Invalid broker action', response)
        toast.error(t('toasts.genericError'))
        return
      }

      toast.error(response.message || t('toasts.genericError'))
    },
    [removeRow, t],
  )

  const fetchPendingBrokers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await BrokerService.getPendingBrokers({
        page: filterValues.page,
        size: filterValues.pageSize,
      })

      if (response.success && response.data) {
        const payload = response.data as typeof response.data & {
          totalItems?: number
        }
        const resolvedTotalItems =
          typeof payload.totalElements === 'number'
            ? payload.totalElements
            : typeof payload.totalItems === 'number'
              ? payload.totalItems
              : Array.isArray(payload.data)
                ? payload.data.length
                : 0

        setBrokers(response.data.data || [])
        setTotalItems(resolvedTotalItems)
        setError(null)
      } else {
        setError(response.message || t('states.error'))
      }
    } catch (err) {
      console.error('Error fetching pending brokers:', err)
      setError(t('states.error'))
    } finally {
      setLoading(false)
    }
  }, [filterValues.page, filterValues.pageSize, t])

  useEffect(() => {
    fetchPendingBrokers()
  }, [fetchPendingBrokers])

  useEffect(() => {
    const handleRefresh = () => fetchPendingBrokers()
    window.addEventListener('broker-pending-refresh', handleRefresh)
    return () =>
      window.removeEventListener('broker-pending-refresh', handleRefresh)
  }, [fetchPendingBrokers])

  const handleFilterChange = (filters: Record<string, unknown>) => {
    setFilterValues((prev) => ({
      ...prev,
      ...filters,
      page: typeof filters.page === 'number' ? filters.page : prev.page,
      pageSize:
        typeof filters.pageSize === 'number' ? filters.pageSize : prev.pageSize,
    }))
  }

  const handleDocError = useCallback(() => {
    const now = Date.now()
    if (now - lastDocRefreshRef.current < DOC_REFRESH_COOLDOWN_MS) {
      return
    }
    lastDocRefreshRef.current = now
    fetchPendingBrokers()
  }, [fetchPendingBrokers])

  const handleApprove = async (user: AdminBrokerUserResponse) => {
    setAction(user.userId, 'approve')
    try {
      const response = await BrokerService.verifyBroker(user.userId, {
        action: 'APPROVE',
      })

      if (response.success) {
        removeRow(user.userId)
        toast.success(t('toasts.approved'))
        setReviewTarget(null)
      } else {
        handleBrokerError(response, user.userId)
      }
    } catch (err) {
      console.error('Approve broker failed:', err)
      toast.error(t('toasts.genericError'))
    } finally {
      clearAction(user.userId)
    }
  }

  const handleRejectWithReason = async (
    user: AdminBrokerUserResponse,
    reason: string,
  ) => {
    setAction(user.userId, 'reject')

    try {
      const response = await BrokerService.verifyBroker(user.userId, {
        action: 'REJECT',
        rejectionReason: reason,
      })

      if (response.success) {
        removeRow(user.userId)
        toast.success(t('toasts.rejected'))
        setReviewTarget(null)
      } else if (response.code === '17001') {
        toast.error(t('modal.reasonRequired'))
      } else {
        handleBrokerError(response, user.userId)
      }
    } catch (err) {
      console.error('Reject broker failed:', err)
      toast.error(t('toasts.genericError'))
    } finally {
      clearAction(user.userId)
    }
  }

  const handleRemove = async (user: AdminBrokerUserResponse) => {
    setAction(user.userId, 'remove')

    try {
      const response = await BrokerService.removeBroker(user.userId)
      if (response.success) {
        removeRow(user.userId)
        toast.success(t('toasts.removed'))
        setReviewTarget(null)
      } else {
        handleBrokerError(response, user.userId)
      }
    } catch (err) {
      console.error('Remove broker failed:', err)
      toast.error(t('toasts.genericError'))
    } finally {
      clearAction(user.userId)
    }
  }

  return (
    <div>
      <div className='space-y-6'>
        {error && (
          <div className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
            <div className='flex items-center justify-between gap-3'>
              <span>{error || t('states.error')}</span>
              <Button variant='outline' size='sm' onClick={fetchPendingBrokers}>
                {t('states.retry')}
              </Button>
            </div>
          </div>
        )}

        <BrokerPendingTable
          data={brokers}
          loading={loading}
          totalItems={totalItems}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onReview={setReviewTarget}
        />

        <BrokerReviewDialog
          open={!!reviewTarget}
          onOpenChange={(open) => !open && setReviewTarget(null)}
          broker={reviewTarget}
          actionState={actionState}
          onApprove={handleApprove}
          onRejectWithReason={handleRejectWithReason}
          onRemove={handleRemove}
        />
      </div>
    </div>
  )
}

export default BrokerPendingPage
