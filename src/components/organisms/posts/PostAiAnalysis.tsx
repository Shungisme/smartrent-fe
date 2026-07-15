'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Sparkles,
  Loader2,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Info,
  Files,
  History,
} from 'lucide-react'
import { Badge } from '@/components/atoms/badge'
import { cn } from '@/lib/utils'
import { UIPostData } from '@/types/posts.type'
import { AiVerificationService } from '@/api/services/ai-verification.service'
import {
  AiVerificationResult,
  AiDuplicateCheckResult,
  AiDuplicateDecision,
  AiSeverity,
  AiPriority,
} from '@/api/types/ai-verification.type'
import {
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
  <div className='rounded-lg border border-border/70 p-3'>
    <div className='flex items-start justify-between gap-2'>
      <span className='min-w-0 flex-1 break-words text-sm font-medium text-foreground'>
        {title}
      </span>
      <Badge
        variant='outline'
        className={cn(
          'shrink-0 text-xs',
          valid
            ? 'bg-success/10 text-success-foreground dark:bg-success/20 border-success/30'
            : 'bg-destructive/10 text-destructive dark:bg-destructive/20 border-destructive/30',
        )}
      >
        {valid ? validLabel : invalidLabel}
      </Badge>
    </div>
    <div className='mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground'>
      <span>
        {scoreLabel}: <span className='font-semibold'>{scorePct}%</span>
      </span>
      {stats?.map((s) => (
        <span key={s.label}>
          {s.label}: <span className='font-semibold'>{s.value}</span>
        </span>
      ))}
    </div>
    {issues.length > 0 && (
      <div className='mt-2'>
        <div className='text-xs font-medium text-foreground/80'>
          {issuesLabel}
        </div>
        <ul className='mt-1 list-inside list-disc space-y-0.5 text-xs text-muted-foreground'>
          {issues.map((issue, i) => (
            <li key={i} className='break-words'>
              {issue}
            </li>
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
  const [loadingStore, setLoadingStore] = useState(false)
  const [result, setResult] = useState<AiVerificationResult | null>(null)
  const [duplicate, setDuplicate] = useState<AiDuplicateCheckResult | null>(
    null,
  )
  const [loadedFromStore, setLoadedFromStore] = useState(false)
  const [analyzedAt, setAnalyzedAt] = useState<string | null>(null)

  // On open: show the AI result the background auto-verify job already computed
  // and stored — instantly, with no live AI call to wait on. There is no manual
  // trigger: the panel purely reflects the auto-verify pipeline's output, so if
  // nothing is stored yet (auto-verify off, or the job hasn't reached this
  // listing), the panel just stays empty below the header.
  useEffect(() => {
    setResult(null)
    setDuplicate(null)
    setLoadedFromStore(false)
    setAnalyzedAt(null)

    if (!open || !post) return

    let cancelled = false
    setLoadingStore(true)
    AiVerificationService.getStoredResult(post.id)
      .then((res) => {
        if (cancelled) return
        const data = res.success ? res.data : null
        if (data && (data.verification || data.duplicateCheck)) {
          if (data.verification) setResult(data.verification)
          if (data.duplicateCheck) setDuplicate(data.duplicateCheck)
          setLoadedFromStore(true)
          setAnalyzedAt(data.analyzedAt ?? null)
        }
      })
      .catch(() => {
        // Nothing stored — silent, matches the "not computed yet" case.
      })
      .finally(() => {
        if (!cancelled) setLoadingStore(false)
      })

    return () => {
      cancelled = true
    }
  }, [post, open])

  const duplicateDecisionColor = (decision: AiDuplicateDecision) =>
    decision === 'DUPLICATE'
      ? 'bg-destructive/10 text-destructive dark:bg-destructive/20 border-destructive/30'
      : decision === 'SUSPICIOUS'
        ? 'bg-warning/10 text-warning-foreground dark:bg-warning/20 border-warning/30'
        : 'bg-success/10 text-success-foreground dark:bg-success/20 border-success/30'

  if (!post) return null

  const levelLabel = (level: AiSeverity | AiPriority) => {
    const key = `aiAnalysis.level.${String(level).toLowerCase()}`
    return t.has(key) ? t(key) : String(level)
  }

  return (
    // @container: this panel is rendered at very different widths depending on
    // context — a fixed ~440px sidebar on desktop review, but the full modal
    // width when the dialog stacks to a single column on smaller screens. The
    // grids below key off the panel's own rendered width (container queries)
    // rather than the viewport (`sm:`/`md:`), which previously made them try to
    // fit 2-3 columns into ~400px any time the viewport itself was wide enough
    // — cramming badges and labels until they wrapped and broke the layout.
    <div className='@container rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 p-4'>
      {/* Header */}
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <Sparkles className='h-5 w-5 text-primary' />
          <div>
            <div className='text-sm font-semibold text-foreground'>
              {t('aiAnalysis.title')}
            </div>
            <div className='text-xs text-muted-foreground'>
              {t('aiAnalysis.disclaimer')}
            </div>
          </div>
        </div>
        <AiServiceStatusBadge />
      </div>

      {/* Loaded from the auto-moderation cronjob's stored result */}
      {loadedFromStore && (
        <div className='mt-3 flex items-center gap-1.5 text-xs text-muted-foreground'>
          <History className='h-3.5 w-3.5' />
          {analyzedAt
            ? t('aiAnalysis.storedNotice', {
                time: new Date(analyzedAt).toLocaleString('vi-VN'),
              })
            : t('aiAnalysis.storedResult')}
        </div>
      )}

      {/* Fetching the stored result */}
      {loadingStore && !result && (
        <div className='mt-3 flex items-center gap-2 text-sm text-muted-foreground'>
          <Loader2 className='h-4 w-4 animate-spin' />
          {t('aiAnalysis.loadingStored')}
        </div>
      )}

      {/* Nothing stored yet — no manual trigger; nudge toward enabling auto-verify */}
      {!loadingStore && !result && (
        <div className='mt-3 flex items-start gap-2 rounded-lg border border-dashed border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground'>
          <Info className='mt-0.5 h-3.5 w-3.5 shrink-0' />
          <span>{t('aiAnalysis.noResult')}</span>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className='mt-4 space-y-4'>
          {/* Score + suggestion summary — three cards on one baseline grid.
              Each card is a flex column with a pinned footer (mt-auto) so the
              rows line up no matter which card is tallest. @lg (>=512px of
              panel width, not viewport) is the point at which 3 columns have
              room to breathe; below that they stack full-width. */}
          <div className='grid grid-cols-1 gap-3 @lg:grid-cols-3'>
            <div
              className={cn(
                'flex flex-col rounded-lg border p-3',
                getScoreColorClasses(result.score),
              )}
            >
              <div className='text-xs font-medium opacity-80'>
                {t('aiAnalysis.score')}
              </div>
              <div className='mt-1 text-2xl font-bold tabular-nums leading-none'>
                {toPercent(result.score)}%
              </div>
              <div className='mt-auto pt-2'>
                <div className='h-1.5 w-full rounded-full bg-background/60'>
                  <div
                    className={cn(
                      'h-1.5 rounded-full',
                      getScoreBarColor(result.score),
                    )}
                    style={{ width: `${toPercent(result.score)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className='flex flex-col rounded-lg border border-border/70 bg-card p-3'>
              <div className='text-xs font-medium text-muted-foreground'>
                {t('aiAnalysis.suggestedStatus')}
              </div>
              <div className='mt-auto pt-2'>
                <Badge
                  variant='outline'
                  className={cn(
                    'text-sm',
                    getSuggestedStatusColor(result.suggested_status),
                  )}
                >
                  {t(`aiAnalysis.suggested.${result.suggested_status}`)}
                </Badge>
              </div>
            </div>

            <div className='flex flex-col rounded-lg border border-border/70 bg-card p-3'>
              <div className='text-xs font-medium text-muted-foreground'>
                {t('aiAnalysis.confidence')}
              </div>
              <div className='mt-1 text-2xl font-bold tabular-nums leading-none text-foreground'>
                {toPercent(result.confidence)}%
              </div>
              <div className='mt-auto truncate pt-2 text-[11px] text-muted-foreground/80'>
                {result.model_used} ·{' '}
                {result.processing_time_seconds.toFixed(1)}
                {t('aiAnalysis.seconds')}
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className='rounded-lg border border-border/70 bg-card p-3'>
            <div className='text-xs font-medium text-foreground/80'>
              {t('aiAnalysis.reasonTitle')}
            </div>
            <p className='mt-1 break-words text-sm text-muted-foreground'>
              {result.reason.details || t('aiAnalysis.noIssues')}
            </p>
            <div className='mt-2 flex flex-wrap gap-1.5'>
              {result.reason.blurriness_issue && (
                <Badge
                  variant='outline'
                  className='bg-destructive/10 text-destructive dark:bg-destructive/20 border-destructive/30 text-xs'
                >
                  {t('aiAnalysis.flags.blurriness')}
                </Badge>
              )}
              {result.reason.inconsistent_info && (
                <Badge
                  variant='outline'
                  className='bg-destructive/10 text-destructive dark:bg-destructive/20 border-destructive/30 text-xs'
                >
                  {t('aiAnalysis.flags.inconsistent')}
                </Badge>
              )}
              {result.reason.watermark_or_phone && (
                <Badge
                  variant='outline'
                  className='bg-destructive/10 text-destructive dark:bg-destructive/20 border-destructive/30 text-xs'
                >
                  {t('aiAnalysis.flags.watermark')}
                </Badge>
              )}
              {result.reason.stock_photo && (
                <Badge
                  variant='outline'
                  className='bg-destructive/10 text-destructive dark:bg-destructive/20 border-destructive/30 text-xs'
                >
                  {t('aiAnalysis.flags.stockPhoto')}
                </Badge>
              )}
            </div>
          </div>

          {/* Violation codes */}
          {result.violation_codes.length > 0 && (
            <div>
              <div className='mb-1.5 text-xs font-medium text-foreground/80'>
                {t('aiAnalysis.violationCodes')}
              </div>
              <div className='flex flex-wrap gap-1.5'>
                {result.violation_codes.map((code) => (
                  <Badge
                    key={code}
                    variant='outline'
                    className='bg-destructive/10 text-destructive dark:bg-destructive/20 border-destructive/30 text-xs'
                  >
                    {code}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Validations */}
          <div>
            <div className='mb-1.5 text-xs font-medium text-foreground/80'>
              {t('aiAnalysis.validations')}
            </div>
            {/* @md (>=448px of panel width): the 440px desktop sidebar stays
                single-column here on purpose — each ValidationCard's stat row
                needs more than ~200px to stay on one line. */}
            <div className='grid grid-cols-1 gap-3 @md:grid-cols-2'>
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
              <div className='mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground/80'>
                <AlertTriangle className='h-4 w-4 text-destructive' />
                {t('aiAnalysis.violations')}
              </div>
              <div className='space-y-2'>
                {result.violations.map((v, i) => (
                  <div
                    key={i}
                    className='rounded-lg border border-destructive/30 bg-destructive/10 dark:bg-destructive/20 p-3'
                  >
                    <div className='flex items-start justify-between gap-2'>
                      <span className='min-w-0 flex-1 break-words text-sm font-medium text-foreground'>
                        {v.category}
                      </span>
                      <Badge
                        variant='outline'
                        className={cn(
                          'shrink-0 text-xs',
                          getSeverityColor(v.severity),
                        )}
                      >
                        {levelLabel(v.severity)}
                      </Badge>
                    </div>
                    <p className='mt-1 break-words text-sm text-foreground/80'>
                      {v.message}
                    </p>
                    {v.field && (
                      <p className='mt-0.5 break-words text-xs text-muted-foreground'>
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
              <div className='mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground/80'>
                <Lightbulb className='h-4 w-4 text-warning-foreground' />
                {t('aiAnalysis.suggestions')}
              </div>
              <div className='space-y-2'>
                {result.suggestions.map((s, i) => (
                  <div
                    key={i}
                    className='rounded-lg border border-warning/30 bg-warning/10 dark:bg-warning/20 p-3'
                  >
                    <div className='flex items-start justify-between gap-2'>
                      <span className='min-w-0 flex-1 break-words text-sm font-medium text-foreground'>
                        {s.category}
                      </span>
                      <Badge
                        variant='outline'
                        className={cn(
                          'shrink-0 text-xs',
                          getSeverityColor(s.priority),
                        )}
                      >
                        {levelLabel(s.priority)}
                      </Badge>
                    </div>
                    <p className='mt-1 break-words text-sm text-foreground/80'>
                      {s.message}
                    </p>
                    {s.field && (
                      <p className='mt-0.5 break-words text-xs text-muted-foreground'>
                        {t('aiAnalysis.field')}: {s.field}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Duplicate detection — independent of the verify result */}
      {duplicate && (
        <div className='mt-4 rounded-xl border border-border/70 bg-card p-4'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <Files className='h-4 w-4 text-primary' />
              <span className='text-sm font-semibold text-foreground'>
                {t('aiAnalysis.duplicate.title')}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Badge
                variant='outline'
                className={cn(
                  'text-xs',
                  duplicateDecisionColor(duplicate.decision),
                )}
              >
                {t(`aiAnalysis.duplicate.decision.${duplicate.decision}`)}
              </Badge>
              <span className='text-xs text-muted-foreground'>
                {t('aiAnalysis.duplicate.highestScore')}:{' '}
                <span className='font-semibold'>
                  {toPercent(duplicate.highestScore)}%
                </span>
              </span>
            </div>
          </div>

          {duplicate.suspiciousMatches.length === 0 ? (
            <p className='mt-2 text-sm text-muted-foreground'>
              {t('aiAnalysis.duplicate.none')}
            </p>
          ) : (
            <div className='mt-3 space-y-2'>
              {duplicate.suspiciousMatches.map((m, i) => (
                <div key={i} className='rounded-lg border border-border/70 p-3'>
                  <div className='flex items-center justify-between gap-2'>
                    {/* min-w-0 is required for line-clamp to take effect inside
                        a flex row — without it the item refuses to shrink below
                        its content's natural width and just pushes the badge
                        out / overflows instead of truncating. */}
                    <span className='line-clamp-1 min-w-0 flex-1 text-sm font-medium text-foreground'>
                      {m.title || `#${m.listingId}`}
                    </span>
                    <Badge variant='outline' className='shrink-0 text-xs'>
                      {toPercent(m.score)}%
                    </Badge>
                  </div>
                  <div className='mt-1 text-[11px] text-muted-foreground'>
                    #{m.listingId} · {t('aiAnalysis.duplicate.image')}:{' '}
                    <span className='font-semibold'>
                      {toPercent(m.imageSimilarity)}%
                    </span>{' '}
                    · {t('aiAnalysis.duplicate.text')}:{' '}
                    {toPercent(m.descriptionSimilarity)}% ·{' '}
                    {t('aiAnalysis.duplicate.address')}:{' '}
                    {toPercent(m.addressSimilarity)}% ·{' '}
                    {t('aiAnalysis.duplicate.price')}:{' '}
                    {toPercent(m.priceSimilarity)}%
                  </div>
                  {m.llmReason && (
                    <p className='mt-1 break-words text-xs text-foreground/80'>
                      {m.llmReason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer: advisory note, only relevant once a result is showing */}
      {result && (
        <div className='mt-4 flex items-center gap-1.5 border-t border-primary/20 pt-3 text-xs text-muted-foreground/80'>
          <CheckCircle2 className='h-3.5 w-3.5' />
          {t('aiAnalysis.advisoryNote')}
        </div>
      )}
    </div>
  )
}
