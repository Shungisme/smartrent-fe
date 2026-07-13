'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { ListingService } from '@/api/services/listing.service'
import { ListingStatisticsSummary } from '@/api/types/listing.type'
import { Loader2 } from 'lucide-react'
import { UIPostData } from '@/types/posts.type'
import {
  mapSummaryToUI,
  mapDetailToUI,
  mapUIFiltersToAPI,
} from '@/utils/post.utils'
import { PostStats } from '@/components/molecules/posts/PostStats'
import { PostTable } from '@/components/organisms/posts/PostTable'
import { PostReviewModal } from '@/components/organisms/posts/PostReviewModal'
import { AiSchedulerControl } from '@/components/molecules/aiServiceStatus/AiSchedulerControl'

// Backend success envelope code (see constants/env API_RESPONSE_CODES.SUCCESS).
const SUCCESS_CODE = '999999'

const PostVerification = () => {
  const t = useTranslations('posts')
  const [posts, setPosts] = useState<UIPostData[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)
  const [selectedPost, setSelectedPost] = useState<UIPostData | null>(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
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

  useEffect(() => {
    fetchListings()
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

  const handleReview = async (post: UIPostData) => {
    setReviewModalOpen(true)
    setSelectedPost(null)
    setDetailLoading(true)
    try {
      const response = await ListingService.getListingDetail(post.id)
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
  }

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

  return (
    <div>
      {initialLoading ? (
        <div className='flex items-center justify-center h-64'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
      ) : (
        <div className='space-y-6'>
          <AiSchedulerControl />

          <PostStats stats={stats} />

          <PostTable
            data={posts}
            loading={tableLoading}
            totalItems={totalCount}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
            onReview={handleReview}
          />
        </div>
      )}

      <PostReviewModal
        open={reviewModalOpen}
        onOpenChange={handleReviewModalChange}
        selectedPost={selectedPost}
        loading={detailLoading}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestRevision={handleRequestRevision}
        actionLoading={actionLoading}
      />
    </div>
  )
}

export default PostVerification
