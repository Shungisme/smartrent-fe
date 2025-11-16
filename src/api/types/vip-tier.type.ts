/**
 * VIP Tier Type Definitions
 *
 * Types for VIP tier management API endpoints
 */

/**
 * VIP tier code enum
 */
export enum VIPTierCode {
  NORMAL = 'NORMAL',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  DIAMOND = 'DIAMOND',
}

/**
 * VIP tier details
 */
export interface VIPTier {
  /** Unique tier identifier */
  tierId: number

  /** Tier code (NORMAL, SILVER, GOLD, DIAMOND) */
  tierCode: VIPTierCode | string

  /** Tier name in Vietnamese */
  tierName: string

  /** Tier name in English */
  tierNameEn: string

  /** Tier level (1-4) */
  tierLevel: number

  /** Price per day (VND) */
  pricePerDay: number

  /** Price for 10 days (VND) */
  price10Days: number

  /** Price for 15 days (VND) */
  price15Days: number

  /** Price for 30 days (VND) */
  price30Days: number

  /** Maximum number of images allowed */
  maxImages: number

  /** Maximum number of videos allowed */
  maxVideos: number

  /** Whether tier has a badge */
  hasBadge: boolean

  /** Badge name (if hasBadge is true) */
  badgeName?: string

  /** Badge color (if hasBadge is true) */
  badgeColor?: string

  /** Whether listings are auto-approved */
  autoApprove: boolean

  /** Whether tier has no ads */
  noAds: boolean

  /** Whether tier has priority display */
  priorityDisplay: boolean

  /** Whether tier has shadow listing feature */
  hasShadowListing: boolean

  /** Whether tier is active */
  isActive: boolean

  /** Display order (optional, in detailed view) */
  displayOrder?: number

  /** Tier description (optional, in detailed view) */
  description?: string

  /** List of features (optional, in detailed view) */
  features?: string[]
}

/**
 * Response type for VIP tier list endpoints
 */
export type VIPTiersResponse = VIPTier[]
