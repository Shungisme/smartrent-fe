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
import { ImagePlus, Loader2, X } from 'lucide-react'
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

const INPUT_CLASS =
  'w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30 transition-[border-color,box-shadow]'

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

  const clearThumbnail = () => {
    setValue('thumbnailUrl', '', { shouldDirty: true })
    setShowNewThumbnailPreview(false)
  }

  return (
    <div className='sticky top-6 space-y-4'>
      <Tabs defaultValue='settings' className='w-full'>
        <TabsList className='w-full p-1'>
          <TabsTrigger value='settings' className='flex-1'>
            {t('tabs.settings')}
          </TabsTrigger>
          <TabsTrigger value='seo' className='flex-1'>
            {t('tabs.seo')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value='settings' className='space-y-4'>
          <div className='space-y-4 rounded-xl border border-border/70 bg-card p-5 shadow-sm'>
            <div className='space-y-1.5'>
              <Label
                htmlFor='slug'
                className='text-xs font-medium text-muted-foreground'
              >
                {t('slug')}
              </Label>
              <input
                {...register('slug', { required: true })}
                id='slug'
                type='text'
                className={INPUT_CLASS}
              />
            </div>

            <div className='space-y-1.5'>
              <Label
                htmlFor='category'
                className='text-xs font-medium text-muted-foreground'
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

            <div className='space-y-1.5'>
              <Label
                htmlFor='status'
                className='text-xs font-medium text-muted-foreground'
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

            <div className='space-y-1.5'>
              <Label
                htmlFor='summary'
                className='text-xs font-medium text-muted-foreground'
              >
                {t('summary')}
              </Label>
              <textarea
                {...register('summary')}
                id='summary'
                rows={3}
                className={`${INPUT_CLASS} resize-none`}
                placeholder={t('summaryPlaceholder')}
              />
            </div>

            <div className='space-y-1.5'>
              <Label
                htmlFor='tags'
                className='text-xs font-medium text-muted-foreground'
              >
                {t('tags')}
              </Label>
              <input
                {...register('tags')}
                id='tags'
                type='text'
                className={INPUT_CLASS}
                placeholder={t('tagsPlaceholder')}
              />
            </div>

            <div className='space-y-1.5'>
              <Label className='text-xs font-medium text-muted-foreground'>
                {t('thumbnail')}
              </Label>
              <input
                ref={thumbnailInputRef}
                type='file'
                accept='image/*'
                onChange={handleThumbnailChange}
                className='hidden'
              />
              {showNewThumbnailPreview && thumbnailUrl ? (
                <div className='space-y-2'>
                  <div className='group relative overflow-hidden rounded-lg border border-border/60'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnailUrl}
                      alt='Thumbnail preview'
                      className='h-32 w-full object-cover'
                    />
                    <button
                      type='button'
                      onClick={clearThumbnail}
                      className='absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-muted-foreground opacity-0 shadow-sm transition-opacity hover:text-destructive group-hover:opacity-100'
                      aria-label='Remove thumbnail'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
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
                </div>
              ) : (
                <button
                  type='button'
                  onClick={() => thumbnailInputRef.current?.click()}
                  disabled={!onThumbnailSelect || isUploadingThumbnail}
                  className='flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {isUploadingThumbnail ? (
                    <Loader2 className='h-5 w-5 animate-spin' />
                  ) : (
                    <ImagePlus className='h-5 w-5' />
                  )}
                  <span className='text-xs'>
                    {isUploadingThumbnail
                      ? t('uploadingThumbnail')
                      : t('addThumbnail')}
                  </span>
                </button>
              )}
              <input
                {...register('thumbnailUrl')}
                type='hidden'
                id='thumbnailUrl'
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value='seo' className='space-y-4'>
          <div className='space-y-4 rounded-xl border border-border/70 bg-card p-5 shadow-sm'>
            <div className='space-y-1.5'>
              <Label
                htmlFor='metaTitle'
                className='text-xs font-medium text-muted-foreground'
              >
                {t('metaTitle')}
              </Label>
              <input
                {...register('metaTitle')}
                id='metaTitle'
                type='text'
                className={INPUT_CLASS}
                placeholder={t('metaTitlePlaceholder')}
              />
            </div>

            <div className='space-y-1.5'>
              <Label
                htmlFor='metaDescription'
                className='text-xs font-medium text-muted-foreground'
              >
                {t('metaDescription')}
              </Label>
              <textarea
                {...register('metaDescription')}
                id='metaDescription'
                rows={3}
                className={`${INPUT_CLASS} resize-none`}
                placeholder={t('metaDescriptionPlaceholder')}
              />
            </div>

            <div className='space-y-1.5'>
              <Label
                htmlFor='metaKeywords'
                className='text-xs font-medium text-muted-foreground'
              >
                {t('metaKeywords')}
              </Label>
              <input
                {...register('metaKeywords')}
                id='metaKeywords'
                type='text'
                className={INPUT_CLASS}
                placeholder={t('metaKeywordsPlaceholder')}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
