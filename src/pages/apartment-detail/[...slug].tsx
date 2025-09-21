import React, { useState, useEffect } from 'react'
//
import Header from '@/components/organisms/apartmentDetail/Header'
import ImageSlider from '@/components/organisms/apartmentDetail/ImageSlider'
import ContactCard from '@/components/organisms/apartmentDetail/ContactCard'
import PriceHistory from '@/components/organisms/apartmentDetail/PriceHistory'
import ApartmentInfo from '@/components/organisms/apartmentDetail/ApartmentInfo'
import LocationMap from '@/components/organisms/apartmentDetail/LocationMap'
import SimilarListings from '@/components/organisms/apartmentDetail/SimilarListings'
import MainLayout from '@/components/layouts/MainLayout'
import type { NextPageWithLayout } from '@/types/next-page'
//
import { useRouter } from 'next/router'
import {
  ApartmentDetail,
  SimilarProperty,
  mockApartmentDetail,
  mockSimilarProperties,
} from '@/types/apartmentDetail.types'

// Auth dialog handled globally by AuthDialogProvider

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

const ApartmentDetailPage: NextPageWithLayout<ApartmentDetailPageProps> = ({
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
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Navigation handled by MainLayout/AppHeader via getLayout

  // Auth handled globally

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

  if (!mounted) {
    return null
  }

  return (
    <>
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

ApartmentDetailPage.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout activeItem='properties'>{page}</MainLayout>
}
