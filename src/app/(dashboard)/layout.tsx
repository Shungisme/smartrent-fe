'use client'

import { usePathname } from 'next/navigation'
import AppAdminLayout from '@/components/layouts/AppAdminLayout'

const ACTIVE_MAP: Record<string, string> = {
  '/admins': 'admins',
  '/users': 'users',
  '/news': 'news',
  '/news-editor': 'news',
  '/analytics/overview': 'analyticsOverview',
  '/analytics/users': 'analyticsUsers',
  '/analytics/posts': 'analyticsPosts',
  '/analytics/revenue': 'analyticsRevenue',
  '/analytics/reports': 'analyticsReports',
  '/finance': 'financeOverview',
  '/posts': 'posts',
  '/premium/overview': 'premiumOverview',
  '/premium/membership': 'premiumMembership',
  '/premium/promotions': 'premiumPromotions',
  '/premium/listing-types': 'premiumListingTypes',
  '/premium/post-boosts': 'premiumPostBoosts',
  '/reports': 'reports',
  '/roles': 'roles',
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
