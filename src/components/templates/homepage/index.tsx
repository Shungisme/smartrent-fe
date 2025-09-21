import { Typography } from '@/components/atoms/typography'
import PropertyList from '@/components/organisms/propertyList'
import { PropertyCard } from '@/api/types/property.type'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

interface HomepageTemplateProps {
  onPropertyClick?: (property: PropertyCard) => void
  initialProperties?: PropertyCard[]
}

const HomepageTemplate: React.FC<HomepageTemplateProps> = ({
  onPropertyClick,
  initialProperties = [],
}) => {
  const [mounted, setMounted] = useState(false)
  const t = useTranslations()

  const handlePropertyClick = (property: PropertyCard) => {
    console.log('Property clicked:', property)
    onPropertyClick?.(property)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className='w-full'>
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='py-4 sm:py-6 lg:py-8'>
            <div className='text-center mb-6 sm:mb-8'>
              <div className='inline-flex items-center gap-2 mb-3 sm:mb-4'>
                <div className='text-xs sm:text-sm font-semibold px-3 py-1 bg-primary text-primary-foreground rounded-full'>
                  🏠 SmartRent Properties
                </div>
              </div>
              <Typography
                variant='h1'
                className='text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3'
              >
                🏘️ {t('homePage.title')}
              </Typography>
              <Typography
                variant='lead'
                className='text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-2'
              >
                {t('homePage.subtitle')}
              </Typography>
              <Typography
                variant='small'
                className='text-xs sm:text-sm text-primary font-medium'
              >
                {t('homePage.instruction')}
              </Typography>
              <div className='mt-2 sm:mt-3'>
                <Typography
                  variant='small'
                  className='text-xs sm:text-sm text-muted-foreground'
                >
                  {t('homePage.description')} •{' '}
                  {t('homePage.propertiesAvailable')}
                </Typography>
              </div>
            </div>

            <PropertyList
              onPropertyClick={handlePropertyClick}
              initialData={initialProperties}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomepageTemplate
