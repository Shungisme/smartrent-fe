import React from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/atoms/button'
import { Typography } from '@/components/atoms/typography'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/atoms/dropdown-menu'
import { ChevronDown, Bed, Bath } from 'lucide-react'

interface BedroomBathroomDropdownProps {
  bedrooms?: number
  bathrooms?: number
  onBedroomsChange: (bedrooms: number | undefined) => void
  onBathroomsChange: (bathrooms: number | undefined) => void
  className?: string
}

const BedroomBathroomDropdown: React.FC<BedroomBathroomDropdownProps> = ({
  bedrooms,
  bathrooms,
  onBedroomsChange,
  onBathroomsChange,
  className = '',
}) => {
  const t = useTranslations('homePage.filters')

  const bedroomOptions = [
    { value: 'any', label: t('bedrooms.any'), icon: Bed },
    { value: '0', label: t('bedrooms.studio'), icon: Bed },
    { value: '1', label: t('bedrooms.one'), icon: Bed },
    { value: '2', label: t('bedrooms.two'), icon: Bed },
    { value: '3', label: t('bedrooms.three'), icon: Bed },
    { value: '4', label: t('bedrooms.four'), icon: Bed },
    { value: '5', label: t('bedrooms.five'), icon: Bed },
  ]

  const bathroomOptions = [
    { value: 'any', label: t('bathrooms.any'), icon: Bath },
    { value: '1', label: t('bathrooms.one'), icon: Bath },
    { value: '2', label: t('bathrooms.two'), icon: Bath },
    { value: '3', label: t('bathrooms.three'), icon: Bath },
    { value: '4', label: t('bathrooms.four'), icon: Bath },
    { value: '5', label: t('bathrooms.five'), icon: Bath },
  ]

  const selectedBedrooms =
    bedroomOptions.find((option) => option.value === bedrooms?.toString()) ||
    bedroomOptions[0]
  const selectedBathrooms =
    bathroomOptions.find((option) => option.value === bathrooms?.toString()) ||
    bathroomOptions[0]

  const handleBedroomsChange = (value: string) => {
    onBedroomsChange(value === 'any' ? undefined : parseInt(value))
  }

  const handleBathroomsChange = (value: string) => {
    onBathroomsChange(value === 'any' ? undefined : parseInt(value))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className={`flex items-center gap-2 h-9 px-3 ${className}`}
        >
          <Bed className='h-4 w-4' />
          <Typography variant='small' className='text-sm'>
            {selectedBedrooms.label}
          </Typography>
          <Bath className='h-4 w-4' />
          <Typography variant='small' className='text-sm'>
            {selectedBathrooms.label}
          </Typography>
          <ChevronDown className='h-3 w-3 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-64'>
        <DropdownMenuLabel className='text-xs font-medium text-muted-foreground'>
          {t('bedrooms.title')} & {t('bathrooms.title')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className='p-2'>
          <div className='space-y-3'>
            <div>
              <Typography
                variant='small'
                className='text-xs font-medium text-muted-foreground mb-2'
              >
                {t('bedrooms.title')}
              </Typography>
              <div className='grid grid-cols-2 gap-1'>
                {bedroomOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      bedrooms?.toString() === option.value
                        ? 'default'
                        : 'ghost'
                    }
                    size='sm'
                    onClick={() => handleBedroomsChange(option.value)}
                    className='h-8 justify-start text-xs'
                  >
                    <option.icon className='h-3 w-3 mr-1' />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Typography
                variant='small'
                className='text-xs font-medium text-muted-foreground mb-2'
              >
                {t('bathrooms.title')}
              </Typography>
              <div className='grid grid-cols-2 gap-1'>
                {bathroomOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      bathrooms?.toString() === option.value
                        ? 'default'
                        : 'ghost'
                    }
                    size='sm'
                    onClick={() => handleBathroomsChange(option.value)}
                    className='h-8 justify-start text-xs'
                  >
                    <option.icon className='h-3 w-3 mr-1' />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default BedroomBathroomDropdown
