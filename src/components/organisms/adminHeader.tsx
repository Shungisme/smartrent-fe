import React from 'react'
import { Input } from '@/components/atoms/input'
import { Button } from '@/components/atoms/button'
import { Avatar } from '@/components/atoms/avatar'
import { Badge } from '@/components/atoms/badge'
import { useTranslations } from 'next-intl'

const AdminHeader: React.FC = () => {
  const t = useTranslations('admin.header')

  // TODO: Replace with real user data from auth context/store
  const currentUser = {
    name: 'Admin',
    email: 'admin@smartrent.com',
  }

  return (
    <header className='bg-white border-b border-gray-200 px-6 py-4'>
      <div className='flex items-center justify-between'>
        {/* Left - Page Title */}
        <h1 className='text-2xl font-bold text-gray-900'>{t('title')}</h1>

        {/* Center - Search Bar */}
        <div className='flex-1 max-w-lg mx-8'>
          <Input
            type='text'
            placeholder={t('searchPlaceholder')}
            className='w-full'
          />
        </div>

        {/* Right - Notifications & Profile */}
        <div className='flex items-center gap-4'>
          {/* Notification Bell */}
          <div className='relative'>
            <Button variant='ghost' size='icon' className='relative'>
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                />
              </svg>
              <Badge
                variant='destructive'
                className='absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs'
              >
                3
              </Badge>
            </Button>
          </div>

          {/* Profile Dropdown */}
          <div className='flex items-center gap-3'>
            <Avatar className='w-8 h-8'>
              <img
                src='/images/default-image.jpg'
                alt={currentUser.name}
                className='w-full h-full object-cover'
              />
            </Avatar>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-900'>
                {currentUser.name}
              </span>
              <span className='text-xs text-gray-500'>{currentUser.email}</span>
            </div>
            <Button variant='ghost' size='sm'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
