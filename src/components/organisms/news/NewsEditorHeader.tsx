import React from 'react'
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

  return (
    <div className='bg-white border-b border-gray-200 sticky top-0 z-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.push('/news')}
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Quay lại
            </Button>
            <h1 className='text-xl font-semibold text-gray-900'>
              {isEditMode ? 'Chỉnh sửa tin tức' : 'Tạo tin tức mới'}
            </h1>
          </div>
          <div className='flex items-center gap-3'>
            <div className='text-sm text-gray-500'>
              {wordCount} từ • {characterCount} ký tự
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className='h-4 w-4 mr-2' />
              {previewMode ? 'Chỉnh sửa' : 'Xem trước'}
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={onSave}
              disabled={loading}
            >
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              <Save className='h-4 w-4 mr-2' />
              Lưu nháp
            </Button>
            <Button size='sm' onClick={onPublish} disabled={loading}>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Xuất bản
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
