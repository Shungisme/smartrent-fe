'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import AdminSidebar from '@/components/organisms/adminSidebar'
import AdminHeader from '@/components/organisms/adminHeader'
import { useAuth, useAuthGuard } from '@/hooks/useAuth'
import { useSwitchLanguage } from '@/contexts/switchLanguage/index.context'
import { Skeleton } from '@/components/atoms/skeleton'
import Breadcrumb from '@/components/molecules/breadcrumb'
import { getBreadcrumbItems } from '@/constants/navigation'

type AppAdminLayoutProps = {
  children: React.ReactNode
  activeItem?: string
}

const AppAdminLayout: React.FC<AppAdminLayoutProps> = ({
  children,
  activeItem,
}) => {
  const router = useRouter()
  const pathname = usePathname() ?? ''
  const { language } = useSwitchLanguage()
  const { isAuthenticated, isLoading } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const breadcrumbItems = getBreadcrumbItems(pathname, language)

  useAuthGuard()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className='app-shell flex h-screen overflow-hidden'>
        <div className='hidden w-72 md:block app-sidebar'>
          <div className='p-6 space-y-4'>
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-8 w-3/4' />
            <Skeleton className='h-8 w-3/4' />
            <Skeleton className='h-8 w-3/4' />
          </div>
        </div>
        <div className='flex-1 p-6 space-y-4'>
          <Skeleton className='h-16 w-full' />
          <Skeleton className='h-64 w-full' />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className='app-shell flex h-screen overflow-hidden'>
      <aside
        className={`hidden md:block app-sidebar transition-[width] duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <AdminSidebar
          activeItem={activeItem}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        />
      </aside>

      <div className='flex min-w-0 flex-1 flex-col overflow-hidden'>
        <AdminHeader
          leftContent={<Breadcrumb items={breadcrumbItems} className='mb-0' />}
        />

        <div className='flex-1 overflow-hidden'>
          <main className='h-full w-full overflow-y-auto'>
            <div className='app-container'>{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AppAdminLayout
