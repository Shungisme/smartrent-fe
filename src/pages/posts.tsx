import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/useDebounce'
import AdminLayout from '@/components/layouts/AdminLayout'
import { NextPageWithLayout } from '@/types/next-page'
import { ListingService } from '@/api/services/listing.service'
import { ListingStatisticsSummary } from '@/api/types/listing.type'
import { Loader2 } from 'lucide-react'
import { UIPostData } from '@/types/posts.type'
import { mapApiDataToUI, mapUIFiltersToAPI } from '@/utils/post.utils'
import { PostStats } from '@/components/molecules/posts/PostStats'
import { PostTable } from '@/components/organisms/posts/PostTable'
import { PostReviewModal } from '@/components/organisms/posts/PostReviewModal'

const PostVerification: NextPageWithLayout = () => {
  const t = useTranslations('posts')

  const [posts, setPosts] = useState<UIPostData[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)
  const [selectedPost, setSelectedPost] = useState<UIPostData | null>(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
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
    status: 'pending',
    page: 1,
    pageSize: 20,
  })
  const [totalCount, setTotalCount] = useState(0)
  const debouncedSearchTerm = useDebounce(filterValues.search || '', 500)

  // Update filterValues with actual search term for DataTable to maintain input state
  // This is passed to PostTable -> DataTable
  // Wait, if I pass filterValues directly to DataTable, it might not work as expected if I debounced it inside DataTable?
  // In original code:
  // const controlledFilterValues = { ...filterValues, search: filterValues.search }
  // debouncedSearchTerm was used in useEffect dependencies.
  // PostTable accepts filterValues and onFilterChange.

  // Fetch listings on mount and when filters change
  useEffect(() => {
    fetchListings()
  }, [
    debouncedSearchTerm,
    filterValues.status,
    filterValues['propertyInfo.type'],
    filterValues.listingType,
    filterValues.page,
    filterValues.pageSize,
  ])

  const fetchListings = async () => {
    try {
      // Only show full-page loading on initial load
      if (initialLoading) {
        setInitialLoading(true)
      } else {
        setTableLoading(true)
      }

      // Map UI filters to API format
      const apiFilters = mapUIFiltersToAPI({
        ...filterValues,
        search: debouncedSearchTerm,
      })

      const response = await ListingService.getAdminListings(apiFilters)

      if (response.data) {
        const uiData = response.data.listings.map(mapApiDataToUI)
        setPosts(uiData)
        setStats(response.data.statistics)
        setTotalCount(response.data.totalCount || 0)
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
      toast.error('Failed to load listings. Please try again.')
    } finally {
      setInitialLoading(false)
      setTableLoading(false)
    }
  }

  // Handle filter changes from DataTable
  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    setFilterValues(newFilters)
  }

  const handleReview = (post: UIPostData) => {
    setSelectedPost(post)
    setReviewModalOpen(true)
  }

  const handleApprove = async (notes: string) => {
    if (!selectedPost) return

    try {
      setActionLoading(true)
      const response = await ListingService.verifyListing(
        selectedPost.id,
        notes || 'Listing approved',
      )

      // Check if request was successful
      if (response && response.code !== '9999') {
        toast.success('Listing has been approved successfully.')

        // Refresh listings
        await fetchListings()
        setReviewModalOpen(false)
        setSelectedPost(null)
      } else {
        // Handle error response
        const errorMessage =
          response.message || 'Failed to approve listing. Please try again.'
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Error approving listing:', error)
      toast.error('Failed to approve listing. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (reason: string) => {
    if (!selectedPost) return

    if (!reason.trim()) {
      toast.warning('Please provide a reason for rejection.')
      return
    }

    try {
      setActionLoading(true)
      const response = await ListingService.rejectListing(
        selectedPost.id,
        reason,
      )

      // Check if request was successful
      if (response && response.code !== '9999') {
        toast.success('Listing has been rejected.')

        // Refresh listings
        await fetchListings()
        setReviewModalOpen(false)
        setSelectedPost(null)
      } else {
        // Handle error response
        const errorMessage =
          response.message || 'Failed to reject listing. Please try again.'
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Error rejecting listing:', error)
      toast.error('Failed to reject listing. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div>
      {initialLoading ? (
        <div className='flex items-center justify-center h-64'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
        </div>
      ) : (
        <div className='space-y-6'>
          {/* Header Section */}
          <div className='flex flex-col lg:flex-row items-start lg:items-start justify-between gap-4'>
            <div>
              <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
                {t('title')}
              </h1>
              <p className='mt-1 text-sm text-gray-600'>{t('description')}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <PostStats stats={stats} totalPosts={posts.length} />

          {/* DataTable Component */}
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

      {/* Review Modal */}
      <PostReviewModal
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        selectedPost={selectedPost}
        onApprove={handleApprove}
        onReject={handleReject}
        actionLoading={actionLoading}
      />
    </div>
  )
}

PostVerification.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout activeItem='posts'>{page}</AdminLayout>
}

export default PostVerification
