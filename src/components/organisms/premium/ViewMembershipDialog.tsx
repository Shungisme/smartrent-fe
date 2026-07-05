'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { MembershipPackage } from '@/api/types/membership.type'
import { formatCurrency, formatDateTime } from '@/utils/format'
import { TIER_STYLES, FALLBACK_TIER_STYLE } from '@/utils/premium.utils'

interface ViewMembershipDialogProps {
  open: boolean
  pkg: MembershipPackage | null
  onOpenChange: (open: boolean) => void
}

export const ViewMembershipDialog: React.FC<ViewMembershipDialogProps> = ({
  open,
  pkg,
  onOpenChange,
}) => {
  const t = useTranslations('premium.membership.view')
  const tLevels = useTranslations('premium.membership.levels')
  const tTiers = useTranslations('premium.listingTypes.tiers')

  if (!pkg) return null

  const levelLabel = (() => {
    try {
      return tLevels(pkg.packageLevel.toUpperCase())
    } catch {
      return pkg.packageLevel
    }
  })()

  const tierLabel = (code: string) => {
    try {
      return tTiers(code.toLowerCase())
    } catch {
      return code
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[min(92vw,36rem)] max-h-[85vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{pkg.packageName}</DialogTitle>
          <p className='text-xs text-muted-foreground'>{pkg.packageCode}</p>
        </DialogHeader>

        <div className='space-y-5'>
          <div className='grid grid-cols-2 gap-4 rounded-xl border border-border/70 bg-muted/30 p-4 sm:grid-cols-3'>
            <div>
              <div className='text-xs text-muted-foreground'>
                {t('fields.originalPrice')}
              </div>
              <div className='text-sm font-medium text-muted-foreground line-through'>
                {formatCurrency(pkg.originalPrice)}
              </div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground'>
                {t('fields.salePrice')}
              </div>
              <div className='text-sm font-semibold text-foreground'>
                {formatCurrency(pkg.salePrice)}
              </div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground'>
                {t('fields.discount')}
              </div>
              <div className='text-sm font-medium text-foreground'>
                {pkg.discountPercentage > 0 ? (
                  <Badge variant='success'>-{pkg.discountPercentage}%</Badge>
                ) : (
                  <span className='text-muted-foreground'>—</span>
                )}
              </div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground'>
                {t('fields.duration')}
              </div>
              <div className='text-sm font-medium text-foreground'>
                {pkg.durationMonths} {t('unit.month')}
              </div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground'>
                {t('fields.level')}
              </div>
              <div className='text-sm font-medium text-foreground'>
                {levelLabel}
              </div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground'>
                {t('fields.status')}
              </div>
              <div>
                {pkg.isActive ? (
                  <Badge variant='success'>{t('status.active')}</Badge>
                ) : (
                  <Badge variant='secondary'>{t('status.inactive')}</Badge>
                )}
              </div>
            </div>
          </div>

          {pkg.description && (
            <div>
              <div className='mb-1 text-xs font-medium text-muted-foreground'>
                {t('fields.description')}
              </div>
              <p className='text-sm text-foreground'>{pkg.description}</p>
            </div>
          )}

          <div>
            <div className='mb-2 text-xs font-medium text-muted-foreground'>
              {t('benefits.title')}
            </div>
            {pkg.benefits.length === 0 ? (
              <p className='text-sm text-muted-foreground/70'>
                {t('benefits.empty')}
              </p>
            ) : (
              <div className='space-y-2'>
                {pkg.benefits.map((benefit) => {
                  const style = benefit.vipTierCode
                    ? TIER_STYLES[benefit.vipTierCode] || FALLBACK_TIER_STYLE
                    : null
                  return (
                    <div
                      key={benefit.benefitId}
                      className='flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-card px-3 py-2'
                    >
                      <div className='min-w-0'>
                        <div className='truncate text-sm font-medium text-foreground'>
                          {benefit.benefitNameDisplay}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {benefit.quantityPerMonth} / {t('unit.month')}
                          {benefit.vipTierCode &&
                          (benefit.maxImages || benefit.maxVideos)
                            ? ` · ${t('benefits.mediaLimit', {
                                images: benefit.maxImages ?? 0,
                                videos: benefit.maxVideos ?? 0,
                              })}`
                            : ''}
                        </div>
                      </div>
                      {benefit.vipTierCode && (
                        <Badge variant='outline' className={style?.badge}>
                          {tierLabel(benefit.vipTierCode)}
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4 text-xs text-muted-foreground'>
            <div>
              {t('createdAt')}: {formatDateTime(pkg.createdAt)}
            </div>
            <div>
              {t('updatedAt')}: {formatDateTime(pkg.updatedAt)}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {t('close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ViewMembershipDialog
