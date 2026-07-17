import React from 'react'
import {
  Home,
  Building2,
  Briefcase,
  MapPin,
  AirVent,
  Refrigerator,
  WashingMachine,
  Shirt,
  Bed,
  Sofa,
  Wifi,
  ArrowUpDown,
  SquareParking,
  Square,
  Blinds,
  Bath,
  Cctv,
  Shield,
  Lock,
  Fingerprint,
  Tv,
  Waves,
  Dumbbell,
  Bus,
  Train,
  Plane,
  Hospital,
  GraduationCap,
  ShoppingCart,
  Circle,
} from 'lucide-react'
import {
  AdminListingSummary,
  ListingResponseWithAdmin,
  VipType,
  ListingFilterRequest,
  ProductType,
  ModerationStatus,
  SummaryListingStatus,
} from '@/api/types/listing.type'
import { PostStatus, UIPostData } from '@/types/posts.type'

export const getPropertyIcon = (type: string) => {
  const iconMap: Record<string, React.ReactElement> = {
    HOUSE: <Home className='h-4 w-4' />,
    APARTMENT: <Building2 className='h-4 w-4' />,
    OFFICE: <Briefcase className='h-4 w-4' />,
    LAND: <MapPin className='h-4 w-4' />,
    ROOM: <Building2 className='h-4 w-4' />,
  }
  return iconMap[type] || <Home className='h-4 w-4' />
}

// Amenity icon map mirrors smartrent-fe (AMENITIES_CONFIG / getAmenityIcon):
// same amenity `icon` codes → same lucide icons, so the admin review dialog
// shows the exact icon set users see on the listing detail page.
export const getAmenityIcon = (iconName: string) => {
  const iconMap: Record<string, React.ReactElement> = {
    // BASIC
    ac: <AirVent className='h-4 w-4' />,
    fridge: <Refrigerator className='h-4 w-4' />,
    'washing-machine': <WashingMachine className='h-4 w-4' />,
    wardrobe: <Shirt className='h-4 w-4' />,
    bed: <Bed className='h-4 w-4' />,
    'table-chair': <Sofa className='h-4 w-4' />,
    // CONVENIENCE
    wifi: <Wifi className='h-4 w-4' />,
    elevator: <ArrowUpDown className='h-4 w-4' />,
    parking: <SquareParking className='h-4 w-4' />,
    balcony: <Square className='h-4 w-4' />,
    window: <Blinds className='h-4 w-4' />,
    bathroom: <Bath className='h-4 w-4' />,
    // SECURITY
    'security-camera': <Cctv className='h-4 w-4' />,
    'security-guard': <Shield className='h-4 w-4' />,
    'magnetic-door': <Lock className='h-4 w-4' />,
    fingerprint: <Fingerprint className='h-4 w-4' />,
    // ENTERTAINMENT
    tv: <Tv className='h-4 w-4' />,
    'swimming-pool': <Waves className='h-4 w-4' />,
    gym: <Dumbbell className='h-4 w-4' />,
    tennis: <Dumbbell className='h-4 w-4' />,
    // TRANSPORT
    'bus-stop': <Bus className='h-4 w-4' />,
    'train-station': <Train className='h-4 w-4' />,
    airport: <Plane className='h-4 w-4' />,
    hospital: <Hospital className='h-4 w-4' />,
    school: <GraduationCap className='h-4 w-4' />,
    market: <ShoppingCart className='h-4 w-4' />,
  }
  return iconMap[iconName.toLowerCase().trim()] || <Circle className='h-4 w-4' />
}

export const formatPrice = (
  price: number | null | undefined,
  priceUnit: string | null | undefined,
): string => {
  const formatted = new Intl.NumberFormat('vi-VN').format(price ?? 0)
  const unitMap: Record<string, string> = {
    VND_PER_MONTH: 'đ/tháng',
    VND_PER_YEAR: 'đ/năm',
    VND_TOTAL: 'đ',
    MONTH: 'đ/tháng',
    YEAR: 'đ/năm',
    TOTAL: 'đ',
  }
  const unit = priceUnit ? unitMap[priceUnit] : undefined
  return `${formatted}${unit || 'đ'}`
}

export const formatDateTime = (
  isoString: string,
): { date: string; time: string } => {
  const date = new Date(isoString)
  return {
    date: date.toLocaleDateString('vi-VN'),
    time: date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
}

export const getStatusColor = (status: PostStatus): string => {
  const colors: Record<PostStatus, string> = {
    pending: 'border-warning/30 bg-warning/15 text-warning-foreground',
    resubmitted: 'border-sky-500/30 bg-sky-500/10 text-sky-700',
    approved: 'border-success/30 bg-success/12 text-success-foreground',
    rejected: 'border-destructive/30 bg-destructive/10 text-destructive',
    revision_required: 'border-orange-500/30 bg-orange-500/10 text-orange-700',
    suspended: 'border-destructive/30 bg-destructive/10 text-destructive',
    hidden: 'border-sky-500/30 bg-sky-500/10 text-sky-700',
    removed: 'border-destructive/30 bg-destructive/10 text-destructive',
    expired: 'border-border bg-muted text-foreground/70',
    pending_payment: 'border-purple-500/30 bg-purple-500/10 text-purple-700',
  }
  return colors[status] ?? colors.pending
}

export const mapUIFiltersToAPI = (
  uiFilters: Record<string, unknown>,
): Partial<ListingFilterRequest> => {
  const apiFilters: Partial<ListingFilterRequest> = {
    page: uiFilters.page ? Number(uiFilters.page) : 1,
    size: uiFilters.pageSize ? Number(uiFilters.pageSize) : 20,
    sortBy: 'NEWEST',
  }

  // Helpers to safely coerce FilterDialog values (always strings) to typed values
  const str = (key: string): string | undefined => {
    const value = uiFilters[key]
    if (value === undefined || value === null || value === '') return undefined
    return String(value)
  }
  const num = (key: string): number | undefined => {
    const value = str(key)
    if (value === undefined) return undefined
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  // Search keyword (new `keyword` id, backward compatible with legacy `search`)
  const keyword = str('keyword') ?? str('search')
  if (keyword) {
    apiFilters.keyword = keyword
  }

  // moderationStatus filter (primary moderation workflow field)
  // Also send the corresponding listingStatus — mirrors smartrent-fe's LISTING_STATUS_MODERATION_MAP pattern.
  // Every value is a real ModerationStatus now (REJECTED / SUSPENDED / REMOVED are
  // distinct), so the same status sent from here and from smartrent-fe hits the
  // same backend filter and returns the same rows.
  const moderationStatus = str('moderationStatus')
  if (moderationStatus) {
    apiFilters.moderationStatus = moderationStatus as ModerationStatus
    const moderationToListingStatus: Partial<
      Record<ModerationStatus, SummaryListingStatus>
    > = {
      PENDING_REVIEW: 'IN_REVIEW',
      RESUBMITTED: 'RESUBMITTED',
      APPROVED: 'DISPLAYING',
      REVISION_REQUIRED: 'REJECTED',
      SUSPENDED: 'REJECTED',
      REJECTED: 'REJECTED',
      REMOVED: 'REJECTED',
    }
    const mappedListingStatus =
      moderationToListingStatus[moderationStatus as ModerationStatus]
    if (mappedListingStatus) {
      apiFilters.listingStatus = mappedListingStatus
    }
  }
  // Legacy: Status mapping (backward compatible)
  else if (uiFilters.status) {
    switch (String(uiFilters.status)) {
      case 'pending':
        apiFilters.verified = false
        apiFilters.expired = false
        break
      case 'approved':
        apiFilters.verified = true
        apiFilters.expired = false
        break
      case 'rejected':
        apiFilters.verified = false
        apiFilters.expired = false
        break
      case 'expired':
        apiFilters.expired = true
        break
    }
  }

  // Property type (new `productType` id, backward compatible with `propertyInfo.type`)
  const productType = str('productType') ?? str('propertyInfo.type')
  if (productType) {
    apiFilters.productType = productType as ProductType
  }

  // Listing type mapping — UI sends new enum (RENT/SALE/SHARE); legacy values mapped too.
  const listingType = str('listingType')
  if (listingType) {
    const upper = listingType.toUpperCase()
    if (upper === 'RENT' || upper === 'FOR_RENT') {
      apiFilters.listingType = 'RENT'
    } else if (upper === 'SALE' || upper === 'FOR_SALE') {
      apiFilters.listingType = 'SALE'
    } else if (upper === 'SHARE') {
      apiFilters.listingType = 'SHARE'
    }
  }

  // Title-only search
  const title = str('title')
  if (title) {
    apiFilters.title = title
  }

  // Owner search (name or phone)
  const ownerSearch = str('ownerSearch')
  if (ownerSearch) {
    apiFilters.ownerSearch = ownerSearch
  }

  // Range filters — UI sends a "from..to" string; pass through if it contains content.
  const isValidRange = (value: string | undefined): value is string => {
    if (!value) return false
    if (value === '..') return false
    return value.includes('..') ? value.replace('..', '').length > 0 : true
  }
  const range = (key: string): string | undefined => {
    const value = str(key)
    return isValidRange(value) ? value : undefined
  }
  const priceRange = range('price')
  if (priceRange) apiFilters.price = priceRange
  const areaRange = range('area')
  if (areaRange) apiFilters.area = areaRange
  const bedroomsRange = range('bedroomsRange')
  if (bedroomsRange) apiFilters.bedroomsRange = bedroomsRange
  const bathroomsRange = range('bathroomsRange')
  if (bathroomsRange) apiFilters.bathroomsRange = bathroomsRange
  const roomCapacity = range('roomCapacity')
  if (roomCapacity) apiFilters.roomCapacity = roomCapacity
  const priceReductionPercent = range('priceReductionPercent')
  if (priceReductionPercent)
    apiFilters.priceReductionPercent = priceReductionPercent
  const postDate = range('postDate')
  if (postDate) apiFilters.postDate = postDate
  const expiryDate = range('expiryDate')
  if (expiryDate) apiFilters.expiryDate = expiryDate

  // VIP tier
  const vipType = str('vipType')
  if (vipType) {
    apiFilters.vipType = vipType as VipType
  }

  // Exact-match numeric fields (use *Range strings for range matching)
  const bedrooms = num('bedrooms')
  if (bedrooms !== undefined) {
    apiFilters.bedrooms = bedrooms
  }
  const bathrooms = num('bathrooms')
  if (bathrooms !== undefined) {
    apiFilters.bathrooms = bathrooms
  }
  const categoryId = num('categoryId')
  if (categoryId !== undefined) {
    apiFilters.categoryId = categoryId
  }

  return apiFilters
}

const deriveStatusFromVerification = (
  verificationStatus: string | null | undefined,
  expired: boolean | null | undefined,
): PostStatus => {
  if (expired) return 'expired'
  switch (verificationStatus) {
    case 'APPROVED':
      return 'approved'
    case 'REJECTED':
      return 'rejected'
    default:
      return 'pending'
  }
}

// Map a raw ModerationStatus straight to the UI PostStatus. Used by the detail
// modal (which carries moderationStatus but not the computed listingStatus) so
// its image badge matches the table — and, in turn, matches smartrent-fe, which
// labels the same statuses identically.
const MODERATION_TO_POST_STATUS: Partial<Record<ModerationStatus, PostStatus>> =
  {
    PENDING_REVIEW: 'pending',
    RESUBMITTED: 'resubmitted',
    APPROVED: 'approved',
    REVISION_REQUIRED: 'revision_required',
    REJECTED: 'rejected',
    SUSPENDED: 'hidden',
    REMOVED: 'removed',
  }

const deriveStatusFromListingStatus = (
  listingStatus: SummaryListingStatus | null | undefined,
  moderationStatus: ModerationStatus | null | undefined,
  verificationStatus: string | null | undefined,
  expired: boolean | null | undefined,
): PostStatus => {
  switch (listingStatus) {
    case 'EXPIRED':
      return 'expired'
    case 'IN_REVIEW':
      return 'pending'
    case 'RESUBMITTED':
      return 'resubmitted'
    case 'PENDING_PAYMENT':
      return 'pending_payment'
    case 'DISPLAYING':
    case 'EXPIRING_SOON':
    case 'VERIFIED':
      return 'approved'
    case 'REJECTED':
      // moderationStatus now carries the exact outcome — no owner-action lookup.
      if (moderationStatus === 'REVISION_REQUIRED') return 'revision_required'
      if (moderationStatus === 'SUSPENDED') return 'hidden'
      if (moderationStatus === 'REMOVED') return 'removed'
      return 'rejected'
    default:
      return deriveStatusFromVerification(verificationStatus, expired)
  }
}

const normalizeListingType = (
  type: string | null | undefined,
): 'for_rent' | 'for_sale' => {
  if (!type) return 'for_rent'
  const upper = type.toUpperCase()
  return upper === 'SALE' || upper === 'FOR_SALE' ? 'for_sale' : 'for_rent'
}

/** Map slim list row → table view model. Detail-only fields stay empty/undefined. */
export const mapSummaryToUI = (item: AdminListingSummary): UIPostData => {
  const { date, time } = item.postDate
    ? formatDateTime(item.postDate)
    : { date: '', time: '' }
  const { date: expiryDate } = item.expiryDate
    ? formatDateTime(item.expiryDate)
    : { date: '' }

  const firstName = item.user?.firstName?.trim() || ''
  const lastName = item.user?.lastName?.trim() || ''
  const fullName = [firstName, lastName].filter(Boolean).join(' ')

  return {
    id: item.listingId.toString(),
    title: item.title,
    postCode: `POST-${item.listingId}`,
    images:
      item.images && item.images.length > 0
        ? item.images
        : ['/images/no-image.png'],
    listingType: normalizeListingType(item.listingType),
    vipType: item.vipType || undefined,
    poster: {
      name: fullName || 'Unknown User',
      avatar: undefined,
      userId: '',
      phone: item.user?.contactPhoneNumber || '',
    },
    propertyInfo: {
      type: item.productType || '',
      area: item.area || 0,
      district: '',
      fullAddress: '',
    },
    price: formatPrice(item.price, item.priceUnit),
    priceRaw: item.price ?? 0,
    postedDate: date,
    postedTime: time,
    expiryDate,
    status: deriveStatusFromListingStatus(
      item.listingStatus,
      item.moderationStatus,
      item.adminVerification?.verificationStatus,
      item.expired,
    ),
    verified: item.verified ?? false,
    isVerify: false,
    rejectionReason: item.lastModerationReasonText || undefined,
    verificationNotes: undefined,
  }
}

/** Map full detail response → modal view model. */
export const mapDetailToUI = (item: ListingResponseWithAdmin): UIPostData => {
  const { date, time } = formatDateTime(item.postDate)
  const { date: expiryDate } = formatDateTime(item.expiryDate)

  return {
    id: item.listingId.toString(),
    title: item.title,
    postCode: `POST-${item.listingId}`,
    images:
      item.media && item.media.length > 0
        ? item.media.map((m) => m.url)
        : ['/images/no-image.png'],
    listingType: normalizeListingType(item.listingType),
    vipType: item.vipType || undefined,
    poster: {
      name: item.user
        ? `${item.user.firstName} ${item.user.lastName}`
        : 'Unknown User',
      avatar: undefined,
      userId: item.user?.userId || '',
      phone: item.user?.contactPhoneNumber || '',
      email: item.user?.email || undefined,
    },
    propertyInfo: {
      type: item.productType,
      area: item.area || 0,
      district:
        item.propertyInfo?.district || item.address?.legacyDistrictName || '',
      fullAddress:
        item.propertyInfo?.fullAddress || item.address?.fullAddress || '',
      fullNewAddress: item.address?.fullNewAddress || null,
    },
    price: formatPrice(item.price, item.priceUnit),
    priceRaw: item.price,
    postedDate: date,
    postedTime: time,
    expiryDate,
    status:
      (item.moderationStatus &&
        MODERATION_TO_POST_STATUS[item.moderationStatus]) ||
      deriveStatusFromVerification(
        item.adminVerification?.verificationStatus,
        item.expired,
      ),
    verified: item.verified,
    isVerify: item.isVerify,
    rejectionReason: item.adminVerification?.rejectionReason,
    verificationNotes: item.adminVerification?.verificationNotes,
    amenities: item.amenities,
    description: item.description,
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms,
    direction: item.direction,
    furnishing: item.furnishing,
    roomCapacity: item.roomCapacity,
    waterPrice: item.waterPrice,
    electricityPrice: item.electricityPrice,
    internetPrice: item.internetPrice,
    serviceFee: item.serviceFee,
  }
}
