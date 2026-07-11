'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Button } from '@/components/atoms/button'
import { ReportedAuthorService } from '@/api/services/reported-author.service'
import { ReportedAuthor } from '@/api/types/reported-author.type'
import { AuthorTable } from '@/components/organisms/authors/AuthorTable'
import { AuthorReportsDialog } from '@/components/organisms/authors/AuthorReportsDialog'
import { AuthorBlockDialog } from '@/components/organisms/authors/AuthorBlockDialog'

const ReportedAuthors = () => {
  const t = useTranslations('authors')
  const tCommon = useTranslations('common')

  const [authors, setAuthors] = useState<ReportedAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalItems, setTotalItems] = useState(0)
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({
    page: 1,
    pageSize: 10,
  })

  // Dialog state
  const [reportsAuthor, setReportsAuthor] = useState<ReportedAuthor | null>(
    null,
  )
  const [blockAuthor, setBlockAuthor] = useState<ReportedAuthor | null>(null)
  const [blocking, setBlocking] = useState(false)

  const fetchAuthors = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const blockEligibleRaw = filterValues.blockEligible as string | undefined
      const res = await ReportedAuthorService.getReportedAuthors({
        page: filterValues.page ? Number(filterValues.page) : 1,
        size: filterValues.pageSize ? Number(filterValues.pageSize) : 10,
        email: (filterValues.email as string) || undefined,
        name: (filterValues.name as string) || undefined,
        phone: (filterValues.phone as string) || undefined,
        blockEligible:
          blockEligibleRaw === 'true'
            ? true
            : blockEligibleRaw === 'false'
              ? false
              : undefined,
      })
      if (res.success && res.data) {
        setAuthors(res.data.data)
        setTotalItems(res.data.totalElements)
      } else {
        setError(res.message || t('table.loadError'))
      }
    } catch (err) {
      console.error('Error fetching reported authors:', err)
      setError(t('table.loadError'))
    } finally {
      setLoading(false)
    }
  }, [filterValues, t])

  useEffect(() => {
    fetchAuthors()
  }, [fetchAuthors])

  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    setFilterValues((prev) => ({
      ...newFilters,
      page: (newFilters.page as number | undefined) ?? 1,
      pageSize:
        (newFilters.pageSize as number | undefined) ?? prev.pageSize ?? 10,
    }))
  }

  // The reports dialog and the table both request a block/unblock; funnel both
  // into the confirmation dialog.
  const openBlockFlow = (author: ReportedAuthor) => {
    setReportsAuthor(null)
    setBlockAuthor(author)
  }

  const handleConfirmBlock = async (blocked: boolean, reason: string) => {
    if (!blockAuthor) return
    setBlocking(true)
    try {
      const res = await ReportedAuthorService.setPostingBlock(
        blockAuthor.userId,
        { blocked, reason: reason || undefined },
      )
      if (res.success) {
        toast.success(
          blocked ? t('toasts.blockSuccess') : t('toasts.unblockSuccess'),
        )
        // Update just the toggled row in place — a block/unblock never changes
        // the report counts, so avoid re-running the whole reported-authors
        // aggregate query (which made the toggle feel slow).
        setAuthors((prev) =>
          prev.map((a) =>
            a.userId === blockAuthor.userId
              ? {
                  ...a,
                  postingBlocked: res.data?.postingBlocked ?? blocked,
                  postingBlockedReason: res.data?.postingBlockedReason ?? null,
                  postingBlockedAt: res.data?.postingBlockedAt ?? null,
                }
              : a,
          ),
        )
        setBlockAuthor(null)
      } else {
        toast.error(res.message || t('toasts.blockError'))
      }
    } catch (err) {
      console.error('Error toggling posting block:', err)
      toast.error(t('toasts.blockError'))
    } finally {
      setBlocking(false)
    }
  }

  if (error) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='max-w-sm space-y-3 rounded-xl border border-destructive/25 bg-destructive/6 p-6 text-center'>
          <p className='text-sm text-destructive'>{error}</p>
          <Button
            variant='outline'
            size='sm'
            onClick={() => window.location.reload()}
          >
            {tCommon('retry')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-xl font-semibold text-foreground'>{t('title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('subtitle')}</p>
      </div>

      <AuthorTable
        authors={authors}
        totalItems={totalItems}
        loading={loading}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onViewReports={setReportsAuthor}
        onToggleBlock={openBlockFlow}
      />

      <AuthorReportsDialog
        open={!!reportsAuthor}
        onOpenChange={(open) => !open && setReportsAuthor(null)}
        author={reportsAuthor}
        onToggleBlock={openBlockFlow}
      />

      <AuthorBlockDialog
        open={!!blockAuthor}
        onOpenChange={(open) => !open && setBlockAuthor(null)}
        author={blockAuthor}
        loading={blocking}
        onConfirm={handleConfirmBlock}
      />
    </div>
  )
}

export default ReportedAuthors
