/**
 * Membership Type Definitions
 * Types for membership package and subscription management
 */

// Benefit type in membership package
export interface MembershipBenefit {
  benefitId: number
  benefitType: string
  benefitNameDisplay: string
  quantityPerMonth: number
  createdAt: string
}

// Membership package response
export interface MembershipPackage {
  membershipId: number
  packageCode: string
  packageName: string
  packageLevel: string
  durationMonths: number
  originalPrice: number
  salePrice: number
  discountPercentage: number
  isActive: boolean
  description: string
  benefits: MembershipBenefit[]
  createdAt: string
  updatedAt: string
}

// User benefit with usage tracking
export interface UserBenefit {
  userBenefitId: number
  benefitType: string
  benefitNameDisplay: string
  grantedAt: string
  expiresAt: string
  totalQuantity: number
  quantityUsed: number
  quantityRemaining: number
  status: string
  createdAt: string
  updatedAt: string
}

// User membership (active or historical)
export interface UserMembership {
  userMembershipId: number
  userId: string
  membershipId: number
  packageName: string
  packageLevel: string
  startDate: string
  endDate: string
  durationDays: number
  daysRemaining: number
  status: string
  totalPaid: number
  benefits: UserBenefit[]
  createdAt: string
  updatedAt: string
}

// Payment provider enum
export type PaymentProvider = 'VNPAY' | 'MOMO' | 'STRIPE'

// Request body for initiating purchase
export interface InitiatePurchaseRequest {
  membershipId: number
  paymentProvider: PaymentProvider
}

// Response from initiate purchase
export interface PaymentInitiationResponse {
  paymentUrl: string
  transactionRef: string
  amount: number
  provider: PaymentProvider
}

// Type aliases for clearer API responses
export type MembershipPackageList = MembershipPackage[]
export type MembershipHistoryList = UserMembership[]
