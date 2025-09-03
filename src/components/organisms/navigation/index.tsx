import React from 'react'
import { cn } from '@/lib/utils'
import MobileNavigationDrawer from '@/components/molecules/mobile-navigation-drawer'
import DesktopNavigation from '@/components/molecules/desktop-navigation'
import { NavigationItemData } from '@/components/atoms/navigation-item'

interface NavigationProps {
  items: NavigationItemData[]
  className?: string
  onItemClick?: (item: NavigationItemData) => void
  defaultExpanded?: string[]
  logo?: React.ReactNode
  rightContent?: React.ReactNode
}

const Navigation: React.FC<NavigationProps> = ({
  items,
  className,
  onItemClick,
  defaultExpanded = [],
  logo,
  rightContent,
}) => {
  const handleItemClick = (item: NavigationItemData) => {
    if (onItemClick) {
      onItemClick(item)
    }
  }

  return (
    <header
      className={cn('w-full border-b border-border bg-background', className)}
    >
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          {logo && <div className='flex items-center'>{logo}</div>}

          {/* Desktop Navigation */}
          <DesktopNavigation items={items} onItemClick={handleItemClick} />

          {/* Right Content */}
          <div className='flex items-center gap-4'>
            {rightContent}

            {/* Mobile Navigation */}
            <MobileNavigationDrawer
              items={items}
              onItemClick={handleItemClick}
              defaultExpanded={defaultExpanded}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navigation
