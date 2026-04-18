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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const breadcrumbItems = getBreadcrumbItems(pathname, language)

  useAuthGuard()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [pathname])

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
      {mobileSidebarOpen && (
        <div className='fixed inset-0 z-[70] md:hidden'>
          <button
            type='button'
            className='absolute inset-0 bg-black/40'
            onClick={() => setMobileSidebarOpen(false)}
            aria-label='Close navigation menu'
          />

          <aside className='absolute left-0 top-0 h-full w-72 max-w-[85vw] app-sidebar shadow-xl'>
            <AdminSidebar
              activeItem={activeItem}
              collapsed={false}
              showCollapseToggle={false}
              onNavigate={() => setMobileSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      <aside
        className={`hidden md:block app-sidebar transition-[width] duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <AdminSidebar
          activeItem={activeItem}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          showCollapseToggle
        />
      </aside>

      <div className='flex min-w-0 flex-1 flex-col overflow-hidden'>
        <AdminHeader
          showMenuButton
          onMenuClick={() => setMobileSidebarOpen(true)}
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
