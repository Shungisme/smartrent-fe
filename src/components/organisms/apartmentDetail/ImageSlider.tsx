import React, { useState } from 'react'
import { Button } from '@/components/atoms/button'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import ImageAtom from '@/components/atoms/imageAtom'
import { DEFAULT_IMAGE } from '@/constants'

interface ImageSliderProps {
  images: string[]
  videoTour?: string
  onPlayVideo?: () => void
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  videoTour,
  onPlayVideo,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const selectImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  if (!images || images.length === 0) {
    return (
      <div className='w-full aspect-[16/10] bg-gray-200 rounded-xl flex items-center justify-center'>
        <span className='text-gray-500'>No images available</span>
      </div>
    )
  }

  return (
    <div className='space-y-5'>
      {/* Main Image */}
      <div className='relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 shadow-lg'>
        <ImageAtom
          src={images[currentImageIndex]}
          defaultImage={DEFAULT_IMAGE}
          alt={`Apartment image ${currentImageIndex + 1}`}
          className='w-full h-full object-cover object-center'
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant='ghost'
              size='icon'
              className='absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background/95 backdrop-blur-sm rounded-full shadow-lg h-10 w-10 transition-all duration-200'
              onClick={prevImage}
            >
              <ChevronLeft className='w-5 h-5' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background/95 backdrop-blur-sm rounded-full shadow-lg h-10 w-10 transition-all duration-200'
              onClick={nextImage}
            >
              <ChevronRight className='w-5 h-5' />
            </Button>
          </>
        )}

        {/* Play Button Overlay */}
        {videoTour && (
          <Button
            variant='ghost'
            className='absolute inset-0 bg-black/20 hover:bg-black/30 text-white rounded-none flex items-center justify-center group transition-all duration-300'
            onClick={onPlayVideo}
          >
            <div className='flex flex-col items-center space-y-3'>
              <div className='w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                <Play className='w-8 h-8 ml-1' fill='currentColor' />
              </div>
              <span className='text-sm font-semibold tracking-wide'>
                Video Tour
              </span>
            </div>
          </Button>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className='absolute bottom-4 right-4 bg-black/60 text-white px-3.5 py-2 rounded-full text-sm backdrop-blur-sm font-medium'>
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-hide'>
          {images.map((image, index) => (
            <button
              key={index}
              className={`flex-shrink-0 w-20 h-16 sm:w-24 sm:h-18 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentImageIndex
                  ? 'border-primary shadow-lg scale-105 ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100 hover:scale-102'
              }`}
              onClick={() => selectImage(index)}
            >
              <ImageAtom
                src={image}
                defaultImage={DEFAULT_IMAGE}
                alt={`Thumbnail ${index + 1}`}
                className='w-full h-full object-cover object-center'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageSlider
