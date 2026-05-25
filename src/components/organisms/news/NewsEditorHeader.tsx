import React from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/atoms/button'
import { cn } from '@/lib/utils'
import { Loader2, Eye, Pencil, Save, FileText, Hash } from 'lucide-react'

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
            : 'flex min-h-14 flex-wrap items-center justify-between gap-3',
        )}
      >
        <div
          className={cn(
            'inline-flex items-center gap-3 rounded-full border border-border/70 bg-card px-3 py-1.5 shadow-xs',
            compact && 'w-fit',
          )}
        >
          <span className='inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
            <FileText className='h-3.5 w-3.5' />
            {t('wordCount', { count: wordCount })}
          </span>
          <span className='h-3 w-px bg-border' aria-hidden />
          <span className='inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
            <Hash className='h-3.5 w-3.5' />
            {t('characterCount', { count: characterCount })}
          </span>
        </div>

        <div
          className={cn(
            'flex items-center gap-2',
            compact && 'grid grid-cols-1 gap-2',
          )}
        >
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? (
              <Pencil className='mr-1 h-4 w-4' />
            ) : (
              <Eye className='mr-1 h-4 w-4' />
            )}
            {previewMode ? t('editButton') : t('previewButton')}
          </Button>
          <Button type='button' size='sm' onClick={onSave} disabled={loading}>
            {loading ? (
              <Loader2 className='mr-1 h-4 w-4 animate-spin' />
            ) : (
              <Save className='mr-1 h-4 w-4' />
            )}
            {t('saveButton')}
          </Button>
        </div>
      </div>
    </div>
  )
}
