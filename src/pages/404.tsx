import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/atoms/button'
import { useTranslations } from 'next-intl'

export default function Custom404() {
  const t = useTranslations('notFound')

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold text-gray-900 mb-4'>{t('title')}</h1>
        <h2 className='text-2xl font-semibold text-gray-700 mb-4'>
          {t('heading')}
        </h2>
        <p className='text-gray-600 mb-8 max-w-md'>{t('description')}</p>
        <div className='space-y-4'>
          <Button asChild>
            <Link href='/users'>{t('backToAdmin')}</Link>
          </Button>
          <div>
            <Button variant='outline' asChild>
              <Link href='/analytics'>{t('viewAnalytics')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
