import React, { useState } from 'react'
import {
  Home,
  Building2,
  Users,
  Settings,
  FileText,
  Calendar,
  BarChart3,
  HelpCircle,
  User,
  LogOut,
} from 'lucide-react'
import Navigation from '@/components/organisms/navigation'
import { NavigationItemData } from '@/components/atoms/navigation-item'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'

const NavigationDemo: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('home')

  // Sample navigation data with recursion
  const navigationItems: NavigationItemData[] = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: <Home className='h-4 w-4' />,
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
          children: [
            {
              id: 'apartments',
              label: 'Apartments',
              href: '/properties/residential/apartments',
              isActive: activeItem === 'apartments',
            },
            {
              id: 'houses',
              label: 'Houses',
              href: '/properties/residential/houses',
              isActive: activeItem === 'houses',
            },
            {
              id: 'condos',
              label: 'Condos',
              href: '/properties/residential/condos',
              isActive: activeItem === 'condos',
            },
          ],
        },
        {
          id: 'commercial',
          label: 'Commercial',
          href: '/properties/commercial',
          isActive: activeItem === 'commercial',
          children: [
            {
              id: 'offices',
              label: 'Office Spaces',
              href: '/properties/commercial/offices',
              isActive: activeItem === 'offices',
            },
            {
              id: 'retail',
              label: 'Retail Spaces',
              href: '/properties/commercial/retail',
              isActive: activeItem === 'retail',
            },
          ],
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

  const handleItemClick = (item: NavigationItemData) => {
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
      <Badge variant='secondary' className='hidden md:inline-flex'>
        Pro Plan
      </Badge>
      <Button variant='ghost' size='icon' className='hidden md:flex'>
        <User className='h-4 w-4' />
      </Button>
      <Button variant='ghost' size='icon' className='hidden md:flex'>
        <Settings className='h-4 w-4' />
      </Button>
      <Button variant='ghost' size='icon' className='hidden md:flex'>
        <LogOut className='h-4 w-4' />
      </Button>
    </div>
  )

  return (
    <div className='min-h-screen bg-background'>
      <Navigation
        items={navigationItems}
        onItemClick={handleItemClick}
        logo={logo}
        rightContent={rightContent}
        defaultExpanded={['properties']}
      />

      {/* Demo Content */}
      <main className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-3xl font-bold text-foreground mb-6'>
            Navigation System Demo
          </h1>

          <div className='grid gap-6 md:grid-cols-2'>
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold text-foreground'>
                Features
              </h2>
              <ul className='space-y-2 text-muted-foreground'>
                <li>• Responsive design for mobile and desktop</li>
                <li>• Recursive navigation with unlimited nesting</li>
                <li>• Hover effects and smooth transitions</li>
                <li>• Mobile drawer with slide-out animation</li>
                <li>• Keyboard navigation support</li>
                <li>• Active state management</li>
                <li>• Follows atomic design principles</li>
              </ul>
            </div>

            <div className='space-y-4'>
              <h2 className='text-xl font-semibold text-foreground'>
                Current State
              </h2>
              <div className='p-4 bg-muted rounded-lg'>
                <p className='text-sm text-muted-foreground'>
                  Active Item:{' '}
                  <span className='font-medium text-foreground'>
                    {activeItem}
                  </span>
                </p>
                <p className='text-sm text-muted-foreground mt-2'>
                  Check the console for navigation logs
                </p>
              </div>
            </div>
          </div>

          <div className='mt-8 p-6 bg-muted rounded-lg'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>
              Test Instructions
            </h3>
            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <h4 className='font-medium text-foreground mb-2'>Desktop:</h4>
                <ul className='text-sm text-muted-foreground space-y-1'>
                  <li>• Hover over navigation items to see dropdowns</li>
                  <li>• Navigate through nested menus</li>
                  <li>• Click items to see active state changes</li>
                </ul>
              </div>
              <div>
                <h4 className='font-medium text-foreground mb-2'>Mobile:</h4>
                <ul className='text-sm text-muted-foreground space-y-1'>
                  <li>• Click the menu button to open drawer</li>
                  <li>• Expand/collapse nested items</li>
                  <li>• Test touch interactions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default NavigationDemo
