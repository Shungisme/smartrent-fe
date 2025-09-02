import React from 'react'
import DesktopNavigation from './index'
import { NavigationItemData } from '@/components/atoms/navigation-item'

// Test navigation data - Single level only
const testNavigationItems: NavigationItemData[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    isActive: true,
  },
  {
    id: 'properties',
    label: 'Properties',
    href: '/properties',
    children: [
      {
        id: 'residential',
        label: 'Residential',
        href: '/properties/residential',
      },
      {
        id: 'commercial',
        label: 'Commercial',
        href: '/properties/commercial',
      },
      {
        id: 'vacation',
        label: 'Vacation Rentals',
        href: '/properties/vacation',
      },
    ],
  },
  {
    id: 'tenants',
    label: 'Tenants',
    href: '/tenants',
    children: [
      {
        id: 'applications',
        label: 'Applications',
        href: '/tenants/applications',
      },
      {
        id: 'leases',
        label: 'Active Leases',
        href: '/tenants/leases',
      },
      {
        id: 'maintenance',
        label: 'Maintenance Requests',
        href: '/tenants/maintenance',
      },
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    href: '/documents',
    children: [
      {
        id: 'contracts',
        label: 'Contracts',
        href: '/documents/contracts',
      },
      {
        id: 'invoices',
        label: 'Invoices',
        href: '/documents/invoices',
      },
    ],
  },
]

const TestNavigation: React.FC = () => {
  const handleItemClick = (item: NavigationItemData) => {
    console.log('Navigation clicked:', item)
  }

  return (
    <div className='p-8 bg-background min-h-screen'>
      <h1 className='text-2xl font-bold mb-6'>
        Navigation Test - Simple UI Only
      </h1>

      <div className='mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
        <h2 className='text-lg font-semibold text-green-800 dark:text-green-200 mb-2'>
          🎯 Simple Navigation System
        </h2>
        <p className='text-green-700 dark:text-green-300 text-sm'>
          This navigation system now uses simple UI rendering without complex
          hover bridges. Clean, fast, and reliable.
        </p>
      </div>

      <DesktopNavigation
        items={testNavigationItems}
        onItemClick={handleItemClick}
      />

      <div className='mt-8 p-4 bg-muted rounded-lg'>
        <h2 className='text-lg font-semibold mb-2'>Test Instructions:</h2>
        <ul className='space-y-1 text-sm'>
          <li>• Hover over &quot;Properties&quot; to see dropdown</li>
          <li>• Move mouse to dropdown items</li>
          <li>• Verify smooth transitions</li>
          <li>• Test click functionality</li>
        </ul>
      </div>

      <div className='mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
        <h3 className='text-md font-semibold text-blue-800 dark:text-blue-200 mb-2'>
          ✅ What&apos;s Changed:
        </h3>
        <ul className='text-blue-700 dark:text-blue-300 text-sm space-y-1'>
          <li>• Removed complex hover bridge system</li>
          <li>• Simple mouse enter/leave logic</li>
          <li>• Clean, straightforward UI rendering</li>
          <li>• Better performance and reliability</li>
          <li>• Easier to maintain and debug</li>
        </ul>
      </div>

      <div className='mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
        <h3 className='text-md font-semibold text-yellow-800 dark:text-yellow-200 mb-2'>
          ⚠️ How It Works Now:
        </h3>
        <ul className='text-yellow-700 dark:text-yellow-300 text-sm space-y-1'>
          <li>• Hover over parent → Dropdown shows</li>
          <li>• Hover over dropdown → Dropdown stays open</li>
          <li>• Move mouse away → Dropdown hides</li>
          <li>• Click item → Navigate and close dropdown</li>
        </ul>
      </div>
    </div>
  )
}

export default TestNavigation
