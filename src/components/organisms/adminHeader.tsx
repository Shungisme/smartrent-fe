import React from 'react'
import { useRouter } from 'next/router'
import { Input } from '@/components/atoms/input'
import { Button } from '@/components/atoms/button'
import { Avatar } from '@/components/atoms/avatar'
import { Badge } from '@/components/atoms/badge'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/atoms/dropdown-menu'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { User, LogOut, Settings, ChevronDown } from 'lucide-react'

const AdminHeader: React.FC = () => {
  const t = useTranslations('admin.header')
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    toast.success('Đăng xuất thành công')
    router.push('/login')
  }

  const handleProfile = () => {
    toast.info('Chức năng đang phát triển')
    // router.push('/admin/profile')
  }

  const handleSettings = () => {
    toast.info('Chức năng đang phát triển')
    // router.push('/admin/settings')
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className='flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors'>
                <Avatar className='w-9 h-9'>
                  <div className='w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold'>
                    {user?.firstName?.[0]?.toUpperCase() || 'A'}
                  </div>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='text-sm font-medium text-gray-900'>
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.email?.split('@')[0] || 'Admin'}
                  </span>
                  <span className='text-xs text-gray-500'>
                    {user?.roles?.[0] || 'Administrator'}
                  </span>
                </div>
                <ChevronDown className='w-4 h-4 text-gray-500' />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel>
                <div className='flex flex-col space-y-1'>
                  <p className='text-sm font-medium leading-none'>
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : 'Admin'}
                  </p>
                  <p className='text-xs leading-none text-muted-foreground'>
                    {user?.email || 'admin@smartrent.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile}>
                <User className='mr-2 h-4 w-4' />
                <span>Thông tin tài khoản</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings}>
                <Settings className='mr-2 h-4 w-4' />
                <span>Cài đặt</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant='destructive' onClick={handleLogout}>
                <LogOut className='mr-2 h-4 w-4' />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
