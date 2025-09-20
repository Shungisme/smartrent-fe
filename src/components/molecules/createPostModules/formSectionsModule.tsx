import React from 'react'
import { PropertyInfoSection } from '@/components/organisms/createPostSections/propertyInfoSection'
import { useTranslations } from 'next-intl'

interface FormSectionsModuleProps {
  className?: string
  currentStep?: number
  formSections?: Array<{
    id: string
    title: string
    description: string
    component: React.ComponentType<any>
  }>
}

const FormSectionsModule: React.FC<FormSectionsModuleProps> = ({
  className,
}) => {
  const t = useTranslations('createPost.sections.propertyInfo')

  return (
    <div className={`max-w-6xl mx-auto ${className || ''}`}>
      <div className='bg-card rounded-lg shadow-sm border p-6 sm:p-8'>
        <div className='mb-6 sm:mb-8'>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3'>
            {t('title')}
          </h2>
          <p className='text-sm sm:text-base text-muted-foreground'>
            {t('description')}
          </p>
        </div>
        <PropertyInfoSection className='w-full' />
      </div>
    </div>
  )
}

export { FormSectionsModule }
export type { FormSectionsModuleProps }
