import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'
import { Loader2 } from 'lucide-react'
import { News } from '@/api/types/news.type'

interface NewsDeleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  news: News | null
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p className='text-sm text-gray-600'>
            Bạn có chắc chắn muốn xóa tin tức "{news?.title}"? Hành động này
            không thể hoàn tác.
          </p>
          <div className='flex justify-end gap-3'>
            <Button
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              variant='destructive'
              onClick={onConfirm}
              disabled={loading}
            >
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Xóa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
