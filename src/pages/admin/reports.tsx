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
import { Search, AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react'

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

// Helper functions
const getCategoryLabel = (category: ReportCategory): string => {
  const labels: Record<ReportCategory, string> = {
    fake_fraudulent: 'Fake/Fraudulent Listing',
    spam_promotional: 'Spam/Promotional',
    inappropriate_content: 'Inappropriate Content',
    wrong_information: 'Wrong Information',
    other: 'Other',
  }
  return labels[category]
}

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

const getStatusLabel = (status: ReportStatus): string => {
  const labels: Record<ReportStatus, string> = {
    pending: 'Pending',
    resolved: 'Resolved',
    dismissed: 'Dismissed',
  }
  return labels[status]
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
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory | 'all'>(
    'all',
  )
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [actionReason, setActionReason] = useState('')

  const breadcrumbItems = [
    { label: 'Thực Đơn Điều Hướng' },
    { label: 'Quản Lý Báo Cáo Vi Phạm' },
    { label: 'Tổng Quan' },
  ]

  // Calculate stats
  const stats = useMemo(() => {
    const total = mockReports.length
    const pending = mockReports.filter((r) => r.status === 'pending').length
    const resolved = mockReports.filter((r) => r.status === 'resolved').length
    const dismissed = mockReports.filter((r) => r.status === 'dismissed').length

    return { total, pending, resolved, dismissed }
  }, [])

  // Filter and search reports
  const filteredReports = useMemo(() => {
    return mockReports.filter((report) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        report.post.title.toLowerCase().includes(searchLower) ||
        report.reporter.name.toLowerCase().includes(searchLower) ||
        report.post.id.toLowerCase().includes(searchLower)

      // Status filter
      const matchesStatus =
        statusFilter === 'all' || report.status === statusFilter

      // Category filter
      const matchesCategory =
        categoryFilter === 'all' || report.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [searchQuery, statusFilter, categoryFilter])

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
          <h1 className='text-3xl font-semibold text-gray-900'>
            Violation Report Management
          </h1>
          <p className='mt-1 text-sm text-gray-500'>
            Review and manage user reports about posts that may violate
            community guidelines.
          </p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <div className='rounded-xl border border-gray-100 bg-white p-6'>
            <div className='text-2xl font-bold text-gray-900'>
              {stats.total}
            </div>
            <div className='mt-1 text-sm text-gray-400'>Total Reports</div>
            <div className='mt-2 text-xs text-gray-500'>All time reports</div>
          </div>

          <div className='rounded-xl border border-gray-100 bg-white p-6'>
            <div className='text-2xl font-bold text-yellow-600'>
              {stats.pending}
            </div>
            <div className='mt-1 text-sm text-gray-400'>Pending Review</div>
            <div className='mt-2 text-xs text-gray-500'>Need attention</div>
          </div>

          <div className='rounded-xl border border-gray-100 bg-white p-6'>
            <div className='text-2xl font-bold text-green-600'>
              {stats.resolved}
            </div>
            <div className='mt-1 text-sm text-gray-400'>Resolved</div>
            <div className='mt-2 text-xs text-gray-500'>Action taken</div>
          </div>

          <div className='rounded-xl border border-gray-100 bg-white p-6'>
            <div className='text-2xl font-bold text-gray-500'>
              {stats.dismissed}
            </div>
            <div className='mt-1 text-sm text-gray-400'>Dismissed</div>
            <div className='mt-2 text-xs text-gray-500'>No action needed</div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className='space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
          {/* Search Bar */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
            <Input
              type='text'
              placeholder='Search by post title, reporter name, or post ID...'
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
                setStatusFilter(e.target.value as ReportStatus | 'all')
              }
              className='rounded-lg border border-gray-100 bg-white px-4 py-2 text-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100'
            >
              <option value='all'>All Status</option>
              <option value='pending'>Pending</option>
              <option value='resolved'>Resolved</option>
              <option value='dismissed'>Dismissed</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as ReportCategory | 'all')
              }
              className='rounded-lg border border-gray-100 bg-white px-4 py-2 text-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100'
            >
              <option value='all'>All Categories</option>
              <option value='fake_fraudulent'>Fake/Fraudulent Listing</option>
              <option value='spam_promotional'>Spam/Promotional</option>
              <option value='inappropriate_content'>
                Inappropriate Content
              </option>
              <option value='wrong_information'>Wrong Information</option>
              <option value='other'>Other</option>
            </select>
          </div>
        </div>

        {/* Reports Table */}
        <div className='rounded-2xl border border-gray-200 bg-white shadow-sm'>
          {/* Table Header */}
          <div className='grid grid-cols-12 gap-4 border-b border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700'>
            <div className='col-span-3'>Post Details</div>
            <div className='col-span-2'>Reporter</div>
            <div className='col-span-2'>Report Category</div>
            <div className='col-span-2'>Report Content</div>
            <div className='col-span-1'>Report Time</div>
            <div className='col-span-1'>Status</div>
            <div className='col-span-1 text-right'>Actions</div>
          </div>

          {/* Table Body */}
          <div className='divide-y divide-gray-100'>
            {filteredReports.length === 0 ? (
              <div className='px-4 py-12 text-center text-gray-500'>
                No reports found matching your criteria
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className='grid grid-cols-12 gap-4 px-4 py-4 hover:bg-gray-50'
                >
                  {/* Post Details */}
                  <div className='col-span-3 flex gap-3'>
                    {/* Thumbnail */}
                    <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg'>
                      <img
                        src={report.post.thumbnail}
                        alt={report.post.title}
                        className='h-full w-full object-cover'
                      />
                    </div>

                    {/* Title & Tags */}
                    <div className='flex-1 min-w-0'>
                      <div className='font-medium text-gray-900 truncate'>
                        {report.post.title}
                      </div>
                      <div className='mt-0.5 text-xs text-gray-400'>
                        {report.post.id}
                      </div>
                      <div className='mt-1 flex flex-wrap gap-1'>
                        <span className='text-xs text-gray-600'>
                          {report.post.propertyType}
                        </span>
                        <span className='text-xs text-gray-400'>•</span>
                        <span className='text-xs text-gray-600'>
                          {report.post.area}m²
                        </span>
                        <span className='text-xs text-gray-400'>•</span>
                        <Badge
                          className={cn(
                            'text-xs px-1.5 py-0',
                            report.post.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500',
                          )}
                        >
                          {report.post.status === 'active'
                            ? 'Active'
                            : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Reporter */}
                  <div className='col-span-2 flex items-center gap-2'>
                    <Avatar className='h-10 w-10'>
                      {report.reporter.avatar ? (
                        <img
                          src={report.reporter.avatar}
                          alt={report.reporter.name}
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <div className='flex h-full w-full items-center justify-center bg-blue-100 text-blue-700 font-semibold text-sm'>
                          {getInitials(report.reporter.name)}
                        </div>
                      )}
                    </Avatar>
                    <div className='min-w-0'>
                      <div className='text-sm font-medium text-gray-900 truncate'>
                        {report.reporter.name}
                      </div>
                      <div className='text-xs text-gray-400'>
                        {report.reporter.id}
                      </div>
                    </div>
                  </div>

                  {/* Report Category */}
                  <div className='col-span-2 flex items-center'>
                    <Badge
                      variant='outline'
                      className={cn(
                        'text-xs font-medium',
                        getCategoryColor(report.category),
                      )}
                    >
                      {getCategoryLabel(report.category)}
                    </Badge>
                  </div>

                  {/* Report Content */}
                  <div className='col-span-2 flex items-center text-sm text-gray-600'>
                    <div className='line-clamp-2'>
                      {truncateText(report.content, 80)}
                    </div>
                  </div>

                  {/* Report Time */}
                  <div className='col-span-1 flex items-center text-sm text-gray-500'>
                    <div>
                      <div>{report.reportDate}</div>
                      <div className='text-xs text-gray-400'>
                        {report.reportTime}
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className='col-span-1 flex items-center'>
                    <Badge
                      variant='outline'
                      className={cn(
                        'text-xs font-medium',
                        getStatusColor(report.status),
                      )}
                    >
                      {getStatusLabel(report.status)}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className='col-span-1 flex items-center justify-end'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleReview(report)}
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
        <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-semibold'>
              Review Violation Report
            </DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className='space-y-6'>
              {/* Report Info */}
              <div className='rounded-lg bg-yellow-50 border border-yellow-200 p-4'>
                <div className='flex items-start gap-3'>
                  <AlertTriangle className='h-5 w-5 text-yellow-600 mt-0.5' />
                  <div>
                    <h4 className='font-medium text-yellow-900'>
                      Report Category:{' '}
                      {getCategoryLabel(selectedReport.category)}
                    </h4>
                    <p className='mt-1 text-sm text-yellow-800'>
                      Reported on {selectedReport.reportDate} at{' '}
                      {selectedReport.reportTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reported Post */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                  Reported Post
                </h3>
                <div className='rounded-lg border border-gray-200 p-4'>
                  <div className='flex gap-4'>
                    <img
                      src={selectedReport.post.thumbnail}
                      alt={selectedReport.post.title}
                      className='h-24 w-24 flex-shrink-0 rounded-lg object-cover'
                    />
                    <div className='flex-1'>
                      <h4 className='font-semibold text-gray-900'>
                        {selectedReport.post.title}
                      </h4>
                      <p className='text-sm text-gray-500 mt-1'>
                        ID: {selectedReport.post.id}
                      </p>
                      <div className='mt-2 flex items-center gap-3 text-sm text-gray-600'>
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
                            ? 'Active'
                            : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reporter Info */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                  Reported By
                </h3>
                <div className='flex items-center gap-3 rounded-lg border border-gray-200 p-4'>
                  <Avatar className='h-12 w-12'>
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
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                  Report Details
                </h3>
                <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
                  <p className='text-sm text-gray-700 leading-relaxed'>
                    {selectedReport.content}
                  </p>
                </div>
              </div>

              {/* Current Status */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                  Current Status
                </h3>
                <Badge
                  variant='outline'
                  className={cn(
                    'text-sm',
                    getStatusColor(selectedReport.status),
                  )}
                >
                  {getStatusLabel(selectedReport.status)}
                </Badge>
              </div>

              {/* Action Reason (if taking action) */}
              {selectedReport.status === 'pending' && (
                <div>
                  <label
                    htmlFor='action-reason'
                    className='text-sm font-medium text-gray-700'
                  >
                    Action Reason (optional)
                  </label>
                  <textarea
                    id='action-reason'
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder='Enter reason for your decision...'
                    className='mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
                    rows={3}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className='flex gap-3'>
                <Button
                  onClick={handleViewPost}
                  variant='outline'
                  className='flex-1'
                >
                  <Eye className='mr-2 h-4 w-4' />
                  View Post
                </Button>

                {selectedReport.status === 'pending' && (
                  <>
                    <Button
                      onClick={handleResolve}
                      className='flex-1 bg-green-600 hover:bg-green-700'
                    >
                      <CheckCircle className='mr-2 h-4 w-4' />
                      Resolve Report
                    </Button>
                    <Button
                      onClick={handleDismiss}
                      variant='outline'
                      className='flex-1 border-gray-300 text-gray-700 hover:bg-gray-50'
                    >
                      <XCircle className='mr-2 h-4 w-4' />
                      Dismiss Report
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
