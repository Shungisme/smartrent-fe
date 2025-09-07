import { NavigationItemData } from '@/components/atoms/navigation-item'
import {
  Home as HomeIcon,
  Building2,
  Users,
  FileText,
  Calendar,
  BarChart3,
} from 'lucide-react'

export const getNavigationItems = (
  activeItem: string,
  t: (key: string) => string,
): NavigationItemData[] => {
  return [
    {
      id: 'home',
      label: t('navigation.home'),
      href: '/',
      icon: <HomeIcon className='h-4 w-4' />,
      isActive: activeItem === 'home',
    },
    {
      id: 'properties',
      label: t('navigation.properties'),
      href: '/properties',
      icon: <Building2 className='h-4 w-4' />,
      isActive: activeItem === 'properties',
      children: [
        {
          id: 'residential',
          label: t('navigation.residential'),
          href: '/properties/residential',
          isActive: activeItem === 'residential',
        },
        {
          id: 'commercial',
          label: t('navigation.commercial'),
          href: '/properties/commercial',
          isActive: activeItem === 'commercial',
        },
        {
          id: 'vacation',
          label: t('navigation.vacation'),
          href: '/properties/vacation',
          isActive: activeItem === 'vacation',
        },
      ],
    },
    {
      id: 'tenants',
      label: t('navigation.tenants'),
      href: '/tenants',
      icon: <Users className='h-4 w-4' />,
      isActive: activeItem === 'tenants',
      children: [
        {
          id: 'applications',
          label: t('navigation.applications'),
          href: '/tenants/applications',
          isActive: activeItem === 'applications',
        },
        {
          id: 'leases',
          label: t('navigation.leases'),
          href: '/tenants/leases',
          isActive: activeItem === 'leases',
        },
        {
          id: 'maintenance',
          label: t('navigation.maintenance'),
          href: '/tenants/maintenance',
          isActive: activeItem === 'maintenance',
        },
      ],
    },
    {
      id: 'documents',
      label: t('navigation.documents'),
      href: '/documents',
      icon: <FileText className='h-4 w-4' />,
      isActive: activeItem === 'documents',
      children: [
        {
          id: 'contracts',
          label: t('navigation.contracts'),
          href: '/documents/contracts',
          isActive: activeItem === 'contracts',
        },
        {
          id: 'invoices',
          label: t('navigation.invoices'),
          href: '/documents/invoices',
          isActive: activeItem === 'invoices',
        },
        {
          id: 'reports',
          label: t('navigation.reports'),
          href: '/documents/reports',
          isActive: activeItem === 'reports',
        },
      ],
    },
    {
      id: 'calendar',
      label: t('navigation.calendar'),
      href: '/calendar',
      icon: <Calendar className='h-4 w-4' />,
      isActive: activeItem === 'calendar',
    },
    {
      id: 'analytics',
      label: t('navigation.analytics'),
      href: '/analytics',
      icon: <BarChart3 className='h-4 w-4' />,
      isActive: activeItem === 'analytics',
      children: [
        {
          id: 'financial',
          label: t('navigation.financial'),
          href: '/analytics/financial',
          isActive: activeItem === 'financial',
        },
        {
          id: 'occupancy',
          label: t('navigation.occupancy'),
          href: '/analytics/occupancy',
          isActive: activeItem === 'occupancy',
        },
        {
          id: 'performance',
          label: t('navigation.performance'),
          href: '/analytics/performance',
          isActive: activeItem === 'performance',
        },
      ],
    },
  ]
}
