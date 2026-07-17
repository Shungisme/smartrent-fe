import { Amenity } from '@/api/types/listing.type'

export type PostStatus =
  | 'pending'
  | 'resubmitted'
  | 'approved'
  | 'rejected'
  | 'revision_required'
  | 'suspended'
  | 'hidden'
  | 'removed'
  | 'expired'
  | 'pending_payment'

export type UIPostData = {
  id: string
  title: string
  postCode: string
  images: string[]
  listingType: 'for_sale' | 'for_rent'
  vipType?: string
  poster: {
    name: string
    avatar?: string
    userId: string
    phone: string
    email?: string
  }
  propertyInfo: {
    type: string
    area: number
    district: string
    fullAddress: string
    fullNewAddress?: string | null
  }
  price: string
  priceRaw: number
  postedDate: string
  postedTime: string
  expiryDate: string
  status: PostStatus
  verified: boolean
  isVerify: boolean
  rejectionReason?: string | null
  verificationNotes?: string | null
  amenities?: Amenity[]
  description?: string
  bedrooms?: number | null
  bathrooms?: number | null
  direction?: string | null
  furnishing?: string | null
  roomCapacity?: number | null
  waterPrice?: string | null
  electricityPrice?: string | null
  internetPrice?: string | null
  serviceFee?: string | null
}
