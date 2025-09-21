import React from 'react'
import { Button } from '@/components/atoms/button'
import { Typography } from '@/components/atoms/typography'
import {
  MapPin,
  Eye,
  TrendingUp,
  Sparkles,
  Bed,
  Bath,
  Square,
  Compass,
  Wifi,
  Car,
  Shield,
  Waves,
  Dumbbell,
  Building,
  Wind,
  Heart,
  Dog,
  Zap,
} from 'lucide-react'
import { ApartmentDetail } from '@/types/apartmentDetail.types'

interface ApartmentInfoProps {
  apartment: ApartmentDetail
  onAIPriceEvaluation?: () => void
}

const ApartmentInfo: React.FC<ApartmentInfoProps> = ({
  apartment,
  onAIPriceEvaluation,
}) => {
  const formatPrice = (price: number, currency: string) => {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN').format(price) + ' VND / tháng'
    }
    return (
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(price) + ' / month'
    )
  }

  const formatPriceIncrease = (
    increase: { amount: number; percentage: number },
    currency: string,
  ) => {
    const formattedAmount =
      currency === 'VND'
        ? new Intl.NumberFormat('vi-VN').format(increase.amount)
        : new Intl.NumberFormat('en-US').format(increase.amount)

    return `+${formattedAmount} ${currency} (${increase.percentage}%)`
  }

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase()

    if (lowerAmenity.includes('wifi') || lowerAmenity.includes('internet')) {
      return <Wifi className='w-5 h-5' />
    }
    if (lowerAmenity.includes('parking') || lowerAmenity.includes('garage')) {
      return <Car className='w-5 h-5' />
    }
    if (lowerAmenity.includes('security') || lowerAmenity.includes('safe')) {
      return <Shield className='w-5 h-5' />
    }
    if (lowerAmenity.includes('pool') || lowerAmenity.includes('swimming')) {
      return <Waves className='w-5 h-5' />
    }
    if (lowerAmenity.includes('gym') || lowerAmenity.includes('fitness')) {
      return <Dumbbell className='w-5 h-5' />
    }
    if (lowerAmenity.includes('elevator') || lowerAmenity.includes('lift')) {
      return <Building className='w-5 h-5' />
    }
    if (lowerAmenity.includes('air') || lowerAmenity.includes('conditioning')) {
      return <Wind className='w-5 h-5' />
    }
    if (lowerAmenity.includes('balcony')) {
      return <Square className='w-5 h-5' />
    }
    if (lowerAmenity.includes('pet')) {
      return <Dog className='w-5 h-5' />
    }
    if (lowerAmenity.includes('laundry')) {
      return <Zap className='w-5 h-5' />
    }

    return <Heart className='w-5 h-5' />
  }

  return (
    <div className='space-y-7'>
      {/* Title and Address */}
      <div className='space-y-4'>
        <Typography
          variant='h1'
          className='text-2xl md:text-3xl font-bold text-foreground leading-tight'
        >
          {apartment.title}
        </Typography>

        <div className='flex items-center text-muted-foreground'>
          <MapPin className='w-5 h-5 mt-6 mr-2.5 flex-shrink-0' />
          <Typography variant='p' className='text-base'>
            {apartment.address}, {apartment.city}
          </Typography>
        </div>

        {/* Metadata */}
        <div className='flex items-center justify-between text-sm text-muted-foreground'>
          <div className='flex items-center space-x-5'>
            <div className='flex items-center'>
              <Eye className='w-4 h-4 mr-1.5' />
              <span className='font-medium'>{apartment.views || 0} views</span>
            </div>
            {apartment.postDate && (
              <span className='font-medium'>Posted {apartment.postDate}</span>
            )}
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className='space-y-4'>
        <div className='flex items-baseline space-x-4'>
          <Typography
            variant='h2'
            className='text-2xl md:text-3xl font-bold text-primary'
          >
            {formatPrice(apartment.price, apartment.currency)}
          </Typography>
          {apartment.priceIncrease && (
            <div className='flex items-center text-red-600'>
              <TrendingUp className='w-4 h-4 mr-1.5' />
              <Typography variant='small' className='font-semibold'>
                {formatPriceIncrease(
                  apartment.priceIncrease,
                  apartment.currency,
                )}
              </Typography>
            </div>
          )}
        </div>

        {/* Smart Pricing Box */}
        {apartment.smartPriceScore && (
          <div className='bg-gradient-to-r from-purple-600 to-blue-600 text-white p-5 rounded-xl shadow-lg'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='flex items-center space-x-2.5 mb-3'>
                  <Sparkles className='w-5 h-5' />
                  <Typography variant='h6' className='font-semibold text-white'>
                    Smart Price Evaluation
                  </Typography>
                </div>
                <Typography
                  variant='small'
                  className='text-purple-100 mb-4 leading-relaxed'
                >
                  AI compares market data to help you decide.
                </Typography>
                <Button
                  variant='secondary'
                  className='bg-white/20 hover:bg-white/30 text-white border-white/20 font-medium'
                  onClick={onAIPriceEvaluation}
                >
                  AI Price Evaluation
                </Button>
              </div>
              <div className='text-right ml-4'>
                <Typography variant='small' className='text-purple-100 mb-1'>
                  Score
                </Typography>
                <Typography variant='h5' className='font-bold text-white'>
                  {apartment.smartPriceScore}/10
                </Typography>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Apartment Details Grid */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className='bg-gray-50 p-4 rounded-lg text-center'>
          <Square className='w-6 h-6 mx-auto mb-2 text-primary' />
          <Typography variant='h6' className='font-semibold'>
            {apartment.area}m²
          </Typography>
          <Typography variant='small' className='text-muted-foreground'>
            Area
          </Typography>
        </div>

        <div className='bg-gray-50 p-4 rounded-lg text-center'>
          <Bed className='w-6 h-6 mx-auto mb-2 text-primary' />
          <Typography variant='h6' className='font-semibold'>
            {apartment.bedrooms}
          </Typography>
          <Typography variant='small' className='text-muted-foreground'>
            Bedrooms
          </Typography>
        </div>

        <div className='bg-gray-50 p-4 rounded-lg text-center'>
          <Bath className='w-6 h-6 mx-auto mb-2 text-primary' />
          <Typography variant='h6' className='font-semibold'>
            {apartment.bathrooms}
          </Typography>
          <Typography variant='small' className='text-muted-foreground'>
            Bathrooms
          </Typography>
        </div>

        {apartment.direction && (
          <div className='bg-gray-50 p-4 rounded-lg text-center'>
            <Compass className='w-6 h-6 mx-auto mb-2 text-primary' />
            <Typography variant='h6' className='font-semibold'>
              {apartment.direction}
            </Typography>
            <Typography variant='small' className='text-muted-foreground'>
              Direction
            </Typography>
          </div>
        )}
      </div>

      {/* Description */}
      {apartment.fullDescription && (
        <div className='space-y-3'>
          <Typography variant='h5' className='font-semibold'>
            Description
          </Typography>
          <Typography
            variant='p'
            className='text-muted-foreground leading-relaxed'
          >
            {apartment.fullDescription}
          </Typography>
        </div>
      )}

      {/* Amenities Section */}
      {apartment.amenities && apartment.amenities.length > 0 && (
        <div className='space-y-3'>
          <Typography variant='h5' className='font-semibold'>
            Amenities
          </Typography>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
            {apartment.amenities.map((amenity, index) => (
              <div
                key={index}
                className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
              >
                <div className='text-primary'>{getAmenityIcon(amenity)}</div>
                <Typography variant='small' className='font-medium'>
                  {amenity}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ApartmentInfo
