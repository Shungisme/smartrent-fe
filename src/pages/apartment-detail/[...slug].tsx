import React, { useState, useEffect } from 'react'
import { Typography } from '@/components/atoms/typography'
import { Button } from '@/components/atoms/button'
import Header from '@/components/organisms/apartmentDetail/Header'
import ImageSlider from '@/components/organisms/apartmentDetail/ImageSlider'
import ContactCard from '@/components/organisms/apartmentDetail/ContactCard'
import PriceHistory from '@/components/organisms/apartmentDetail/PriceHistory'
import ApartmentInfo from '@/components/organisms/apartmentDetail/ApartmentInfo'
import LocationMap from '@/components/organisms/apartmentDetail/LocationMap'
import SimilarListings from '@/components/organisms/apartmentDetail/SimilarListings'
import Navigation from '@/components/organisms/navigation'
import LanguageSwitch from '@/components/molecules/languageSwitch'
import ThemeSwitch from '@/components/molecules/themeSwitch'
import UserMenu from '@/components/molecules/userMenu'
import { NavigationItemData } from '@/components/atoms/navigation-item'
import { getNavigationItems } from '@/components/organisms/navigation/navigationItems.helper'
import { Building2 } from 'lucide-react'
import { useRouter } from 'next/router'
import { useDialog } from '@/hooks/useDialog'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/useAuth'
import dynamic from 'next/dynamic'
import {
  ApartmentDetail,
  SimilarProperty,
  mockApartmentDetail,
  mockSimilarProperties,
} from '@/types/apartmentDetail.types'

const AuthDialog = dynamic(() => import('@/components/organisms/authDialog'), {
  ssr: false,
  loading: () => null,
})

interface ApartmentDetailPageProps {
  apartment?: ApartmentDetail
  similarProperties?: SimilarProperty[]
  onBack?: () => void
  onSave?: () => void
  onCompare?: () => void
  onShare?: () => void
  onExport?: () => void
  onCall?: () => void
  onMessage?: () => void
  onPlayVideo?: () => void
  onAIPriceEvaluation?: () => void
  onSimilarPropertyClick?: (property: SimilarProperty) => void
}

const ApartmentDetailPage: React.FC<ApartmentDetailPageProps> = ({
  apartment = mockApartmentDetail,
  similarProperties = mockSimilarProperties,
  onBack,
  onSave,
  onCompare,
  onShare,
  onExport,
  onCall,
  onMessage,
  onPlayVideo,
  onAIPriceEvaluation,
  onSimilarPropertyClick,
}) => {
  const [isSaved, setIsSaved] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeItem, setActiveItem] = useState<string>('home')
  const router = useRouter()
  const { open, handleOpen, handleClose } = useDialog()
  const { isAuthenticated } = useAuth()
  const t = useTranslations()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNavigationClick = (item: NavigationItemData) => {
    if (item.href) {
      setActiveItem(item.id)
      router.push(item.href)
      console.log('Navigating to:', item.href)
    }
  }

  const handleAuthSuccess = () => {
    handleClose()
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    onSave?.()
  }

  const handleBack = () => {
    console.log('Navigate back to listings')
    router.back() // Go back to previous page
    onBack?.()
  }

  const handleCompare = () => {
    console.log('Add to comparison')
    onCompare?.()
  }

  const handleShare = () => {
    console.log('Share apartment listing')
    onShare?.()
  }

  const handleExport = () => {
    console.log('Export apartment details')
    onExport?.()
  }

  const handleCall = () => {
    console.log('Call host:', apartment.host.phone)
    onCall?.()
  }

  const handleMessage = () => {
    console.log('Message host:', apartment.host.name)
    onMessage?.()
  }

  const handlePlayVideo = () => {
    console.log('Play video tour:', apartment.videoTour)
    onPlayVideo?.()
  }

  const handleAIPriceEvaluation = () => {
    console.log('Open AI price evaluation')
    onAIPriceEvaluation?.()
  }

  const handleSimilarPropertyClick = (property: SimilarProperty) => {
    console.log('Navigate to property:', property.id)
    // Navigate to the same page but with different property ID
    router.push(`/apartment-detail?id=${property.id}`)
    onSimilarPropertyClick?.(property)
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
        onSuccess={handleAuthSuccess}
      />

      <Navigation
        items={navigationItems}
        onItemClick={handleNavigationClick}
        logo={logo}
        rightContent={rightContent}
        defaultExpanded={['properties']}
      />

      <div className='min-h-screen bg-background'>
        {/* Header */}
        <Header
          onBack={handleBack}
          onSave={handleSave}
          onCompare={handleCompare}
          onShare={handleShare}
          onExport={handleExport}
          isSaved={isSaved}
        />

        {/* Main Content */}
        <div className='container mx-auto px-4 py-6'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Left Column - Main Content */}
            <div className='lg:col-span-2 space-y-8'>
              {/* Image Slider */}
              <ImageSlider
                images={apartment.images || []}
                videoTour={apartment.videoTour}
                onPlayVideo={handlePlayVideo}
              />

              {/* Apartment Information */}
              <ApartmentInfo
                apartment={apartment}
                onAIPriceEvaluation={handleAIPriceEvaluation}
              />

              {/* Location & Map */}
              <LocationMap
                location={{
                  address: apartment.address,
                  city: apartment.city,
                  latitude: apartment.location?.coordinates?.latitude,
                  longitude: apartment.location?.coordinates?.longitude,
                  nearbyPlaces: apartment.location?.nearbyPlaces,
                }}
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className='lg:col-span-1 space-y-6'>
              {/* Contact Card */}
              <ContactCard
                host={apartment.host}
                availability={apartment.availability}
                onCall={handleCall}
                onMessage={handleMessage}
              />

              {/* Price History */}
              <PriceHistory priceHistory={apartment.priceHistory} />
            </div>
          </div>

          {/* Similar Listings Section */}
          <div className='mt-12'>
            <SimilarListings
              similarProperties={similarProperties}
              onPropertyClick={handleSimilarPropertyClick}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ApartmentDetailPage
