import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import AdminLayout from '@/components/layouts/AdminLayout'
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/atoms/tabs'
import { NextPageWithLayout } from '@/types/next-page'
import { Plus } from 'lucide-react'
import { getMembershipPackages } from '@/api/services/membership.service'
import { MembershipPackage as APIMembershipPackage } from '@/api/types/membership.type'
import { VIPTierService } from '@/api/services/vip-tier.service'
import { VIPTier } from '@/api/types/vip-tier.type'
import {
  MembershipPackage,
  PricingTier,
  ListingTypePricing,
} from '@/types/premium.type'
import { getTierColor } from '@/utils/premium.utils'
import {
  mockMemberships,
  mockPromotions,
  mockListingTypes,
  mockBoostPackages,
} from '@/data/premium.mock'
import { PremiumStats } from '@/components/molecules/premium/PremiumStats'
import { MembershipTable } from '@/components/organisms/premium/MembershipTable'
import { PromoTable } from '@/components/organisms/premium/PromoTable'
import { ListingTypePricingList } from '@/components/organisms/premium/ListingTypePricingList'
import { BoostPackageList } from '@/components/organisms/premium/BoostPackageList'

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
      } catch (err: unknown) {
        const error = err as { message?: string }
        setMembershipsError(error.message || 'An error occurred')
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
      } catch (err: unknown) {
        const error = err as { message?: string }
        setVIPTiersError(error.message || 'Failed to load VIP tiers')
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
      <div className='space-y-6'>
        {/* Header Section */}
        <div className='flex flex-col lg:flex-row items-start lg:items-start justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
              {t('title')}
            </h1>
            <p className='mt-1 text-sm text-gray-600'>{t('description')}</p>
          </div>
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
            <PremiumStats stats={stats} />
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

            <MembershipTable
              memberships={displayMemberships}
              loading={membershipsLoading}
              onEdit={(id) => console.log('Edit', id)}
              onDelete={(id) => console.log('Delete', id)}
              onToggleStatus={() => {}}
            />
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

            <PromoTable
              promotions={mockPromotions}
              onEdit={(id) => console.log('Edit', id)}
              onDelete={(id) => console.log('Delete', id)}
            />
          </TabsContent>

          {/* Tab 4: Listing Types */}
          <TabsContent value='listing-types' className='space-y-6'>
            <p className='text-sm text-gray-500'>
              {t('listingTypes.description')}
            </p>

            <ListingTypePricingList
              listingTypes={displayListingTypes}
              loading={vipTiersLoading}
              onEdit={(tier) => {
                const pricing1Day =
                  tier.dayPricing.find((p) => p.days === 1)?.price || ''
                const pricing10Days =
                  tier.dayPricing.find((p) => p.days === 10)?.price || ''
                const pricing15Days =
                  tier.dayPricing.find((p) => p.days === 15)?.price || ''
                const pricing30Days =
                  tier.dayPricing.find((p) => p.days === 30)?.price || ''

                setPricingInitialData({
                  listingType: tier.name,
                  pricing1Day,
                  pricing10Days,
                  pricing15Days,
                  pricing30Days,
                  baseClickPrice: tier.clickPricing.basePrice,
                  minClickPrice: tier.clickPricing.minClicks.toString(),
                  maxClickPrice: tier.clickPricing.maxClicks.toString(),
                })
                setPricingModalOpen(true)
              }}
            />
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

            <BoostPackageList
              boostPackages={mockBoostPackages}
              onEdit={(id) => console.log('Edit', id)}
              onDelete={(id) => console.log('Delete', id)}
            />
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
