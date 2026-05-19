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
    approve: 'bg-green-50 text-green-700 border-green-200',
    review: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    reject: 'bg-red-50 text-red-700 border-red-200',
  }
  return map[band]
}

export const getScoreBarColor = (score: number): string => {
  const band = getScoreBand(score)
  const map: Record<ScoreBand, string> = {
    approve: 'bg-green-500',
    review: 'bg-yellow-500',
    reject: 'bg-red-500',
  }
  return map[band]
}

export const getSuggestedStatusColor = (status: AiSuggestedStatus): string => {
  const map: Record<AiSuggestedStatus, string> = {
    APPROVED: 'bg-green-50 text-green-700 border-green-200',
    REJECTED: 'bg-red-50 text-red-700 border-red-200',
    NEEDS_REVIEW: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  }
  return map[status] || 'bg-gray-50 text-gray-700 border-gray-200'
}

export const getSeverityColor = (level: AiSeverity | AiPriority): string => {
  const map: Record<string, string> = {
    high: 'bg-red-50 text-red-700 border-red-200',
    medium: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    low: 'bg-blue-50 text-blue-700 border-blue-200',
  }
  return map[level] || 'bg-gray-50 text-gray-700 border-gray-200'
}

/** Round a 0..1 score to a whole percentage for display. */
export const toPercent = (value: number): number =>
  Math.round((Number.isFinite(value) ? value : 0) * 100)
