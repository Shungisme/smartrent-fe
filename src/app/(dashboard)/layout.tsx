'use client'

import { usePathname } from 'next/navigation'
import AppAdminLayout from '@/components/layouts/AppAdminLayout'

const ACTIVE_MAP: Record<string, string> = {
  '/admins': 'admin',
  '/users': 'users',
  '/news': 'news',
  '/news-editor': 'news',
  '/analytics': 'analytics',
  '/finance': 'finance',
  '/posts': 'posts',
  '/premium': 'premium',
  '/reports': 'reports',
  '/roles': 'roles',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname() ?? ''
  const activeItem = ACTIVE_MAP[pathname] ?? 'users'

  return <AppAdminLayout activeItem={activeItem}>{children}</AppAdminLayout>
}
