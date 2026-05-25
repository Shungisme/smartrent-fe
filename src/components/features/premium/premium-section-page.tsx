'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import AddMembershipModal, {
  type MembershipFormData,
} from '@/components/molecules/addMembershipModal'
import { Button } from '@/components/atoms/button'
import { getMembershipPackages } from '@/api/services/membership.service'
import { MembershipPackage as APIMembershipPackage } from '@/api/types/membership.type'
import { VIPTierService } from '@/api/services/vip-tier.service'
import { VIPTier } from '@/api/types/vip-tier.type'
import { MembershipPackage } from '@/types/premium.type'
import { PremiumStats } from '@/components/molecules/premium/PremiumStats'
import { MembershipTable } from '../../organisms/premium/MembershipTable'
import { ListingTypeTable } from '@/components/organisms/premium/ListingTypeTable'
import { PageHeader } from '@/components/molecules/pageHeader'

export type PremiumSection = 'overview' | 'membership' | 'listing-types'

type PremiumSectionPageProps = {
  section: PremiumSection
}

const PremiumSectionPage: React.FC<PremiumSectionPageProps> = ({ section }) => {
  const t = useTranslations('premium')

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

  const needsMemberships = section === 'overview' || section === 'membership'
  const needsVIPTiers = section === 'overview' || section === 'listing-types'

  useEffect(() => {
    if (!needsMemberships) {
      setMembershipsLoading(false)
      return
    }

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
  }, [needsMemberships])

  useEffect(() => {
    if (!needsVIPTiers) {
      setVIPTiersLoading(false)
      return
    }

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
  }, [needsVIPTiers])

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

  const displayMemberships = transformedMemberships

  const [membershipModalOpen, setMembershipModalOpen] = useState(false)

  const handleMembershipSubmit = (data: MembershipFormData) => {
    console.log('Creating membership package:', data)
  }

  const stats = {
    activeMemberships: `${displayMemberships.filter((m) => m.status === 'active').length}/${displayMemberships.length}`,
    listingTypes: apiVIPTiers.filter((t) => t.isActive).length,
  }

  return (
    <div className='space-y-6'>
      {section === 'overview' && (
        <>
          <PageHeader title={t('title')} description={t('description')} />
          <PremiumStats stats={stats} />
        </>
      )}

      {section === 'membership' && (
        <>
          <PageHeader
            title={t('title')}
            description={t('membership.description')}
            actions={
              <Button
                className='w-full sm:w-auto'
                onClick={() => setMembershipModalOpen(true)}
              >
                <Plus className='h-4 w-4' />
                {t('membership.addPackage')}
              </Button>
            }
          />

          <MembershipTable
            memberships={displayMemberships}
            loading={membershipsLoading}
            onEdit={(id: string) => console.log('Edit', id)}
            onDelete={(id: string) => console.log('Delete', id)}
            onToggleStatus={() => {}}
          />
        </>
      )}

      {section === 'listing-types' && (
        <>
          <PageHeader
            title={t('title')}
            description={t('listingTypes.description')}
          />
          <ListingTypeTable tiers={apiVIPTiers} loading={vipTiersLoading} />
        </>
      )}

      <AddMembershipModal
        open={membershipModalOpen}
        onOpenChange={setMembershipModalOpen}
        onSubmit={handleMembershipSubmit}
      />
    </div>
  )
}

export default PremiumSectionPage
