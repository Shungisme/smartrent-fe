import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Typography } from '@/components/atoms/typography'
import { Input } from '@/components/atoms/input'
import { Slider } from '@/components/atoms/slider'

interface PriceRangeFilterProps {
  minPrice?: number
  maxPrice?: number
  onChange: (minPrice: number | undefined, maxPrice: number | undefined) => void
  className?: string
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minPrice,
  maxPrice,
  onChange,
  className = '',
}) => {
  const t = useTranslations('homePage.filters.priceRange')

  const [localMinPrice, setLocalMinPrice] = useState<number>(minPrice || 0)
  const [localMaxPrice, setLocalMaxPrice] = useState<number>(
    maxPrice || 100000000,
  )
  const [sliderValue, setSliderValue] = useState<[number, number]>([
    minPrice || 0,
    maxPrice || 100000000,
  ])

  const minSliderValue = 0
  const maxSliderValue = 100000000

  useEffect(() => {
    if (minPrice !== undefined) {
      setLocalMinPrice(minPrice)
      setSliderValue([minPrice, sliderValue[1]])
    }
    if (maxPrice !== undefined) {
      setLocalMaxPrice(maxPrice)
      setSliderValue([sliderValue[0], maxPrice])
    }
  }, [minPrice, maxPrice])

  const handleSliderChange = (value: number[]) => {
    const [min, max] = value
    setSliderValue([min, max])
    setLocalMinPrice(min)
    setLocalMaxPrice(max)
    onChange(
      min === minSliderValue ? undefined : min,
      max === maxSliderValue ? undefined : max,
    )
  }

  const handleMinPriceChange = (value: string) => {
    const numValue = parseInt(value) || 0
    setLocalMinPrice(numValue)
    setSliderValue([numValue, sliderValue[1]])
    onChange(
      numValue === 0 ? undefined : numValue,
      sliderValue[1] === maxSliderValue ? undefined : sliderValue[1],
    )
  }

  const handleMaxPriceChange = (value: string) => {
    const numValue = parseInt(value) || maxSliderValue
    setLocalMaxPrice(numValue)
    setSliderValue([sliderValue[0], numValue])
    onChange(
      sliderValue[0] === minSliderValue ? undefined : sliderValue[0],
      numValue === maxSliderValue ? undefined : numValue,
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Typography variant='h6' className='text-sm font-medium'>
        {t('title')}
      </Typography>

      <div className='space-y-3'>
        <Slider
          value={sliderValue}
          onValueChange={handleSliderChange}
          min={minSliderValue}
          max={maxSliderValue}
          step={1000000}
          className='w-full'
        />

        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          <Typography variant='small' className='text-xs'>
            {formatPrice(minSliderValue)} {t('currency')}
          </Typography>
          <Typography variant='small' className='text-xs'>
            -
          </Typography>
          <Typography variant='small' className='text-xs'>
            {formatPrice(maxSliderValue)} {t('currency')}
          </Typography>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <div className='space-y-1'>
          <Typography variant='small' className='text-xs text-muted-foreground'>
            {t('minPrice')}
          </Typography>
          <div className='relative'>
            <Input
              type='number'
              value={localMinPrice}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              placeholder='0'
              className='pr-8'
            />
            <Typography
              variant='small'
              className='absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground'
            >
              {t('currency')}
            </Typography>
          </div>
        </div>

        <div className='space-y-1'>
          <Typography variant='small' className='text-xs text-muted-foreground'>
            {t('maxPrice')}
          </Typography>
          <div className='relative'>
            <Input
              type='number'
              value={localMaxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              placeholder='100000000'
              className='pr-8'
            />
            <Typography
              variant='small'
              className='absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground'
            >
              {t('currency')}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PriceRangeFilter
