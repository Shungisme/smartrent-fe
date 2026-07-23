// Listing Types for Admin Portal

export type ListingType = 'RENT' | 'SALE' | 'SHARE'
export type VipType = 'NORMAL' | 'SILVER' | 'GOLD' | 'DIAMOND'
export type ListingStatus =
  | 'ACTIVE'
  | 'PENDING'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'DRAFT'
  | 'SHADOW'
export type ProductType = 'ROOM' | 'APARTMENT' | 'HOUSE' | 'OFFICE' | 'STUDIO'
export type PriceUnit = 'VND_PER_MONTH' | 'VND_PER_YEAR' | 'VND_TOTAL'
export type PostSource =
  | 'DIRECT_PAYMENT'
  | 'MEMBERSHIP_QUOTA'
  | 'CREATE_LISTING_QUOTA'
export type MediaType = 'IMAGE' | 'VIDEO'
export type AddressType = 'OLD' | 'NEW'

// Moderation Status for Admin Review Queue
export type ModerationStatus =
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'REVISION_REQUIRED'
  | 'SUSPENDED'
  | 'RESUBMITTED'
  | 'REMOVED'

// Decision for moderation action
export type ModerationDecision =
  | 'APPROVE'
  | 'REJECT'
  | 'REQUEST_REVISION'
  | 'SUSPEND'

// Admin Verification Info
export interface AdminVerification {
  adminId: string
  adminName: string
  adminEmail: string
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  verificationNotes: string | null
  verifiedAt: string | null
  rejectionReason: string | null
}

// User Info in Listing
export interface ListingUser {
  userId: string
  firstName: string
  lastName: string
  email: string
  contactPhoneNumber: string
  contactPhoneVerified: boolean
  avatarUrl: string | null
}

// Media
export interface ListingMedia {
  mediaId: number
  url: string
  mediaType: MediaType
  isPrimary: boolean
  sortOrder: number
}

// Address
export interface ListingAddress {
  addressId: number
  fullAddress: string
  fullNewAddress: string | null
  latitude: number
  longitude: number
  addressType: AddressType
  // Old address structure
  legacyProvinceId?: number
  legacyProvinceName?: string
  legacyDistrictId?: number
  legacyDistrictName?: string
  legacyWardId?: number
  legacyWardName?: string
  legacyStreet?: string
  // New address structure
  newProvinceCode?: string
  newProvinceName?: string
  newWardCode?: string
  newWardName?: string
  newStreet?: string
}

// Payment Info
export interface PaymentInfo {
  provider: string
  status: string
  paidAt: string
  amount: number
  vipTierPurchased: VipType
  durationPurchased: number
}

// Statistics
export interface ListingStatistics {
  viewCount: number
  contactCount: number
  saveCount: number
  reportCount: number
}

// Amenity
export interface Amenity {
  amenityId: number
  name: string
  icon: string
  description?: string
  category?: string
  isActive?: boolean
}

// Category
export interface Category {
  categoryId: number
  name: string
  description?: string
  isActive: boolean
}

// Main Listing Response with Admin Info
export interface ListingResponseWithAdmin {
  listingId: number
  title: string
  description: string
  user: ListingUser
  category?: Category
  listingType: ListingType
  productType: ProductType
  price: number
  priceUnit: PriceUnit
  area: number
  bedrooms: number | null
  bathrooms: number | null
  direction: string | null
  furnishing: string | null
  roomCapacity: number | null
  // Utility price fields: either a PriceType enum name (NEGOTIABLE /
  // SET_BY_OWNER / PROVIDER_RATE) or a free-form amount string.
  waterPrice?: string | null
  electricityPrice?: string | null
  internetPrice?: string | null
  serviceFee?: string | null
  amenities: Amenity[]
  address?: ListingAddress
  propertyInfo?: {
    type?: ProductType
    area?: number
    district?: string | null
    fullAddress?: string | null
  }
  media: ListingMedia[]
  postDate: string
  expiryDate: string
  verified: boolean
  isVerify: boolean
  expired: boolean
  isDraft?: boolean
  vipType: VipType
  postSource?: PostSource
  transactionId?: string | null
  isShadow?: boolean
  parentListingId?: number | null
  paymentInfo?: PaymentInfo | null
  statistics?: ListingStatistics
  verificationNotes?: string | null
  rejectionReason?: string | null
  createdAt: string
  updatedAt: string
  adminVerification: AdminVerification
  moderationStatus?: ModerationStatus | null
  revisionCount?: number | null
  lastModerationReasonCode?: string | null
  lastModerationReasonText?: string | null
}

// Admin Listing List Item — slim summary returned by /v1/listings/admin/list
// (full record is fetched via /v1/listings/admin/{id})
export interface OwnerSummary {
  userId?: string | null
  firstName: string | null
  lastName: string | null
  contactPhoneNumber: string | null
  avatarUrl?: string | null
}

export interface AdminVerificationSummary {
  verifiedAt: string | null
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_SUBMITTED'
}

export type SummaryListingType = ListingType

export type SummaryListingStatus =
  | 'EXPIRED'
  | 'EXPIRING_SOON'
  | 'DISPLAYING'
  | 'IN_REVIEW'
  | 'PENDING_PAYMENT'
  | 'REJECTED'
  | 'VERIFIED'
  | 'RESUBMITTED'

export interface AdminListingSummary {
  listingId: number
  title: string
  user: OwnerSummary | null
  postDate: string | null
  expiryDate: string | null
  listingType: SummaryListingType | null
  verified: boolean | null
  expired: boolean | null
  listingStatus: SummaryListingStatus | null
  vipType: VipType | null
  categoryId: number | null
  productType: ProductType | null
  price: number | null
  priceUnit: string | null
  area: number | null
  /** Image URLs for the listing — typically the first few used for previews. */
  images?: string[] | null
  adminVerification: AdminVerificationSummary
  moderationStatus: ModerationStatus | null
  revisionCount: number | null
  lastModerationReasonCode: string | null
  lastModerationReasonText: string | null
}

// Statistics for Admin Dashboard
export interface ListingStatisticsSummary {
  totalListings?: number
  pendingVerification: number
  verified: number
  expired: number
  rejected?: number
  drafts: number
  shadows: number
  normalListings: number
  silverListings: number
  goldListings: number
  diamondListings: number
}

// Admin Listing List Response
export interface AdminListingListResponse {
  listings: AdminListingSummary[]
  totalCount: number
  currentPage: number
  pageSize: number
  totalPages: number
  statistics: ListingStatisticsSummary
}

// Filter Request for Admin
export interface ListingFilterRequest {
  page?: number
  size?: number
  sortBy?: 'DEFAULT' | 'PRICE_ASC' | 'PRICE_DESC' | 'NEWEST' | 'OLDEST'
  sortDirection?: 'ASC' | 'DESC'
  /** Legacy: search in title and description. Prefer `title` and `ownerSearch`. A purely-numeric keyword also matches the listing ID exactly. */
  keyword?: string
  /** Exact match on listing ID (PK lookup). */
  id?: number
  /** Case-insensitive substring match on the listing title only. */
  title?: string
  /** Matches owner firstName/lastName/contactPhoneNumber/phoneNumber (case-insensitive contains). */
  ownerSearch?: string
  moderationStatus?: ModerationStatus
  listingStatus?: SummaryListingStatus
  verified?: boolean
  isVerify?: boolean
  expired?: boolean
  isDraft?: boolean
  vipType?: VipType
  categoryId?: number
  provinceId?: string
  districtId?: number
  wardId?: string
  userId?: string
  listingType?: ListingType
  productType?: ProductType
  /** Exact match on bedrooms count. Use {@link bedroomsRange} for a range. */
  bedrooms?: number
  /** Exact match on bathrooms count. Use {@link bathroomsRange} for a range. */
  bathrooms?: number
  /** Range filter "from..to" — either side optional. Example: "5000000..15000000". */
  price?: string
  /** Range filter "from..to" — m². Example: "30..60". */
  area?: string
  /** Range filter "from..to" — bedroom count. Example: "2..4". */
  bedroomsRange?: string
  /** Range filter "from..to" — bathroom count. Example: "1..3". */
  bathroomsRange?: string
  /** Range filter "from..to" — room capacity. Example: "2..6". */
  roomCapacity?: string
  /** Range filter "from..to" — discount %. Example: "10..50". */
  priceReductionPercent?: string
  /** Range filter "YYYY-MM-DD..YYYY-MM-DD". Server pads to start/end of day. */
  postDate?: string
  /** Range filter "YYYY-MM-DD..YYYY-MM-DD". */
  expiryDate?: string
}

// Status Change Request (old format - backward compatible)
export interface ListingStatusChangeRequest {
  verified?: boolean
  reason?: string
  // New moderation workflow fields
  decision?: ModerationDecision
  reasonText?: string
  ownerActionRequired?: boolean
  ownerActionDeadlineAt?: string // ISO 8601 datetime
}

// API Response wrapper
// API Response wrapper
import { ApiResponse } from '@/configs/axios/types'
export type { ApiResponse }
