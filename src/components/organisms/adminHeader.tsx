import React from 'react'
import { useRouter } from 'next/router'
import { Avatar } from '@/components/atoms/avatar'
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
    toast.success(t('logoutSuccess'))
    router.push('/login')
  }

  const handleProfile = () => {
    toast.info(t('featureInDevelopment'))
    // router.push('/profile')
  }

  const handleSettings = () => {
    toast.info(t('featureInDevelopment'))
    // router.push('/settings')
  }

  return (
    <header className='bg-white border-b border-gray-200 px-6 py-2'>
      <div className='flex items-center justify-between'>
        <div
          className='flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity'
          onClick={() => router.push('/users')}
        >
          <span className='font-bold text-xl text-gray-900'>
            SmartRent Admin
          </span>
        </div>

        {/* Right - Notifications & Profile */}
        <div className='flex items-center gap-4'>
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
                    {user?.roles?.[0] || t('defaultRole')}
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
                <span>{t('profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings}>
                <Settings className='mr-2 h-4 w-4' />
                <span>{t('settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant='destructive' onClick={handleLogout}>
                <LogOut className='mr-2 h-4 w-4' />
                <span>{t('logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
