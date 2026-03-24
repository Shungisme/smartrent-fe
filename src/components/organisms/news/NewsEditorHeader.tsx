import React from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/atoms/button'
import { cn } from '@/lib/utils'
import { Loader2, Eye, Save } from 'lucide-react'

interface NewsEditorHeaderProps {
  wordCount: number
  characterCount: number
  previewMode: boolean
  setPreviewMode: (value: boolean) => void
  onSave: () => void
  loading: boolean
  compact?: boolean
}

export const NewsEditorHeader: React.FC<NewsEditorHeaderProps> = ({
  wordCount,
  characterCount,
  previewMode,
  setPreviewMode,
  onSave,
  loading,
  compact = false,
}) => {
  const t = useTranslations('news.editor.header')

  return (
    <div className={cn('mb-6', compact && 'mb-0 surface-card p-4')}>
      <div
        className={cn(
          compact
            ? 'space-y-3'
            : 'flex min-h-14 items-center justify-between gap-4',
        )}
      >
        <div
          className={cn(
            'px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-200',
            compact && 'w-fit',
          )}
        >
          <span className='text-sm font-medium text-gray-600'>
            {t('wordCount', { count: wordCount })}
          </span>
          <span className='mx-2 text-gray-400'>•</span>
          <span className='text-sm font-medium text-gray-600'>
            {t('characterCount', { count: characterCount })}
          </span>
        </div>

        <div
          className={cn(
            'flex items-center gap-2 sm:gap-3',
            compact && 'grid grid-cols-1 gap-2',
          )}
        >
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => setPreviewMode(!previewMode)}
            className='shadow-sm hover:shadow-md transition-shadow'
          >
            <Eye className='h-4 w-4 mr-2' />
            {previewMode ? t('editButton') : t('previewButton')}
          </Button>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={onSave}
            disabled={loading}
            className='shadow-sm hover:shadow-md transition-shadow hover:bg-blue-50'
          >
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            <Save className='h-4 w-4 mr-2' />
            {t('saveButton')}
          </Button>
        </div>
      </div>
    </div>
  )
}
