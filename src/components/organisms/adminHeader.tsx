import React from 'react'
import { useRouter } from 'next/navigation'
import { Avatar } from '@/components/atoms/avatar'
import { Button } from '@/components/atoms/button'
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
import { User, LogOut, Settings, ChevronDown, Menu } from 'lucide-react'
import { NotificationBell } from './NotificationBell'

type AdminHeaderProps = {
  leftContent?: React.ReactNode
  showMenuButton?: boolean
  onMenuClick?: () => void
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  leftContent,
  showMenuButton = false,
  onMenuClick,
}) => {
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
    <header className='app-header'>
      <div className='flex w-full items-center justify-between gap-4'>
        <div className='flex min-w-0 flex-1 items-center gap-2 overflow-hidden'>
          {showMenuButton && (
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={onMenuClick}
              className='h-8 w-8 p-0 md:hidden'
              aria-label='Open navigation menu'
            >
              <Menu className='h-4.5 w-4.5 text-foreground/80' />
            </Button>
          )}
          <div className='min-w-0 flex-1 overflow-hidden'>{leftContent}</div>
        </div>

        {/* Right - Notifications & Profile */}
        <div className='flex shrink-0 items-center gap-2.5'>
          {/* Notification Bell */}
          <NotificationBell />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className='flex cursor-pointer items-center gap-2 rounded-lg border border-transparent p-1.5 transition-colors hover:border-border/70 hover:bg-accent'>
                <Avatar className='h-8 w-8'>
                  <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-primary/80 font-semibold text-primary-foreground'>
                    {user?.firstName?.[0]?.toUpperCase() || 'A'}
                  </div>
                </Avatar>
                <div className='hidden sm:flex flex-col'>
                  <span className='text-xs font-semibold text-foreground sm:text-sm'>
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.email?.split('@')[0] || 'Admin'}
                  </span>
                  <span className='text-[11px] leading-4 text-muted-foreground'>
                    {user?.roles?.[0] || t('defaultRole')}
                  </span>
                </div>
                <ChevronDown className='hidden sm:block h-4 w-4 text-muted-foreground' />
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
