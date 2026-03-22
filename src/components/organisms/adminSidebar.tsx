import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { useSwitchLanguage } from '@/contexts/switchLanguage/index.context'
import { getSidebarNavigationGroups } from '@/constants/navigation'
import {
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
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
  Newspaper,
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
  collapsed?: boolean
  isActive?: boolean
  onClick?: () => void
  disabled?: boolean
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  collapsed = false,
  isActive,
  onClick,
  disabled = false,
}) => {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={cn(
        'mx-2 flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all',
        collapsed ? 'justify-center' : 'gap-3',
        disabled
          ? 'cursor-not-allowed text-muted-foreground/60'
          : 'cursor-pointer',
        !disabled &&
          (isActive
            ? 'bg-sidebar-primary/12 text-sidebar-primary shadow-xs ring-1 ring-sidebar-primary/20'
            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'),
      )}
      title={collapsed ? label : undefined}
    >
      {collapsed ? (
        icon && <span className='h-5 w-5'>{icon}</span>
      ) : (
        <span className='truncate text-nowrap'>{label}</span>
      )}
    </div>
  )
}

type SidebarSectionProps = {
  title: string
  icon?: React.ReactNode
  collapsed?: boolean
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  icon,
  collapsed = false,
  open,
  onToggle,
  children,
}) => {
  return (
    <div className='mb-2 last:mb-0'>
      <button
        type='button'
        onClick={collapsed ? undefined : onToggle}
        className='mb-1 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm font-medium text-sidebar-foreground/80 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        title={collapsed ? title : undefined}
      >
        <span
          className={cn(
            'inline-flex items-center gap-2',
            collapsed && 'mx-auto',
          )}
        >
          {icon && (
            <span className='h-4 w-4 text-muted-foreground'>{icon}</span>
          )}
          {!collapsed && <span>{title}</span>}
        </span>
        {!collapsed && (
          <ChevronRight
            className={cn(
              'h-3.5 w-3.5 transition-transform duration-300 ease-in-out',
              open && 'rotate-90',
            )}
          />
        )}
      </button>

      {!collapsed && (
        <div
          className={cn(
            'grid transition-all duration-300 ease-in-out',
            open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <div className='space-y-0.5 overflow-hidden'>{children}</div>
        </div>
      )}
    </div>
  )
}

type AdminSidebarProps = {
  activeItem?: string
  collapsed?: boolean
  onToggleCollapse?: () => void
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeItem,
  collapsed = false,
  onToggleCollapse,
}) => {
  const router = useRouter()
  const pathname = usePathname() ?? ''
  const t = useTranslations('admin.sidebar')
  const { language, updateLanguage } = useSwitchLanguage()
  const navigationGroups = React.useMemo(
    () => getSidebarNavigationGroups(language),
    [language],
  )

  const activeGroupKey = React.useMemo(
    () =>
      navigationGroups.find((group) =>
        group.items.some(
          (item) =>
            pathname === item.href || pathname.startsWith(`${item.href}/`),
        ),
      )?.key,
    [navigationGroups, pathname],
  )

  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    management: true,
    comingSoon: false,
  })
  const openGroupsBeforeCollapseRef = React.useRef<Record<
    string,
    boolean
  > | null>(null)

  React.useEffect(() => {
    if (collapsed) {
      const hasAnyOpenGroup = Object.values(openGroups).some(Boolean)
      if (hasAnyOpenGroup) {
        openGroupsBeforeCollapseRef.current = openGroups
        setOpenGroups({ comingSoon: false })
      }
      return
    }

    if (openGroupsBeforeCollapseRef.current) {
      const restoredGroups = {
        ...openGroupsBeforeCollapseRef.current,
      }

      if (activeGroupKey) {
        restoredGroups[activeGroupKey] = true
      }

      setOpenGroups(restoredGroups)
      openGroupsBeforeCollapseRef.current = null
      return
    }
  }, [collapsed, activeGroupKey, openGroups])

  const toggleGroup = (groupKey: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }))
  }

  const languageConfig = {
    vi: { flag: '🇻🇳', name: 'Tiếng Việt', code: 'VI' },
    en: { flag: '🇺🇸', name: 'English', code: 'EN' },
  }

  const iconMap: Record<string, React.ReactNode> = {
    users: <Users width={20} />,
    admins: <UserCogIcon width={20} />,
    roles: <Shield width={20} />,
    financeOverview: <Calculator width={20} />,
    premiumOverview: <CreditCard width={20} />,
    premiumMembership: <CreditCard width={20} />,
    premiumPromotions: <CreditCard width={20} />,
    premiumListingTypes: <CreditCard width={20} />,
    premiumPostBoosts: <CreditCard width={20} />,
    analyticsOverview: <ChartColumn width={20} />,
    analyticsUsers: <ChartColumn width={20} />,
    analyticsPosts: <ChartColumn width={20} />,
    analyticsRevenue: <ChartColumn width={20} />,
    analyticsReports: <ChartColumn width={20} />,
    posts: <FileCheck width={20} />,
    news: <Newspaper width={20} />,
    reports: <Shield width={20} />,
  }

  const groupIconMap: Record<string, React.ReactNode> = {
    management: <UserCogIcon className='h-4 w-4' />,
    finance: <Calculator className='h-4 w-4' />,
    monetization: <CreditCard className='h-4 w-4' />,
    insights: <ChartColumn className='h-4 w-4' />,
    content: <Newspaper className='h-4 w-4' />,
    moderation: <Shield className='h-4 w-4' />,
  }

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
    <div className='flex h-full flex-col overflow-y-auto'>
      <div className='h-[var(--app-topbar-height)] border-b border-sidebar-border/70 px-2'>
        <div
          className={cn(
            'flex h-full items-center gap-2',
            collapsed ? 'justify-center' : 'justify-between',
          )}
        >
          <button
            type='button'
            onClick={() => router.push('/users')}
            className={cn(
              'min-w-0 flex-1 rounded-md px-3 py-1.5 text-left text-sm font-semibold text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              collapsed && 'hidden',
            )}
          >
            SmartRent Admin
          </button>

          <button
            type='button'
            onClick={onToggleCollapse}
            className='flex items-center justify-center rounded-md px-3 py-1.5 text-sidebar-foreground/80 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen className='h-4 w-4 transition-transform duration-300 ease-in-out' />
            ) : (
              <PanelLeftClose className='h-4 w-4 transition-transform duration-300 ease-in-out' />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className='flex-1 p-2'>
        {navigationGroups.map((group) => (
          <SidebarSection
            key={group.key}
            title={group.label}
            icon={groupIconMap[group.key]}
            collapsed={collapsed}
            open={!!openGroups[group.key]}
            onToggle={() => toggleGroup(group.key)}
          >
            {group.items.map((item) => (
              <SidebarItem
                key={item.href}
                icon={iconMap[item.key]}
                label={item.label}
                collapsed={collapsed}
                isActive={pathname === item.href || activeItem === item.key}
                onClick={() => router.push(item.href)}
              />
            ))}
          </SidebarSection>
        ))}

        <SidebarSection
          title={t('sections.comingSoon')}
          icon={<Home className='h-4 w-4' />}
          collapsed={collapsed}
          open={!!openGroups.comingSoon}
          onToggle={() => toggleGroup('comingSoon')}
        >
          {upcomingItems.map((item) => (
            <SidebarItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
              isActive={false}
              disabled={true}
            />
          ))}
        </SidebarSection>
      </div>

      {/* Language Switcher */}
      <div className='border-t border-sidebar-border/70 p-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2',
                'text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-2',
              )}
            >
              <div className='flex items-center gap-2'>
                <span className='text-lg'>{languageConfig[language].flag}</span>
                {!collapsed && <span>{languageConfig[language].code}</span>}
              </div>
              {!collapsed && (
                <ChevronDown className='h-4 w-4 text-muted-foreground' />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuItem
              onClick={() => updateLanguage('vi')}
              className={cn(
                'cursor-pointer',
                language === 'vi' && 'bg-primary/12 text-primary',
              )}
            >
              <span className='text-lg mr-2'>🇻🇳</span>
              <span>Tiếng Việt</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateLanguage('en')}
              className={cn(
                'cursor-pointer',
                language === 'en' && 'bg-primary/12 text-primary',
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
