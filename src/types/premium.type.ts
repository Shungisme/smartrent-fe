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

export type PremiumOverviewStats = {
  activeMemberships: string
  listingTypes: number
}
