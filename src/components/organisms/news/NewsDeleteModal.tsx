import React from 'react'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'
import { Loader2 } from 'lucide-react'
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('deleteModal.title')}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p className='text-sm text-gray-600'>
            {t('deleteModal.description', { title: news?.title || '' })}
          </p>
          <div className='flex justify-end gap-3'>
            <Button
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t('deleteModal.cancelButton')}
            </Button>
            <Button
              variant='destructive'
              onClick={onConfirm}
              disabled={loading}
            >
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {t('deleteModal.confirmButton')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
