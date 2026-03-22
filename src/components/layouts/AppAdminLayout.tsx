'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/organisms/adminSidebar'
import AdminHeader from '@/components/organisms/adminHeader'
import { useAuth, useAuthGuard } from '@/hooks/useAuth'
import { Skeleton } from '@/components/atoms/skeleton'

type AppAdminLayoutProps = {
  children: React.ReactNode
  activeItem?: string
}

const AppAdminLayout: React.FC<AppAdminLayoutProps> = ({
  children,
  activeItem,
}) => {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useAuthGuard()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex'>
        <div className='fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200'>
          <div className='p-6 space-y-4'>
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-8 w-3/4' />
            <Skeleton className='h-8 w-3/4' />
            <Skeleton className='h-8 w-3/4' />
          </div>
        </div>
        <div className='flex-1 ml-64'>
          <div className='p-6 space-y-4'>
            <Skeleton className='h-16 w-full' />
            <Skeleton className='h-64 w-full' />
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className='min-h-screen h-screen bg-gray-50 flex flex-col'>
      <AdminHeader />

      <div className='flex flex-1 overflow-hidden'>
        <div className='w-64 bg-white border-r border-gray-200'>
          <AdminSidebar activeItem={activeItem} />
        </div>

        <div className='flex-1 overflow-hidden'>
          <main className='h-full w-full overflow-y-auto p-3 sm:p-4 lg:p-6'>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default AppAdminLayout
