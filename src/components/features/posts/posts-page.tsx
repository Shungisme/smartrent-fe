'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { ListingService } from '@/api/services/listing.service'
import { ListingStatisticsSummary } from '@/api/types/listing.type'
import { Loader2, Sparkles } from 'lucide-react'
import { UIPostData } from '@/types/posts.type'
import {
  mapSummaryToUI,
  mapDetailToUI,
  mapUIFiltersToAPI,
} from '@/utils/post.utils'
import { PostStats } from '@/components/molecules/posts/PostStats'
import { PostTable } from '@/components/organisms/posts/PostTable'
import { PostReviewModal } from '@/components/organisms/posts/PostReviewModal'
import { AiAutoVerifyControl } from '@/components/molecules/aiServiceStatus/AiAutoVerifyControl'
import { ConfirmDialog } from '@/components/molecules/confirmDialog'
import { toPercent, getScoreColorClasses } from '@/utils/ai-verification.utils'
import { cn } from '@/lib/utils'

// Backend success envelope code (see constants/env API_RESPONSE_CODES.SUCCESS).
const SUCCESS_CODE = '999999'

const PostVerification = () => {
  const t = useTranslations('posts')
  const tCommon = useTranslations('common')
  const [posts, setPosts] = useState<UIPostData[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)
  const [selectedPost, setSelectedPost] = useState<UIPostData | null>(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [visibilityLoading, setVisibilityLoading] = useState(false)
  const [quickApproveTarget, setQuickApproveTarget] =
    useState<UIPostData | null>(null)
  const [quickApproveLoading, setQuickApproveLoading] = useState(false)
  const [stats, setStats] = useState<ListingStatisticsSummary>({
    pendingVerification: 0,
    verified: 0,
    expired: 0,
    drafts: 0,
    shadows: 0,
    normalListings: 0,
    silverListings: 0,
    goldListings: 0,
    diamondListings: 0,
  })
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({
    moderationStatus: 'PENDING_REVIEW',
    page: 1,
    pageSize: 20,
  })
  const [totalCount, setTotalCount] = useState(0)

  // Deep link target, e.g. from a "pending review" / "resubmitted" notification:
  // /content/posts?id=123
  const searchParams = useSearchParams()
  const deepLinkId = searchParams?.get('id') ?? null
  const lastOpenedIdRef = useRef<string | null>(null)

  useEffect(() => {
    fetchListings()
  }, [filterValues])

  useEffect(() => {
    const handleRefresh = () => fetchListings()
    window.addEventListener('listing-pending-refresh', handleRefresh)
    return () =>
      window.removeEventListener('listing-pending-refresh', handleRefresh)
  }, [filterValues])

  const fetchListings = async () => {
    try {
      if (initialLoading) {
        setInitialLoading(true)
      } else {
        setTableLoading(true)
      }

      const apiFilters = mapUIFiltersToAPI(filterValues)
      const response = await ListingService.getAdminListings(apiFilters)

      if (response.data) {
        const uiData = response.data.listings.map(mapSummaryToUI)
        setPosts(uiData)
        setStats(response.data.statistics)
        setTotalCount(response.data.totalCount || 0)
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
      toast.error(t('toasts.loadListingsError'))
    } finally {
      setInitialLoading(false)
      setTableLoading(false)
    }
  }

  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    setFilterValues(newFilters)
  }

  const openReviewById = useCallback(
    async (listingId: string) => {
      setReviewModalOpen(true)
      setSelectedPost(null)
      setDetailLoading(true)
      try {
        const response = await ListingService.getListingDetail(listingId)
        if (response.success && response.data) {
          setSelectedPost(mapDetailToUI(response.data))
        } else {
          toast.error(response.message || t('toasts.loadDetailError'))
          setReviewModalOpen(false)
        }
      } catch (error) {
        console.error('Error fetching listing detail:', error)
        toast.error(t('toasts.loadDetailError'))
        setReviewModalOpen(false)
      } finally {
        setDetailLoading(false)
      }
    },
    [t],
  )

  const handleReview = (post: UIPostData) => openReviewById(post.id)

  // Open the listing referenced by ?id= (from a notification) in the review
  // modal. getListingDetail fetches by id, so this works even when the listing
  // isn't in the current (PENDING_REVIEW-filtered) table — e.g. a RESUBMITTED one.
  useEffect(() => {
    if (!deepLinkId || lastOpenedIdRef.current === deepLinkId) return
    if (Number.isNaN(Number(deepLinkId))) return
    lastOpenedIdRef.current = deepLinkId
    openReviewById(deepLinkId)
  }, [deepLinkId, openReviewById])

  const handleReviewModalChange = (open: boolean) => {
    setReviewModalOpen(open)
    if (!open) {
      setSelectedPost(null)
    }
  }

  const handleApprove = async (notes: string) => {
    if (!selectedPost) return
    void notes

    try {
      setActionLoading(true)
      const response = await ListingService.approveListing(selectedPost.id)

      if (response.success && response.code === SUCCESS_CODE) {
        toast.success(t('toasts.approveSuccess'))
        // Close the dialog immediately, then refresh the table in the
        // background — don't leave the modal open during the refetch.
        setReviewModalOpen(false)
        setSelectedPost(null)
        await fetchListings()
      } else {
        const errorMessage = response.message || t('toasts.approveError')
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Error approving listing:', error)
      toast.error(t('toasts.approveError'))
    } finally {
      setActionLoading(false)
    }
  }

  // Quick-approve straight from the table row for posts the AI background job
  // already suggested approving — reuses the same approve endpoint as the
  // review dialog, just without needing to fetch the full listing detail first.
  const handleQuickApprove = (post: UIPostData) => setQuickApproveTarget(post)

  const confirmQuickApprove = async () => {
    if (!quickApproveTarget) return

    try {
      setQuickApproveLoading(true)
      const response = await ListingService.approveListing(
        quickApproveTarget.id,
      )

      if (response.success && response.code === SUCCESS_CODE) {
        toast.success(t('toasts.approveSuccess'))
        setQuickApproveTarget(null)
        await fetchListings()
      } else {
        toast.error(response.message || t('toasts.approveError'))
      }
    } catch (error) {
      console.error('Error quick-approving listing:', error)
      toast.error(t('toasts.approveError'))
    } finally {
      setQuickApproveLoading(false)
    }
  }

  const handleReject = async (reason: string) => {
    if (!selectedPost) return

    if (!reason.trim()) {
      toast.warning(t('toasts.rejectReasonRequired'))
      return
    }

    try {
      setActionLoading(true)
      const deadline = new Date()
      deadline.setDate(deadline.getDate() + 7)

      const response = await ListingService.rejectListingWithReason(
        selectedPost.id,
        reason,
        true,
        deadline.toISOString(),
      )

      if (response.success && response.code === SUCCESS_CODE) {
        toast.success(t('toasts.rejectSuccess'))
        setReviewModalOpen(false)
        setSelectedPost(null)
        await fetchListings()
      } else {
        const errorMessage = response.message || t('toasts.rejectError')
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Error rejecting listing:', error)
      toast.error(t('toasts.rejectError'))
    } finally {
      setActionLoading(false)
    }
  }

  const handleRequestRevision = async (reason: string) => {
    if (!selectedPost) return

    if (!reason.trim()) {
      toast.warning(t('toasts.revisionDetailsRequired'))
      return
    }

    try {
      setActionLoading(true)
      const response = await ListingService.requestListingRevision(
        selectedPost.id,
        reason,
        true,
      )

      if (response.success && response.code === SUCCESS_CODE) {
        toast.success(t('toasts.revisionSuccess'))
        setReviewModalOpen(false)
        setSelectedPost(null)
        await fetchListings()
      } else {
        const errorMessage = response.message || t('toasts.revisionError')
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Error requesting revision:', error)
      toast.error(t('toasts.revisionError'))
    } finally {
      setActionLoading(false)
    }
  }

  const handleHide = async () => {
    if (!selectedPost) return

    try {
      setVisibilityLoading(true)
      const response = await ListingService.hideListing(
        selectedPost.id,
        t('review.hideReason'),
      )

      if (response.success && response.code === SUCCESS_CODE) {
        toast.success(t('toasts.hideSuccess'))
        setReviewModalOpen(false)
        setSelectedPost(null)
        await fetchListings()
      } else {
        const errorMessage = response.message || t('toasts.hideError')
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Error hiding listing:', error)
      toast.error(t('toasts.hideError'))
    } finally {
      setVisibilityLoading(false)
    }
  }

  const handleUnhide = async () => {
    if (!selectedPost) return

    try {
      setVisibilityLoading(true)
      const response = await ListingService.unhideListing(selectedPost.id)

      if (response.success && response.code === SUCCESS_CODE) {
        toast.success(t('toasts.unhideSuccess'))
        setReviewModalOpen(false)
        setSelectedPost(null)
        await fetchListings()
      } else {
        const errorMessage = response.message || t('toasts.unhideError')
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Error unhiding listing:', error)
      toast.error(t('toasts.unhideError'))
    } finally {
      setVisibilityLoading(false)
    }
  }

  return (
    <div>
      {initialLoading ? (
        <div className='flex items-center justify-center h-64'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
      ) : (
        <div className='space-y-6'>
          <AiAutoVerifyControl />

          <PostStats stats={stats} />

          <PostTable
            data={posts}
            loading={tableLoading}
            totalItems={totalCount}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
            onReview={handleReview}
            onQuickApprove={handleQuickApprove}
          />
        </div>
      )}

      <ConfirmDialog
        open={!!quickApproveTarget}
        onOpenChange={(open) => !open && setQuickApproveTarget(null)}
        title={t('table.quickApproveTitle')}
        description={
          quickApproveTarget && (
            <div className='space-y-3 text-left'>
              <p className='text-sm text-foreground/90'>
                {t.rich('table.quickApproveDescription', {
                  title: quickApproveTarget.title,
                  b: (chunks) => (
                    <span className='font-semibold text-foreground'>
                      {chunks}
                    </span>
                  ),
                })}
              </p>
              <div
                className={cn(
                  'rounded-lg border p-3',
                  getScoreColorClasses(
                    quickApproveTarget.aiQuickApprove?.score ?? 1,
                  ),
                )}
              >
                <div className='flex items-center justify-between gap-2'>
                  <span className='flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide opacity-80'>
                    <Sparkles className='h-3.5 w-3.5' />
                    {t('table.aiSuggestionLabel')}
                  </span>
                  {typeof quickApproveTarget.aiQuickApprove?.score ===
                    'number' && (
                    <span className='text-sm font-bold tabular-nums'>
                      {toPercent(quickApproveTarget.aiQuickApprove.score)}%
                    </span>
                  )}
                </div>
                <p className='mt-2 text-sm leading-snug'>
                  {quickApproveTarget.aiQuickApprove?.reason ||
                    t('table.aiApprovedBadge')}
                </p>
              </div>
            </div>
          )
        }
        confirmLabel={t('table.quickApproveConfirm')}
        cancelLabel={tCommon('cancel')}
        onConfirm={confirmQuickApprove}
        loading={quickApproveLoading}
      />

      <PostReviewModal
        open={reviewModalOpen}
        onOpenChange={handleReviewModalChange}
        selectedPost={selectedPost}
        loading={detailLoading}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestRevision={handleRequestRevision}
        onHide={handleHide}
        onUnhide={handleUnhide}
        actionLoading={actionLoading}
        visibilityLoading={visibilityLoading}
      />
    </div>
  )
}

export default PostVerification
