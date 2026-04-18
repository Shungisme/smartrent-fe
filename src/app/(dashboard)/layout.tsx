'use client'

import { usePathname } from 'next/navigation'
import AppAdminLayout from '@/components/layouts/AppAdminLayout'

const ACTIVE_MAP: Record<string, string> = {
  '/management/admins': 'admins',
  '/management/users': 'users',
  '/management/roles': 'roles',
  '/content/news': 'news',
  '/content/news-editor': 'news',
  '/content/posts': 'posts',
  '/insights/overview': 'analyticsOverview',
  '/insights/users': 'analyticsUsers',
  '/insights/posts': 'analyticsPosts',
  '/insights/revenue': 'analyticsRevenue',
  '/insights/reports': 'analyticsReports',
  '/monetization/overview': 'premiumOverview',
  '/monetization/membership': 'premiumMembership',
  '/monetization/promotions': 'premiumPromotions',
  '/monetization/listing-types': 'premiumListingTypes',
  '/monetization/post-boosts': 'premiumPostBoosts',
  '/moderation/broker-pending': 'brokerPending',
  '/moderation/reports': 'reports',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname() ?? ''
  const activeItem =
    Object.entries(ACTIVE_MAP)
      .sort(([a], [b]) => b.length - a.length)
      .find(
        ([route]) => pathname === route || pathname.startsWith(`${route}/`),
      )?.[1] ?? ''

  return <AppAdminLayout activeItem={activeItem}>{children}</AppAdminLayout>
}
