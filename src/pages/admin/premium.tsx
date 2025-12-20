import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import AdminLayout from '@/components/layouts/AdminLayout'
import Breadcrumb from '@/components/molecules/breadcrumb'
import AddMembershipModal, {
  type MembershipFormData,
} from '@/components/molecules/addMembershipModal'
import CreatePromoModal, {
  type PromoFormData,
} from '@/components/molecules/createPromoModal'
import EditPricingModal, {
  type PricingFormData,
} from '@/components/molecules/editPricingModal'
import AddBoostModal, {
  type BoostFormData,
} from '@/components/molecules/addBoostModal'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'
import { Card } from '@/components/atoms/card'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/atoms/tabs'
import { cn } from '@/lib/utils'
import { NextPageWithLayout } from '@/types/next-page'
import {
  Crown,
  Tag,
  Layers,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
  Zap,
} from 'lucide-react'
import { getMembershipPackages } from '@/api/services/membership.service'
import { MembershipPackage as APIMembershipPackage } from '@/api/types/membership.type'
import { VIPTierService } from '@/api/services/vip-tier.service'
import { VIPTier } from '@/api/types/vip-tier.type'

// Types
type MembershipStatus = 'active' | 'inactive'
type MembershipPackage = {
  id: string
  name: string
  price: string
  features: string[]
  discount: number
  status: MembershipStatus
  revenue: string
  activeUsers: number
}

type PromoStatus = 'active' | 'expired' | 'scheduled'
type PromoType = 'percentage' | 'fixed_amount' | 'free_trial'
type PromoTarget = 'all' | 'new_users' | 'premium' | 'basic'
type PromotionalCode = {
  id: string
  code: string
  type: PromoType
  target: PromoTarget
  usage: { current: number; limit: number }
  discount: string
  validUntil: string
  status: PromoStatus
}

type PricingTier = 'regular' | 'vip1' | 'vip2' | 'vip3'
type DayPricing = { days: number; price: string }
type ClickPricing = { basePrice: string; minClicks: number; maxClicks: number }
type ListingTypePricing = {
  tier: PricingTier
  name: string
  isActive: boolean
  dayPricing: DayPricing[]
  clickPricing: ClickPricing
  color: string
}

type BoostPackage = {
  id: string
  name: string
  price: string
  boostsPerDay: number
  isActive: boolean
  description: string
}

// Mock Data
const mockMemberships: MembershipPackage[] = [
  {
    id: 'M001',
    name: 'Basic',
    price: '99,000đ/month',
    features: ['Post up to 5 listings', 'Basic support', 'Standard visibility'],
    discount: 0,
    status: 'active',
    revenue: '4,950,000đ',
    activeUsers: 50,
  },
  {
    id: 'M002',
    name: 'Standard',
    price: '199,000đ/month',
    features: [
      'Post up to 20 listings',
      'Priority support',
      'Enhanced visibility',
      'Analytics dashboard',
      'Featured badge',
    ],
    discount: 10,
    status: 'active',
    revenue: '23,880,000đ',
    activeUsers: 120,
  },
  {
    id: 'M003',
    name: 'Premium',
    price: '399,000đ/month',
    features: [
      'Unlimited listings',
      '24/7 VIP support',
      'Maximum visibility',
      'Advanced analytics',
      'Premium badge',
      'Free boost credits',
      'Custom branding',
      'API access',
    ],
    discount: 15,
    status: 'active',
    revenue: '33,915,000đ',
    activeUsers: 85,
  },
]

const mockPromotions: PromotionalCode[] = [
  {
    id: 'P001',
    code: 'WELCOME2024',
    type: 'percentage',
    target: 'new_users',
    usage: { current: 45, limit: 100 },
    discount: '20%',
    validUntil: '31/12/2024',
    status: 'active',
  },
  {
    id: 'P002',
    code: 'PREMIUM50',
    type: 'fixed_amount',
    target: 'premium',
    usage: { current: 12, limit: 50 },
    discount: '50,000đ',
    validUntil: '30/06/2024',
    status: 'active',
  },
  {
    id: 'P003',
    code: 'NEWYEAR25',
    type: 'percentage',
    target: 'all',
    usage: { current: 150, limit: 200 },
    discount: '25%',
    validUntil: '15/01/2024',
    status: 'expired',
  },
  {
    id: 'P004',
    code: 'SPRING2024',
    type: 'free_trial',
    target: 'new_users',
    usage: { current: 30, limit: 100 },
    discount: '7 days free',
    validUntil: '30/03/2024',
    status: 'scheduled',
  },
]

const mockListingTypes: ListingTypePricing[] = [
  {
    tier: 'regular',
    name: 'Regular Listing',
    isActive: true,
    dayPricing: [
      { days: 1, price: '10,000đ' },
      { days: 10, price: '80,000đ' },
      { days: 15, price: '110,000đ' },
      { days: 30, price: '200,000đ' },
    ],
    clickPricing: { basePrice: '500đ', minClicks: 0, maxClicks: 1000 },
    color: 'bg-gray-100 text-gray-700',
  },
  {
    tier: 'vip1',
    name: 'VIP 1',
    isActive: true,
    dayPricing: [
      { days: 1, price: '20,000đ' },
      { days: 10, price: '180,000đ' },
      { days: 15, price: '250,000đ' },
      { days: 30, price: '450,000đ' },
    ],
    clickPricing: { basePrice: '800đ', minClicks: 0, maxClicks: 2000 },
    color: 'bg-blue-100 text-blue-700',
  },
  {
    tier: 'vip2',
    name: 'VIP 2',
    isActive: true,
    dayPricing: [
      { days: 1, price: '35,000đ' },
      { days: 10, price: '320,000đ' },
      { days: 15, price: '450,000đ' },
      { days: 30, price: '800,000đ' },
    ],
    clickPricing: { basePrice: '1,200đ', minClicks: 0, maxClicks: 5000 },
    color: 'bg-purple-100 text-purple-700',
  },
  {
    tier: 'vip3',
    name: 'VIP 3',
    isActive: true,
    dayPricing: [
      { days: 1, price: '50,000đ' },
      { days: 10, price: '450,000đ' },
      { days: 15, price: '650,000đ' },
      { days: 30, price: '1,200,000đ' },
    ],
    clickPricing: { basePrice: '1,500đ', minClicks: 0, maxClicks: 10000 },
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
  },
]

const mockBoostPackages: BoostPackage[] = [
  {
    id: 'B001',
    name: 'Standard Boost',
    price: '50,000đ',
    boostsPerDay: 3,
    isActive: true,
    description: 'Boost your listing 3 times per day',
  },
  {
    id: 'B002',
    name: 'Premium Boost',
    price: '150,000đ',
    boostsPerDay: 10,
    isActive: true,
    description: 'Boost your listing 10 times per day',
  },
  {
    id: 'B003',
    name: 'Super Boost',
    price: '300,000đ',
    boostsPerDay: 20,
    isActive: false,
    description: 'Boost your listing 20 times per day',
  },
]

// Helper functions
const getPromoStatusColor = (status: PromoStatus): string => {
  const colors: Record<PromoStatus, string> = {
    active: 'bg-green-100 text-green-800 border-green-200',
    expired: 'bg-red-100 text-red-800 border-red-200',
    scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  }
  return colors[status]
}

const PaidFeaturesManagement: NextPageWithLayout = () => {
  const t = useTranslations('premium')
  const [activeTab, setActiveTab] = useState('overview')

  // API state for membership packages
  const [apiMemberships, setApiMemberships] = useState<APIMembershipPackage[]>(
    [],
  )
  const [membershipsLoading, setMembershipsLoading] = useState(true)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [membershipsError, setMembershipsError] = useState<string | null>(null)

  // API state for VIP tiers
  const [apiVIPTiers, setApiVIPTiers] = useState<VIPTier[]>([])
  const [vipTiersLoading, setVIPTiersLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [vipTiersError, setVIPTiersError] = useState<string | null>(null)

  // Fetch membership packages from API
  useEffect(() => {
    const fetchMemberships = async () => {
      setMembershipsLoading(true)
      setMembershipsError(null)
      try {
        const response = await getMembershipPackages()
        if (response.success && response.data) {
          setApiMemberships(
            response.data.data as unknown as APIMembershipPackage[], // Fix later
          )
        } else {
          setMembershipsError(
            response.message || 'Failed to load membership packages',
          )
        }
      } catch (err: any) {
        setMembershipsError(err.message || 'An error occurred')
        console.error('Error fetching memberships:', err)
      } finally {
        setMembershipsLoading(false)
      }
    }

    fetchMemberships()
  }, [])

  // Fetch VIP tiers from API
  useEffect(() => {
    const fetchVIPTiers = async () => {
      setVIPTiersLoading(true)
      setVIPTiersError(null)
      try {
        const tiers = await VIPTierService.getAllVIPTiers()
        setApiVIPTiers(tiers)
      } catch (err: any) {
        setVIPTiersError(err.message || 'Failed to load VIP tiers')
        console.error('Error fetching VIP tiers:', err)
      } finally {
        setVIPTiersLoading(false)
      }
    }

    fetchVIPTiers()
  }, [])

  // Transform API memberships to UI format
  const transformedMemberships: MembershipPackage[] = apiMemberships.map(
    (pkg) => ({
      id: pkg.membershipId.toString(),
      name: pkg.packageName,
      price: `${pkg.salePrice.toLocaleString()}đ/${pkg.durationMonths}mo`,
      features: pkg.benefits.map(
        (b) => `${b.benefitNameDisplay} (${b.quantityPerMonth}/month)`,
      ),
      discount: pkg.discountPercentage,
      status: pkg.isActive ? 'active' : 'inactive',
      revenue: '0đ', // API doesn't provide revenue yet
      activeUsers: 0, // API doesn't provide user count yet
    }),
  )

  // Use API data if available, otherwise fallback to mock
  const displayMemberships =
    apiMemberships.length > 0 ? transformedMemberships : mockMemberships

  // Helper function to get tier color based on tier code
  const getTierColor = (tierCode: string): string => {
    const colors: Record<string, string> = {
      NORMAL: 'bg-gray-100 text-gray-700',
      SILVER: 'bg-blue-100 text-blue-700',
      GOLD: 'bg-purple-100 text-purple-700',
      DIAMOND: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
    }
    return colors[tierCode] || 'bg-gray-100 text-gray-700'
  }

  // Transform API VIP tiers to UI format
  const transformedVIPTiers: ListingTypePricing[] = apiVIPTiers.map((tier) => ({
    tier: tier.tierCode.toLowerCase() as PricingTier,
    name: tier.tierNameEn,
    isActive: tier.isActive,
    dayPricing: [
      { days: 1, price: `${tier.pricePerDay.toLocaleString()}đ` },
      { days: 10, price: `${tier.price10Days.toLocaleString()}đ` },
      { days: 15, price: `${tier.price15Days.toLocaleString()}đ` },
      { days: 30, price: `${tier.price30Days.toLocaleString()}đ` },
    ],
    clickPricing: {
      basePrice: '0đ', // API doesn't provide click pricing
      minClicks: 0,
      maxClicks: tier.maxImages * 1000, // Estimate based on max images
    },
    color: getTierColor(tier.tierCode),
  }))

  // Use API data if available, otherwise fallback to mock
  const displayListingTypes =
    apiVIPTiers.length > 0 ? transformedVIPTiers : mockListingTypes

  // Modal states
  const [membershipModalOpen, setMembershipModalOpen] = useState(false)
  const [promoModalOpen, setPromoModalOpen] = useState(false)
  const [pricingModalOpen, setPricingModalOpen] = useState(false)
  const [boostModalOpen, setBoostModalOpen] = useState(false)
  const [pricingInitialData, setPricingInitialData] = useState<
    PricingFormData | undefined
  >(undefined)

  // Submit handlers
  const handleMembershipSubmit = (data: MembershipFormData) => {
    console.log('Creating membership package:', data)
    // TODO: API call here
  }

  const handlePromoSubmit = (data: PromoFormData) => {
    console.log('Creating promotional code:', data)
    // TODO: API call here
  }

  const handlePricingSubmit = (data: PricingFormData) => {
    console.log('Updating pricing:', data)
    // TODO: API call here
  }

  const handleBoostSubmit = (data: BoostFormData) => {
    console.log('Creating boost package:', data)
    // TODO: API call here
  }

  const breadcrumbItems = [
    { label: 'Admin Dashboard', href: '/admin' },
    { label: t('breadcrumb.title') }, // Current page
  ]

  // Calculate overview stats
  const stats = {
    activeMemberships: `${displayMemberships.filter((m) => m.status === 'active').length}/${displayMemberships.length}`,
    activePromos: mockPromotions.filter((p) => p.status === 'active').length,
    totalPromoUsage: mockPromotions.reduce(
      (sum, p) => sum + p.usage.current,
      0,
    ),
    listingTypes: displayListingTypes.filter((l) => l.isActive).length,
    boostPackages: mockBoostPackages.filter((b) => b.isActive).length,
    totalBoostValue: mockBoostPackages
      .filter((b) => b.isActive)
      .reduce((sum, b) => sum + parseInt(b.price.replace(/[^\d]/g, '')), 0)
      .toLocaleString(),
  }

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />

      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-semibold text-gray-900'>{t('title')}</h1>
          <p className='mt-1 text-sm text-gray-500'>{t('description')}</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className='overflow-x-auto'>
            <TabsList className='inline-flex w-auto min-w-full'>
              <TabsTrigger value='overview' className='flex-shrink-0'>
                {t('tabs.overview')}
              </TabsTrigger>
              <TabsTrigger value='membership' className='flex-shrink-0'>
                {t('tabs.membership')}
              </TabsTrigger>
              <TabsTrigger value='promotions' className='flex-shrink-0'>
                {t('tabs.promotions')}
              </TabsTrigger>
              <TabsTrigger value='listing-types' className='flex-shrink-0'>
                {t('tabs.listingTypes')}
              </TabsTrigger>
              <TabsTrigger value='post-boosts' className='flex-shrink-0'>
                {t('tabs.postBoosts')}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: Overview */}
          <TabsContent value='overview' className='space-y-6'>
            {/* Stats Cards */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Card className='p-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <div className='text-sm text-gray-500'>
                      {t('overview.activeMemberships')}
                    </div>
                    <div className='mt-2 text-3xl font-bold text-gray-900'>
                      {stats.activeMemberships}
                    </div>
                    <div className='mt-1 text-xs text-gray-500'>
                      {t('overview.packagesRunning')}
                    </div>
                  </div>
                  <div className='rounded-lg bg-blue-100 p-3'>
                    <Crown className='h-6 w-6 text-blue-600' />
                  </div>
                </div>
              </Card>

              <Card className='p-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <div className='text-sm text-gray-500'>
                      {t('overview.activePromos')}
                    </div>
                    <div className='mt-2 text-3xl font-bold text-gray-900'>
                      {stats.activePromos}
                    </div>
                    <div className='mt-1 text-xs text-gray-500'>
                      {stats.totalPromoUsage} {t('overview.totalUses')}
                    </div>
                  </div>
                  <div className='rounded-lg bg-green-100 p-3'>
                    <Tag className='h-6 w-6 text-green-600' />
                  </div>
                </div>
              </Card>

              <Card className='p-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <div className='text-sm text-gray-500'>
                      {t('overview.listingTypes')}
                    </div>
                    <div className='mt-2 text-3xl font-bold text-gray-900'>
                      {stats.listingTypes}
                    </div>
                    <div className='mt-1 text-xs text-gray-500'>
                      {t('overview.regularVipTiers')}
                    </div>
                  </div>
                  <div className='rounded-lg bg-purple-100 p-3'>
                    <Layers className='h-6 w-6 text-purple-600' />
                  </div>
                </div>
              </Card>

              <Card className='p-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <div className='text-sm text-gray-500'>
                      {t('overview.boostPackages')}
                    </div>
                    <div className='mt-2 text-3xl font-bold text-gray-900'>
                      {stats.boostPackages}
                    </div>
                    <div className='mt-1 text-xs text-gray-500'>
                      {stats.totalBoostValue}đ {t('overview.value')}
                    </div>
                  </div>
                  <div className='rounded-lg bg-orange-100 p-3'>
                    <TrendingUp className='h-6 w-6 text-orange-600' />
                  </div>
                </div>
              </Card>
            </div>

            {/* Membership Package Revenue */}
            <Card className='p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                {t('overview.membershipRevenue')}
              </h3>
              {membershipsLoading ? (
                <div className='flex items-center justify-center py-8'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                  <span className='ml-3 text-gray-600'>
                    Loading packages...
                  </span>
                </div>
              ) : (
                <div className='space-y-3'>
                  {displayMemberships.map((pkg) => (
                    <div
                      key={pkg.id}
                      className='flex items-center justify-between rounded-lg border border-gray-100 p-4'
                    >
                      <div className='flex items-center gap-4'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100'>
                          <Crown className='h-6 w-6 text-blue-600' />
                        </div>
                        <div>
                          <div className='font-semibold text-gray-900'>
                            {pkg.name}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {pkg.price}
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center gap-8'>
                        <div className='text-right'>
                          <div className='text-sm text-gray-500'>
                            {t('overview.revenue')}
                          </div>
                          <div className='font-semibold text-gray-900'>
                            {pkg.revenue}
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className='text-sm text-gray-500'>
                            {t('overview.users')}
                          </div>
                          <div className='font-semibold text-gray-900'>
                            {pkg.activeUsers}
                          </div>
                        </div>
                        {pkg.discount > 0 && (
                          <Badge className='bg-green-100 text-green-800'>
                            {pkg.discount}% off
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Promotional Activity */}
            <Card className='p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                {t('overview.recentPromoActivity')}
              </h3>
              <div className='space-y-3'>
                {mockPromotions.slice(0, 3).map((promo) => (
                  <div
                    key={promo.id}
                    className='flex items-center justify-between rounded-lg border border-gray-100 p-4'
                  >
                    <div className='flex items-center gap-4'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100'>
                        <Tag className='h-6 w-6 text-purple-600' />
                      </div>
                      <div>
                        <div className='font-mono font-semibold text-gray-900'>
                          {promo.code}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {promo.discount}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-6'>
                      <div className='text-right'>
                        <div className='text-sm text-gray-500'>
                          {t('overview.usage')}
                        </div>
                        <div className='font-semibold text-gray-900'>
                          {promo.usage.current}/{promo.usage.limit}
                        </div>
                        <div className='text-xs text-gray-400'>
                          {Math.round(
                            (promo.usage.current / promo.usage.limit) * 100,
                          )}
                          %
                        </div>
                      </div>
                      <Badge
                        variant='outline'
                        className={cn(
                          'text-xs',
                          getPromoStatusColor(promo.status),
                        )}
                      >
                        {t(`promotions.statuses.${promo.status}`)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Tab 2: Membership */}
          <TabsContent value='membership' className='space-y-6'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
              <p className='text-sm text-gray-500'>
                {t('membership.description')}
              </p>
              <Button
                className='bg-blue-600 hover:bg-blue-700 w-full sm:w-auto'
                onClick={() => setMembershipModalOpen(true)}
              >
                <Plus className='h-4 w-4 mr-2' />
                {t('membership.addPackage')}
              </Button>
            </div>

            <Card className='overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full min-w-[800px]'>
                  <thead className='bg-gray-50 border-b border-gray-200'>
                    <tr>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                        {t('membership.table.package')}
                      </th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                        {t('membership.table.price')}
                      </th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                        {t('membership.table.features')}
                      </th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                        {t('membership.table.discount')}
                      </th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                        {t('membership.table.status')}
                      </th>
                      <th className='px-6 py-4 text-center text-sm font-semibold text-gray-700'>
                        {t('membership.table.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100'>
                    {membershipsLoading ? (
                      <tr>
                        <td colSpan={6} className='px-6 py-12 text-center'>
                          <div className='flex items-center justify-center'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                            <span className='ml-3 text-gray-600'>
                              Loading packages...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : displayMemberships.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className='px-6 py-12 text-center text-gray-500'
                        >
                          No membership packages found
                        </td>
                      </tr>
                    ) : (
                      displayMemberships.map((pkg) => (
                        <tr key={pkg.id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-3'>
                              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100'>
                                <Crown className='h-5 w-5 text-blue-600' />
                              </div>
                              <div>
                                <div className='font-semibold text-gray-900'>
                                  {pkg.name}
                                </div>
                                <div className='text-xs text-gray-500'>
                                  {pkg.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='font-semibold text-gray-900'>
                              {pkg.price}
                            </div>
                            <div className='text-xs text-gray-500'>
                              {pkg.activeUsers}{' '}
                              {t('membership.table.activeUsers')}
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex flex-wrap gap-1'>
                              {pkg.features.slice(0, 2).map((feature, idx) => (
                                <Badge
                                  key={idx}
                                  variant='outline'
                                  className='text-xs'
                                >
                                  {feature}
                                </Badge>
                              ))}
                              {pkg.features.length > 2 && (
                                <Badge variant='outline' className='text-xs'>
                                  {t('membership.table.moreFeatures', {
                                    count: pkg.features.length - 2,
                                  })}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            {pkg.discount > 0 ? (
                              <Badge className='bg-green-100 text-green-800'>
                                {pkg.discount}%
                              </Badge>
                            ) : (
                              <span className='text-sm text-gray-400'>
                                {t('membership.table.noDiscount')}
                              </span>
                            )}
                          </td>
                          <td className='px-6 py-4'>
                            <label className='relative inline-flex items-center cursor-pointer'>
                              <input
                                type='checkbox'
                                className='sr-only peer'
                                checked={pkg.status === 'active'}
                                readOnly
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex items-center justify-center gap-2'>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-8 w-8 p-0'
                              >
                                <Pencil className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50'
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Tab 3: Promotions */}
          <TabsContent value='promotions' className='space-y-6'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
              <p className='text-sm text-gray-500'>
                {t('promotions.description')}
              </p>
              <Button
                className='bg-green-600 hover:bg-green-700 w-full sm:w-auto'
                onClick={() => setPromoModalOpen(true)}
              >
                <Plus className='h-4 w-4 mr-2' />
                {t('promotions.createPromo')}
              </Button>
            </div>

            <Card className='overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full min-w-[900px]'>
                  <thead className='bg-gray-50 border-b border-gray-200'>
                    <tr>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                        {t('promotions.table.code')}
                      </th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                        {t('promotions.table.type')}
                      </th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                        {t('promotions.table.target')}
                      </th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                        {t('promotions.table.usage')}
                      </th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                        {t('promotions.table.validUntil')}
                      </th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                        {t('promotions.table.status')}
                      </th>
                      <th className='px-6 py-4 text-center text-sm font-semibold text-gray-700'>
                        {t('promotions.table.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100'>
                    {mockPromotions.map((promo) => (
                      <tr key={promo.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4'>
                          <div className='font-mono font-semibold text-gray-900'>
                            {promo.code}
                          </div>
                          <div className='text-sm font-medium text-blue-600'>
                            {promo.discount}
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <Badge variant='outline' className='text-xs'>
                            {t(`promotions.types.${promo.type}`)}
                          </Badge>
                        </td>
                        <td className='px-6 py-4'>
                          <span className='text-sm text-gray-700'>
                            {t(`promotions.targets.${promo.target}`)}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <div>
                            <div className='text-sm font-semibold text-gray-900'>
                              {promo.usage.current} / {promo.usage.limit}
                            </div>
                            <div className='mt-1 w-32 h-2 bg-gray-200 rounded-full overflow-hidden'>
                              <div
                                className='h-full bg-blue-600 rounded-full'
                                style={{
                                  width: `${(promo.usage.current / promo.usage.limit) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <span className='text-sm text-gray-700'>
                            {promo.validUntil}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <Badge
                            variant='outline'
                            className={cn(
                              'text-xs',
                              getPromoStatusColor(promo.status),
                            )}
                          >
                            {t(`promotions.statuses.${promo.status}`)}
                          </Badge>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex items-center justify-center gap-2'>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-8 w-8 p-0'
                            >
                              <Pencil className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Tab 4: Listing Types */}
          <TabsContent value='listing-types' className='space-y-6'>
            <p className='text-sm text-gray-500'>
              {t('listingTypes.description')}
            </p>

            {vipTiersLoading ? (
              <div className='flex justify-center py-12'>
                <div className='text-center'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
                  <p className='mt-4 text-sm text-gray-600'>
                    Loading VIP tiers...
                  </p>
                </div>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                {displayListingTypes.map((listingType) => (
                  <Card key={listingType.tier} className='p-6'>
                    <div className='flex items-start justify-between mb-4'>
                      <div>
                        <Badge
                          className={cn(
                            'text-sm font-medium',
                            listingType.color,
                          )}
                        >
                          {t(`listingTypes.tiers.${listingType.tier}`)}
                        </Badge>
                      </div>
                      <label className='relative inline-flex items-center cursor-pointer'>
                        <input
                          type='checkbox'
                          className='sr-only peer'
                          checked={listingType.isActive}
                          readOnly
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Day Pricing */}
                    <div className='mb-4'>
                      <h4 className='text-sm font-semibold text-gray-700 mb-3'>
                        {t('listingTypes.dayPricing')}
                      </h4>
                      <div className='grid grid-cols-2 gap-3'>
                        {listingType.dayPricing.map((pricing) => (
                          <div
                            key={pricing.days}
                            className='rounded-lg border border-gray-200 p-3'
                          >
                            <div className='text-xs text-gray-500'>
                              {pricing.days} {t('listingTypes.days')}
                            </div>
                            <div className='font-semibold text-gray-900'>
                              {pricing.price}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Click Pricing */}
                    <div className='mb-4'>
                      <h4 className='text-sm font-semibold text-gray-700 mb-3'>
                        {t('listingTypes.clickPricing')}
                      </h4>
                      <div className='rounded-lg border border-gray-200 p-3'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm text-gray-600'>
                            {t('listingTypes.basePrice')}
                          </span>
                          <span className='font-semibold text-gray-900'>
                            {listingType.clickPricing.basePrice}/
                            {t('listingTypes.perClick')}
                          </span>
                        </div>
                        <div className='mt-2 flex items-center justify-between'>
                          <span className='text-sm text-gray-600'>
                            {t('listingTypes.minClicks')} -{' '}
                            {t('listingTypes.maxClicks')}
                          </span>
                          <span className='text-sm text-gray-700'>
                            {listingType.clickPricing.minClicks} -{' '}
                            {listingType.clickPricing.maxClicks.toLocaleString()}{' '}
                            {t('listingTypes.clicks')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant='outline'
                      className='w-full'
                      onClick={() => {
                        const pricing1Day =
                          listingType.dayPricing.find((p) => p.days === 1)
                            ?.price || ''
                        const pricing10Days =
                          listingType.dayPricing.find((p) => p.days === 10)
                            ?.price || ''
                        const pricing15Days =
                          listingType.dayPricing.find((p) => p.days === 15)
                            ?.price || ''
                        const pricing30Days =
                          listingType.dayPricing.find((p) => p.days === 30)
                            ?.price || ''

                        setPricingInitialData({
                          listingType: listingType.name,
                          pricing1Day,
                          pricing10Days,
                          pricing15Days,
                          pricing30Days,
                          baseClickPrice: listingType.clickPricing.basePrice,
                          minClickPrice:
                            listingType.clickPricing.minClicks.toString(),
                          maxClickPrice:
                            listingType.clickPricing.maxClicks.toString(),
                        })
                        setPricingModalOpen(true)
                      }}
                    >
                      <Pencil className='h-4 w-4 mr-2' />
                      {t('listingTypes.editPricing')}
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab 5: Post Boosts */}
          <TabsContent value='post-boosts' className='space-y-6'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
              <p className='text-sm text-gray-500'>
                {t('postBoosts.description')}
              </p>
              <Button
                className='bg-orange-600 hover:bg-orange-700 w-full sm:w-auto'
                onClick={() => setBoostModalOpen(true)}
              >
                <Plus className='h-4 w-4 mr-2' />
                {t('postBoosts.addBoost')}
              </Button>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {mockBoostPackages.map((boost) => (
                <Card key={boost.id} className='p-6'>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100'>
                        <Zap className='h-6 w-6 text-orange-600' />
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900'>
                          {boost.name}
                        </h4>
                        <p className='text-xs text-gray-500'>{boost.id}</p>
                      </div>
                    </div>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        className='sr-only peer'
                        checked={boost.isActive}
                        readOnly
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  <div className='space-y-3'>
                    <div className='flex items-baseline gap-1'>
                      <span className='text-3xl font-bold text-gray-900'>
                        {boost.price}
                      </span>
                    </div>

                    <div className='rounded-lg bg-gray-50 p-3'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-600'>
                          {t('postBoosts.boostsPerDay')}
                        </span>
                        <span className='font-semibold text-gray-900'>
                          {boost.boostsPerDay}x
                        </span>
                      </div>
                    </div>

                    <p className='text-sm text-gray-600'>{boost.description}</p>

                    <div className='flex gap-2 pt-2'>
                      <Button variant='outline' className='flex-1'>
                        <Pencil className='h-4 w-4 mr-1' />
                        {t('postBoosts.edit')}
                      </Button>
                      <Button
                        variant='outline'
                        className='border-red-300 text-red-600 hover:bg-red-50'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal Components */}
        <AddMembershipModal
          open={membershipModalOpen}
          onOpenChange={setMembershipModalOpen}
          onSubmit={handleMembershipSubmit}
        />

        <CreatePromoModal
          open={promoModalOpen}
          onOpenChange={setPromoModalOpen}
          onSubmit={handlePromoSubmit}
        />

        <EditPricingModal
          open={pricingModalOpen}
          onOpenChange={setPricingModalOpen}
          onSubmit={handlePricingSubmit}
          initialData={pricingInitialData}
        />

        <AddBoostModal
          open={boostModalOpen}
          onOpenChange={setBoostModalOpen}
          onSubmit={handleBoostSubmit}
        />
      </div>
    </div>
  )
}

PaidFeaturesManagement.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout activeItem='premium'>{page}</AdminLayout>
}

export default PaidFeaturesManagement
