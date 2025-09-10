import React from 'react'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import PropertyFilter from '@/components/organisms/propertyFilter'
import { PropertyFilters } from '@/api/types/property.type'
import { Filter } from 'lucide-react'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  filters: PropertyFilters
  onFiltersChange: (filters: PropertyFilters) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  searchQuery = '',
  onSearchChange,
}) => {
  const t = useTranslations('homePage.filters')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='rounded-none mx-auto h-dvh overflow-hidden flex flex-col'>
        <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0'>
          <div className='flex items-center gap-2'>
            <Filter className='h-5 w-5' />
            <DialogTitle className='text-lg font-semibold'>
              {t('title')}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto'>
          <PropertyFilter
            filters={filters}
            onFiltersChange={onFiltersChange}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onClose={onClose}
            isOpen={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FilterDrawer
