import React from 'react'
import { useTranslations } from 'next-intl'

interface HeaderModuleProps {
  className?: string
}

const HeaderModule: React.FC<HeaderModuleProps> = ({ className }) => {
  const t = useTranslations('createPost')

  return (
    <div className={`mb-6 sm:mb-8 ${className || ''}`}>
      {/* Header Content - Mobile First */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6'>
        {/* Title Section - Mobile First */}
        <div className='flex-1'>
          <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-2'>
            {t('title')}
          </h1>
          <p className='text-sm sm:text-base text-muted-foreground'>
            {t('description')}
          </p>
        </div>
      </div>
    </div>
  )
}

export { HeaderModule }
export type { HeaderModuleProps }
