import React from 'react'
import {
  Home,
  Building2,
  Briefcase,
  MapPin,
  Refrigerator,
  ShirtIcon,
  Armchair,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Shield,
  Wind,
  ShowerHead,
  Tv,
  UtensilsCrossed,
  WashingMachine,
  Bed,
  Circle,
} from 'lucide-react'
import {
  AdminListingItem,
  VipType,
  ListingFilterRequest,
  ProductType,
  ModerationStatus,
} from '@/api/types/listing.type'
import { PostStatus, UIPostData } from '@/types/posts.type'

export const getVipLevel = (vipType: VipType): number | undefined => {
  const levels: Record<VipType, number | undefined> = {
    NORMAL: undefined,
    SILVER: 1,
    GOLD: 2,
    DIAMOND: 3,
  }
  return levels[vipType]
}

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

export const getAmenityIcon = (iconName: string) => {
  const iconMap: Record<string, React.ReactElement> = {
    fridge: <Refrigerator className='h-4 w-4' />,
    refrigerator: <Refrigerator className='h-4 w-4' />,
    wardrobe: <ShirtIcon className='h-4 w-4' />,
    'table-chair': <Armchair className='h-4 w-4' />,
    chair: <Armchair className='h-4 w-4' />,
    wifi: <Wifi className='h-4 w-4' />,
    parking: <Car className='h-4 w-4' />,
    pool: <Waves className='h-4 w-4' />,
    'swimming-pool': <Waves className='h-4 w-4' />,
    gym: <Dumbbell className='h-4 w-4' />,
    security: <Shield className='h-4 w-4' />,
    'air-conditioner': <Wind className='h-4 w-4' />,
    ac: <Wind className='h-4 w-4' />,
    'water-heater': <ShowerHead className='h-4 w-4' />,
    tv: <Tv className='h-4 w-4' />,
    television: <Tv className='h-4 w-4' />,
    kitchen: <UtensilsCrossed className='h-4 w-4' />,
    'washing-machine': <WashingMachine className='h-4 w-4' />,
    washer: <WashingMachine className='h-4 w-4' />,
    bed: <Bed className='h-4 w-4' />,
    bedroom: <Bed className='h-4 w-4' />,
  }
  return iconMap[iconName.toLowerCase()] || <Circle className='h-4 w-4' />
}

export const formatPrice = (price: number, priceUnit: string): string => {
  const formatted = new Intl.NumberFormat('vi-VN').format(price)
  const unitMap: Record<string, string> = {
    VND_PER_MONTH: 'đ/tháng',
    VND_PER_YEAR: 'đ/năm',
    VND_TOTAL: 'đ',
  }
  return `${formatted}${unitMap[priceUnit] || 'đ'}`
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
  const colors = {
    pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    approved: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    expired: 'bg-gray-50 text-gray-700 border-gray-200',
  }
  return colors[status]
}

export const mapUIFiltersToAPI = (
  uiFilters: Record<string, unknown>,
): Partial<ListingFilterRequest> => {
  const apiFilters: Partial<ListingFilterRequest> = {
    page: uiFilters.page ? Number(uiFilters.page) - 1 : 0,
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
  const bool = (key: string): boolean | undefined => {
    const value = str(key)
    if (value === 'true') return true
    if (value === 'false') return false
    return undefined
  }

  // Search keyword (new `keyword` id, backward compatible with legacy `search`)
  const keyword = str('keyword') ?? str('search')
  if (keyword) {
    apiFilters.keyword = keyword
  }

  // moderationStatus filter (primary moderation workflow field)
  const moderationStatus = str('moderationStatus')
  if (moderationStatus) {
    apiFilters.moderationStatus = moderationStatus as ModerationStatus
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

  // Listing type mapping (accepts UI `for_rent`/`for_sale` or API `FOR_RENT`/`FOR_SALE`)
  const listingType = str('listingType')
  if (listingType) {
    apiFilters.listingType =
      listingType === 'for_rent' || listingType === 'FOR_RENT'
        ? 'FOR_RENT'
        : 'FOR_SALE'
  }

  // VIP tier
  const vipType = str('vipType')
  if (vipType) {
    apiFilters.vipType = vipType as VipType
  }

  // Owner
  const userId = str('userId')
  if (userId) {
    apiFilters.userId = userId
  }

  // Boolean flags
  const verified = bool('verified')
  if (verified !== undefined) {
    apiFilters.verified = verified
  }
  const isVerify = bool('isVerify')
  if (isVerify !== undefined) {
    apiFilters.isVerify = isVerify
  }
  const expired = bool('expired')
  if (expired !== undefined) {
    apiFilters.expired = expired
  }

  // Numeric range filters
  const minPrice = num('minPrice')
  if (minPrice !== undefined) {
    apiFilters.minPrice = minPrice
  }
  const maxPrice = num('maxPrice')
  if (maxPrice !== undefined) {
    apiFilters.maxPrice = maxPrice
  }
  const minArea = num('minArea')
  if (minArea !== undefined) {
    apiFilters.minArea = minArea
  }
  const maxArea = num('maxArea')
  if (maxArea !== undefined) {
    apiFilters.maxArea = maxArea
  }
  const minBedrooms = num('minBedrooms')
  if (minBedrooms !== undefined) {
    apiFilters.minBedrooms = minBedrooms
  }
  const maxBedrooms = num('maxBedrooms')
  if (maxBedrooms !== undefined) {
    apiFilters.maxBedrooms = maxBedrooms
  }
  const categoryId = num('categoryId')
  if (categoryId !== undefined) {
    apiFilters.categoryId = categoryId
  }

  return apiFilters
}

export const mapApiDataToUI = (item: AdminListingItem): UIPostData => {
  const { date, time } = formatDateTime(item.postDate)
  const { date: expiryDate } = formatDateTime(item.expiryDate)

  // Determine status from adminVerification.verificationStatus
  let status: PostStatus = 'pending'
  if (item.expired) {
    status = 'expired'
  } else if (item.adminVerification?.verificationStatus) {
    const verificationStatus = item.adminVerification.verificationStatus
    switch (verificationStatus) {
      case 'APPROVED':
        status = 'approved'
        break
      case 'REJECTED':
        status = 'rejected'
        break
      case 'PENDING':
      default:
        status = 'pending'
        break
    }
  } else {
    status = 'pending'
  }

  return {
    id: item.listingId.toString(),
    title: item.title,
    postCode: `POST-${item.listingId}`,
    images:
      item.media && item.media.length > 0
        ? item.media.map((m) => m.url)
        : ['/images/no-image.png'],
    listingType: item.listingType === 'FOR_RENT' ? 'for_rent' : 'for_sale',
    vipLevel: getVipLevel(item.vipType),
    poster: {
      name: item.user
        ? `${item.user.firstName} ${item.user.lastName}`
        : 'Unknown User',
      avatar: item.user?.avatarUrl || undefined,
      userId: item.user?.userId || item.userId,
      phone: item.user?.contactPhoneNumber || '',
    },
    propertyInfo: {
      type: item.productType,
      area: item.area || 0,
      district: item.address?.legacyDistrictName || 'N/A',
      fullAddress: item.address?.fullAddress || 'N/A',
    },
    price: formatPrice(item.price, item.priceUnit),
    priceRaw: item.price,
    postedDate: date,
    postedTime: time,
    expiryDate: expiryDate,
    status,
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
  }
}
