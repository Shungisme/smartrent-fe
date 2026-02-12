import { Amenity } from '@/api/types/listing.type'

export type PostStatus = 'pending' | 'approved' | 'rejected' | 'expired'

export type UIPostData = {
  id: string
  title: string
  postCode: string
  images: string[]
  listingType: 'for_sale' | 'for_rent'
  vipLevel?: number
  poster: {
    name: string
    avatar?: string
    userId: string
    phone: string
  }
  propertyInfo: {
    type: string
    area: number
    district: string
    fullAddress: string
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
}
