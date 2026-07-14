// AI Listing Verification Types
//
// Contract mirrors the Spring Boot -> Python AI service response, which is
// returned in snake_case. Keep field names snake_case so they match the
// raw payload exactly (no transformation layer in between).

import { ApiResponse } from '@/configs/axios/types'

export type { ApiResponse }

// ---------------------------------------------------------------------------
// Request payload for POST /v1/ai/listings/verify
// ---------------------------------------------------------------------------

export type AiPropertyType =
  | 'APARTMENT'
  | 'ROOM'
  | 'HOUSE'
  | 'STUDIO'
  | 'OFFICE'

export interface AiVerificationVideo {
  url: string
  thumbnailUrl?: string
  durationSeconds?: number
}

export interface AiVerificationMetadata {
  bedrooms?: number | null
  bathrooms?: number | null
  floor?: number | null
}

export interface AiVerificationRequest {
  title: string
  description: string
  price: number
  address: string
  property_type?: string
  area?: number
  amenities?: string[]
  images?: string[]
  videos?: AiVerificationVideo[]
  metadata?: AiVerificationMetadata
}

// ---------------------------------------------------------------------------
// Response data for POST /v1/ai/listings/verify
// ---------------------------------------------------------------------------

export type AiSuggestedStatus = 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW'

export type AiViolationCode =
  | 'SCAM'
  | 'INCONSISTENT_INFO'
  | 'STOCK_PHOTO'
  | 'CONTACT_IN_LISTING'
  | 'BLURRY_IMAGE'
  | 'MISSING_MEDIA'
  | 'PRICE_ANOMALY'

export type AiSeverity = 'low' | 'medium' | 'high' | 'critical'
export type AiPriority = 'low' | 'medium' | 'high' | 'critical'

export interface AiImageValidation {
  is_valid: boolean
  total_images: number
  valid_images: number
  quality_score: number
  issues: string[]
}

export interface AiVideoValidation {
  is_valid: boolean
  total_videos: number
  valid_videos: number
  quality_score: number
  issues: string[]
}

export interface AiContentValidation {
  is_rental_related: boolean
  category_match: boolean
  content_score: number
  issues: string[]
}

export interface AiCompletenessValidation {
  is_complete: boolean
  completeness_score: number
  missing_fields: string[]
  quality_issues: string[]
}

export interface AiViolation {
  category: string
  severity: AiSeverity
  message: string
  field: string
}

export interface AiSuggestion {
  category: string
  message: string
  field: string
  priority: AiPriority
}

export interface AiReason {
  blurriness_issue: boolean
  missing_fields: string[]
  inconsistent_info: boolean
  watermark_or_phone: boolean
  stock_photo: boolean
  details: string
}

export interface AiVerificationResult {
  is_valid: boolean
  score: number
  confidence: number
  suggested_status: AiSuggestedStatus
  image_validation: AiImageValidation
  video_validation: AiVideoValidation
  content_validation: AiContentValidation
  completeness_validation: AiCompletenessValidation
  violations: AiViolation[]
  suggestions: AiSuggestion[]
  reason: AiReason
  violation_codes: AiViolationCode[]
  model_used: string
  processing_time_seconds: number
  verification_timestamp: string
}

// ---------------------------------------------------------------------------
// Response data for POST /v1/ai/listings/{listingId}/check-duplicate
//
// NOTE: unlike the snake_case Python verification payload, the duplicate result
// is a Spring Boot DTO (DuplicateCheckResponse) and comes back camelCase.
// ---------------------------------------------------------------------------

export type AiDuplicateDecision = 'PASS' | 'SUSPICIOUS' | 'DUPLICATE'

export interface AiDuplicateMatch {
  listingId: number | string | null
  title: string
  score: number
  titleSimilarity: number
  descriptionSimilarity: number
  addressSimilarity: number
  priceSimilarity: number
  imageSimilarity: number
  llmScore: number | null
  llmReason: string | null
}

export interface AiDuplicateCheckResult {
  isDuplicate: boolean
  highestScore: number
  decision: AiDuplicateDecision
  suspiciousMatches: AiDuplicateMatch[]
}

// ---------------------------------------------------------------------------
// Response data for GET /v1/ai/listings/{listingId}/moderation-result
//
// The AI result the auto-moderation cronjob already stored, replayed so the
// review UI shows it without re-running. `verification` and `duplicateCheck`
// reuse the exact shapes the on-demand endpoints return.
// ---------------------------------------------------------------------------

export interface AiStoredModerationResult {
  verification: AiVerificationResult | null
  duplicateCheck: AiDuplicateCheckResult | null
  aiScore: number | null
  verificationStatus: string | null
  analyzedAt: string | null
}

// ---------------------------------------------------------------------------
// Response data for GET /v1/ai/listings/service-status
// ---------------------------------------------------------------------------

export interface AiServiceStatus {
  available: boolean
  checked_at: string
}

// ---------------------------------------------------------------------------
// Admin auto-verify control
//   GET /v1/ai/listings/auto-verify/status
//   PUT /v1/ai/listings/auto-verify/toggle?enabled={true|false}
//
// Requires an admin Bearer token + X-Admin-Id header (injected automatically by
// the axios request interceptor). Roles allowed: SA, UA, SPA.
//
// When enabled, the post review dialog auto-runs AI analysis as soon as it
// opens instead of requiring a manual "Verify" click. Persisted in the DB.
//
// NOTE: backend fields here are camelCase (Spring Boot DTO), unlike the
// snake_case Python verification payload above.
// ---------------------------------------------------------------------------

export interface AiAutoVerifySetting {
  aiAutoVerifyEnabled: boolean
  checkedAt?: string
  /** Present on toggle responses. */
  updatedAt?: string
  /** Admin id that performed the toggle; present on toggle responses. */
  updatedBy?: string
}
