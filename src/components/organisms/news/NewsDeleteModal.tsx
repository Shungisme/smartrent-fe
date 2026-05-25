import React from 'react'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'
import { Loader2, Trash2 } from 'lucide-react'
import { NewsSummaryResponse } from '@/api/types/news.type'

interface NewsDeleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  news: NewsSummaryResponse | null
  loading: boolean
  onConfirm: () => void
}

export const NewsDeleteModal: React.FC<NewsDeleteModalProps> = ({
  open,
  onOpenChange,
  news,
  loading,
  onConfirm,
}) => {
  const t = useTranslations('news')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md sm:max-w-lg p-0 gap-0 overflow-hidden'>
        <DialogHeader className='px-6 pt-6 pb-2'>
          <div className='flex items-start gap-4'>
            <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/12 ring-1 ring-inset ring-destructive/25'>
              <Trash2 className='h-5 w-5 text-destructive' />
            </span>
            <div className='min-w-0 flex-1 space-y-1.5 pt-0.5 text-left'>
              <DialogTitle className='text-base font-semibold'>
                {t('deleteModal.title')}
              </DialogTitle>
              <p className='text-sm leading-relaxed text-muted-foreground'>
                {t('deleteModal.description', { title: news?.title || '' })}
              </p>
            </div>
          </div>
        </DialogHeader>
        <div className='flex justify-end gap-2 border-t border-border/60 bg-muted/30 px-6 py-4'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t('deleteModal.cancelButton')}
          </Button>
          <Button variant='destructive' onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {t('deleteModal.confirmButton')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
