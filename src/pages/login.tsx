import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/useAuth'
import AdminLoginForm from '@/components/molecules/adminLoginForm'
import { Skeleton } from '@/components/atoms/skeleton'

const LoginPage = () => {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  // Redirect to admin dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/admin/analytics')
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
        <div className='w-full max-w-md p-8 bg-white rounded-2xl shadow-xl'>
          <div className='space-y-4'>
            <Skeleton className='h-8 w-3/4 mx-auto' />
            <Skeleton className='h-4 w-1/2 mx-auto' />
            <Skeleton className='h-12 w-full mt-6' />
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
          </div>
        </div>
      </div>
    )
  }

  // Don't render login form if already authenticated (will redirect)
  if (isAuthenticated) {
    return null
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='w-full max-w-md p-8 bg-white rounded-2xl shadow-xl'>
        <div className='mb-8 text-center'>
          {/* Logo placeholder */}
          <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center'>
            <span className='text-white text-2xl font-bold'>SR</span>
          </div>
          <h1 className='text-2xl font-bold text-gray-900'>Smart Rent</h1>
          <p className='text-gray-500 text-sm'>Admin Panel</p>
        </div>

        <AdminLoginForm />

        <div className='mt-6 text-center'>
          <p className='text-xs text-gray-500'>
            © 2024 Smart Rent. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
