import React, { useRef } from 'react'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card'
import { Button } from '@/components/atoms/button'
import { useTranslations } from 'next-intl'
import { useCreatePost } from '@/contexts/createPost'
import { ImagePlus, Upload, Images, Star } from 'lucide-react'

const MAX_IMAGES = 24

const UploadImages: React.FC = () => {
  const t = useTranslations('createPost.sections.media')
  const { propertyInfo, updatePropertyInfo } = useCreatePost()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const current = propertyInfo.images
    const remaining = Math.max(0, MAX_IMAGES - current.length)
    const slice = Array.from(files).slice(0, remaining)

    const newItems = slice.map((file, idx) => ({
      id: `${Date.now()}-${idx}-${file.name}`,
      url: URL.createObjectURL(file),
      caption: file.name.replace(/\.[^.]+$/, ''),
      isCover: false,
    }))

    updatePropertyInfo({ images: [...current, ...newItems] })
  }

  const setCover = (id: string) => {
    updatePropertyInfo({
      images: propertyInfo.images.map((img) => ({
        ...img,
        isCover: img.id === id,
      })),
    })
  }

  const removeImage = (id: string) => {
    updatePropertyInfo({
      images: propertyInfo.images.filter((i) => i.id !== id),
    })
  }

  return (
    <Card className='mb-6 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
          <span className='text-lg sm:text-xl'>{t('title')}</span>
          <Button
            variant='outline'
            size='sm'
            className='rounded-lg w-full sm:w-auto'
          >
            {t('downloadSample')}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Dropzone */}
        <div
          className='rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-4 sm:p-6 flex flex-col items-center justify-center text-center bg-white dark:bg-gray-900/50'
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            handleFiles(e.dataTransfer.files)
          }}
        >
          <Upload className='w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-2' />
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            {t('dropzone.hint')}
          </p>
          <div className='flex flex-col sm:flex-row gap-3 mt-4 w-full sm:w-auto'>
            <Button
              className='rounded-lg w-full sm:w-auto'
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus className='w-4 h-4 mr-2' />
              {t('dropzone.uploadFromDevice')}
            </Button>
            <Button variant='outline' className='rounded-lg w-full sm:w-auto'>
              <Images className='w-4 h-4 mr-2' />
              {t('dropzone.chooseFromLibrary')}
            </Button>
          </div>
          <input
            ref={inputRef}
            type='file'
            accept='image/*'
            multiple
            className='hidden'
            onChange={(e) => handleFiles(e.target.files)}
          />
          <p className='text-xs text-gray-500 dark:text-gray-500 mt-3'>
            {t('dropzone.note')}
          </p>
        </div>

        {/* Uploaded list */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-600 dark:text-gray-400'>
              {t('uploaded.title')}
            </span>
            <span className='text-xs text-gray-500'>
              {propertyInfo.images.length}/{MAX_IMAGES}
            </span>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {propertyInfo.images.map((img) => (
              <div
                key={img.id}
                className={`relative rounded-xl overflow-hidden border ${
                  img.isCover
                    ? 'border-yellow-400'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.caption}
                  width={600}
                  height={400}
                  className='w-full h-44 sm:h-40 md:h-44 object-cover'
                />
                <div className='p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800'>
                  <p className='text-sm truncate'>{img.caption}</p>
                </div>
                <div className='absolute top-2 left-2 flex gap-2'>
                  {img.isCover && (
                    <span className='px-2 py-0.5 rounded-md text-xs bg-yellow-400 text-gray-900 font-medium'>
                      {t('uploaded.cover')}
                    </span>
                  )}
                </div>
                <div className='px-3 pb-3 md:px-0 md:pb-0'>
                  <div className='grid grid-cols-2 gap-2 md:absolute md:bottom-2 md:left-2 md:right-2 md:flex md:justify-between'>
                    <Button
                      size='sm'
                      variant='outline'
                      className='h-9 md:h-8 px-2 rounded-md w-full md:w-auto text-sm'
                      onClick={() => setCover(img.id)}
                    >
                      <Star className='w-3 h-3 mr-1' />
                      {t('uploaded.setCover')}
                    </Button>
                    <Button
                      size='sm'
                      variant='destructive'
                      className='h-9 md:h-8 px-2 rounded-md w-full md:w-auto text-sm'
                      onClick={() => removeImage(img.id)}
                    >
                      {t('uploaded.remove')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { UploadImages }
