import React from 'react'
import { useRouter } from 'next/router'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { useSwitchLanguage } from '@/contexts/switchLanguage/index.context'
import {
  Calculator,
  ChartColumn,
  CreditCard,
  FileCheck,
  Home,
  ChevronDown,
  Search,
  Settings,
  Shield,
  UserCogIcon,
  Users,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu'

type SidebarItemProps = {
  icon?: React.ReactNode
  label: string
  href?: string
  isActive?: boolean
  onClick?: () => void
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 mx-2 rounded-lg cursor-pointer transition-colors',
        isActive
          ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
          : 'text-gray-700 hover:bg-gray-100',
      )}
    >
      {icon && <span className='w-5 h-5'>{icon}</span>}
      <span className='text-sm text-nowrap truncate'>{label}</span>
    </div>
  )
}

type SidebarSectionProps = {
  title: string
  children: React.ReactNode
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
  return (
    <div className='mb-6'>
      <div className='px-4 mb-2 text-sm font-semibold text-gray-400 uppercase tracking-wider'>
        {title}
      </div>
      <div>{children}</div>
    </div>
  )
}

type AdminSidebarProps = {
  activeItem?: string
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeItem }) => {
  const router = useRouter()
  const t = useTranslations('admin.sidebar')
  const { language, updateLanguage } = useSwitchLanguage()

  const languageConfig = {
    vi: { flag: '🇻🇳', name: 'Tiếng Việt', code: 'VI' },
    en: { flag: '🇺🇸', name: 'English', code: 'EN' },
  }

  // Route mapping for navigation
  const routeMap: Record<string, string> = {
    users: '/admin/users',
    dashboard: '/admin',
    admin: '/admin/admins',
    finance: '/admin/finance',
    posts: '/admin/posts',
    reports: '/admin/reports',
    properties: '/admin/listings',
    premium: '/admin/premium',
    analytics: '/admin/analytics',
    // Add more routes as we implement them
  }

  const handleNavigation = (key: string) => {
    const route = routeMap[key]
    if (route) {
      router.push(route)
    }
  }

  const mainNavItems = [
    { key: 'users', label: t('menuItems.users'), icon: <Users width={20} /> },
    {
      key: 'admin',
      label: t('menuItems.admins'),
      icon: <UserCogIcon width={20} />,
    },
    {
      key: 'finance',
      label: t('menuItems.finance'),
      icon: <Calculator width={20} />,
    },
    {
      key: 'premium',
      label: t('menuItems.premium'),
      icon: <CreditCard width={20} />,
    },
    {
      key: 'posts',
      label: t('menuItems.posts'),
      icon: <FileCheck width={20} />,
    },
    {
      key: 'reports',
      label: t('menuItems.reports'),
      icon: <Shield width={20} />,
    },
    {
      key: 'analytics',
      label: t('menuItems.analytics'),
      icon: <ChartColumn width={20} />,
    },
  ]

  const upcomingItems = [
    {
      key: 'properties',
      label: t('menuItems.properties'),
      icon: <Home width={20} />,
    },
    {
      key: 'settings',
      label: t('menuItems.settings'),
      icon: <Settings width={20} />,
    },
    {
      key: 'search',
      label: t('menuItems.search'),
      icon: <Search width={20} />,
    },
  ]

  return (
    <div className='h-full bg-white border-r border-gray-200 overflow-y-auto flex flex-col'>
      {/* Logo */}
      <div className='p-6 border-b border-gray-200'>
        <div
          className='flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity'
          onClick={() => router.push('/admin')}
        >
          <span className='font-bold text-xl text-gray-900'>{t('title')}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className='p-2 flex-1'>
        <SidebarSection title={t('sections.management')}>
          {mainNavItems.map((item) => (
            <SidebarItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              isActive={activeItem === item.key}
              onClick={() => handleNavigation(item.key)}
            />
          ))}
        </SidebarSection>

        <SidebarSection title={t('sections.comingSoon')}>
          {upcomingItems.map((item) => (
            <SidebarItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              isActive={false}
            />
          ))}
        </SidebarSection>
      </div>

      {/* Language Switcher */}
      <div className='p-4 border-t border-gray-200'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2',
                'text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors',
              )}
            >
              <div className='flex items-center gap-2'>
                <span className='text-lg'>{languageConfig[language].flag}</span>
                <span>{languageConfig[language].code}</span>
              </div>
              <ChevronDown className='h-4 w-4 text-gray-500' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuItem
              onClick={() => updateLanguage('vi')}
              className={cn(
                'cursor-pointer',
                language === 'vi' && 'bg-blue-50 text-blue-600',
              )}
            >
              <span className='text-lg mr-2'>🇻🇳</span>
              <span>Tiếng Việt</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateLanguage('en')}
              className={cn(
                'cursor-pointer',
                language === 'en' && 'bg-blue-50 text-blue-600',
              )}
            >
              <span className='text-lg mr-2'>🇺🇸</span>
              <span>English</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default AdminSidebar
