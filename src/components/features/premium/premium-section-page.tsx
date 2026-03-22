'use client'

import React, { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
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
import { MembershipTable } from '../../organisms/premium/MembershipTable'
import { PromoTable } from '../../organisms/premium/PromoTable'
import { ListingTypePricingList } from '@/components/organisms/premium/ListingTypePricingList'
import { BoostPackageList } from '@/components/organisms/premium/BoostPackageList'

export type PremiumSection =
  | 'overview'
  | 'membership'
  | 'promotions'
  | 'listing-types'
  | 'post-boosts'

type PremiumSectionPageProps = {
  section: PremiumSection
}

const PremiumSectionPage: React.FC<PremiumSectionPageProps> = ({ section }) => {
  const t = useTranslations('premium')
  const locale = useLocale()

  const [apiMemberships, setApiMemberships] = useState<APIMembershipPackage[]>(
    [],
  )
  const [membershipsLoading, setMembershipsLoading] = useState(true)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [membershipsError, setMembershipsError] = useState<string | null>(null)

  const [apiVIPTiers, setApiVIPTiers] = useState<VIPTier[]>([])
  const [vipTiersLoading, setVIPTiersLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [vipTiersError, setVIPTiersError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMemberships = async () => {
      setMembershipsLoading(true)
      setMembershipsError(null)
      try {
        const response = await getMembershipPackages()
        if (response.success && response.data) {
          setApiMemberships(
            response.data.data as unknown as APIMembershipPackage[],
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
      revenue: '0đ',
      activeUsers: 0,
    }),
  )

  const displayMemberships =
    apiMemberships.length > 0 ? transformedMemberships : mockMemberships

  const transformedVIPTiers: ListingTypePricing[] = apiVIPTiers.map((tier) => ({
    tier: tier.tierCode.toLowerCase() as PricingTier,
    name: locale === 'vi' ? tier.tierName : tier.tierNameEn,
    isActive: tier.isActive,
    dayPricing: [
      { days: 1, price: `${tier.pricePerDay.toLocaleString()}đ` },
      { days: 10, price: `${tier.price10Days.toLocaleString()}đ` },
      { days: 15, price: `${tier.price15Days.toLocaleString()}đ` },
      { days: 30, price: `${tier.price30Days.toLocaleString()}đ` },
    ],
    clickPricing: {
      basePrice: '0đ',
      minClicks: 0,
      maxClicks: tier.maxImages * 1000,
    },
    color: getTierColor(tier.tierCode),
  }))

  const displayListingTypes =
    apiVIPTiers.length > 0 ? transformedVIPTiers : mockListingTypes

  const [membershipModalOpen, setMembershipModalOpen] = useState(false)
  const [promoModalOpen, setPromoModalOpen] = useState(false)
  const [pricingModalOpen, setPricingModalOpen] = useState(false)
  const [boostModalOpen, setBoostModalOpen] = useState(false)
  const [pricingInitialData, setPricingInitialData] = useState<
    PricingFormData | undefined
  >(undefined)

  const handleMembershipSubmit = (data: MembershipFormData) => {
    console.log('Creating membership package:', data)
  }

  const handlePromoSubmit = (data: PromoFormData) => {
    console.log('Creating promotional code:', data)
  }

  const handlePricingSubmit = (data: PricingFormData) => {
    console.log('Updating pricing:', data)
  }

  const handleBoostSubmit = (data: BoostFormData) => {
    console.log('Creating boost package:', data)
  }

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
    <div className='space-y-6'>
      {section === 'overview' && <PremiumStats stats={stats} />}

      {section === 'membership' && (
        <>
          <div className='flex justify-stretch sm:justify-end'>
            <Button
              className='w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto'
              onClick={() => setMembershipModalOpen(true)}
            >
              <Plus className='h-4 w-4' />
              {t('membership.addPackage')}
            </Button>
          </div>

          <MembershipTable
            memberships={displayMemberships}
            loading={membershipsLoading}
            onEdit={(id: string) => console.log('Edit', id)}
            onDelete={(id: string) => console.log('Delete', id)}
            onToggleStatus={() => {}}
          />
        </>
      )}

      {section === 'promotions' && (
        <>
          <div className='flex justify-stretch sm:justify-end'>
            <Button
              className='w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto'
              onClick={() => setPromoModalOpen(true)}
            >
              <Plus className='h-4 w-4' />
              {t('promotions.createPromo')}
            </Button>
          </div>

          <PromoTable
            promotions={mockPromotions}
            onEdit={(id: string) => console.log('Edit', id)}
            onDelete={(id: string) => console.log('Delete', id)}
          />
        </>
      )}

      {section === 'listing-types' && (
        <>
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
        </>
      )}

      {section === 'post-boosts' && (
        <>
          <div className='flex justify-stretch sm:justify-end'>
            <Button
              className='w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto'
              onClick={() => setBoostModalOpen(true)}
            >
              <Plus className='h-4 w-4' />
              {t('postBoosts.addBoost')}
            </Button>
          </div>

          <BoostPackageList
            boostPackages={mockBoostPackages}
            onEdit={(id) => console.log('Edit', id)}
            onDelete={(id) => console.log('Delete', id)}
          />
        </>
      )}

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
  )
}

export default PremiumSectionPage
