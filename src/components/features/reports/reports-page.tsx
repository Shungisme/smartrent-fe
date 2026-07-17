'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
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

  // Deep link target, e.g. from a "new report" notification: /moderation/reports?id=616
  const searchParams = useSearchParams()
  const deepLinkId = searchParams?.get('id') ?? null
  const lastOpenedIdRef = useRef<string | null>(null)

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

  // Open the report referenced by ?id= once the list has loaded. Reports come
  // back newest-first, so a freshly reported listing is on the first page.
  // Guard by id so closing the modal doesn't reopen it, while clicking a
  // different notification still opens the new report.
  useEffect(() => {
    if (!deepLinkId || reports.length === 0) return
    if (lastOpenedIdRef.current === deepLinkId) return
    const target = reports.find((r) => String(r.reportId) === deepLinkId)
    if (target) {
      setSelectedReport(target)
      setReviewModalOpen(true)
      lastOpenedIdRef.current = deepLinkId
    }
  }, [deepLinkId, reports])

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
    <div>
      <div className='space-y-6'>
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
