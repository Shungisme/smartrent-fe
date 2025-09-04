export interface Property {
  id: string
  title: string
  description: string
  address: string
  city: string
  property_type: string
  bedrooms: number
  bathrooms: number
  price: number
  currency: string
  images?: string[]
  area?: number
  furnishing?: string
  amenities?: string[]
  verified?: boolean
  featured?: boolean
  views?: number
  virtual_tour?: string
  distance?: number
  ward?: string
  ward_id?: string
}

export interface PropertyCard {
  id: string
  title: string
  description: string
  address: string
  city: string
  property_type: string
  bedrooms: number
  bathrooms: number
  price: number
  currency: string
  images?: string[]
  area?: number
  furnishing?: string
  amenities?: string[]
  verified?: boolean
  featured?: boolean
  views?: number
  virtual_tour?: string
  distance?: number
}

export interface PropertyListResponse {
  data: Property[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PropertyFilters {
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  propertyType?: string
  city?: string
  amenities?: string[]
}
