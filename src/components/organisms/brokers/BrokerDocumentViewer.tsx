'use client'

import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { AdminBrokerUserResponse } from '@/api/types/broker.type'

interface BrokerDocumentViewerProps {
  user: AdminBrokerUserResponse
  onImageError?: () => void
}

export const BrokerDocumentViewer: React.FC<BrokerDocumentViewerProps> = ({
  user,
  onImageError,
}) => {
  const t = useTranslations('moderation.brokerPending')

  const documents = [
    {
      key: 'cccdFront',
      label: t('documents.cccdFront'),
      url: user.cccdFrontUrl,
    },
    {
      key: 'cccdBack',
      label: t('documents.cccdBack'),
      url: user.cccdBackUrl,
    },
    {
      key: 'certificate',
      label: t('documents.certificate'),
      url: user.certUrl,
    },
  ]

  return (
    <div className='grid gap-2 sm:grid-cols-3'>
      {documents.map((doc) =>
        doc.url ? (
          <a
            key={doc.key}
            href={doc.url}
            target='_blank'
            rel='noopener noreferrer'
            className='group flex items-center gap-2 rounded-md border border-gray-200 bg-white p-2 transition-colors hover:border-blue-400'
          >
            <div className='relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100'>
              <Image
                src={doc.url}
                alt={doc.label}
                width={96}
                height={64}
                sizes='96px'
                className='h-full w-full object-cover transition-transform duration-200 group-hover:scale-105'
                onError={() => onImageError?.()}
              />
            </div>
            <span className='text-xs font-medium text-gray-600 group-hover:text-blue-600'>
              {doc.label}
            </span>
          </a>
        ) : (
          <div
            key={doc.key}
            className='flex flex-col gap-1 rounded-md border border-dashed border-gray-200 bg-gray-50 p-2 text-xs text-gray-500'
          >
            <span className='font-medium text-gray-600'>{doc.label}</span>
            <span>{t('documents.notSubmitted')}</span>
          </div>
        ),
      )}
    </div>
  )
}
