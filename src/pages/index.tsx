import { Button } from '@/components/atoms/button'
import LanguageSwitch from '@/components/molecules/languageSwitch'
import ThemeSwitch from '@/components/molecules/themeSwitch'
import Navigation from '@/components/organisms/navigation'
import { NavigationItemData } from '@/components/atoms/navigation-item'
import {
  Home as HomeIcon,
  Building2,
  Users,
  FileText,
  Calendar,
  BarChart3,
  HelpCircle,
} from 'lucide-react'

import { useEffect, useState } from 'react'
import { useDialog } from '@/hooks/useDialog'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'

const AuthDialog = dynamic(() => import('@/components/organisms/authDialog'), {
  ssr: false,
  loading: () => null,
})

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [activeItem, setActiveItem] = useState<string>('home')
  const { open, handleOpen, handleClose } = useDialog()
  const t = useTranslations('homePage.buttons')

  // Navigation data - Single level only
  const navigationItems: NavigationItemData[] = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: <HomeIcon className='h-4 w-4' />,
      isActive: activeItem === 'home',
    },
    {
      id: 'properties',
      label: 'Properties',
      href: '/properties',
      icon: <Building2 className='h-4 w-4' />,
      isActive: activeItem === 'properties',
      children: [
        {
          id: 'residential',
          label: 'Residential',
          href: '/properties/residential',
          isActive: activeItem === 'residential',
        },
        {
          id: 'commercial',
          label: 'Commercial',
          href: '/properties/commercial',
          isActive: activeItem === 'commercial',
        },
        {
          id: 'vacation',
          label: 'Vacation Rentals',
          href: '/properties/vacation',
          isActive: activeItem === 'vacation',
        },
      ],
    },
    {
      id: 'tenants',
      label: 'Tenants',
      href: '/tenants',
      icon: <Users className='h-4 w-4' />,
      isActive: activeItem === 'tenants',
      children: [
        {
          id: 'applications',
          label: 'Applications',
          href: '/tenants/applications',
          isActive: activeItem === 'applications',
        },
        {
          id: 'leases',
          label: 'Active Leases',
          href: '/tenants/leases',
          isActive: activeItem === 'leases',
        },
        {
          id: 'maintenance',
          label: 'Maintenance Requests',
          href: '/tenants/maintenance',
          isActive: activeItem === 'maintenance',
        },
      ],
    },
    {
      id: 'documents',
      label: 'Documents',
      href: '/documents',
      icon: <FileText className='h-4 w-4' />,
      isActive: activeItem === 'documents',
      children: [
        {
          id: 'contracts',
          label: 'Contracts',
          href: '/documents/contracts',
          isActive: activeItem === 'contracts',
        },
        {
          id: 'invoices',
          label: 'Invoices',
          href: '/documents/invoices',
          isActive: activeItem === 'invoices',
        },
        {
          id: 'reports',
          label: 'Reports',
          href: '/documents/reports',
          isActive: activeItem === 'reports',
        },
      ],
    },
    {
      id: 'calendar',
      label: 'Calendar',
      href: '/calendar',
      icon: <Calendar className='h-4 w-4' />,
      isActive: activeItem === 'calendar',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: '/analytics',
      icon: <BarChart3 className='h-4 w-4' />,
      isActive: activeItem === 'analytics',
      children: [
        {
          id: 'financial',
          label: 'Financial Reports',
          href: '/analytics/financial',
          isActive: activeItem === 'financial',
        },
        {
          id: 'occupancy',
          label: 'Occupancy Rates',
          href: '/analytics/occupancy',
          isActive: activeItem === 'occupancy',
        },
        {
          id: 'performance',
          label: 'Property Performance',
          href: '/analytics/performance',
          isActive: activeItem === 'performance',
        },
      ],
    },
    {
      id: 'help',
      label: 'Help & Support',
      href: '/help',
      icon: <HelpCircle className='h-4 w-4' />,
      isActive: activeItem === 'help',
    },
  ]

  const handleNavigationClick = (item: NavigationItemData) => {
    if (item.href) {
      setActiveItem(item.id)
      console.log('Navigating to:', item.href)
    }
  }

  const logo = (
    <div className='flex items-center gap-2'>
      <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
        <Building2 className='h-5 w-5 text-primary-foreground' />
      </div>
      <span className='text-xl font-bold text-foreground'>SmartRent</span>
    </div>
  )

  const rightContent = (
    <div className='flex items-center gap-3'>
      <LanguageSwitch />
      <ThemeSwitch />
      <Button onClick={() => handleOpen()}>{t('openAuth')}</Button>
    </div>
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <AuthDialog
        open={open}
        handleClose={handleClose}
        handleOpen={handleOpen}
      />

      {/* Navigation Header */}
      <Navigation
        items={navigationItems}
        onItemClick={handleNavigationClick}
        logo={logo}
        rightContent={rightContent}
        defaultExpanded={['properties']}
      />

      <div className='min-h-screen p-4'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8  top-4 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50'>
          <div className='flex gap-2'>
            <div className='text-sm font-semibold px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full'>
              🧭 Navigation Demo
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              Active Navigation:{' '}
              <span className='font-semibold text-blue-600 dark:text-blue-400'>
                {activeItem}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4'>
              🧭 SmartRent Navigation System
            </h1>
            <p className='text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
              A comprehensive navigation system with recursive menus, responsive
              design, and smooth animations.
              <br />
              <span className='text-blue-600 dark:text-blue-400 font-medium'>
                Try the navigation menu above! Hover on desktop, tap on mobile.
              </span>
            </p>
          </div>

          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <div className='p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl'>
              <h3 className='text-xl font-semibold text-blue-800 dark:text-blue-200 mb-3'>
                🚀 Features
              </h3>
              <ul className='space-y-2 text-blue-700 dark:text-blue-300 text-sm'>
                <li>• Recursive navigation with unlimited nesting</li>
                <li>• Responsive mobile drawer navigation</li>
                <li>• Desktop hover dropdowns</li>
                <li>• Smooth animations & transitions</li>
                <li>• Keyboard navigation support</li>
              </ul>
            </div>

            <div className='p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl'>
              <h3 className='text-xl font-semibold text-green-800 dark:text-green-200 mb-3'>
                📱 Mobile
              </h3>
              <ul className='space-y-2 text-green-700 dark:text-green-300 text-sm'>
                <li>• Slide-out drawer from right</li>
                <li>• Touch-friendly interactions</li>
                <li>• Auto-expand on parent click</li>
                <li>• Smooth slide animations</li>
                <li>• Backdrop blur effect</li>
              </ul>
            </div>

            <div className='p-6 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl'>
              <h3 className='text-xl font-semibold text-purple-800 dark:text-purple-200 mb-3'>
                💻 Desktop
              </h3>
              <ul className='space-y-2 text-purple-700 dark:text-purple-300 text-sm'>
                <li>• Hover-triggered dropdowns</li>
                <li>• Multi-level nested menus</li>
                <li>• Smooth fade animations</li>
                <li>• Keyboard shortcuts</li>
                <li>• Focus management</li>
              </ul>
            </div>
          </div>

          <div className='mt-12 p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl'>
            <h2 className='text-2xl font-bold text-indigo-800 dark:text-indigo-200 mb-6 text-center'>
              🎯 Test Instructions
            </h2>
            <div className='grid md:grid-cols-2 gap-8'>
              <div>
                <h3 className='text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-3 flex items-center'>
                  <span className='mr-2'>🖥️</span> Desktop Testing
                </h3>
                <ul className='space-y-2 text-indigo-600 dark:text-indigo-400 text-sm'>
                  <li>• Hover over &quot;Properties&quot; to see dropdown</li>
                  <li>• Move mouse to nested items for sub-dropdowns</li>
                  <li>• Click items to see active state changes</li>
                  <li>• Use keyboard Tab to navigate</li>
                </ul>
              </div>
              <div>
                <h3 className='text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-3 flex items-center'>
                  <span className='mr-2'>📱</span> Mobile Testing
                </h3>
                <ul className='space-y-2 text-indigo-600 dark:text-indigo-400 text-sm'>
                  <li>• Tap menu button to open drawer</li>
                  <li>• Tap parent items to auto-expand</li>
                  <li>• Swipe or tap backdrop to close</li>
                  <li>• Test nested menu interactions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
