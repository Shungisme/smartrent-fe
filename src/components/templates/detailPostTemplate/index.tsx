import React, { useEffect, useState } from 'react'
// UI sections
import Header from '@/components/organisms/apartmentDetail/Header'
import ImageSlider from '@/components/organisms/apartmentDetail/ImageSlider'
import ContactCard from '@/components/organisms/apartmentDetail/ContactCard'
import PriceHistory from '@/components/organisms/apartmentDetail/PriceHistory'
import ApartmentInfo from '@/components/organisms/apartmentDetail/ApartmentInfo'
import LocationMap from '@/components/organisms/apartmentDetail/LocationMap'
import SimilarListings from '@/components/organisms/apartmentDetail/SimilarListings'
// Types & mocks
import {
  ApartmentDetail,
  SimilarProperty,
  mockApartmentDetail,
  mockSimilarProperties,
} from '@/types/apartmentDetail.types'

export interface DetailPostTemplateProps {
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

const DetailPostTemplate: React.FC<DetailPostTemplateProps> = ({
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

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSave = () => {
    setIsSaved((v) => !v)
    onSave?.()
  }

  const handleBack = () => {
    onBack?.()
  }

  const handleCompare = () => {
    onCompare?.()
  }

  const handleShare = () => {
    onShare?.()
  }

  const handleExport = () => {
    onExport?.()
  }

  const handleCall = () => {
    onCall?.()
  }

  const handleMessage = () => {
    onMessage?.()
  }

  const handlePlayVideo = () => {
    onPlayVideo?.()
  }

  const handleAIPriceEvaluation = () => {
    onAIPriceEvaluation?.()
  }

  const handleSimilarPropertyClick = (property: SimilarProperty) => {
    onSimilarPropertyClick?.(property)
  }

  if (!mounted) return null

  return (
    <div className='min-h-screen bg-background'>
      <Header
        onBack={handleBack}
        onSave={handleSave}
        onCompare={handleCompare}
        onShare={handleShare}
        onExport={handleExport}
        isSaved={isSaved}
      />

      <div className='container mx-auto px-4 py-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            <ImageSlider
              images={apartment.images || []}
              videoTour={apartment.videoTour}
              onPlayVideo={handlePlayVideo}
            />

            <ApartmentInfo
              apartment={apartment}
              onAIPriceEvaluation={handleAIPriceEvaluation}
            />

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
            <ContactCard
              host={apartment.host}
              availability={apartment.availability}
              onCall={handleCall}
              onMessage={handleMessage}
            />

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
  )
}

export default DetailPostTemplate
