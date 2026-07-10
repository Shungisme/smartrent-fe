'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { ListingReport } from '@/api/types/listing-report.type'
import { ListingService } from '@/api/services/listing.service'
import { ReportStats } from '@/components/organisms/reports/ReportStats'
import { ReportTable } from '@/components/organisms/reports/ReportTable'
import { ReportReviewModal } from '@/components/organisms/reports/ReportReviewModal'
import { PageHeader } from '@/components/molecules/pageHeader'

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
      const [reportsRes, statsRes] = await Promise.all([
        ListingService.getReports({ page: 1, size: 50 }),
        ListingService.getReportStatistics(),
      ])

      if (!reportsRes.data) {
        setReports([])
        setStats({ total: 0, pending: 0, resolved: 0, dismissed: 0 })
        return
      }

      setReports(reportsRes.data.data)

      if (statsRes.data) {
        setStats({
          total: statsRes.data.totalReports,
          pending: statsRes.data.pendingReports,
          resolved: statsRes.data.resolvedReports,
          dismissed: statsRes.data.rejectedReports,
        })
      } else {
        setStats({
          total: reportsRes.data.totalElements,
          pending: 0,
          resolved: 0,
          dismissed: 0,
        })
      }
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
      toast.warning(t('toasts.revisionDetailsRequired'))
      return
    }

    try {
      await ListingService.requestListingRevision(
        selectedReport.listingId,
        reason,
        true, // ownerActionRequired
      )

      // Close the report after requesting revision
      await ListingService.resolveReport(selectedReport.reportId, {
        status: 'RESOLVED',
        adminNotes: reason,
      })

      toast.success(t('toasts.revisionSuccess'))
      setReviewModalOpen(false)
      fetchReports()
    } catch (error) {
      console.error('Error requesting revision:', error)
      toast.error(t('toasts.revisionError'))
    }
  }

  return (
    <div className='flex flex-col lg:min-h-0 lg:flex-1'>
      <div className='flex flex-col gap-6 lg:min-h-0 lg:flex-1'>
        <PageHeader title={t('title')} />

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
