import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import AdminLayout from '@/components/layouts/AdminLayout'
import Breadcrumb from '@/components/molecules/breadcrumb'
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
  const t = useTranslations('posts')
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const breadcrumbItems = [
    { label: 'Admin Dashboard', href: '/admin' },
    { label: t('breadcrumb.title') }, // Current page
  ]

  // Calculate stats
  const stats = {
    total: mockPosts.length,
    pending: mockPosts.filter((p) => p.status === 'pending').length,
    approved: mockPosts.filter((p) => p.status === 'approved').length,
    rejected: mockPosts.filter((p) => p.status === 'rejected').length,
  }

  // Define columns for DataTable
  const columns: Column<PostData>[] = [
    {
      id: 'post',
      header: t('table.postDetails'),
      accessor: (row) => row.title,
      sortable: true,
      render: (_, row) => (
        <div className='flex gap-3'>
          <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg'>
            <img
              src={row.images[0]}
              alt={row.title}
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
            <img
              src={row.poster.avatar || '/images/default-image.jpg'}
              alt={row.poster.name}
              className='h-full w-full object-cover'
            />
          </Avatar>
          <div>
            <div className='text-sm font-medium text-gray-900'>
              {row.poster.name}
            </div>
            <div className='text-xs text-gray-500'>
              {row.poster.totalPosts} posts
            </div>
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
        <div className='text-sm font-semibold text-gray-900'>{value}</div>
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
          className={cn('text-xs font-medium', getStatusColor(value))}
        >
          {getStatusLabel(value)}
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
        { value: 'house', label: t('filters.house') },
        { value: 'apartment', label: t('filters.apartment') },
        { value: 'office', label: t('filters.office') },
        { value: 'land', label: t('filters.land') },
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
          <h1 className='text-3xl font-semibold text-gray-900'>{t('title')}</h1>
          <p className='mt-1 text-sm text-gray-500'>{t('description')}</p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <div className='rounded-xl border border-gray-100 bg-white p-6'>
            <div className='text-2xl font-bold text-gray-900'>
              {stats.total}
            </div>
            <div className='mt-1 text-sm text-gray-400'>{t('stats.total')}</div>
            <div className='mt-2 text-xs text-gray-500'>
              {t('stats.allSubmitted')}
            </div>
          </div>

          <div className='rounded-xl border border-gray-100 bg-white p-6'>
            <div className='text-2xl font-bold text-yellow-600'>
              {stats.pending}
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
              {stats.approved}
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
              {stats.rejected}
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
          data={mockPosts}
          columns={columns}
          filters={filters}
          filterMode='frontend'
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
                  <img
                    key={idx}
                    src={img}
                    alt={`${selectedPost.title} ${idx + 1}`}
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

                <div>
                  <div className='text-xs md:text-sm font-medium text-gray-700'>
                    Posted by
                  </div>
                  <div className='mt-2 flex items-center gap-2'>
                    <Avatar className='h-8 w-8 md:h-10 md:w-10'>
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
                      <div className='text-sm md:text-base font-medium text-gray-900'>
                        {selectedPost.poster.name}
                      </div>
                      <div className='text-xs md:text-sm text-gray-500'>
                        {selectedPost.poster.totalPosts} posts
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

                {/* Rejection Reason (if rejecting) */}
                {selectedPost.status === 'pending' && (
                  <div>
                    <label
                      htmlFor='rejection-reason'
                      className='text-xs md:text-sm font-medium text-gray-700'
                    >
                      Rejection Reason (optional)
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
                )}
              </div>

              {/* Action Buttons */}
              {selectedPost.status === 'pending' && (
                <div className='flex flex-col sm:flex-row gap-2 md:gap-3'>
                  <Button
                    onClick={handleApprove}
                    className='flex-1 bg-green-600 hover:bg-green-700 text-sm'
                  >
                    <CheckCircle className='mr-2 h-4 w-4' />
                    Approve Post
                  </Button>
                  <Button
                    onClick={handleReject}
                    variant='outline'
                    className='flex-1 border-red-300 text-red-600 hover:bg-red-50 text-sm'
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
