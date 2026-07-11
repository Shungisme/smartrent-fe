export type MembershipStatus = 'active' | 'inactive'

export type MembershipPackage = {
  id: string
  name: string
  price: string
  description: string
  features: string[]
  discount: number
  status: MembershipStatus
  revenue: string
}

export type PremiumOverviewStats = {
  activeMemberships: string
  listingTypes: number
}
