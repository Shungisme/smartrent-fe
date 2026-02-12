import React from 'react'
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
  return (
    <div className='space-y-4'>
      <Tabs defaultValue='settings' className='w-full'>
        <TabsList className='w-full'>
          <TabsTrigger value='settings' className='flex-1'>
            Cài đặt
          </TabsTrigger>
          <TabsTrigger value='seo' className='flex-1'>
            SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value='settings' className='space-y-4'>
          {/* Slug */}
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <Label htmlFor='slug'>Slug (URL)</Label>
            <input
              {...register('slug', { required: true })}
              id='slug'
              type='text'
              className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Category */}
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <Label htmlFor='category'>Danh mục</Label>
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
                <SelectItem value='NEWS'>Tin tức</SelectItem>
                <SelectItem value='BLOG'>Blog</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <Label htmlFor='status'>Trạng thái</Label>
            <Select
              value={watch('status')}
              onValueChange={(value) => setValue('status', value as NewsStatus)}
            >
              <SelectTrigger id='status' className='mt-1'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='DRAFT'>Bản nháp</SelectItem>
                <SelectItem value='PUBLISHED'>Đã xuất bản</SelectItem>
                <SelectItem value='ARCHIVED'>Lưu trữ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary */}
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <Label htmlFor='summary'>Tóm tắt</Label>
            <textarea
              {...register('summary')}
              id='summary'
              rows={3}
              className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Tóm tắt ngắn gọn...'
            />
          </div>

          {/* Tags */}
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <Label htmlFor='tags'>Tags (phân cách bằng dấu phẩy)</Label>
            <input
              {...register('tags')}
              id='tags'
              type='text'
              className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='tag1, tag2, tag3'
            />
          </div>

          {/* Thumbnail */}
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <Label htmlFor='thumbnail_url'>URL Ảnh đại diện</Label>
            <input
              {...register('thumbnail_url')}
              id='thumbnail_url'
              type='text'
              className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='https://...'
            />
          </div>

          {/* Author */}
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <Label htmlFor='author_name'>Tên tác giả</Label>
            <input
              {...register('author_name')}
              id='author_name'
              type='text'
              className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Tên tác giả...'
            />
          </div>
        </TabsContent>

        <TabsContent value='seo' className='space-y-4'>
          {/* Meta Title */}
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <Label htmlFor='meta_title'>Meta Title</Label>
            <input
              {...register('meta_title')}
              id='meta_title'
              type='text'
              className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='SEO title...'
            />
          </div>

          {/* Meta Description */}
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <Label htmlFor='meta_description'>Meta Description</Label>
            <textarea
              {...register('meta_description')}
              id='meta_description'
              rows={3}
              className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='SEO description...'
            />
          </div>

          {/* Meta Keywords */}
          {/* Note: In original code, meta_keywords was used in logic but not clearly in the form. Added here if needed or reused existing field logic if it was there. Checking original file... it was at line 454/515 but not in JSX?
          Wait, I need to check the original file again. Line 454: setValue('meta_keywords', news.meta_keywords || '').
          Lines 777-800 show SEO tab. It has meta_title and meta_description. It does not seem to have meta_keywords in the JSX in the original snippet I viewed (up to line 800).
          However, line 81 maps to meta_keywords.
          I'll assume it might be missing or down below line 800. I'll add it if it's in the data structure.
          Actually, I viewed up to line 800. Let's check if there is more content.
          The file size was 27412 bytes. 800 lines shown.
          Let's view the end of the file to be sure.
          */}
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <Label htmlFor='meta_keywords'>Meta Keywords</Label>
            <input
              {...register('meta_keywords')}
              id='meta_keywords'
              type='text'
              className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='keyword1, keyword2, keyword3'
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
