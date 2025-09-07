import React, { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import NavigationItem, {
  NavigationItemData,
} from '@/components/atoms/navigation-item'

interface NavigationMenuProps {
  items: NavigationItemData[]
  className?: string
  onItemClick?: (item: NavigationItemData) => void
  defaultExpanded?: string[]
  isMobile?: boolean
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  items,
  className,
  onItemClick,
  defaultExpanded = [],
  isMobile = false,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(defaultExpanded),
  )

  const handleToggleExpand = useCallback((itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }, [])

  const handleItemClick = useCallback(
    (item: NavigationItemData) => {
      if (onItemClick) {
        onItemClick(item)
      }
    },
    [onItemClick],
  )

  const processItems = (items: NavigationItemData[]): NavigationItemData[] => {
    return items.map((item) => ({
      ...item,
      isExpanded: expandedItems.has(item.id),
      children: item.children ? processItems(item.children) : undefined,
    }))
  }

  const processedItems = processItems(items)

  return (
    <nav className={cn('w-full', className)}>
      <div className='space-y-1'>
        {processedItems.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            onItemClick={handleItemClick}
            onToggleExpand={handleToggleExpand}
            isMobile={isMobile}
          />
        ))}
      </div>
    </nav>
  )
}

export default NavigationMenu
