import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import slugify from 'react-slugify'
import AdminLayout from '@/components/layouts/AdminLayout'
import { Button } from '@/components/atoms/button'
import { NextPageWithLayout } from '@/types/next-page'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Minus,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Loader2,
  Save,
  Eye,
  ArrowLeft,
  FileText,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select'
import { Label } from '@/components/atoms/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/atoms/tabs'
import { Separator } from '@/components/atoms/separator'
import { NewsService } from '@/api/services/news.service'
import {
  News,
  NewsStatus,
  NewsCategory,
  CreateNewsRequest,
  UpdateNewsRequest,
} from '@/api/types/news.type'

interface EditorFormData {
  title: string
  slug: string
  summary: string
  category: NewsCategory
  tags: string
  thumbnail_url: string
  status: NewsStatus
  published_at: string
  author_name: string
  meta_title: string
  meta_description: string
  meta_keywords: string
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null

  const setLink = () => {
    const url = window.prompt('Nhập URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className='border-b border-gray-200 bg-white sticky top-0 z-10'>
      <div className='flex flex-wrap gap-1 p-2'>
        {/* Text formatting */}
        <div className='flex gap-1 pr-2 border-r'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-gray-200' : ''}
            title='Bold (Ctrl+B)'
          >
            <Bold className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-gray-200' : ''}
            title='Italic (Ctrl+I)'
          >
            <Italic className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'bg-gray-200' : ''}
            title='Underline (Ctrl+U)'
          >
            <UnderlineIcon className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'bg-gray-200' : ''}
            title='Strikethrough'
          >
            <Strikethrough className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? 'bg-gray-200' : ''}
            title='Inline Code'
          >
            <Code className='h-4 w-4' />
          </Button>
        </div>

        {/* Headings */}
        <div className='flex gap-1 pr-2 border-r'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
            }
            title='Heading 1'
          >
            <Heading1 className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
            }
            title='Heading 2'
          >
            <Heading2 className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''
            }
            title='Heading 3'
          >
            <Heading3 className='h-4 w-4' />
          </Button>
        </div>

        {/* Lists */}
        <div className='flex gap-1 pr-2 border-r'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
            title='Bullet List'
          >
            <List className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
            title='Numbered List'
          >
            <ListOrdered className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={editor.isActive('taskList') ? 'bg-gray-200' : ''}
            title='Task List'
          >
            <ListTodo className='h-4 w-4' />
          </Button>
        </div>

        {/* Alignment */}
        <div className='flex gap-1 pr-2 border-r'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={
              editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
            }
            title='Align Left'
          >
            <AlignLeft className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={
              editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
            }
            title='Align Center'
          >
            <AlignCenter className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={
              editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
            }
            title='Align Right'
          >
            <AlignRight className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={
              editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''
            }
            title='Justify'
          >
            <AlignJustify className='h-4 w-4' />
          </Button>
        </div>

        {/* Other */}
        <div className='flex gap-1 pr-2 border-r'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={setLink}
            className={editor.isActive('link') ? 'bg-gray-200' : ''}
            title='Insert Link'
          >
            <LinkIcon className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
            title='Quote'
          >
            <Quote className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title='Horizontal Rule'
          >
            <Minus className='h-4 w-4' />
          </Button>
        </div>

        {/* Undo/Redo */}
        <div className='flex gap-1'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title='Undo (Ctrl+Z)'
          >
            <Undo className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title='Redo (Ctrl+Y)'
          >
            <Redo className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}

const NewsEditor: NextPageWithLayout = () => {
  const router = useRouter()
  const { id } = router.query
  const isEditMode = !!id

  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(
    null,
  )

  const { register, watch, setValue, getValues, handleSubmit } =
    useForm<EditorFormData>({
      defaultValues: {
        title: '',
        slug: '',
        summary: '',
        category: 'NEWS',
        tags: '',
        thumbnail_url: '',
        status: 'DRAFT',
        published_at: '',
        author_name: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
      },
    })

  const title = watch('title')

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: 'Bắt đầu viết nội dung của bạn...',
      }),
      CharacterCount,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[500px] p-6',
      },
    },
  })

  useEffect(() => {
    if (isEditMode && id) {
      fetchNews(Number(id))
    }
  }, [id, isEditMode])

  useEffect(() => {
    if (title && !isEditMode) {
      const generatedSlug = slugify(title)
      setValue('slug', generatedSlug)
    }
  }, [title, isEditMode, setValue])

  // Auto-save functionality
  useEffect(() => {
    if (!isEditMode || !editor) return

    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }

    const timer = setTimeout(() => {
      handleAutoSave()
    }, 30000) // Auto-save every 30 seconds

    setAutoSaveTimer(timer)

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [editor?.getHTML(), watch()])

  const fetchNews = async (newsId: number) => {
    try {
      setLoading(true)
      const response = await NewsService.getNewsById(newsId)

      if (response.data) {
        const news = response.data
        setValue('title', news.title)
        setValue('slug', news.slug)
        setValue('summary', news.summary || '')
        setValue('category', news.category)
        setValue('tags', news.tags || '')
        setValue('thumbnail_url', news.thumbnail_url || '')
        setValue('status', news.status)
        setValue('published_at', news.published_at || '')
        setValue('author_name', news.author_name || '')
        setValue('meta_title', news.meta_title || '')
        setValue('meta_description', news.meta_description || '')
        setValue('meta_keywords', news.meta_keywords || '')

        if (editor) {
          editor.commands.setContent(news.content)
        }
      } else {
        toast.error('Không tìm thấy tin tức')
        router.push('/news')
      }
    } catch (error) {
      console.error('Error fetching news:', error)
      toast.error('Không thể tải tin tức')
    } finally {
      setLoading(false)
    }
  }

  const handleAutoSave = async () => {
    if (!isEditMode || !editor) return

    try {
      const formData = getValues()
      const updateData: UpdateNewsRequest = {
        ...formData,
        content: editor.getHTML(),
        summary: formData.summary || undefined,
        tags: formData.tags || undefined,
        thumbnail_url: formData.thumbnail_url || undefined,
        meta_title: formData.meta_title || undefined,
        meta_description: formData.meta_description || undefined,
        meta_keywords: formData.meta_keywords || undefined,
      }

      await NewsService.updateNews(Number(id), updateData)
      toast.success('Đã tự động lưu', { duration: 2000 })
    } catch (error) {
      console.error('Auto-save error:', error)
    }
  }

  const onSubmit = async (data: EditorFormData) => {
    if (!editor) return

    const content = editor.getHTML()
    if (!content.trim() || content === '<p></p>') {
      toast.error('Nội dung không được để trống')
      return
    }

    try {
      setSaveLoading(true)

      if (isEditMode) {
        const updateData: UpdateNewsRequest = {
          ...data,
          content,
          summary: data.summary || undefined,
          tags: data.tags || undefined,
          thumbnail_url: data.thumbnail_url || undefined,
          meta_title: data.meta_title || undefined,
          meta_description: data.meta_description || undefined,
          meta_keywords: data.meta_keywords || undefined,
        }

        const response = await NewsService.updateNews(Number(id), updateData)

        if (response.code === '1000') {
          toast.success('Cập nhật tin tức thành công')
          router.push('/news')
        } else {
          toast.error(response.message || 'Không thể cập nhật tin tức')
        }
      } else {
        const createData: CreateNewsRequest = {
          ...data,
          content,
          summary: data.summary || undefined,
          tags: data.tags || undefined,
          thumbnail_url: data.thumbnail_url || undefined,
          meta_title: data.meta_title || undefined,
          meta_description: data.meta_description || undefined,
          meta_keywords: data.meta_keywords || undefined,
        }

        const response = await NewsService.createNews(createData)

        if (response.code === '1000') {
          toast.success('Tạo tin tức thành công')
          router.push('/news')
        } else {
          toast.error(response.message || 'Không thể tạo tin tức')
        }
      }
    } catch (error) {
      console.error('Error saving news:', error)
      toast.error('Có lỗi xảy ra khi lưu tin tức')
    } finally {
      setSaveLoading(false)
    }
  }

  const handlePublish = () => {
    setValue('status', 'PUBLISHED')
    setValue('published_at', new Date().toISOString())
    handleSubmit(onSubmit)()
  }

  const wordCount = editor?.storage.characterCount.words() || 0
  const characterCount = editor?.storage.characterCount.characters() || 0

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
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
                onClick={handleSubmit(onSubmit)}
                disabled={saveLoading}
              >
                {saveLoading && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                <Save className='h-4 w-4 mr-2' />
                Lưu nháp
              </Button>
              <Button size='sm' onClick={handlePublish} disabled={saveLoading}>
                {saveLoading && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Xuất bản
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Editor Section */}
            <div className='lg:col-span-2 space-y-4'>
              {/* Title */}
              <div className='bg-white rounded-lg shadow-sm p-6'>
                <input
                  {...register('title', { required: true })}
                  type='text'
                  placeholder='Tiêu đề tin tức...'
                  className='w-full text-3xl font-bold border-none focus:outline-none focus:ring-0 placeholder-gray-400'
                />
              </div>

              {/* Editor */}
              <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
                {!previewMode ? (
                  <>
                    <MenuBar editor={editor} />
                    <EditorContent editor={editor} />
                  </>
                ) : (
                  <div className='p-6'>
                    <h2 className='text-3xl font-bold mb-4'>
                      {watch('title')}
                    </h2>
                    <div
                      className='prose prose-sm max-w-none'
                      dangerouslySetInnerHTML={{
                        __html: editor?.getHTML() || '',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
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
                      onValueChange={(value) =>
                        setValue('status', value as NewsStatus)
                      }
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
                  <div className='bg-white rounded-lg shadow-sm p-4'>
                    <Label htmlFor='meta_keywords'>
                      Meta Keywords (phân cách bằng dấu phẩy)
                    </Label>
                    <input
                      {...register('meta_keywords')}
                      id='meta_keywords'
                      type='text'
                      className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='keyword1, keyword2...'
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

NewsEditor.getLayout = (page: React.ReactNode) => (
  <AdminLayout>{page}</AdminLayout>
)

export default NewsEditor
