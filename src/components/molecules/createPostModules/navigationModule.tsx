import React from 'react'
import { Button } from '@/components/atoms/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface NavigationModuleProps {
  className?: string
  onNext?: () => void
  onBack?: () => void
  isFormValid?: boolean
}

const NavigationModule: React.FC<NavigationModuleProps> = ({
  className,
  onNext,
  onBack,
  isFormValid = false,
}) => {
  const t = useTranslations('createPost')

  return (
    <div className={`max-w-6xl mx-auto mt-8 sm:mt-12 ${className || ''}`}>
      <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between items-center'>
        {/* Back Button */}
        <Button
          variant='outline'
          onClick={onBack}
          className='w-full sm:w-auto order-2 sm:order-1 h-12 px-6 sm:px-8'
        >
          <ArrowLeft className='w-4 h-4 mr-2' />
          {t('back')}
        </Button>

        {/* Next Button - Only show when form is valid */}
        {isFormValid && (
          <Button
            onClick={onNext}
            className='w-full sm:w-auto order-1 sm:order-2 h-12 px-6 sm:px-8 bg-primary hover:bg-primary/90'
          >
            {t('next')}
            <ArrowRight className='w-4 h-4 ml-2' />
          </Button>
        )}
      </div>
    </div>
  )
}

export { NavigationModule }
export type { NavigationModuleProps }
