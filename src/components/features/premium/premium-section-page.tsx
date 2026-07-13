'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import {
  getMembershipPackages,
  updateMembershipPackage,
  deleteMembershipPackage,
} from '@/api/services/membership.service'
import { MembershipPackage as APIMembershipPackage } from '@/api/types/membership.type'
import { VIPTierService } from '@/api/services/vip-tier.service'
import { VIPTier } from '@/api/types/vip-tier.type'
import { MembershipPackage } from '@/types/premium.type'
import { MembershipTable } from '../../organisms/premium/MembershipTable'
import { ListingTypeTable } from '@/components/organisms/premium/ListingTypeTable'
import { EditMembershipDialog } from '@/components/organisms/premium/EditMembershipDialog'
import { DeleteMembershipDialog } from '@/components/organisms/premium/DeleteMembershipDialog'
import { ViewMembershipDialog } from '@/components/organisms/premium/ViewMembershipDialog'
import { useCanWrite } from '@/hooks/usePermissions'

export type PremiumSection = 'membership' | 'listing-types'

type PremiumSectionPageProps = {
  section: PremiumSection
}

const PremiumSectionPage: React.FC<PremiumSectionPageProps> = ({ section }) => {
  const t = useTranslations('premium')
  const canWrite = useCanWrite('premiumMembership')

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

  const [viewTarget, setViewTarget] = useState<APIMembershipPackage | null>(
    null,
  )
  const [editTarget, setEditTarget] = useState<APIMembershipPackage | null>(
    null,
  )
  const [editSaving, setEditSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<APIMembershipPackage | null>(
    null,
  )
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)

  const needsMemberships = section === 'membership'
  const needsVIPTiers = section === 'listing-types'

  const fetchMemberships = React.useCallback(async () => {
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
  }, [])

  useEffect(() => {
    if (!needsMemberships) {
      setMembershipsLoading(false)
      return
    }
    fetchMemberships()
  }, [needsMemberships, fetchMemberships])

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

  const monthUnit = t('membership.table.month')

  const transformedMemberships: MembershipPackage[] = apiMemberships.map(
    (pkg) => ({
      id: pkg.membershipId.toString(),
      name: pkg.packageName,
      price: `${pkg.salePrice.toLocaleString()}đ/${pkg.durationMonths} ${monthUnit}`,
      description: pkg.description,
      features: pkg.benefits.map((b) => b.benefitNameDisplay),
      discount: pkg.discountPercentage,
      status: pkg.isActive ? 'active' : 'inactive',
      revenue: '0đ',
    }),
  )

  const displayMemberships = transformedMemberships

  const findApiPackage = (id: string) =>
    apiMemberships.find((p) => p.membershipId.toString() === id) ?? null

  const handleView = (id: string) => {
    const pkg = findApiPackage(id)
    if (pkg) setViewTarget(pkg)
  }

  const handleEdit = (id: string) => {
    const pkg = findApiPackage(id)
    if (pkg) setEditTarget(pkg)
  }

  const handleDelete = (id: string) => {
    const pkg = findApiPackage(id)
    if (pkg) setDeleteTarget(pkg)
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const pkg = findApiPackage(id)
    if (!pkg) return
    try {
      const response = await updateMembershipPackage(pkg.membershipId, {
        packageName: pkg.packageName,
        salePrice: pkg.salePrice,
        discountPercentage: pkg.discountPercentage,
        isActive: currentStatus !== 'active',
      })
      if (response.success) {
        toast.success(t('membership.toasts.updateSuccess'))
        await fetchMemberships()
      } else {
        toast.error(response.message || t('membership.toasts.updateError'))
      }
    } catch (err) {
      console.error('Toggle status error:', err)
      toast.error(t('membership.toasts.updateError'))
    }
  }

  const handleEditSubmit = async (data: {
    packageName: string
    salePrice: number
    discountPercentage: number
    isActive: boolean
  }) => {
    if (!editTarget) return
    setEditSaving(true)
    try {
      const response = await updateMembershipPackage(
        editTarget.membershipId,
        data,
      )
      if (response.success) {
        toast.success(t('membership.toasts.updateSuccess'))
        setEditTarget(null)
        await fetchMemberships()
      } else {
        toast.error(response.message || t('membership.toasts.updateError'))
      }
    } catch (err) {
      console.error('Update membership error:', err)
      toast.error(t('membership.toasts.updateError'))
    } finally {
      setEditSaving(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteSubmitting(true)
    try {
      const response = await deleteMembershipPackage(deleteTarget.membershipId)
      if (response.success) {
        toast.success(t('membership.toasts.deleteSuccess'))
        setDeleteTarget(null)
        await fetchMemberships()
      } else {
        toast.error(response.message || t('membership.toasts.deleteError'))
      }
    } catch (err) {
      console.error('Delete membership error:', err)
      toast.error(t('membership.toasts.deleteError'))
    } finally {
      setDeleteSubmitting(false)
    }
  }

  return (
    <div className='space-y-6'>
      {section === 'membership' && (
        <>
          <MembershipTable
            memberships={displayMemberships}
            loading={membershipsLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            canWrite={canWrite}
          />
        </>
      )}

      {section === 'listing-types' && (
        <>
          <ListingTypeTable tiers={apiVIPTiers} loading={vipTiersLoading} />
        </>
      )}

      <ViewMembershipDialog
        open={!!viewTarget}
        pkg={viewTarget}
        onOpenChange={(open) => {
          if (!open) setViewTarget(null)
        }}
      />

      <EditMembershipDialog
        open={!!editTarget}
        pkg={editTarget}
        loading={editSaving}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null)
        }}
        onSubmit={handleEditSubmit}
      />

      <DeleteMembershipDialog
        open={!!deleteTarget}
        packageName={deleteTarget?.packageName}
        loading={deleteSubmitting}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

export default PremiumSectionPage
