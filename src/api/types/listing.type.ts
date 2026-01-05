// Listing Types for Admin Portal

export type ListingType = 'FOR_RENT' | 'FOR_SALE'
export type VipType = 'NORMAL' | 'SILVER' | 'GOLD' | 'DIAMOND'
export type ListingStatus =
  | 'ACTIVE'
  | 'PENDING'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'DRAFT'
  | 'SHADOW'
export type ProductType =
  | 'APARTMENT'
  | 'HOUSE'
  | 'OFFICE'
  | 'LAND'
  | 'ROOM'
  | 'OTHER'
export type PriceUnit = 'VND_PER_MONTH' | 'VND_PER_YEAR' | 'VND_TOTAL'
export type PostSource =
  | 'DIRECT_PAYMENT'
  | 'MEMBERSHIP_QUOTA'
  | 'CREATE_LISTING_QUOTA'
export type MediaType = 'IMAGE' | 'VIDEO'
export type AddressType = 'OLD' | 'NEW'

// Admin Verification Info
export interface AdminVerification {
  adminId: string
  adminName: string
  adminEmail: string
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
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
  category: Category
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
  amenities: Amenity[]
  address: ListingAddress
  media: ListingMedia[]
  postDate: string
  expiryDate: string
  verified: boolean
  isVerify: boolean
  expired: boolean
  isDraft: boolean
  vipType: VipType
  postSource: PostSource
  transactionId: string | null
  isShadow: boolean
  parentListingId: number | null
  paymentInfo: PaymentInfo | null
  statistics: ListingStatistics
  verificationNotes: string | null
  rejectionReason: string | null
  createdAt: string
  updatedAt: string
  adminVerification: AdminVerification
}

// Admin Listing List Item (lighter version for list view)
export interface AdminListingItem {
  listingId: number
  title: string
  description: string
  userId: string
  verified: boolean
  isVerify: boolean
  vipType: VipType
  listingType: ListingType
  productType: ProductType
  price: number
  priceUnit: PriceUnit
  addressId: number
  area: number
  bedrooms: number | null
  bathrooms: number | null
  direction: string | null
  furnishing: string | null
  address?: {
    fullAddress: string
    legacyProvinceName?: string
    legacyDistrictName?: string
  }
  media: ListingMedia[] | null
  amenities: Amenity[]
  postDate: string
  expiryDate: string
  expired: boolean
  isDraft: boolean
  adminVerification: AdminVerification | null
  user?: {
    userId: string
    firstName: string
    lastName: string
    email: string
    contactPhoneNumber: string
    avatarUrl?: string | null
  }
}

// Statistics for Admin Dashboard
export interface ListingStatisticsSummary {
  pendingVerification: number
  verified: number
  expired: number
  drafts: number
  shadows: number
  normalListings: number
  silverListings: number
  goldListings: number
  diamondListings: number
}

// Admin Listing List Response
export interface AdminListingListResponse {
  listings: AdminListingItem[]
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
  keyword?: string // Search in title and description
  listingStatus?: ListingStatus
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
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  minBedrooms?: number
  maxBedrooms?: number
}

// Status Change Request
export interface ListingStatusChangeRequest {
  verified: boolean
  reason?: string
}

// API Response wrapper
export interface ApiResponse<T> {
  code: string
  message: string | null
  data: T
}
