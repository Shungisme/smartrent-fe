'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { FileSearch } from 'lucide-react'
import { BrokerService } from '@/api/services/broker.service'
import { ApiResponse } from '@/configs/axios/types'
import { AdminBrokerUserResponse } from '@/api/types/broker.type'
import { Button } from '@/components/atoms/button'
import { Skeleton } from '@/components/atoms/skeleton'
import { BrokerPendingTable } from '@/components/organisms/brokers/BrokerPendingTable'
import { BrokerRejectDialog } from '@/components/organisms/brokers/BrokerRejectDialog'
import { BrokerRemoveDialog } from '@/components/organisms/brokers/BrokerRemoveDialog'

const DEFAULT_PAGE_SIZE = 20
const DOC_REFRESH_COOLDOWN_MS = 60 * 1000

type ActionKind = 'approve' | 'reject' | 'remove'

type BrokerFilterValues = {
  page: number
  pageSize: number
}

const BrokerPendingPage = () => {
  const t = useTranslations('admin.brokerPending')

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

  const [rejectTarget, setRejectTarget] =
    useState<AdminBrokerUserResponse | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectError, setRejectError] = useState<string | null>(null)

  const [removeTarget, setRemoveTarget] =
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
        setBrokers(response.data.data || [])
        setTotalItems(response.data.totalElements || 0)
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

  const handleRejectOpen = (user: AdminBrokerUserResponse) => {
    setRejectTarget(user)
    setRejectReason('')
    setRejectError(null)
  }

  const handleRejectSubmit = async () => {
    if (!rejectTarget) return

    const trimmedReason = rejectReason.trim()
    if (!trimmedReason) {
      setRejectError(t('modal.reasonRequired'))
      return
    }

    setAction(rejectTarget.userId, 'reject')

    try {
      const response = await BrokerService.verifyBroker(rejectTarget.userId, {
        action: 'REJECT',
        rejectionReason: trimmedReason,
      })

      if (response.success) {
        removeRow(rejectTarget.userId)
        toast.success(t('toasts.rejected'))
        setRejectTarget(null)
        setRejectReason('')
        setRejectError(null)
      } else if (response.code === '17001') {
        setRejectError(t('modal.reasonRequired'))
      } else {
        handleBrokerError(response, rejectTarget.userId)
      }
    } catch (err) {
      console.error('Reject broker failed:', err)
      toast.error(t('toasts.genericError'))
    } finally {
      clearAction(rejectTarget.userId)
    }
  }

  const handleRemoveOpen = (user: AdminBrokerUserResponse) => {
    setRemoveTarget(user)
  }

  const handleRemoveConfirm = async () => {
    if (!removeTarget) return

    setAction(removeTarget.userId, 'remove')

    try {
      const response = await BrokerService.removeBroker(removeTarget.userId)
      if (response.success) {
        removeRow(removeTarget.userId)
        toast.success(t('toasts.removed'))
        setRemoveTarget(null)
      } else {
        handleBrokerError(response, removeTarget.userId)
      }
    } catch (err) {
      console.error('Remove broker failed:', err)
      toast.error(t('toasts.genericError'))
    } finally {
      clearAction(removeTarget.userId)
    }
  }

  const rejectLoading =
    rejectTarget && actionState[rejectTarget.userId] === 'reject'
  const removeLoading =
    removeTarget && actionState[removeTarget.userId] === 'remove'

  const showErrorState = !!error && brokers.length === 0 && !loading
  const showEmptyState = !loading && !error && brokers.length === 0

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-xl font-semibold text-gray-900'>{t('title')}</h1>
        <p className='mt-1 text-sm text-gray-600'>{t('subtitle')}</p>
      </div>

      {loading && brokers.length === 0 && (
        <div className='space-y-4'>
          <div className='rounded-2xl border border-gray-200 bg-white'>
            <div className='grid grid-cols-5 gap-4 border-b border-gray-200 px-6 py-4'>
              {Array.from({ length: 5 }).map((_, idx) => (
                <Skeleton key={idx} className='h-4 w-24' />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, rowIdx) => (
              <div
                key={rowIdx}
                className='grid grid-cols-5 gap-4 border-b border-gray-100 px-6 py-4'
              >
                {Array.from({ length: 5 }).map((_, colIdx) => (
                  <Skeleton key={colIdx} className='h-4 w-full' />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {showErrorState && (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center'>
          <p className='text-sm text-gray-700'>{t('states.error')}</p>
          <Button
            variant='outline'
            className='mt-4'
            onClick={() => fetchPendingBrokers()}
          >
            {t('states.retry')}
          </Button>
        </div>
      )}

      {showEmptyState && (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-50'>
            <FileSearch className='h-8 w-8 text-blue-600' />
          </div>
          <p className='mt-4 text-sm text-gray-600'>{t('states.empty')}</p>
        </div>
      )}

      {!showEmptyState && !showErrorState && brokers.length > 0 && (
        <BrokerPendingTable
          data={brokers}
          loading={loading}
          totalItems={totalItems}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          actionState={actionState}
          onApprove={handleApprove}
          onReject={handleRejectOpen}
          onRemove={handleRemoveOpen}
          onDocError={handleDocError}
        />
      )}

      <BrokerRejectDialog
        open={!!rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        reason={rejectReason}
        onReasonChange={(value) => {
          setRejectReason(value)
          if (rejectError) setRejectError(null)
        }}
        onSubmit={handleRejectSubmit}
        error={rejectError}
        loading={!!rejectLoading}
      />

      <BrokerRemoveDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        onConfirm={handleRemoveConfirm}
        loading={!!removeLoading}
      />
    </div>
  )
}

export default BrokerPendingPage
