import React, { useState, useEffect } from 'react'
import { X, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/atoms/button'
import NavigationMenu from '@/components/molecules/navigation-menu'
import { NavigationItemData } from '@/components/atoms/navigation-item'

interface MobileNavigationDrawerProps {
  items: NavigationItemData[]
  className?: string
  onItemClick?: (item: NavigationItemData) => void
  defaultExpanded?: string[]
}

const MobileNavigationDrawer: React.FC<MobileNavigationDrawerProps> = ({
  items,
  className,
  onItemClick,
  defaultExpanded = [],
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(defaultExpanded),
  )

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleItemClick = (item: NavigationItemData) => {
    if (onItemClick) {
      onItemClick(item)
    }

    // Auto-expand parent items when clicked
    if (item.children && item.children.length > 0) {
      setExpandedItems((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(item.id)) {
          newSet.delete(item.id)
        } else {
          newSet.add(item.id)
        }
        return newSet
      })
    } else if (item.href) {
      // Close drawer when navigating to a page
      setIsOpen(false)
    }
  }

  const toggleDrawer = () => setIsOpen(!isOpen)

  return (
    <div className={cn('md:hidden', className)}>
      {/* Toggle Button */}
      <Button
        variant='ghost'
        size='icon'
        onClick={toggleDrawer}
        className='relative z-50'
        aria-label='Toggle navigation menu'
      >
        <Menu className='h-5 w-5' />
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-background/80 backdrop-blur-sm z-40'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer - Now slides from right to left */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background border-l border-border z-50 transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-border'>
          <h2 className='text-lg font-semibold'>Navigation</h2>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsOpen(false)}
            aria-label='Close navigation'
          >
            <X className='h-5 w-5' />
          </Button>
        </div>

        {/* Navigation Content */}
        <div className='flex-1 overflow-y-auto p-4'>
          <NavigationMenu
            items={items}
            onItemClick={handleItemClick}
            defaultExpanded={Array.from(expandedItems)}
            isMobile={true}
          />
        </div>
      </div>
    </div>
  )
}

export default MobileNavigationDrawer
