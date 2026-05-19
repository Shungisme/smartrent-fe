'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Sparkles,
  Loader2,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'
import { cn } from '@/lib/utils'
import { UIPostData } from '@/types/posts.type'
import { AiVerificationService } from '@/api/services/ai-verification.service'
import {
  AiVerificationResult,
  AiSeverity,
  AiPriority,
} from '@/api/types/ai-verification.type'
import {
  buildAiVerificationRequest,
  getScoreColorClasses,
  getScoreBarColor,
  getSuggestedStatusColor,
  getSeverityColor,
  toPercent,
} from '@/utils/ai-verification.utils'
import { AiServiceStatusBadge } from '@/components/molecules/aiServiceStatus/AiServiceStatusBadge'

interface PostAiAnalysisProps {
  post: UIPostData | null
  /** Reset internal state when the host modal closes/reopens. */
  open: boolean
}

const ValidationCard: React.FC<{
  title: string
  valid: boolean
  validLabel: string
  invalidLabel: string
  scoreLabel: string
  scorePct: number
  stats?: { label: string; value: React.ReactNode }[]
  issues: string[]
  issuesLabel: string
}> = ({
  title,
  valid,
  validLabel,
  invalidLabel,
  scoreLabel,
  scorePct,
  stats,
  issues,
  issuesLabel,
}) => (
  <div className='rounded-lg border border-gray-200 p-3'>
    <div className='flex items-center justify-between gap-2'>
      <span className='text-sm font-medium text-gray-900'>{title}</span>
      <Badge
        variant='outline'
        className={cn(
          'text-xs',
          valid
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-red-50 text-red-700 border-red-200',
        )}
      >
        {valid ? validLabel : invalidLabel}
      </Badge>
    </div>
    <div className='mt-2 text-xs text-gray-500'>
      {scoreLabel}: <span className='font-semibold'>{scorePct}%</span>
      {stats?.map((s) => (
        <span key={s.label} className='ml-2'>
          {s.label}: <span className='font-semibold'>{s.value}</span>
        </span>
      ))}
    </div>
    {issues.length > 0 && (
      <div className='mt-2'>
        <div className='text-xs font-medium text-gray-700'>{issuesLabel}</div>
        <ul className='mt-1 list-inside list-disc space-y-0.5 text-xs text-gray-600'>
          {issues.map((issue, i) => (
            <li key={i}>{issue}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
)

export const PostAiAnalysis: React.FC<PostAiAnalysisProps> = ({
  post,
  open,
}) => {
  const t = useTranslations('posts')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AiVerificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [serviceAvailable, setServiceAvailable] = useState<boolean | null>(null)

  // Reset whenever the modal closes or the selected post changes.
  useEffect(() => {
    setResult(null)
    setError(null)
    setLoading(false)
  }, [post, open])

  const runAnalysis = async () => {
    if (!post) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const payload = buildAiVerificationRequest(post)
      const res = await AiVerificationService.verifyListing(payload)
      if (res.success && res.data) {
        setResult(res.data)
      } else {
        setError(res.message || t('aiAnalysis.error'))
      }
    } catch {
      setError(t('aiAnalysis.error'))
    } finally {
      setLoading(false)
    }
  }

  if (!post) return null

  const levelLabel = (level: AiSeverity | AiPriority) =>
    t(`aiAnalysis.level.${level}`)

  return (
    <div className='rounded-xl border border-blue-200 bg-blue-50/40 p-4'>
      {/* Header */}
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <Sparkles className='h-5 w-5 text-blue-600' />
          <div>
            <div className='text-sm font-semibold text-gray-900'>
              {t('aiAnalysis.title')}
            </div>
            <div className='text-xs text-gray-500'>
              {t('aiAnalysis.disclaimer')}
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <AiServiceStatusBadge onStatusChange={setServiceAvailable} />
          <Button
            type='button'
            size='sm'
            onClick={runAnalysis}
            disabled={loading || serviceAvailable === false}
            className='bg-blue-600 text-sm hover:bg-blue-700'
          >
            {loading ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Sparkles className='mr-2 h-4 w-4' />
            )}
            {result ? t('aiAnalysis.rerunButton') : t('aiAnalysis.runButton')}
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className='mt-4 flex items-center gap-2 text-sm text-gray-600'>
          <Loader2 className='h-4 w-4 animate-spin' />
          {t('aiAnalysis.analyzing')}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className='mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
          <XCircle className='mt-0.5 h-4 w-4 flex-shrink-0' />
          <span>{error}</span>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className='mt-4 space-y-4'>
          {/* Score + suggestion summary */}
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
            <div
              className={cn(
                'rounded-lg border p-3',
                getScoreColorClasses(result.score),
              )}
            >
              <div className='text-xs font-medium opacity-80'>
                {t('aiAnalysis.score')}
              </div>
              <div className='text-2xl font-bold'>
                {toPercent(result.score)}%
              </div>
              <div className='mt-1 h-1.5 w-full rounded-full bg-white/60'>
                <div
                  className={cn(
                    'h-1.5 rounded-full',
                    getScoreBarColor(result.score),
                  )}
                  style={{ width: `${toPercent(result.score)}%` }}
                />
              </div>
            </div>

            <div className='rounded-lg border border-gray-200 bg-white p-3'>
              <div className='text-xs font-medium text-gray-500'>
                {t('aiAnalysis.suggestedStatus')}
              </div>
              <Badge
                variant='outline'
                className={cn(
                  'mt-2 text-sm',
                  getSuggestedStatusColor(result.suggested_status),
                )}
              >
                {t(`aiAnalysis.suggested.${result.suggested_status}`)}
              </Badge>
            </div>

            <div className='rounded-lg border border-gray-200 bg-white p-3'>
              <div className='text-xs font-medium text-gray-500'>
                {t('aiAnalysis.confidence')}
              </div>
              <div className='text-2xl font-bold text-gray-900'>
                {toPercent(result.confidence)}%
              </div>
              <div className='mt-1 text-[11px] text-gray-400'>
                {t('aiAnalysis.model')}: {result.model_used} ·{' '}
                {result.processing_time_seconds.toFixed(1)}
                {t('aiAnalysis.seconds')}
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className='rounded-lg border border-gray-200 bg-white p-3'>
            <div className='text-xs font-medium text-gray-700'>
              {t('aiAnalysis.reasonTitle')}
            </div>
            <p className='mt-1 text-sm text-gray-600'>
              {result.reason.details || t('aiAnalysis.noIssues')}
            </p>
            <div className='mt-2 flex flex-wrap gap-1.5'>
              {result.reason.blurriness_issue && (
                <Badge
                  variant='outline'
                  className='bg-red-50 text-red-700 border-red-200 text-xs'
                >
                  {t('aiAnalysis.flags.blurriness')}
                </Badge>
              )}
              {result.reason.inconsistent_info && (
                <Badge
                  variant='outline'
                  className='bg-red-50 text-red-700 border-red-200 text-xs'
                >
                  {t('aiAnalysis.flags.inconsistent')}
                </Badge>
              )}
              {result.reason.watermark_or_phone && (
                <Badge
                  variant='outline'
                  className='bg-red-50 text-red-700 border-red-200 text-xs'
                >
                  {t('aiAnalysis.flags.watermark')}
                </Badge>
              )}
              {result.reason.stock_photo && (
                <Badge
                  variant='outline'
                  className='bg-red-50 text-red-700 border-red-200 text-xs'
                >
                  {t('aiAnalysis.flags.stockPhoto')}
                </Badge>
              )}
            </div>
          </div>

          {/* Violation codes */}
          {result.violation_codes.length > 0 && (
            <div>
              <div className='mb-1.5 text-xs font-medium text-gray-700'>
                {t('aiAnalysis.violationCodes')}
              </div>
              <div className='flex flex-wrap gap-1.5'>
                {result.violation_codes.map((code) => (
                  <Badge
                    key={code}
                    variant='outline'
                    className='bg-red-50 text-red-700 border-red-200 text-xs'
                  >
                    {code}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Validations */}
          <div>
            <div className='mb-1.5 text-xs font-medium text-gray-700'>
              {t('aiAnalysis.validations')}
            </div>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <ValidationCard
                title={t('aiAnalysis.imageValidation')}
                valid={result.image_validation.is_valid}
                validLabel={t('aiAnalysis.valid')}
                invalidLabel={t('aiAnalysis.invalid')}
                scoreLabel={t('aiAnalysis.qualityScore')}
                scorePct={toPercent(result.image_validation.quality_score)}
                stats={[
                  {
                    label: t('aiAnalysis.total'),
                    value: result.image_validation.total_images,
                  },
                  {
                    label: t('aiAnalysis.valid'),
                    value: result.image_validation.valid_images,
                  },
                ]}
                issues={result.image_validation.issues}
                issuesLabel={t('aiAnalysis.issues')}
              />
              <ValidationCard
                title={t('aiAnalysis.videoValidation')}
                valid={result.video_validation.is_valid}
                validLabel={t('aiAnalysis.valid')}
                invalidLabel={t('aiAnalysis.invalid')}
                scoreLabel={t('aiAnalysis.qualityScore')}
                scorePct={toPercent(result.video_validation.quality_score)}
                stats={[
                  {
                    label: t('aiAnalysis.total'),
                    value: result.video_validation.total_videos,
                  },
                  {
                    label: t('aiAnalysis.valid'),
                    value: result.video_validation.valid_videos,
                  },
                ]}
                issues={result.video_validation.issues}
                issuesLabel={t('aiAnalysis.issues')}
              />
              <ValidationCard
                title={t('aiAnalysis.contentValidation')}
                valid={result.content_validation.category_match}
                validLabel={t('aiAnalysis.valid')}
                invalidLabel={t('aiAnalysis.invalid')}
                scoreLabel={t('aiAnalysis.contentScore')}
                scorePct={toPercent(result.content_validation.content_score)}
                stats={[
                  {
                    label: t('aiAnalysis.rentalRelated'),
                    value: result.content_validation.is_rental_related
                      ? t('aiAnalysis.yes')
                      : t('aiAnalysis.no'),
                  },
                ]}
                issues={result.content_validation.issues}
                issuesLabel={t('aiAnalysis.issues')}
              />
              <ValidationCard
                title={t('aiAnalysis.completenessValidation')}
                valid={result.completeness_validation.is_complete}
                validLabel={t('aiAnalysis.complete')}
                invalidLabel={t('aiAnalysis.incomplete')}
                scoreLabel={t('aiAnalysis.completenessScore')}
                scorePct={toPercent(
                  result.completeness_validation.completeness_score,
                )}
                issues={[
                  ...result.completeness_validation.missing_fields.map(
                    (f) => `${t('aiAnalysis.missingFields')}: ${f}`,
                  ),
                  ...result.completeness_validation.quality_issues,
                ]}
                issuesLabel={t('aiAnalysis.issues')}
              />
            </div>
          </div>

          {/* Violations */}
          {result.violations.length > 0 && (
            <div>
              <div className='mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-700'>
                <AlertTriangle className='h-4 w-4 text-red-500' />
                {t('aiAnalysis.violations')}
              </div>
              <div className='space-y-2'>
                {result.violations.map((v, i) => (
                  <div
                    key={i}
                    className='rounded-lg border border-red-200 bg-red-50 p-3'
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <span className='text-sm font-medium text-gray-900'>
                        {v.category}
                      </span>
                      <Badge
                        variant='outline'
                        className={cn('text-xs', getSeverityColor(v.severity))}
                      >
                        {levelLabel(v.severity)}
                      </Badge>
                    </div>
                    <p className='mt-1 text-sm text-gray-700'>{v.message}</p>
                    {v.field && (
                      <p className='mt-0.5 text-xs text-gray-500'>
                        {t('aiAnalysis.field')}: {v.field}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div>
              <div className='mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-700'>
                <Lightbulb className='h-4 w-4 text-yellow-500' />
                {t('aiAnalysis.suggestions')}
              </div>
              <div className='space-y-2'>
                {result.suggestions.map((s, i) => (
                  <div
                    key={i}
                    className='rounded-lg border border-yellow-200 bg-yellow-50 p-3'
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <span className='text-sm font-medium text-gray-900'>
                        {s.category}
                      </span>
                      <Badge
                        variant='outline'
                        className={cn('text-xs', getSeverityColor(s.priority))}
                      >
                        {levelLabel(s.priority)}
                      </Badge>
                    </div>
                    <p className='mt-1 text-sm text-gray-700'>{s.message}</p>
                    {s.field && (
                      <p className='mt-0.5 text-xs text-gray-500'>
                        {t('aiAnalysis.field')}: {s.field}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className='flex items-center gap-1.5 text-xs text-gray-400'>
            <CheckCircle2 className='h-3.5 w-3.5' />
            {t('aiAnalysis.advisoryNote')}
          </div>
        </div>
      )}
    </div>
  )
}
