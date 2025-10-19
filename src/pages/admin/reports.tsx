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
import { AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react'

// Types
type ReportStatus = 'pending' | 'resolved' | 'dismissed'
type ReportCategory =
  | 'fake_fraudulent'
  | 'spam_promotional'
  | 'inappropriate_content'
  | 'wrong_information'
  | 'other'

type ReportData = {
  id: string
  post: {
    id: string
    title: string
    thumbnail: string
    propertyType: string
    area: number
    price: string
    status: 'active' | 'inactive'
  }
  reporter: {
    id: string
    name: string
    avatar?: string
  }
  category: ReportCategory
  content: string
  reportTime: string
  reportDate: string
  status: ReportStatus
}

// Mock data
const mockReports: ReportData[] = [
  {
    id: 'r001',
    post: {
      id: 'post001',
      title: 'Modern Studio Apartment in District 1',
      thumbnail: '/images/default-image.jpg',
      propertyType: 'Studio',
      area: 35,
      price: '12,000,000đ',
      status: 'active',
    },
    reporter: {
      id: 'user002',
      name: 'Tran Thi Mai',
      avatar: '/images/default-image.jpg',
    },
    category: 'fake_fraudulent',
    content:
      "This listing appears to be fake. The images don't match the actual property and the price seems unrealistic for the location.",
    reportTime: '21:30',
    reportDate: 'Jan 20, 2025',
    status: 'pending',
  },
  {
    id: 'r002',
    post: {
      id: 'post002',
      title: 'Cheap Room for Students - Very Good Price!!!',
      thumbnail: '/images/default-image.jpg',
      propertyType: 'Room',
      area: 15,
      price: '2,000,000đ',
      status: 'active',
    },
    reporter: {
      id: 'user004',
      name: 'Pham Minh Hieu',
    },
    category: 'spam_promotional',
    content:
      'This post contains excessive promotional language and appears to be spam. Multiple exclamation marks and unrealistic claims.',
    reportTime: '23:45',
    reportDate: 'Jan 19, 2025',
    status: 'dismissed',
  },
  {
    id: 'r003',
    post: {
      id: 'post003',
      title: 'Luxury Villa with Pool',
      thumbnail: '/images/default-image.jpg',
      propertyType: 'Villa',
      area: 300,
      price: '25,000,000,000đ',
      status: 'inactive',
    },
    reporter: {
      id: 'user005',
      name: 'Nguyen Van An',
      avatar: '/images/default-image.jpg',
    },
    category: 'wrong_information',
    content:
      'The property information is incorrect. The listed area does not match the actual size, and amenities mentioned are not present.',
    reportTime: '14:20',
    reportDate: 'Jan 18, 2025',
    status: 'resolved',
  },
  {
    id: 'r004',
    post: {
      id: 'post004',
      title: 'Office Space Downtown',
      thumbnail: '/images/default-image.jpg',
      propertyType: 'Office',
      area: 80,
      price: '30,000,000đ/month',
      status: 'inactive',
    },
    reporter: {
      id: 'user006',
      name: 'Le Thi Hoa',
    },
    category: 'inappropriate_content',
    content:
      'The post contains inappropriate images and descriptions that violate community guidelines.',
    reportTime: '09:15',
    reportDate: 'Jan 17, 2025',
    status: 'resolved',
  },
  {
    id: 'r005',
    post: {
      id: 'post005',
      title: 'Beachfront Property Investment',
      thumbnail: '/images/default-image.jpg',
      propertyType: 'Land',
      area: 500,
      price: '50,000,000,000đ',
      status: 'active',
    },
    reporter: {
      id: 'user007',
      name: 'Do Van Cuong',
      avatar: '/images/default-image.jpg',
    },
    category: 'fake_fraudulent',
    content:
      'Suspected fraudulent investment scheme. The property may not exist or ownership claims are questionable.',
    reportTime: '16:50',
    reportDate: 'Jan 21, 2025',
    status: 'pending',
  },
]

const getCategoryColor = (category: ReportCategory): string => {
  const colors: Record<ReportCategory, string> = {
    fake_fraudulent: 'bg-purple-100 text-purple-700 border-purple-200',
    spam_promotional: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    inappropriate_content: 'bg-red-100 text-red-700 border-red-200',
    wrong_information: 'bg-orange-100 text-orange-700 border-orange-200',
    other: 'bg-gray-100 text-gray-700 border-gray-200',
  }
  return colors[category]
}

const getStatusColor = (status: ReportStatus): string => {
  const colors: Record<ReportStatus, string> = {
    pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    resolved: 'bg-green-50 text-green-700 border-green-200',
    dismissed: 'bg-gray-100 text-gray-500 border-gray-200',
  }
  return colors[status]
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const truncateText = (text: string, maxLength: number = 60): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

const ViolationReportManagement: NextPageWithLayout = () => {
  const t = useTranslations('reports')
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [actionReason, setActionReason] = useState('')

  const breadcrumbItems = [
    { label: 'Admin Dashboard', href: '/admin' },
    { label: t('breadcrumb.title') }, // Current page
  ]

  // Calculate stats
  const stats = {
    total: mockReports.length,
    pending: mockReports.filter((r) => r.status === 'pending').length,
    resolved: mockReports.filter((r) => r.status === 'resolved').length,
    dismissed: mockReports.filter((r) => r.status === 'dismissed').length,
  }

  // Define columns for DataTable
  const columns: Column<ReportData>[] = [
    {
      id: 'post',
      header: t('table.postDetails'),
      accessor: (row) => row.post.title,
      sortable: true,
      render: (_, row) => (
        <div className='flex gap-3'>
          <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg'>
            <img
              src={row.post.thumbnail}
              alt={row.post.title}
              className='h-full w-full object-cover'
            />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='font-medium text-gray-900 truncate'>
              {row.post.title}
            </div>
            <div className='mt-0.5 text-xs text-gray-400'>{row.post.id}</div>
            <div className='mt-1 flex flex-wrap gap-1'>
              <span className='text-xs text-gray-600'>
                {row.post.propertyType}
              </span>
              <span className='text-xs text-gray-400'>•</span>
              <span className='text-xs text-gray-600'>{row.post.area}m²</span>
              <span className='text-xs text-gray-400'>•</span>
              <Badge
                className={cn(
                  'text-xs px-1.5 py-0',
                  row.post.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500',
                )}
              >
                {row.post.status === 'active'
                  ? t('review.active')
                  : t('review.inactive')}
              </Badge>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'reporter',
      header: t('table.reporter'),
      accessor: (row) => row.reporter.name,
      sortable: true,
      render: (_, row) => (
        <div className='flex items-center gap-2'>
          <Avatar className='h-10 w-10'>
            {row.reporter.avatar ? (
              <img
                src={row.reporter.avatar}
                alt={row.reporter.name}
                className='h-full w-full object-cover'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-blue-100 text-blue-700 font-semibold text-sm'>
                {getInitials(row.reporter.name)}
              </div>
            )}
          </Avatar>
          <div className='min-w-0'>
            <div className='text-sm font-medium text-gray-900 truncate'>
              {row.reporter.name}
            </div>
            <div className='text-xs text-gray-400'>{row.reporter.id}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'category',
      header: t('table.category'),
      accessor: 'category',
      render: (value) => (
        <Badge
          variant='outline'
          className={cn('text-xs font-medium', getCategoryColor(value))}
        >
          {t(`categories.${value}`)}
        </Badge>
      ),
    },
    {
      id: 'content',
      header: t('table.content'),
      accessor: 'content',
      render: (value) => (
        <div className='text-sm text-gray-600 line-clamp-2'>
          {truncateText(value, 80)}
        </div>
      ),
      hideOnMobile: true,
    },
    {
      id: 'reportTime',
      header: t('table.reportTime'),
      accessor: 'reportDate',
      sortable: true,
      render: (_, row) => (
        <div className='text-sm text-gray-500'>
          <div>{row.reportDate}</div>
          <div className='text-xs text-gray-400'>{row.reportTime}</div>
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
          {t(`statuses.${value}`)}
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
        { value: 'resolved', label: t('filters.resolved') },
        { value: 'dismissed', label: t('filters.dismissed') },
      ],
    },
    {
      id: 'category',
      type: 'select',
      label: t('filters.allCategories'),
      options: [
        { value: 'fake_fraudulent', label: t('filters.fakeFraudulent') },
        { value: 'spam_promotional', label: t('filters.spamPromotional') },
        {
          value: 'inappropriate_content',
          label: t('filters.inappropriateContent'),
        },
        { value: 'wrong_information', label: t('filters.wrongInformation') },
        { value: 'other', label: t('filters.other') },
      ],
    },
  ]

  const handleReview = (report: ReportData) => {
    setSelectedReport(report)
    setReviewModalOpen(true)
    setActionReason('')
  }

  const handleResolve = () => {
    console.log(
      'Resolving report:',
      selectedReport?.id,
      'Reason:',
      actionReason,
    )
    // TODO: API call to resolve report
    setReviewModalOpen(false)
    setSelectedReport(null)
    setActionReason('')
  }

  const handleDismiss = () => {
    console.log(
      'Dismissing report:',
      selectedReport?.id,
      'Reason:',
      actionReason,
    )
    // TODO: API call to dismiss report
    setReviewModalOpen(false)
    setSelectedReport(null)
    setActionReason('')
  }

  const handleViewPost = () => {
    console.log('Viewing post:', selectedReport?.post.id)
    // TODO: Navigate to post details or open in new tab
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
              {t('stats.allTime')}
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
              {t('stats.needAttention')}
            </div>
          </div>

          <div className='rounded-xl border border-gray-100 bg-white p-6'>
            <div className='text-2xl font-bold text-green-600'>
              {stats.resolved}
            </div>
            <div className='mt-1 text-sm text-gray-400'>
              {t('stats.resolved')}
            </div>
            <div className='mt-2 text-xs text-gray-500'>
              {t('stats.actionTaken')}
            </div>
          </div>

          <div className='rounded-xl border border-gray-100 bg-white p-6'>
            <div className='text-2xl font-bold text-gray-500'>
              {stats.dismissed}
            </div>
            <div className='mt-1 text-sm text-gray-400'>
              {t('stats.dismissed')}
            </div>
            <div className='mt-2 text-xs text-gray-500'>
              {t('stats.noAction')}
            </div>
          </div>
        </div>

        {/* DataTable Component */}
        <DataTable
          data={mockReports}
          columns={columns}
          filters={filters}
          filterMode='frontend'
          pagination
          itemsPerPage={10}
          itemsPerPageOptions={[5, 10, 20, 50]}
          sortable
          defaultSort={{ key: 'reportDate', direction: 'desc' }}
          actions={(row) => (
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleReview(row)}
              className='rounded-lg border-gray-300 px-3 py-1 text-sm hover:border-blue-500 hover:text-blue-600'
            >
              {t('table.viewDetails')}
            </Button>
          )}
          emptyMessage={t('table.noReportsFound')}
          getRowKey={(row) => row.id}
        />
      </div>

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto w-[calc(100%-2rem)] mx-auto'>
          <DialogHeader>
            <DialogTitle className='text-xl md:text-2xl font-semibold'>
              {t('review.title')}
            </DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className='space-y-4 md:space-y-6'>
              {/* Report Info */}
              <div className='rounded-lg bg-yellow-50 border border-yellow-200 p-3 md:p-4'>
                <div className='flex items-start gap-2 md:gap-3'>
                  <AlertTriangle className='h-4 w-4 md:h-5 md:w-5 text-yellow-600 mt-0.5' />
                  <div>
                    <h4 className='text-sm md:text-base font-medium text-yellow-900'>
                      {t('review.category')}:{' '}
                      {t(`categories.${selectedReport.category}`)}
                    </h4>
                    <p className='mt-1 text-xs md:text-sm text-yellow-800'>
                      {t('review.reportedBy')} {selectedReport.reportDate}{' '}
                      {t('review.on')} {selectedReport.reportTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reported Post */}
              <div>
                <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3'>
                  {t('review.reportedPost')}
                </h3>
                <div className='rounded-lg border border-gray-200 p-3 md:p-4'>
                  <div className='flex flex-col sm:flex-row gap-3 md:gap-4'>
                    <img
                      src={selectedReport.post.thumbnail}
                      alt={selectedReport.post.title}
                      className='h-32 w-full sm:h-24 sm:w-24 flex-shrink-0 rounded-lg object-cover'
                    />
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-semibold text-gray-900'>
                        {selectedReport.post.title}
                      </h4>
                      <p className='text-xs md:text-sm text-gray-500 mt-1'>
                        {t('review.postId')}: {selectedReport.post.id}
                      </p>
                      <div className='mt-2 flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600'>
                        <span>
                          {selectedReport.post.propertyType} •{' '}
                          {selectedReport.post.area}m²
                        </span>
                        <span>•</span>
                        <span className='font-semibold'>
                          {selectedReport.post.price}
                        </span>
                        <span>•</span>
                        <Badge
                          className={cn(
                            'text-xs',
                            selectedReport.post.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500',
                          )}
                        >
                          {selectedReport.post.status === 'active'
                            ? t('review.active')
                            : t('review.inactive')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reporter Info */}
              <div>
                <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3'>
                  {t('review.reporterInfo')}
                </h3>
                <div className='flex items-center gap-3 rounded-lg border border-gray-200 p-3 md:p-4'>
                  <Avatar className='h-10 w-10 md:h-12 md:w-12'>
                    {selectedReport.reporter.avatar ? (
                      <img
                        src={selectedReport.reporter.avatar}
                        alt={selectedReport.reporter.name}
                        className='h-full w-full object-cover'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center bg-blue-100 text-blue-700 font-semibold'>
                        {getInitials(selectedReport.reporter.name)}
                      </div>
                    )}
                  </Avatar>
                  <div>
                    <div className='font-medium text-gray-900'>
                      {selectedReport.reporter.name}
                    </div>
                    <div className='text-sm text-gray-500'>
                      User ID: {selectedReport.reporter.id}
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Content */}
              <div>
                <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3'>
                  {t('review.reportContent')}
                </h3>
                <div className='rounded-lg border border-gray-200 bg-gray-50 p-3 md:p-4'>
                  <p className='text-xs md:text-sm text-gray-700 leading-relaxed'>
                    {selectedReport.content}
                  </p>
                </div>
              </div>

              {/* Current Status */}
              <div>
                <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3'>
                  {t('review.currentStatus')}
                </h3>
                <Badge
                  variant='outline'
                  className={cn(
                    'text-sm',
                    getStatusColor(selectedReport.status),
                  )}
                >
                  {t(`statuses.${selectedReport.status}`)}
                </Badge>
              </div>

              {/* Action Reason (if taking action) */}
              {selectedReport.status === 'pending' && (
                <div>
                  <label
                    htmlFor='action-reason'
                    className='text-xs md:text-sm font-medium text-gray-700'
                  >
                    {t('review.actionReason')}
                  </label>
                  <textarea
                    id='action-reason'
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder={t('review.actionPlaceholder')}
                    className='mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs md:text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
                    rows={3}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-2 md:gap-3'>
                <Button
                  onClick={handleViewPost}
                  variant='outline'
                  className='flex-1 text-sm'
                >
                  <Eye className='mr-2 h-4 w-4' />
                  {t('review.viewPost')}
                </Button>

                {selectedReport.status === 'pending' && (
                  <>
                    <Button
                      onClick={handleResolve}
                      className='flex-1 bg-green-600 hover:bg-green-700 text-sm'
                    >
                      <CheckCircle className='mr-2 h-4 w-4' />
                      {t('review.resolve')}
                    </Button>
                    <Button
                      onClick={handleDismiss}
                      variant='outline'
                      className='flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm'
                    >
                      <XCircle className='mr-2 h-4 w-4' />
                      {t('review.dismiss')}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

ViolationReportManagement.getLayout = function getLayout(
  page: React.ReactNode,
) {
  return <AdminLayout activeItem='reports'>{page}</AdminLayout>
}

export default ViolationReportManagement
