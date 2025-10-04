import React from 'react'
import { useRouter } from 'next/router'
import { cn } from '@/lib/utils'
import {
  Calculator,
  ChartColumn,
  CreditCard,
  FileCheck,
  Home,
  Search,
  Settings,
  Shield,
  UserCogIcon,
  Users,
} from 'lucide-react'

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

  // Route mapping for navigation
  const routeMap: Record<string, string> = {
    users: '/admin/users',
    dashboard: '/admin',
    admin: '/admin/admins',
    finance: '/admin/finance',
    // Add more routes as we implement them
  }

  const handleNavigation = (key: string) => {
    const route = routeMap[key]
    if (route) {
      router.push(route)
    }
  }

  const mainNavItems = [
    { key: 'users', label: 'Quản Lý Người Dùng', icon: <Users width={20} /> },
    { key: 'admin', label: 'Quản Lý Admin', icon: <UserCogIcon width={20} /> },
    {
      key: 'finance',
      label: 'Quản Lý Tài Chính',
      icon: <Calculator width={20} />,
    },
    {
      key: 'premium',
      label: 'Tính Năng Trả Phí & Khuyến Mãi',
      icon: <CreditCard width={20} />,
    },
    {
      key: 'posts',
      label: 'Kiểm Duyệt Bài Đăng',
      icon: <FileCheck width={20} />,
    },
    {
      key: 'reports',
      label: 'Quản Lý Báo Cáo Vi Phạm',
      icon: <Shield width={20} />,
    },
    {
      key: 'analytics',
      label: 'Phân Tích Ứng Dụng',
      icon: <ChartColumn width={20} />,
    },
  ]

  const upcomingItems = [
    {
      key: 'properties',
      label: 'Danh Sách Bất Động Sản',
      icon: <Home width={20} />,
    },
    { key: 'settings', label: 'Cài Đặt', icon: <Settings width={20} /> },
    { key: 'search', label: 'Tìm Kiếm Nâng Cao', icon: <Search width={20} /> },
  ]

  return (
    <div className='h-full bg-white border-r border-gray-200 overflow-y-auto'>
      {/* Logo */}
      <div className='p-6 border-b border-gray-200'>
        <div
          className='flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity'
          onClick={() => router.push('/admin')}
        >
          <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
            <span className='text-white font-bold text-lg'>S</span>
          </div>
          <span className='font-bold text-xl text-gray-900'>
            SmartRent Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className='p-2'>
        <SidebarSection title='Quản Trị'>
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

        <SidebarSection title='Sắp Ra Mắt'>
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
    </div>
  )
}

export default AdminSidebar
