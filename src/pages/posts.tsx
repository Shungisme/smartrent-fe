import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/useDebounce'
import AdminLayout from '@/components/layouts/AdminLayout'
import {
  DataTable,
  Column,
  FilterConfig,
} from '@/components/organisms/DataTable'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'
import { Avatar } from '@/components/atoms/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { cn } from '@/lib/utils'
import { NextPageWithLayout } from '@/types/next-page'
import {
  Home,
  Building2,
  Briefcase,
  MapPin,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react'
import { ListingService } from '@/api/services/listing.service'
import {
  AdminListingItem,
  ListingStatisticsSummary,
  VipType,
  ListingFilterRequest,
  ProductType,
  Amenity,
} from '@/api/types/listing.type'

// UI Display Types
type PostStatus = 'pending' | 'approved' | 'rejected' | 'expired'
type UIPostData = {
  id: string
  title: string
  postCode: string
  images: string[]
  listingType: 'for_sale' | 'for_rent'
  vipLevel?: number
  poster: {
    name: string
    avatar?: string
    userId: string
    phone: string
  }
  propertyInfo: {
    type: string
    area: number
    district: string
    fullAddress: string
  }
  price: string
  priceRaw: number
  postedDate: string
  postedTime: string
  expiryDate: string
  status: PostStatus
  verified: boolean
  isVerify: boolean
  rejectionReason?: string | null
  verificationNotes?: string | null
  amenities?: Amenity[]
  description?: string
  bedrooms?: number | null
  bathrooms?: number | null
  direction?: string | null
  furnishing?: string | null
}

// Helper functions
const getVipLevel = (vipType: VipType): number | undefined => {
  const levels: Record<VipType, number | undefined> = {
    NORMAL: undefined,
    SILVER: 1,
    GOLD: 2,
    DIAMOND: 3,
  }
  return levels[vipType]
}

const getPropertyIcon = (type: string) => {
  const iconMap: Record<string, React.ReactElement> = {
    HOUSE: <Home className='h-4 w-4' />,
    APARTMENT: <Building2 className='h-4 w-4' />,
    OFFICE: <Briefcase className='h-4 w-4' />,
    LAND: <MapPin className='h-4 w-4' />,
    ROOM: <Building2 className='h-4 w-4' />,
  }
  return iconMap[type] || <Home className='h-4 w-4' />
}

const getPropertyTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    HOUSE: 'Nhà',
    APARTMENT: 'Căn hộ',
    OFFICE: 'Văn phòng',
    LAND: 'Đất',
    ROOM: 'Phòng trọ',
    OTHER: 'Khác',
  }
  return labels[type] || type
}

const formatPrice = (price: number, priceUnit: string): string => {
  const formatted = new Intl.NumberFormat('vi-VN').format(price)
  const unitMap: Record<string, string> = {
    VND_PER_MONTH: 'đ/tháng',
    VND_PER_YEAR: 'đ/năm',
    VND_TOTAL: 'đ',
  }
  return `${formatted}${unitMap[priceUnit] || 'đ'}`
}

const formatDateTime = (isoString: string): { date: string; time: string } => {
  const date = new Date(isoString)
  return {
    date: date.toLocaleDateString('vi-VN'),
    time: date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
}

// Helper function to map UI filters to API filter format
const mapUIFiltersToAPI = (
  uiFilters: Record<string, unknown>,
): Partial<ListingFilterRequest> => {
  const apiFilters: Partial<ListingFilterRequest> = {
    page: 0, // Backend uses 0-based pagination
    size: 20,
    sortBy: 'NEWEST',
  }

  // Search keyword
  if (uiFilters.search) {
    apiFilters.keyword = String(uiFilters.search)
  }

  // Status mapping
  if (uiFilters.status) {
    switch (String(uiFilters.status)) {
      case 'pending':
        apiFilters.isVerify = false
        apiFilters.verified = undefined
        apiFilters.expired = false
        break
      case 'approved':
        apiFilters.verified = true
        apiFilters.isVerify = true
        apiFilters.expired = false
        break
      case 'rejected':
        apiFilters.verified = false
        apiFilters.isVerify = true
        apiFilters.expired = false
        break
      case 'expired':
        apiFilters.expired = true
        break
    }
  }

  // Property type (productType in API)
  if (uiFilters['propertyInfo.type']) {
    apiFilters.productType = String(
      uiFilters['propertyInfo.type'],
    ) as ProductType
  }

  // Listing type mapping
  if (uiFilters.listingType) {
    apiFilters.listingType =
      String(uiFilters.listingType) === 'for_rent' ? 'FOR_RENT' : 'FOR_SALE'
  }

  return apiFilters
}

const mapApiDataToUI = (item: AdminListingItem): UIPostData => {
  const { date, time } = formatDateTime(item.postDate)
  const { date: expiryDate } = formatDateTime(item.expiryDate)

  // Determine status from adminVerification.verificationStatus
  let status: PostStatus = 'pending'
  if (item.expired) {
    status = 'expired'
  } else if (item.adminVerification?.verificationStatus) {
    const verificationStatus = item.adminVerification.verificationStatus
    switch (verificationStatus) {
      case 'VERIFIED':
        status = 'approved'
        break
      case 'REJECTED':
        status = 'rejected'
        break
      case 'PENDING':
      default:
        status = 'pending'
        break
    }
  } else {
    status = 'pending'
  }

  return {
    id: item.listingId.toString(),
    title: item.title,
    postCode: `POST-${item.listingId}`,
    images: item.media?.map((m) => m.url) || [],
    listingType: item.listingType === 'FOR_RENT' ? 'for_rent' : 'for_sale',
    vipLevel: getVipLevel(item.vipType),
    poster: {
      name: item.user
        ? `${item.user.firstName} ${item.user.lastName}`
        : 'Unknown User',
      avatar: item.user?.avatarUrl || undefined,
      userId: item.user?.userId || item.userId,
      phone: item.user?.contactPhoneNumber || '',
    },
    propertyInfo: {
      type: item.productType,
      area: item.area || 0,
      district: item.address?.legacyDistrictName || 'N/A',
      fullAddress: item.address?.fullAddress || 'N/A',
    },
    price: formatPrice(item.price, item.priceUnit),
    priceRaw: item.price,
    postedDate: date,
    postedTime: time,
    expiryDate: expiryDate,
    status,
    verified: item.verified,
    isVerify: item.isVerify,
    rejectionReason: item.adminVerification?.rejectionReason,
    verificationNotes: item.adminVerification?.verificationNotes,
    amenities: item.amenities,
    description: item.description,
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms,
    direction: item.direction,
    furnishing: item.furnishing,
  }
}

const getStatusColor = (status: PostStatus): string => {
  const colors = {
    pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    approved: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    expired: 'bg-gray-50 text-gray-700 border-gray-200',
  }
  return colors[status]
}

const getStatusLabel = (status: PostStatus): string => {
  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    expired: 'Expired',
  }
  return labels[status]
}

const PostVerification: NextPageWithLayout = () => {
  const t = useTranslations('posts')
  const [posts, setPosts] = useState<UIPostData[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)
  const [selectedPost, setSelectedPost] = useState<UIPostData | null>(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [verificationNotes, setVerificationNotes] = useState('')
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
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({})
  const debouncedSearchTerm = useDebounce(filterValues.search || '', 500)

  // Update filterValues with actual search term for DataTable to maintain input state
  const controlledFilterValues = {
    ...filterValues,
    search: filterValues.search, // Keep the actual input value, not debounced
  }

  // Fetch listings on mount and when filters change
  useEffect(() => {
    fetchListings()
  }, [
    debouncedSearchTerm,
    filterValues.status,
    filterValues['propertyInfo.type'],
    filterValues.listingType,
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
    setRejectionReason(post.rejectionReason || '')
    setVerificationNotes(post.verificationNotes || '')
  }

  const handleApprove = async () => {
    if (!selectedPost) return

    try {
      setActionLoading(true)
      await ListingService.verifyListing(
        selectedPost.id,
        verificationNotes || 'Listing approved',
      )

      toast.success('Listing has been approved successfully.')

      // Refresh listings
      await fetchListings()
      setReviewModalOpen(false)
      setSelectedPost(null)
      setVerificationNotes('')
    } catch (error) {
      console.error('Error approving listing:', error)
      toast.error('Failed to approve listing. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedPost) return

    if (!rejectionReason.trim()) {
      toast.warning('Please provide a reason for rejection.')
      return
    }

    try {
      setActionLoading(true)
      await ListingService.rejectListing(selectedPost.id, rejectionReason)

      toast.success('Listing has been rejected.')

      // Refresh listings
      await fetchListings()
      setReviewModalOpen(false)
      setSelectedPost(null)
      setRejectionReason('')
    } catch (error) {
      console.error('Error rejecting listing:', error)
      alert('Failed to reject listing. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  // Define columns for DataTable
  const columns: Column<UIPostData>[] = [
    {
      id: 'post',
      header: t('table.postDetails'),
      accessor: (row) => row.title,
      sortable: true,
      render: (_, row) => (
        <div className='flex gap-3'>
          <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg'>
            <Image
              src={row.images[0]}
              alt={row.title}
              width={64}
              height={64}
              className='h-full w-full object-cover'
            />
            {row.images.length > 1 && (
              <div className='absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white'>
                +{row.images.length - 1}
              </div>
            )}
          </div>
          <div className='flex-1 min-w-0'>
            <div className='font-medium text-gray-900 truncate'>
              {row.title}
            </div>
            <div className='mt-0.5 text-xs text-gray-400'>{row.postCode}</div>
            <div className='mt-1 flex flex-wrap gap-1'>
              {row.vipLevel && (
                <Badge className='bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-0'>
                  VIP{row.vipLevel}
                </Badge>
              )}
              <Badge
                className={cn(
                  'text-xs px-2 py-0',
                  row.listingType === 'for_sale'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800',
                )}
              >
                {row.listingType === 'for_sale' ? 'For Sale' : 'For Rent'}
              </Badge>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'poster',
      header: t('table.poster'),
      accessor: (row) => row.poster.name,
      sortable: true,
      render: (_, row) => (
        <div className='flex items-center gap-2'>
          <Avatar className='h-10 w-10'>
            <div className='h-full w-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold'>
              {row.poster.name.charAt(0).toUpperCase()}
            </div>
          </Avatar>
          <div>
            <div className='text-sm font-medium text-gray-900'>
              {row.poster.name}
            </div>
            <div className='text-xs text-gray-500'>{row.poster.phone}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'propertyInfo',
      header: t('table.propertyInfo'),
      accessor: (row) => row.propertyInfo.type,
      render: (_, row) => (
        <div className='flex items-center gap-2 text-sm text-gray-700'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100'>
            {getPropertyIcon(row.propertyInfo.type)}
          </div>
          <div>
            <div className='font-medium'>
              {getPropertyTypeLabel(row.propertyInfo.type)}
            </div>
            <div className='text-xs text-gray-500'>
              {row.propertyInfo.area}m² • {row.propertyInfo.district}
            </div>
          </div>
        </div>
      ),
      hideOnMobile: true,
    },
    {
      id: 'price',
      header: t('table.price'),
      accessor: 'price',
      render: (value) => (
        <div className='text-sm font-semibold text-gray-900'>
          {value as React.ReactNode}
        </div>
      ),
    },
    {
      id: 'postedDate',
      header: t('table.postedDate'),
      accessor: 'postedDate',
      sortable: true,
      render: (_, row) => (
        <div className='text-sm text-gray-500'>
          <div>{row.postedDate}</div>
          <div className='text-xs text-gray-400'>{row.postedTime}</div>
        </div>
      ),
    },
    {
      id: 'status',
      header: t('table.status'),
      accessor: 'status',
      render: (value) => (
        <Badge
          variant='outline'
          className={cn(
            'text-xs font-medium',
            getStatusColor(value as PostStatus),
          )}
        >
          {getStatusLabel(value as PostStatus)}
        </Badge>
      ),
    },
  ]

  // Define filters for DataTable
  const filters: FilterConfig[] = [
    {
      id: 'search',
      type: 'search',
      label: t('search.placeholder'),
      placeholder: t('search.placeholder'),
    },
    {
      id: 'status',
      type: 'select',
      label: t('filters.allStatus'),
      options: [
        { value: 'pending', label: t('filters.pending') },
        { value: 'approved', label: t('filters.approved') },
        { value: 'rejected', label: t('filters.rejected') },
      ],
    },
    {
      id: 'propertyInfo.type',
      type: 'select',
      label: t('filters.allTypes'),
      options: [
        { value: 'HOUSE', label: t('filters.house') },
        { value: 'APARTMENT', label: t('filters.apartment') },
        { value: 'OFFICE', label: t('filters.office') },
        { value: 'LAND', label: t('filters.land') },
      ],
    },
    {
      id: 'listingType',
      type: 'select',
      label: t('filters.allCategories'),
      options: [
        { value: 'for_sale', label: t('filters.forSale') },
        { value: 'for_rent', label: t('filters.forRent') },
      ],
    },
  ]

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
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <div className='rounded-xl border border-gray-100 bg-white p-6'>
              <div className='text-2xl font-bold text-gray-900'>
                {posts.length}
              </div>
              <div className='mt-1 text-sm text-gray-400'>
                {t('stats.total')}
              </div>
              <div className='mt-2 text-xs text-gray-500'>
                {t('stats.allSubmitted')}
              </div>
            </div>

            <div className='rounded-xl border border-gray-100 bg-white p-6'>
              <div className='text-2xl font-bold text-yellow-600'>
                {stats.pendingVerification}
              </div>
              <div className='mt-1 text-sm text-gray-400'>
                {t('stats.pending')}
              </div>
              <div className='mt-2 text-xs text-gray-500'>
                {t('stats.awaitingVerification')}
              </div>
            </div>

            <div className='rounded-xl border border-gray-100 bg-white p-6'>
              <div className='text-2xl font-bold text-green-600'>
                {stats.verified}
              </div>
              <div className='mt-1 text-sm text-gray-400'>
                {t('stats.approved')}
              </div>
              <div className='mt-2 text-xs text-gray-500'>
                {t('stats.published')}
              </div>
            </div>

            <div className='rounded-xl border border-gray-100 bg-white p-6'>
              <div className='text-2xl font-bold text-red-600'>
                {stats.expired}
              </div>
              <div className='mt-1 text-sm text-gray-400'>
                {t('stats.rejected')}
              </div>
              <div className='mt-2 text-xs text-gray-500'>
                {t('stats.notApproved')}
              </div>
            </div>
          </div>

          {/* DataTable Component */}
          <DataTable
            data={posts}
            columns={columns}
            filters={filters}
            filterMode='api'
            filterValues={controlledFilterValues}
            onFilterChange={handleFilterChange}
            loading={tableLoading}
            pagination
            itemsPerPage={10}
            itemsPerPageOptions={[5, 10, 20, 50]}
            sortable
            defaultSort={{ key: 'postedDate', direction: 'desc' }}
            actions={(row) => (
              <Button
                variant='outline'
                size='sm'
                onClick={() => handleReview(row)}
                className='rounded-lg border-gray-300 px-3 py-1 text-sm hover:border-blue-500 hover:text-blue-600'
              >
                Review
              </Button>
            )}
            emptyMessage={t('table.noPostsFound')}
            getRowKey={(row) => row.id}
          />
        </div>
      )}

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto w-[calc(100%-2rem)] mx-auto'>
          <DialogHeader>
            <DialogTitle className='text-xl md:text-2xl font-semibold'>
              Review Post
            </DialogTitle>
          </DialogHeader>

          {selectedPost && (
            <div className='space-y-4 md:space-y-6'>
              {/* Images */}
              <div className='flex gap-2 overflow-x-auto'>
                {selectedPost.images.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    alt={`${selectedPost.title} ${idx + 1}`}
                    width={192}
                    height={128}
                    className='h-24 w-32 md:h-32 md:w-48 flex-shrink-0 rounded-lg object-cover'
                  />
                ))}
              </div>

              {/* Post Info */}
              <div className='space-y-3 md:space-y-4'>
                <div>
                  <h3 className='text-lg md:text-xl font-semibold text-gray-900'>
                    {selectedPost.title}
                  </h3>
                  <p className='text-xs md:text-sm text-gray-500'>
                    {selectedPost.postCode}
                  </p>
                </div>

                {/* Description */}
                {selectedPost.description && (
                  <div>
                    <div className='text-xs md:text-sm font-medium text-gray-700'>
                      Description
                    </div>
                    <div className='mt-1 text-sm text-gray-600 whitespace-pre-wrap'>
                      {selectedPost.description}
                    </div>
                  </div>
                )}

                <div className='grid grid-cols-2 gap-3 md:gap-4'>
                  <div>
                    <div className='text-xs md:text-sm font-medium text-gray-700'>
                      Property Type
                    </div>
                    <div className='text-sm md:text-base text-gray-900'>
                      {getPropertyTypeLabel(selectedPost.propertyInfo.type)}
                    </div>
                  </div>
                  <div>
                    <div className='text-xs md:text-sm font-medium text-gray-700'>
                      Area
                    </div>
                    <div className='text-sm md:text-base text-gray-900'>
                      {selectedPost.propertyInfo.area}m²
                    </div>
                  </div>
                  {selectedPost.bedrooms !== null &&
                    selectedPost.bedrooms !== undefined && (
                      <div>
                        <div className='text-xs md:text-sm font-medium text-gray-700'>
                          Bedrooms
                        </div>
                        <div className='text-sm md:text-base text-gray-900'>
                          {selectedPost.bedrooms}
                        </div>
                      </div>
                    )}
                  {selectedPost.bathrooms !== null &&
                    selectedPost.bathrooms !== undefined && (
                      <div>
                        <div className='text-xs md:text-sm font-medium text-gray-700'>
                          Bathrooms
                        </div>
                        <div className='text-sm md:text-base text-gray-900'>
                          {selectedPost.bathrooms}
                        </div>
                      </div>
                    )}
                  {selectedPost.direction && (
                    <div>
                      <div className='text-xs md:text-sm font-medium text-gray-700'>
                        Direction
                      </div>
                      <div className='text-sm md:text-base text-gray-900'>
                        {selectedPost.direction}
                      </div>
                    </div>
                  )}
                  {selectedPost.furnishing && (
                    <div>
                      <div className='text-xs md:text-sm font-medium text-gray-700'>
                        Furnishing
                      </div>
                      <div className='text-sm md:text-base text-gray-900'>
                        {selectedPost.furnishing}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className='text-xs md:text-sm font-medium text-gray-700'>
                      Location
                    </div>
                    <div className='text-sm md:text-base text-gray-900'>
                      {selectedPost.propertyInfo.district}
                    </div>
                  </div>
                  <div>
                    <div className='text-xs md:text-sm font-medium text-gray-700'>
                      Price
                    </div>
                    <div className='text-sm md:text-base text-gray-900'>
                      {selectedPost.price}
                    </div>
                  </div>
                </div>

                {/* Full Address */}
                <div>
                  <div className='text-xs md:text-sm font-medium text-gray-700'>
                    Full Address
                  </div>
                  <div className='mt-1 text-sm text-gray-600'>
                    {selectedPost.propertyInfo.fullAddress}
                  </div>
                </div>

                {/* Amenities */}
                {selectedPost.amenities &&
                  selectedPost.amenities.length > 0 && (
                    <div>
                      <div className='text-xs md:text-sm font-medium text-gray-700 mb-2'>
                        Amenities
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {selectedPost.amenities.map((amenity) => (
                          <Badge
                            key={amenity.amenityId}
                            variant='outline'
                            className='bg-blue-50 text-blue-700 border-blue-200'
                          >
                            {amenity.icon && (
                              <span className='mr-1'>{amenity.icon}</span>
                            )}
                            {amenity.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                <div>
                  <div className='text-xs md:text-sm font-medium text-gray-700'>
                    Posted by
                  </div>
                  <div className='mt-2 flex items-center gap-2'>
                    <Avatar className='h-8 w-8 md:h-10 md:w-10'>
                      <Image
                        src={
                          selectedPost.poster.avatar ||
                          '/images/default-image.jpg'
                        }
                        alt={selectedPost.poster.name}
                        width={40}
                        height={40}
                        className='h-full w-full object-cover'
                      />
                    </Avatar>
                    <div>
                      <div className='text-sm md:text-base font-medium text-gray-900'>
                        {selectedPost.poster.name}
                      </div>
                      <div className='text-xs md:text-sm text-gray-500'>
                        {selectedPost.poster.phone}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Status */}
                <div>
                  <div className='text-xs md:text-sm font-medium text-gray-700'>
                    Current Status
                  </div>
                  <Badge
                    variant='outline'
                    className={cn('mt-1', getStatusColor(selectedPost.status))}
                  >
                    {getStatusLabel(selectedPost.status)}
                  </Badge>
                </div>

                {/* Rejection Reason / Verification Notes */}
                {selectedPost.status === 'pending' && (
                  <>
                    <div>
                      <label
                        htmlFor='verification-notes'
                        className='text-xs md:text-sm font-medium text-gray-700'
                      >
                        Verification Notes (optional)
                      </label>
                      <textarea
                        id='verification-notes'
                        value={verificationNotes}
                        onChange={(e) => setVerificationNotes(e.target.value)}
                        placeholder='Enter notes for approval...'
                        className='mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs md:text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
                        rows={2}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='rejection-reason'
                        className='text-xs md:text-sm font-medium text-gray-700'
                      >
                        Rejection Reason (required for rejection)
                      </label>
                      <textarea
                        id='rejection-reason'
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder='Enter reason for rejection...'
                        className='mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs md:text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {/* Display existing notes if already reviewed */}
                {selectedPost.status !== 'pending' && (
                  <>
                    {selectedPost.verificationNotes && (
                      <div>
                        <div className='text-xs md:text-sm font-medium text-gray-700'>
                          Verification Notes
                        </div>
                        <div className='mt-1 text-sm text-gray-600'>
                          {selectedPost.verificationNotes}
                        </div>
                      </div>
                    )}
                    {selectedPost.rejectionReason && (
                      <div>
                        <div className='text-xs md:text-sm font-medium text-gray-700'>
                          Rejection Reason
                        </div>
                        <div className='mt-1 text-sm text-red-600'>
                          {selectedPost.rejectionReason}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons */}
              {selectedPost.status === 'pending' && (
                <div className='flex flex-col sm:flex-row gap-2 md:gap-3'>
                  <Button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className='flex-1 bg-green-600 hover:bg-green-700 text-sm'
                  >
                    {actionLoading ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <CheckCircle className='mr-2 h-4 w-4' />
                    )}
                    Approve Post
                  </Button>
                  <Button
                    onClick={handleReject}
                    disabled={actionLoading}
                    variant='outline'
                    className='flex-1 border-red-300 text-red-600 hover:bg-red-50 text-sm'
                  >
                    {actionLoading ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <XCircle className='mr-2 h-4 w-4' />
                    )}
                    Reject Post
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

PostVerification.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout activeItem='posts'>{page}</AdminLayout>
}

export default PostVerification
