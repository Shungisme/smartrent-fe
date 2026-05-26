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
            className='group flex items-center gap-2 rounded-md border border-border/70 bg-card p-2 transition-colors hover:border-primary/50'
          >
            <div className='relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted'>
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
            <span className='text-xs font-medium text-muted-foreground group-hover:text-primary'>
              {doc.label}
            </span>
          </a>
        ) : (
          <div
            key={doc.key}
            className='flex flex-col gap-1 rounded-md border border-dashed border-border/70 bg-muted/50 p-2 text-xs text-muted-foreground'
          >
            <span className='font-medium text-foreground'>{doc.label}</span>
            <span>{t('documents.notSubmitted')}</span>
          </div>
        ),
      )}
    </div>
  )
}
