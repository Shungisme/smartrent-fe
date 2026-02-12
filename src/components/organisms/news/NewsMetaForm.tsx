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
import { NewsCategory, NewsStatus } from '@/api/types/news.type'
import { EditorFormData } from '@/types/news-editor.type'

interface NewsMetaFormProps {
  register: UseFormRegister<EditorFormData>
  watch: UseFormWatch<EditorFormData>
  setValue: UseFormSetValue<EditorFormData>
  errors?: FieldErrors<EditorFormData>
}

export const NewsMetaForm: React.FC<NewsMetaFormProps> = ({
  register,
  watch,
  setValue,
}) => {
  const t = useTranslations('news.editor.meta')
  const tStatus = useTranslations('news.status')
  const tCategory = useTranslations('news.category')

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
          {/* Slug */}
          <div className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100'>
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
              className='mt-2 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
            />
          </div>

          {/* Category */}
          <div className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100'>
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
              <SelectTrigger id='category' className='mt-1'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='NEWS'>{tCategory('NEWS')}</SelectItem>
                <SelectItem value='BLOG'>{tCategory('BLOG')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100'>
            <Label
              htmlFor='status'
              className='text-sm font-semibold text-gray-700'
            >
              {t('status')}
            </Label>
            <Select
              value={watch('status')}
              onValueChange={(value) => setValue('status', value as NewsStatus)}
            >
              <SelectTrigger id='status' className='mt-1'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='DRAFT'>{tStatus('DRAFT')}</SelectItem>
                <SelectItem value='PUBLISHED'>
                  {tStatus('PUBLISHED')}
                </SelectItem>
                <SelectItem value='ARCHIVED'>{tStatus('ARCHIVED')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary */}
          <div className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100'>
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
              className='mt-2 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none'
              placeholder={t('summaryPlaceholder')}
            />
          </div>

          {/* Tags */}
          <div className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100'>
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
              className='mt-2 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
              placeholder={t('tagsPlaceholder')}
            />
          </div>

          {/* Thumbnail */}
          <div className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100'>
            <Label
              htmlFor='thumbnail_url'
              className='text-sm font-semibold text-gray-700'
            >
              {t('thumbnail')}
            </Label>
            <input
              {...register('thumbnail_url')}
              id='thumbnail_url'
              type='text'
              className='mt-2 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
              placeholder={t('thumbnailPlaceholder')}
            />
          </div>

          {/* Author */}
          <div className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100'>
            <Label
              htmlFor='author_name'
              className='text-sm font-semibold text-gray-700'
            >
              {t('author')}
            </Label>
            <input
              {...register('author_name')}
              id='author_name'
              type='text'
              className='mt-2 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
              placeholder={t('authorPlaceholder')}
            />
          </div>
        </TabsContent>

        <TabsContent value='seo' className='space-y-4'>
          {/* Meta Title */}
          <div className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100'>
            <Label
              htmlFor='meta_title'
              className='text-sm font-semibold text-gray-700'
            >
              {t('metaTitle')}
            </Label>
            <input
              {...register('meta_title')}
              id='meta_title'
              type='text'
              className='mt-2 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
              placeholder={t('metaTitlePlaceholder')}
            />
          </div>

          {/* Meta Description */}
          <div className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100'>
            <Label
              htmlFor='meta_description'
              className='text-sm font-semibold text-gray-700'
            >
              {t('metaDescription')}
            </Label>
            <textarea
              {...register('meta_description')}
              id='meta_description'
              rows={3}
              className='mt-2 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none'
              placeholder={t('metaDescriptionPlaceholder')}
            />
          </div>

          {/* Meta Keywords */}
          <div className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100'>
            <Label
              htmlFor='meta_keywords'
              className='text-sm font-semibold text-gray-700'
            >
              {t('metaKeywords')}
            </Label>
            <input
              {...register('meta_keywords')}
              id='meta_keywords'
              type='text'
              className='mt-2 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
              placeholder={t('metaKeywordsPlaceholder')}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
