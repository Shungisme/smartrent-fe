import React from 'react'
import { useTranslations } from 'next-intl'
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
} from 'react-hook-form'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/atoms/tabs'
import { Label } from '@/components/atoms/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select'
import { Button } from '@/components/atoms/button'
import { ImagePlus, Loader2 } from 'lucide-react'
import { EditorFormData } from '@/types/news-editor.type'
import { NewsCategory, NewsStatus } from '@/api/types/news.type'

interface NewsMetaFormProps {
  register: UseFormRegister<EditorFormData>
  watch: UseFormWatch<EditorFormData>
  setValue: UseFormSetValue<EditorFormData>
  errors?: FieldErrors<EditorFormData>
  onThumbnailSelect?: (file: File) => void | Promise<void>
  isUploadingThumbnail?: boolean
}

export const NewsMetaForm: React.FC<NewsMetaFormProps> = ({
  register,
  watch,
  setValue,
  onThumbnailSelect,
  isUploadingThumbnail = false,
}) => {
  const t = useTranslations('news.editor.meta')
  const tStatus = useTranslations('news.status')
  const tCategory = useTranslations('news.category')
  const thumbnailUrl = watch('thumbnailUrl')
  const thumbnailInputRef = React.useRef<HTMLInputElement | null>(null)
  const [showNewThumbnailPreview, setShowNewThumbnailPreview] =
    React.useState(false)

  React.useEffect(() => {
    if (thumbnailUrl) {
      setShowNewThumbnailPreview(true)
    }
  }, [thumbnailUrl])

  const handleThumbnailChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file || !onThumbnailSelect) return

    await onThumbnailSelect(file)
    setShowNewThumbnailPreview(true)
    event.target.value = ''
  }

  return (
    <div className='sticky top-6 space-y-4'>
      <Tabs defaultValue='settings' className='w-full'>
        <TabsList className='w-full p-1'>
          <TabsTrigger
            value='settings'
            className='flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all'
          >
            {t('tabs.settings')}
          </TabsTrigger>
          <TabsTrigger
            value='seo'
            className='flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all'
          >
            {t('tabs.seo')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value='settings' className='space-y-4'>
          <div className='bg-white rounded-xl shadow-md transition-shadow p-5 border border-gray-100 space-y-4'>
            <div className='space-y-2'>
              <Label
                htmlFor='slug'
                className='text-sm font-semibold text-gray-700'
              >
                {t('slug')}
              </Label>
              <input
                {...register('slug', { required: true })}
                id='slug'
                type='text'
                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
              />
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='category'
                className='text-sm font-semibold text-gray-700'
              >
                {t('category')}
              </Label>
              <Select
                value={watch('category')}
                onValueChange={(value) =>
                  setValue('category', value as NewsCategory)
                }
              >
                <SelectTrigger id='category'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='NEWS'>{tCategory('NEWS')}</SelectItem>
                  <SelectItem value='BLOG'>{tCategory('BLOG')}</SelectItem>
                  <SelectItem value='POLICY'>{tCategory('POLICY')}</SelectItem>
                  <SelectItem value='MARKET'>{tCategory('MARKET')}</SelectItem>
                  <SelectItem value='PROJECT'>
                    {tCategory('PROJECT')}
                  </SelectItem>
                  <SelectItem value='INVESTMENT'>
                    {tCategory('INVESTMENT')}
                  </SelectItem>
                  <SelectItem value='GUIDE'>{tCategory('GUIDE')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='status'
                className='text-sm font-semibold text-gray-700'
              >
                {t('status')}
              </Label>
              <Select
                value={watch('status')}
                onValueChange={(value) =>
                  setValue('status', value as NewsStatus)
                }
              >
                <SelectTrigger id='status'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='DRAFT'>{tStatus('DRAFT')}</SelectItem>
                  <SelectItem value='PUBLISHED'>
                    {tStatus('PUBLISHED')}
                  </SelectItem>
                  <SelectItem value='ARCHIVED'>
                    {tStatus('ARCHIVED')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='summary'
                className='text-sm font-semibold text-gray-700'
              >
                {t('summary')}
              </Label>
              <textarea
                {...register('summary')}
                id='summary'
                rows={3}
                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none'
                placeholder={t('summaryPlaceholder')}
              />
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='tags'
                className='text-sm font-semibold text-gray-700'
              >
                {t('tags')}
              </Label>
              <input
                {...register('tags')}
                id='tags'
                type='text'
                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                placeholder={t('tagsPlaceholder')}
              />
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='thumbnailUrl'
                className='text-sm font-semibold text-gray-700'
              >
                {t('thumbnail')}
              </Label>
              <input
                ref={thumbnailInputRef}
                type='file'
                accept='image/*'
                onChange={handleThumbnailChange}
                className='hidden'
              />
              <Button
                type='button'
                variant='outline'
                className='w-full justify-center gap-2'
                onClick={() => thumbnailInputRef.current?.click()}
                disabled={!onThumbnailSelect || isUploadingThumbnail}
              >
                {isUploadingThumbnail ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <ImagePlus className='h-4 w-4' />
                )}
                {isUploadingThumbnail
                  ? t('uploadingThumbnail')
                  : t('addThumbnail')}
              </Button>
              <input
                {...register('thumbnailUrl')}
                type='hidden'
                id='thumbnailUrl'
              />
              {showNewThumbnailPreview && thumbnailUrl ? (
                <>
                  <img
                    src={thumbnailUrl}
                    alt='Thumbnail preview'
                    className='h-32 w-full rounded-lg border border-gray-200 object-cover'
                  />
                  <p className='break-all text-xs text-gray-500'>
                    {thumbnailUrl}
                  </p>
                </>
              ) : null}
            </div>
          </div>
        </TabsContent>

        <TabsContent value='seo' className='space-y-4'>
          <div className='bg-white rounded-xl shadow-md transition-shadow p-5 border border-gray-100 space-y-4'>
            <div className='space-y-2'>
              <Label
                htmlFor='metaTitle'
                className='text-sm font-semibold text-gray-700'
              >
                {t('metaTitle')}
              </Label>
              <input
                {...register('metaTitle')}
                id='metaTitle'
                type='text'
                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                placeholder={t('metaTitlePlaceholder')}
              />
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='metaDescription'
                className='text-sm font-semibold text-gray-700'
              >
                {t('metaDescription')}
              </Label>
              <textarea
                {...register('metaDescription')}
                id='metaDescription'
                rows={3}
                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none'
                placeholder={t('metaDescriptionPlaceholder')}
              />
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='metaKeywords'
                className='text-sm font-semibold text-gray-700'
              >
                {t('metaKeywords')}
              </Label>
              <input
                {...register('metaKeywords')}
                id='metaKeywords'
                type='text'
                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                placeholder={t('metaKeywordsPlaceholder')}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
