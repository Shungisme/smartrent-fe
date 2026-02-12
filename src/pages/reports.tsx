import React, { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import AdminLayout from '@/components/layouts/AdminLayout'
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

  return (
    <div>
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
      />
    </div>
  )
}

ViolationReportManagement.getLayout = (page: React.ReactElement) => (
  <AdminLayout>{page}</AdminLayout>
)

export default ViolationReportManagement
