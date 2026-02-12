import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
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
import { NextPageWithLayout } from '@/types/next-page'
import { Loader2 } from 'lucide-react'
import { NewsService } from '@/api/services/news.service'
import { CreateNewsRequest, UpdateNewsRequest } from '@/api/types/news.type'
import { EditorFormData } from '@/types/news-editor.type'
import { NewsEditorMenuBar } from '@/components/molecules/editor/NewsEditorMenuBar'
import { NewsEditorHeader } from '@/components/organisms/news/NewsEditorHeader'
import { NewsMetaForm } from '@/components/organisms/news/NewsMetaForm'

const NewsEditor: NextPageWithLayout = () => {
  const router = useRouter()
  const t = useTranslations('news.editor')
  const { id } = router.query
  const isEditMode = !!id

  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(
    null,
  )
  const [wordCount, setWordCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)

  const {
    register,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<EditorFormData>({
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
        placeholder: t('form.contentPlaceholder'),
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

  // Update word and character counts when editor content changes
  useEffect(() => {
    if (!editor) return

    const updateCounts = () => {
      setWordCount(editor.storage.characterCount.words())
      setCharacterCount(editor.storage.characterCount.characters())
    }

    // Set initial counts
    updateCounts()

    // Listen to content changes
    editor.on('update', updateCounts)

    return () => {
      editor.off('update', updateCounts)
    }
  }, [editor])

  // Auto-save functionality - Disabled to prevent infinite loop
  // TODO: Implement proper auto-save with debounce and stable dependencies
  /*
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
  */

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
        toast.error(t('messages.notFound'))
        router.push('/news')
      }
    } catch (error) {
      console.error('Error fetching news:', error)
      toast.error(t('messages.fetchError'))
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
      toast.error(t('messages.contentRequired'))
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
          toast.success(t('messages.updateSuccess'))
          router.push('/news')
        } else {
          toast.error(response.message || t('messages.updateError'))
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
          toast.success(t('messages.createSuccess'))
          router.push('/news')
        } else {
          toast.error(response.message || t('messages.createError'))
        }
      }
    } catch (error) {
      console.error('Error saving news:', error)
      toast.error(t('messages.saveError'))
    } finally {
      setSaveLoading(false)
    }
  }

  const handlePublish = () => {
    setValue('status', 'PUBLISHED')
    setValue('published_at', new Date().toISOString())
    handleSubmit(onSubmit)()
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <NewsEditorHeader
        isEditMode={isEditMode}
        wordCount={wordCount}
        characterCount={characterCount}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        onSave={handleSubmit(onSubmit)}
        onPublish={handlePublish}
        loading={saveLoading}
      />

      {/* Main Content */}
      <div className='py-10'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Editor Section */}
            <div className='lg:col-span-2 space-y-6'>
              {/* Title */}
              <div className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-8 border border-gray-100'>
                <input
                  {...register('title', { required: true })}
                  type='text'
                  placeholder={t('form.titlePlaceholder')}
                  className='w-full text-4xl font-bold border-none focus:outline-none focus:ring-0 placeholder-gray-300 text-gray-900'
                />
              </div>

              {/* Editor */}
              <div className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100'>
                {!previewMode ? (
                  <>
                    <NewsEditorMenuBar editor={editor} />
                    <EditorContent editor={editor} />
                  </>
                ) : (
                  <div className='p-10 bg-gradient-to-br from-gray-50 to-white'>
                    <div className='max-w-4xl mx-auto bg-white p-12 rounded-lg shadow-xl'>
                      <h2 className='text-4xl font-bold mb-6 text-gray-900 border-b-4 border-blue-500 pb-4 inline-block'>
                        {watch('title')}
                      </h2>
                      <div
                        className='prose prose-lg max-w-none mt-8'
                        dangerouslySetInnerHTML={{
                          __html: editor?.getHTML() || '',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className='space-y-4'>
              <NewsMetaForm
                register={register}
                watch={watch}
                setValue={setValue}
                errors={errors}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

NewsEditor.getLayout = (page: React.ReactNode) => (
  <AdminLayout activeItem='news'>{page}</AdminLayout>
)

export default NewsEditor
