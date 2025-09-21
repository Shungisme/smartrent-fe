import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card'
import { useTranslations } from 'next-intl'
import { useCreatePost } from '@/contexts/createPost'
import { Link2 } from 'lucide-react'

const VideoUrl: React.FC = () => {
  const t = useTranslations('createPost.sections.media')
  const { propertyInfo, updatePropertyInfo } = useCreatePost()

  return (
    <Card className='mb-6 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg sm:text-xl flex items-center gap-2'>
          <Link2 className='w-4 h-4' /> {t('video.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <input
          type='url'
          placeholder={t('video.placeholder')}
          value={propertyInfo.videoUrl}
          onChange={(e) => updatePropertyInfo({ videoUrl: e.target.value })}
          className='w-full h-12 sm:h-12 px-3 sm:px-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm'
        />
        <p className='text-xs sm:text-sm text-gray-500 mt-2'>
          {t('video.help')}
        </p>
      </CardContent>
    </Card>
  )
}

export { VideoUrl }
