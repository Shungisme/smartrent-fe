'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { ListingReport } from '@/api/types/listing-report.type'
import { ListingService } from '@/api/services/listing.service'
import { ReportStats } from '@/components/organisms/reports/ReportStats'
import { ReportTable } from '@/components/organisms/reports/ReportTable'
import { ReportReviewModal } from '@/components/organisms/reports/ReportReviewModal'

const ViolationReportManagement = () => {
  const t = useTranslations('reports')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    dismissed: 0,
  })
  const [reports, setReports] = useState<ListingReport[]>([])
  const [loading, setLoading] = useState(false)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<ListingReport | null>(
    null,
  )

  // Fetch reports from API
  const fetchReports = useCallback(async () => {
    setLoading(true)
    try {
      const res = await ListingService.getReports({ page: 1, size: 50 })

      if (!res.data) {
        setReports([])
        setStats({ total: 0, pending: 0, resolved: 0, dismissed: 0 })
        return
      }

      setReports(res.data.data)
      // Calculate stats
      const statObj = { total: 0, pending: 0, resolved: 0, dismissed: 0 }
      statObj.total = res.data.totalElements
      statObj.pending = res.data.data.filter(
        (r) => r.status === 'PENDING',
      ).length
      statObj.resolved = res.data.data.filter(
        (r) => r.status === 'RESOLVED',
      ).length
      statObj.dismissed = res.data.data.filter(
        (r) => r.status === 'REJECTED',
      ).length
      setStats(statObj)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const handleOpenReview = (report: ListingReport) => {
    setSelectedReport(report)
    setReviewModalOpen(true)
  }

  const handleActionComplete = () => {
    fetchReports()
  }

  const handleRequestRevision = async (reason: string) => {
    if (!selectedReport) return

    if (!reason.trim()) {
      toast.warning('Please provide details on what needs to be revised.')
      return
    }

    try {
      const response = await ListingService.requestListingRevision(
        selectedReport.listingId,
        reason,
        true, // ownerActionRequired
      )

      // Check if request was successful
      if (response && response.code !== '9999') {
        toast.success(
          'Revision requested. Listing owner will be notified to update the listing.',
        )

        // Refresh reports
        setReviewModalOpen(false)
        fetchReports()
      } else {
        // Handle error response
        const errorMessage =
          response.message || 'Failed to request revision. Please try again.'
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Error requesting revision:', error)
      toast.error('Failed to request revision. Please try again.')
    }
  }

  return (
    <div>
      <div className='space-y-6'>
        {/* Header Section */}
        <div className='flex flex-col lg:flex-row items-start lg:items-start justify-between gap-3'>
          <div>
            <h1 className='text-xl md:text-2xl font-bold text-gray-900'>
              {t('title')}
            </h1>
            <p className='mt-0.5 text-xs sm:text-sm text-gray-600'>
              {t('description')}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <ReportStats stats={stats} />

        {/* DataTable Component */}
        <ReportTable
          data={reports}
          loading={loading}
          onReview={handleOpenReview}
        />
      </div>

      {/* Review Modal */}
      <ReportReviewModal
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        report={selectedReport}
        onActionComplete={handleActionComplete}
        onRequestRevision={handleRequestRevision}
      />
    </div>
  )
}

export default ViolationReportManagement
