import { Button } from '@/components/atoms/button'
import { Typography } from '@/components/atoms/typography'
import LanguageSwitch from '@/components/molecules/languageSwitch'
import ThemeSwitch from '@/components/molecules/themeSwitch'
import UserMenu from '@/components/molecules/userMenu'
import Navigation from '@/components/organisms/navigation'
import PropertyList from '@/components/organisms/propertyList'
import Footer from '@/components/organisms/footer'
import { NavigationItemData } from '@/components/atoms/navigation-item'
import { PropertyCard } from '@/api/types/property.type'
import { getNavigationItems } from '@/components/organisms/navigation/navigationItems.helper'
import { Building2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDialog } from '@/hooks/useDialog'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/useAuth'
import dynamic from 'next/dynamic'

const AuthDialog = dynamic(() => import('@/components/organisms/authDialog'), {
  ssr: false,
  loading: () => null,
})

interface HomepageTemplateProps {
  onPropertyClick?: (property: PropertyCard) => void
  initialProperties?: PropertyCard[]
}

const HomepageTemplate: React.FC<HomepageTemplateProps> = ({
  onPropertyClick,
  initialProperties = [],
}) => {
  const [mounted, setMounted] = useState(false)
  const [activeItem, setActiveItem] = useState<string>('home')
  const { open, handleOpen, handleClose } = useDialog()
  const { isAuthenticated } = useAuth()
  const t = useTranslations()

  const handleNavigationClick = (item: NavigationItemData) => {
    if (item.href) {
      setActiveItem(item.id)
      console.log('Navigating to:', item.href)
    }
  }

  const handlePropertyClick = (property: PropertyCard) => {
    console.log('Property clicked:', property)
    onPropertyClick?.(property)
  }

  const logo = (
    <div className='flex items-center gap-2'>
      <div className='w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center'>
        <Building2 className='h-3 w-3 sm:h-5 sm:w-5 text-primary-foreground' />
      </div>
      <Typography variant='h5' className='text-foreground text-sm sm:text-base'>
        SmartRent
      </Typography>
    </div>
  )

  const rightContent = (
    <div className='flex items-center gap-2 sm:gap-3'>
      <LanguageSwitch />
      <ThemeSwitch />
      {isAuthenticated ? (
        <UserMenu />
      ) : (
        <Button
          onClick={() => handleOpen()}
          size='sm'
          className='text-xs sm:text-sm'
        >
          {t('homePage.buttons.openAuth')}
        </Button>
      )}
    </div>
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const navigationItems = getNavigationItems(activeItem, t)

  return (
    <>
      <AuthDialog
        open={open}
        handleClose={handleClose}
        handleOpen={handleOpen}
      />

      <Navigation
        items={navigationItems}
        onItemClick={handleNavigationClick}
        logo={logo}
        rightContent={rightContent}
        defaultExpanded={['properties']}
      />

      <div className='min-h-screen bg-background flex flex-col'>
        <div className='flex-1'>
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
        </div>

        <Footer />
      </div>
    </>
  )
}

export default HomepageTemplate
