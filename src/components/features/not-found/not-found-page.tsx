'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/atoms/button'
import { useTranslations } from 'next-intl'

export default function Custom404() {
  const t = useTranslations('notFound')

  return (
    <div className='min-h-screen bg-background flex flex-col justify-center items-center px-6'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold text-foreground mb-4'>
          {t('title')}
        </h1>
        <h2 className='text-2xl font-semibold text-foreground/80 mb-4'>
          {t('heading')}
        </h2>
        <p className='text-muted-foreground mb-8 max-w-md'>
          {t('description')}
        </p>
        <div className='space-y-4'>
          <Button asChild>
            <Link href='/management/users'>{t('backToAdmin')}</Link>
          </Button>
          <div>
            <Button variant='outline' asChild>
              <Link href='/insights/users'>{t('viewAnalytics')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
