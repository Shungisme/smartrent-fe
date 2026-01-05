import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminSidebar from '@/components/organisms/adminSidebar'
import AdminHeader from '@/components/organisms/adminHeader'
import { useAuth, useAuthGuard } from '@/hooks/useAuth'
import { Skeleton } from '@/components/atoms/skeleton'

type AdminLayoutProps = {
  children: React.ReactNode
  activeItem?: string
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeItem }) => {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  // Check authentication state on mount
  useAuthGuard()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.warn('[AdminLayout] User not authenticated, redirecting to login')
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading skeleton while checking auth
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

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className='min-h-screen h-screen bg-gray-50 flex flex-col'>
      {/* Headers  */}
      <AdminHeader />

      <div className='flex flex-1 overflow-hidden'>
        {/* Sidebar */}
        <div className='w-64 bg-white border-r border-gray-200'>
          <AdminSidebar activeItem={activeItem} />
        </div>

        {/* Main Content Area */}
        <div className='flex-1 overflow-hidden'>
          <main className='h-full w-full overflow-y-auto p-6'>{children}</main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
