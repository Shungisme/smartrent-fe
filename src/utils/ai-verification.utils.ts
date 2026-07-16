import {
  AiVerificationRequest,
  AiSuggestedStatus,
  AiSeverity,
  AiPriority,
} from '@/api/types/ai-verification.type'
import { UIPostData } from '@/types/posts.type'

// Placeholder image paths used by mapApiDataToUI when a listing has no media.
// These are not real listing photos so they must not be sent to the AI.
const PLACEHOLDER_IMAGES = new Set([
  '/images/no-image.png',
  '/images/default-image.jpg',
])

/**
 * Build the AI verification request payload from the UI post model.
 *
 * Note: UIPostData carries a formatted price string, so we use `priceRaw`
 * for the numeric VND value. Placeholder images are stripped so the AI only
 * sees real listing media.
 */
export const buildAiVerificationRequest = (
  post: UIPostData,
): AiVerificationRequest => {
  const images = (post.images || []).filter(
    (url) => !!url && !PLACEHOLDER_IMAGES.has(url),
  )

  console.log('Building AI verification request', post)
  const metadata: AiVerificationRequest['metadata'] = {}
  if (post.bedrooms !== null && post.bedrooms !== undefined) {
    metadata.bedrooms = post.bedrooms
  }
  if (post.bathrooms !== null && post.bathrooms !== undefined) {
    metadata.bathrooms = post.bathrooms
  }

  return {
    title: post.title,
    description: post.description || '',
    price: post.priceRaw,
    address: post.propertyInfo.fullAddress,
    property_type: post.propertyInfo.type,
    area: post.propertyInfo.area,
    amenities: (post.amenities || []).map((a) => a.name).filter(Boolean),
    images,
    ...(Object.keys(metadata).length > 0 ? { metadata } : {}),
  }
}

export type ScoreBand = 'approve' | 'review' | 'reject'

/**
 * Map an AI score (0..1) to a band using the thresholds documented in the
 * Gemini system prompt: >=0.75 approve, 0.50-0.74 review, <0.50 reject.
 */
export const getScoreBand = (score: number): ScoreBand => {
  if (score >= 0.75) return 'approve'
  if (score >= 0.5) return 'review'
  return 'reject'
}

export const getScoreColorClasses = (score: number): string => {
  const band = getScoreBand(score)
  const map: Record<ScoreBand, string> = {
    approve:
      'bg-success/10 text-success-foreground dark:bg-success/20 border-success/30',
    review:
      'bg-warning/10 text-warning-foreground dark:bg-warning/20 border-warning/30',
    reject:
      'bg-destructive/10 text-destructive dark:bg-destructive/20 border-destructive/30',
  }
  return map[band]
}

export const getScoreBarColor = (score: number): string => {
  const band = getScoreBand(score)
  const map: Record<ScoreBand, string> = {
    approve: 'bg-success',
    review: 'bg-warning',
    reject: 'bg-destructive',
  }
  return map[band]
}

export const getSuggestedStatusColor = (status: AiSuggestedStatus): string => {
  const map: Record<AiSuggestedStatus, string> = {
    APPROVED:
      'bg-success/10 text-success-foreground dark:bg-success/20 border-success/30',
    REJECTED:
      'bg-destructive/10 text-destructive dark:bg-destructive/20 border-destructive/30',
    NEEDS_REVIEW:
      'bg-warning/10 text-warning-foreground dark:bg-warning/20 border-warning/30',
  }
  return map[status] || 'bg-muted/50 text-foreground/80 border-border/70'
}

export const getSeverityColor = (level: AiSeverity | AiPriority): string => {
  const map: Record<string, string> = {
    critical:
      'bg-destructive/10 text-destructive dark:bg-destructive/20 border-destructive/30',
    high: 'bg-destructive/10 text-destructive dark:bg-destructive/20 border-destructive/30',
    medium:
      'bg-warning/10 text-warning-foreground dark:bg-warning/20 border-warning/30',
    low: 'bg-primary/10 text-primary dark:bg-primary/20 border-primary/30',
  }
  return (
    map[String(level).toLowerCase()] ||
    'bg-muted/50 text-foreground/80 border-border/70'
  )
}

/** Round a 0..1 score to a whole percentage for display. */
export const toPercent = (value: number): number =>
  Math.round((Number.isFinite(value) ? value : 0) * 100)

// The AI prefixes each media issue with the index of the offending item
// ("Ảnh 1: ...", "Video 2: ..."). The indices do not map to anything the
// moderator can act on in the modal, so they are stripped for display.
const MEDIA_INDEX_PREFIX =
  /^\s*(?:ảnh|hình|image|photo|video)\s*(?:số\s*)?\d+\s*[:\-–]\s*/i

/**
 * Strip the leading media index from AI issue strings and drop the duplicates
 * that stripping exposes (e.g. three separate "anime character" issues for
 * three bad photos collapse into one line).
 */
export const formatAiIssues = (issues: string[]): string[] => {
  const seen = new Set<string>()
  const result: string[] = []

  for (const issue of issues) {
    const stripped = issue.replace(MEDIA_INDEX_PREFIX, '').trim()
    if (!stripped) continue

    const key = stripped.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(stripped.charAt(0).toUpperCase() + stripped.slice(1))
  }

  return result
}
