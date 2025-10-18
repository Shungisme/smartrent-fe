import React, { useState, useMemo } from 'react'
import AdminLayout from '@/components/layouts/AdminLayout'
import Breadcrumb from '@/components/molecules/breadcrumb'
import { Input } from '@/components/atoms/input'
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
  Search,
  Calendar,
  Home,
  Building2,
  Briefcase,
  MapPin,
  ChevronDown,
  CheckCircle,
  XCircle,
} from 'lucide-react'

// Types
type PostStatus = 'pending' | 'approved' | 'rejected'
type PropertyType = 'house' | 'apartment' | 'office' | 'land'
type ListingType = 'for_sale' | 'for_rent'

type PostData = {
  id: string
  title: string
  postCode: string
  images: string[]
  listingType: ListingType
  vipLevel?: number
  poster: {
    name: string
    avatar?: string
    totalPosts: number
  }
  propertyInfo: {
    type: PropertyType
    area: number
    district: string
  }
  price: string
  postedDate: string
  postedTime: string
  status: PostStatus
}

// Mock data
const mockPosts: PostData[] = [
  {
    id: 'p001',
    title: 'Luxury Villa for Sale - District 2',
    postCode: 'POST-2024-001',
    images: [
      '/images/default-image.jpg',
      '/images/example.png',
      '/images/rental-auth-bg.jpg',
    ],
    listingType: 'for_sale',
    vipLevel: 3,
    poster: {
      name: 'Pham Minh Hieu',
      avatar: '/images/default-image.jpg',
      totalPosts: 15,
    },
    propertyInfo: {
      type: 'house',
      area: 250,
      district: 'District 2',
    },
    price: '8,500,000,000đ',
    postedDate: '15/01/2024',
    postedTime: '09:30',
    status: 'pending',
  },
  {
    id: 'p002',
    title: 'Office Space for Rent - CBD Area',
    postCode: 'POST-2024-002',
    images: ['/images/default-image.jpg', '/images/example.png'],
    listingType: 'for_rent',
    poster: {
      name: 'Do Thi Lan',
      avatar: '/images/default-image.jpg',
      totalPosts: 8,
    },
    propertyInfo: {
      type: 'office',
      area: 120,
      district: 'District 1',
    },
    price: '25,000,000đ/month',
    postedDate: '16/01/2024',
    postedTime: '14:15',
    status: 'pending',
  },
  {
    id: 'p003',
    title: 'Spacious 2BR Apartment for Sale - District 7',
    postCode: 'POST-2024-003',
    images: ['/images/default-image.jpg'],
    listingType: 'for_sale',
    poster: {
      name: 'Tran Thi Mai',
      avatar: '/images/default-image.jpg',
      totalPosts: 22,
    },
    propertyInfo: {
      type: 'apartment',
      area: 85,
      district: 'District 7',
    },
    price: '3,200,000,000đ',
    postedDate: '14/01/2024',
    postedTime: '11:00',
    status: 'approved',
  },
  {
    id: 'p004',
    title: 'Modern Studio Apartment - District 1',
    postCode: 'POST-2024-004',
    images: ['/images/default-image.jpg', '/images/example.png'],
    listingType: 'for_sale',
    vipLevel: 2,
    poster: {
      name: 'Nguyen Van Khanh',
      avatar: '/images/default-image.jpg',
      totalPosts: 12,
    },
    propertyInfo: {
      type: 'apartment',
      area: 45,
      district: 'District 1',
    },
    price: '2,500,000,000đ',
    postedDate: '17/01/2024',
    postedTime: '16:45',
    status: 'pending',
  },
  {
    id: 'p005',
    title: 'Commercial Land Plot - Thu Duc',
    postCode: 'POST-2024-005',
    images: ['/images/default-image.jpg'],
    listingType: 'for_sale',
    poster: {
      name: 'Le Hoang Nam',
      avatar: '/images/default-image.jpg',
      totalPosts: 5,
    },
    propertyInfo: {
      type: 'land',
      area: 500,
      district: 'Thu Duc City',
    },
    price: '15,000,000,000đ',
    postedDate: '13/01/2024',
    postedTime: '08:20',
    status: 'rejected',
  },
]

// Helper functions
const getPropertyIcon = (type: PropertyType) => {
  const icons = {
    house: <Home className='h-4 w-4' />,
    apartment: <Building2 className='h-4 w-4' />,
    office: <Briefcase className='h-4 w-4' />,
    land: <MapPin className='h-4 w-4' />,
  }
  return icons[type]
}

const getPropertyTypeLabel = (type: PropertyType): string => {
  const labels = {
    house: 'Nhà',
    apartment: 'Căn hộ',
    office: 'Văn phòng',
    land: 'Đất',
  }
  return labels[type]
}

const getStatusColor = (status: PostStatus): string => {
  const colors = {
    pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    approved: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  }
  return colors[status]
}

const getStatusLabel = (status: PostStatus): string => {
  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  }
  return labels[status]
}

const PostVerification: NextPageWithLayout = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'all'>('all')
  const [listingTypeFilter, setListingTypeFilter] = useState<
    ListingType | 'all'
  >('all')
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const breadcrumbItems = [
    { label: 'Thực Đơn Điều Hướng' },
    { label: 'Kiểm Duyệt Bài Đăng' },
    { label: 'Tổng Quan' },
  ]

  // Calculate stats
  const stats = useMemo(() => {
    const total = mockPosts.length
    const pending = mockPosts.filter((p) => p.status === 'pending').length
    const approved = mockPosts.filter((p) => p.status === 'approved').length
    const rejected = mockPosts.filter((p) => p.status === 'rejected').length

    return { total, pending, approved, rejected }
  }, [])

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    return mockPosts.filter((post) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchLower) ||
        post.poster.name.toLowerCase().includes(searchLower) ||
        post.propertyInfo.district.toLowerCase().includes(searchLower)

      // Status filter
      const matchesStatus =
        statusFilter === 'all' || post.status === statusFilter

      // Type filter
      const matchesType =
        typeFilter === 'all' || post.propertyInfo.type === typeFilter

      // Listing type filter
      const matchesListingType =
        listingTypeFilter === 'all' || post.listingType === listingTypeFilter

      return matchesSearch && matchesStatus && matchesType && matchesListingType
    })
  }, [searchQuery, statusFilter, typeFilter, listingTypeFilter])

  const handleReview = (post: PostData) => {
    setSelectedPost(post)
    setReviewModalOpen(true)
    setRejectionReason('')
  }

  const handleApprove = () => {
    console.log('Approving post:', selectedPost?.id)
    // TODO: API call to approve post
    setReviewModalOpen(false)
    setSelectedPost(null)
  }

  const handleReject = () => {
    console.log('Rejecting post:', selectedPost?.id, 'Reason:', rejectionReason)
    // TODO: API call to reject post with reason
    setReviewModalOpen(false)
    setSelectedPost(null)
    setRejectionReason('')
  }

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />

      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-semibold text-gray-900'>
            Post Verification
          </h1>
          <p className='mt-1 text-sm text-gray-500'>
            Review and process property listings submitted by users for
            publication.
          </p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <div className='rounded-xl border border-gray-100 bg-white p-6'>
            <div className='text-2xl font-bold text-gray-900'>
              {stats.total}
            </div>
            <div className='mt-1 text-sm text-gray-400'>Total Posts</div>
            <div className='mt-2 text-xs text-gray-500'>
              All submitted posts
            </div>
          </div>

          <div className='rounded-xl border border-gray-100 bg-white p-6'>
            <div className='text-2xl font-bold text-yellow-600'>
              {stats.pending}
            </div>
            <div className='mt-1 text-sm text-gray-400'>Pending Review</div>
            <div className='mt-2 text-xs text-gray-500'>
              Awaiting verification
            </div>
          </div>

          <div className='rounded-xl border border-gray-100 bg-white p-6'>
            <div className='text-2xl font-bold text-green-600'>
              {stats.approved}
            </div>
            <div className='mt-1 text-sm text-gray-400'>Approved</div>
            <div className='mt-2 text-xs text-gray-500'>Published posts</div>
          </div>

          <div className='rounded-xl border border-gray-100 bg-white p-6'>
            <div className='text-2xl font-bold text-red-600'>
              {stats.rejected}
            </div>
            <div className='mt-1 text-sm text-gray-400'>Rejected</div>
            <div className='mt-2 text-xs text-gray-500'>Not approved</div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className='space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
          {/* Search Bar */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
            <Input
              type='text'
              placeholder='Search by title, poster name, or address...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10'
            />
          </div>

          {/* Filters Row */}
          <div className='flex flex-wrap items-center gap-3'>
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as PostStatus | 'all')
              }
              className='rounded-lg border border-gray-100 bg-white px-4 py-2 text-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100'
            >
              <option value='all'>All Status</option>
              <option value='pending'>Pending</option>
              <option value='approved'>Approved</option>
              <option value='rejected'>Rejected</option>
            </select>

            {/* Property Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as PropertyType | 'all')
              }
              className='rounded-lg border border-gray-100 bg-white px-4 py-2 text-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100'
            >
              <option value='all'>All Types</option>
              <option value='house'>Nhà</option>
              <option value='apartment'>Căn hộ</option>
              <option value='office'>Văn phòng</option>
              <option value='land'>Đất</option>
            </select>

            {/* Listing Type Filter */}
            <select
              value={listingTypeFilter}
              onChange={(e) =>
                setListingTypeFilter(e.target.value as ListingType | 'all')
              }
              className='rounded-lg border border-gray-100 bg-white px-4 py-2 text-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100'
            >
              <option value='all'>All Categories</option>
              <option value='for_sale'>For Sale</option>
              <option value='for_rent'>For Rent</option>
            </select>

            {/* Date Range Picker (placeholder) */}
            <button className='flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-4 py-2 text-sm hover:border-gray-300'>
              <Calendar className='h-4 w-4 text-gray-500' />
              <span className='text-gray-700'>Pick a date range</span>
              <ChevronDown className='h-4 w-4 text-gray-400' />
            </button>
          </div>
        </div>

        {/* Posts Table */}
        <div className='rounded-2xl border border-gray-200 bg-white shadow-sm'>
          {/* Table Header */}
          <div className='grid grid-cols-12 gap-4 border-b border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700'>
            <div className='col-span-3'>Post Details</div>
            <div className='col-span-2'>Poster</div>
            <div className='col-span-2'>Property Info</div>
            <div className='col-span-1'>Price</div>
            <div className='col-span-2'>Posted Date</div>
            <div className='col-span-1'>Status</div>
            <div className='col-span-1 text-right'>Actions</div>
          </div>

          {/* Table Body */}
          <div className='divide-y divide-gray-100'>
            {filteredPosts.length === 0 ? (
              <div className='px-4 py-12 text-center text-gray-500'>
                No posts found matching your criteria
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className='grid grid-cols-12 gap-4 px-4 py-4 hover:bg-gray-50'
                >
                  {/* Post Details */}
                  <div className='col-span-3 flex gap-3'>
                    {/* Thumbnail */}
                    <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg'>
                      <img
                        src={post.images[0]}
                        alt={post.title}
                        className='h-full w-full object-cover'
                      />
                      {post.images.length > 1 && (
                        <div className='absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white'>
                          +{post.images.length - 1}
                        </div>
                      )}
                    </div>

                    {/* Title & Badges */}
                    <div className='flex-1 min-w-0'>
                      <div className='font-medium text-gray-900 truncate'>
                        {post.title}
                      </div>
                      <div className='mt-0.5 text-xs text-gray-400'>
                        {post.postCode}
                      </div>
                      <div className='mt-1 flex flex-wrap gap-1'>
                        {post.vipLevel && (
                          <Badge className='bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-0'>
                            VIP{post.vipLevel}
                          </Badge>
                        )}
                        <Badge
                          className={cn(
                            'text-xs px-2 py-0',
                            post.listingType === 'for_sale'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800',
                          )}
                        >
                          {post.listingType === 'for_sale'
                            ? 'For Sale'
                            : 'For Rent'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Poster */}
                  <div className='col-span-2 flex items-center gap-2'>
                    <Avatar className='h-10 w-10'>
                      <img
                        src={post.poster.avatar || '/images/default-image.jpg'}
                        alt={post.poster.name}
                        className='h-full w-full object-cover'
                      />
                    </Avatar>
                    <div>
                      <div className='text-sm font-medium text-gray-900'>
                        {post.poster.name}
                      </div>
                      <div className='text-xs text-gray-500'>
                        {post.poster.totalPosts} posts
                      </div>
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className='col-span-2 flex items-center gap-2 text-sm text-gray-700'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100'>
                      {getPropertyIcon(post.propertyInfo.type)}
                    </div>
                    <div>
                      <div className='font-medium'>
                        {getPropertyTypeLabel(post.propertyInfo.type)}
                      </div>
                      <div className='text-xs text-gray-500'>
                        {post.propertyInfo.area}m² •{' '}
                        {post.propertyInfo.district}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className='col-span-1 flex items-center text-sm font-semibold text-gray-900'>
                    {post.price}
                  </div>

                  {/* Posted Date */}
                  <div className='col-span-2 flex items-center text-sm text-gray-500'>
                    <div>
                      <div>{post.postedDate}</div>
                      <div className='text-xs text-gray-400'>
                        {post.postedTime}
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className='col-span-1 flex items-center'>
                    <Badge
                      variant='outline'
                      className={cn(
                        'text-xs font-medium',
                        getStatusColor(post.status),
                      )}
                    >
                      {getStatusLabel(post.status)}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className='col-span-1 flex items-center justify-end'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleReview(post)}
                      className='rounded-lg border-gray-300 px-3 py-1 text-sm hover:border-blue-500 hover:text-blue-600'
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-semibold'>
              Review Post
            </DialogTitle>
          </DialogHeader>

          {selectedPost && (
            <div className='space-y-6'>
              {/* Images */}
              <div className='flex gap-2 overflow-x-auto'>
                {selectedPost.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${selectedPost.title} ${idx + 1}`}
                    className='h-32 w-48 flex-shrink-0 rounded-lg object-cover'
                  />
                ))}
              </div>

              {/* Post Info */}
              <div className='space-y-4'>
                <div>
                  <h3 className='text-xl font-semibold text-gray-900'>
                    {selectedPost.title}
                  </h3>
                  <p className='text-sm text-gray-500'>
                    {selectedPost.postCode}
                  </p>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <div className='text-sm font-medium text-gray-700'>
                      Property Type
                    </div>
                    <div className='text-gray-900'>
                      {getPropertyTypeLabel(selectedPost.propertyInfo.type)}
                    </div>
                  </div>
                  <div>
                    <div className='text-sm font-medium text-gray-700'>
                      Area
                    </div>
                    <div className='text-gray-900'>
                      {selectedPost.propertyInfo.area}m²
                    </div>
                  </div>
                  <div>
                    <div className='text-sm font-medium text-gray-700'>
                      Location
                    </div>
                    <div className='text-gray-900'>
                      {selectedPost.propertyInfo.district}
                    </div>
                  </div>
                  <div>
                    <div className='text-sm font-medium text-gray-700'>
                      Price
                    </div>
                    <div className='text-gray-900'>{selectedPost.price}</div>
                  </div>
                </div>

                <div>
                  <div className='text-sm font-medium text-gray-700'>
                    Posted by
                  </div>
                  <div className='mt-2 flex items-center gap-2'>
                    <Avatar className='h-10 w-10'>
                      <img
                        src={
                          selectedPost.poster.avatar ||
                          '/images/default-image.jpg'
                        }
                        alt={selectedPost.poster.name}
                        className='h-full w-full object-cover'
                      />
                    </Avatar>
                    <div>
                      <div className='font-medium text-gray-900'>
                        {selectedPost.poster.name}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {selectedPost.poster.totalPosts} posts
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Status */}
                <div>
                  <div className='text-sm font-medium text-gray-700'>
                    Current Status
                  </div>
                  <Badge
                    variant='outline'
                    className={cn('mt-1', getStatusColor(selectedPost.status))}
                  >
                    {getStatusLabel(selectedPost.status)}
                  </Badge>
                </div>

                {/* Rejection Reason (if rejecting) */}
                {selectedPost.status === 'pending' && (
                  <div>
                    <label
                      htmlFor='rejection-reason'
                      className='text-sm font-medium text-gray-700'
                    >
                      Rejection Reason (optional)
                    </label>
                    <textarea
                      id='rejection-reason'
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder='Enter reason for rejection...'
                      className='mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {selectedPost.status === 'pending' && (
                <div className='flex gap-3'>
                  <Button
                    onClick={handleApprove}
                    className='flex-1 bg-green-600 hover:bg-green-700'
                  >
                    <CheckCircle className='mr-2 h-4 w-4' />
                    Approve Post
                  </Button>
                  <Button
                    onClick={handleReject}
                    variant='outline'
                    className='flex-1 border-red-300 text-red-600 hover:bg-red-50'
                  >
                    <XCircle className='mr-2 h-4 w-4' />
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
