export type MembershipStatus = 'active' | 'inactive'

export type MembershipPackage = {
  id: string
  name: string
  price: string
  features: string[]
  discount: number
  status: MembershipStatus
  revenue: string
  activeUsers: number
}

export type PromoStatus = 'active' | 'expired' | 'scheduled'
export type PromoType = 'percentage' | 'fixed_amount' | 'free_trial'
export type PromoTarget = 'all' | 'new_users' | 'premium' | 'basic'

export type PromotionalCode = {
  id: string
  code: string
  type: PromoType
  target: PromoTarget
  usage: { current: number; limit: number }
  discount: string
  validUntil: string
  status: PromoStatus
}

export type PricingTier = 'regular' | 'vip1' | 'vip2' | 'vip3'
export type DayPricing = { days: number; price: string }
export type ClickPricing = {
  basePrice: string
  minClicks: number
  maxClicks: number
}

export type ListingTypePricing = {
  tier: PricingTier
  name: string
  isActive: boolean
  dayPricing: DayPricing[]
  clickPricing: ClickPricing
  color: string
}

export type BoostPackage = {
  id: string
  name: string
  price: string
  boostsPerDay: number
  isActive: boolean
  description: string
}

export type PremiumOverviewStats = {
  activeMemberships: string
  activePromos: number
  totalPromoUsage: number
  listingTypes: number
  boostPackages: number
  totalBoostValue: string
}
