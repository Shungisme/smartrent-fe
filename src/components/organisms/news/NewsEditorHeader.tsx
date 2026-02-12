import React from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/atoms/button'
import { Loader2, ArrowLeft, Eye, Save } from 'lucide-react'
import { useRouter } from 'next/router'

interface NewsEditorHeaderProps {
  isEditMode: boolean
  wordCount: number
  characterCount: number
  previewMode: boolean
  setPreviewMode: (value: boolean) => void
  onSave: () => void
  onPublish: () => void
  loading: boolean
}

export const NewsEditorHeader: React.FC<NewsEditorHeaderProps> = ({
  isEditMode,
  wordCount,
  characterCount,
  previewMode,
  setPreviewMode,
  onSave,
  onPublish,
  loading,
}) => {
  const router = useRouter()
  const t = useTranslations('news.editor.header')

  return (
    <div className=''>
      <div className=''>
        <div className='flex items-center justify-between h-20'>
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.push('/news')}
              className='hover:bg-blue-100 transition-colors'
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              {t('backButton')}
            </Button>
            <div className='h-8 w-px bg-gray-300' />
            <h1 className='text-2xl font-bold text-gray-900'>
              {isEditMode ? t('titleEdit') : t('titleCreate')}
            </h1>
          </div>
          <div className='flex items-center gap-4'>
            <div className='px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-200'>
              <span className='text-sm font-medium text-gray-600'>
                {t('wordCount', { count: wordCount })}
              </span>
              <span className='mx-2 text-gray-400'>•</span>
              <span className='text-sm font-medium text-gray-600'>
                {t('characterCount', { count: characterCount })}
              </span>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setPreviewMode(!previewMode)}
              className='shadow-sm hover:shadow-md transition-shadow'
            >
              <Eye className='h-4 w-4 mr-2' />
              {previewMode ? t('editButton') : t('previewButton')}
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={onSave}
              disabled={loading}
              className='shadow-sm hover:shadow-md transition-shadow hover:bg-blue-50'
            >
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              <Save className='h-4 w-4 mr-2' />
              {t('saveDraftButton')}
            </Button>
            <Button
              size='sm'
              onClick={onPublish}
              disabled={loading}
              className='hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all'
            >
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {t('publishButton')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
