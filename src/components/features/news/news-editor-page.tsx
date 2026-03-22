'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
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
import { Loader2 } from 'lucide-react'
import { NewsService } from '@/api/services/news.service'
import { NewsCreateRequest, NewsUpdateRequest } from '@/api/types/news.type'
import { EditorFormData } from '@/types/news-editor.type'
import { NewsEditorMenuBar } from '@/components/molecules/editor/NewsEditorMenuBar'
import { NewsEditorHeader } from '@/components/organisms/news/NewsEditorHeader'
import { NewsMetaForm } from '@/components/organisms/news/NewsMetaForm'

const SUCCESS_CODE = '999999'

const NewsEditor = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('news.editor')
  const idParam = searchParams?.get('id')
  const newsId = idParam ? Number(idParam) : null
  const isEditMode = newsId !== null && !Number.isNaN(newsId)

  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)
  const [pendingContent, setPendingContent] = useState<string | null>(null)
  const [uploadingContentImage, setUploadingContentImage] = useState(false)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const contentImageInputRef = useRef<HTMLInputElement | null>(null)

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<EditorFormData>({
    defaultValues: {
      title: '',
      slug: '',
      summary: '',
      category: 'NEWS',
      tags: '',
      thumbnailUrl: '',
      status: 'DRAFT',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    },
  })

  const title = watch('title')

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
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
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[320px] p-6',
      },
    },
  })

  useEffect(() => {
    if (isEditMode && newsId !== null) {
      fetchNews(newsId)
    }
  }, [newsId, isEditMode])

  useEffect(() => {
    if (title && !isEditMode) {
      setValue('slug', slugify(title))
    }
  }, [title, isEditMode, setValue])

  useEffect(() => {
    if (!editor) return

    const updateCounts = () => {
      setWordCount(editor.storage.characterCount.words())
      setCharacterCount(editor.storage.characterCount.characters())
    }

    updateCounts()
    editor.on('update', updateCounts)

    return () => {
      editor.off('update', updateCounts)
    }
  }, [editor])

  useEffect(() => {
    if (!editor || pendingContent === null) return
    editor.commands.setContent(pendingContent)
    setPendingContent(null)
  }, [editor, pendingContent])

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
        setValue('tags', news.tags.join(', '))
        setValue('thumbnailUrl', news.thumbnailUrl || '')
        setValue('status', news.status)
        setValue('metaTitle', news.metaTitle || '')
        setValue('metaDescription', news.metaDescription || '')
        setValue('metaKeywords', news.metaKeywords || '')
        setPendingContent(news.content)

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

  const buildPayload = (
    data: EditorFormData,
    content: string,
  ): NewsCreateRequest | NewsUpdateRequest => ({
    title: data.title,
    summary: data.summary || undefined,
    content,
    category: data.category,
    tags: data.tags || undefined,
    thumbnailUrl: data.thumbnailUrl || undefined,
    metaTitle: data.metaTitle || undefined,
    metaDescription: data.metaDescription || undefined,
    metaKeywords: data.metaKeywords || undefined,
  })

  const onSubmit = async (data: EditorFormData, publish = false) => {
    if (!editor) return

    const content = editor.getHTML()
    if (!content.trim() || content === '<p></p>') {
      toast.error(t('messages.contentRequired'))
      return
    }

    try {
      setSaveLoading(true)

      if (isEditMode) {
        const updateData = buildPayload(data, content) as NewsUpdateRequest
        const updateResponse = await NewsService.updateNews(
          newsId as number,
          updateData,
        )

        if (updateResponse.code !== SUCCESS_CODE) {
          toast.error(updateResponse.message || t('messages.updateError'))
          return
        }

        if (publish && updateResponse.data) {
          const publishResponse = await NewsService.publishNews(
            updateResponse.data.newsId,
          )
          if (publishResponse.code !== SUCCESS_CODE) {
            toast.error(publishResponse.message || t('messages.updateError'))
            return
          }
        }

        toast.success(
          publish ? t('messages.updateSuccess') : t('messages.updateSuccess'),
        )
        router.push('/news')
      } else {
        const createData = buildPayload(data, content) as NewsCreateRequest
        const createResponse = await NewsService.createNews(createData)

        if (createResponse.code !== SUCCESS_CODE || !createResponse.data) {
          toast.error(createResponse.message || t('messages.createError'))
          return
        }

        if (publish) {
          const publishResponse = await NewsService.publishNews(
            createResponse.data.newsId,
          )
          if (publishResponse.code !== SUCCESS_CODE) {
            toast.error(publishResponse.message || t('messages.createError'))
            return
          }
        }

        toast.success(t('messages.createSuccess'))
        router.push('/news')
      }
    } catch (error) {
      console.error('Error saving news:', error)
      toast.error(t('messages.saveError'))
    } finally {
      setSaveLoading(false)
    }
  }

  const uploadImageAndGetUrl = async (file: File) => {
    const response = await NewsService.uploadImage(file)

    if (response.code !== SUCCESS_CODE || !response.data?.url) {
      throw new Error(response.message || 'Image upload failed')
    }

    return response.data.url
  }

  const handleContentImageSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file || !editor) return

    try {
      setUploadingContentImage(true)
      const imageUrl = await uploadImageAndGetUrl(file)
      editor
        .chain()
        .focus()
        .setImage({ src: imageUrl, alt: file.name, title: file.name })
        .run()
      toast.success('Image inserted')
    } catch (error) {
      console.error('Error uploading content image:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploadingContentImage(false)
      event.target.value = ''
    }
  }

  const handleThumbnailSelect = async (file: File) => {
    try {
      setUploadingThumbnail(true)
      const imageUrl = await uploadImageAndGetUrl(file)
      setValue('thumbnailUrl', imageUrl, {
        shouldDirty: true,
      })
      toast.success('Thumbnail uploaded')
    } catch (error) {
      console.error('Error uploading thumbnail:', error)
      toast.error('Failed to upload thumbnail')
    } finally {
      setUploadingThumbnail(false)
    }
  }

  const handlePublish = () => {
    handleSubmit((data) => onSubmit(data, true))()
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    )
  }

  return (
    <div className='min-h-screen'>
      <div>
        <input
          ref={contentImageInputRef}
          type='file'
          accept='image/*'
          onChange={handleContentImageSelected}
          className='hidden'
        />
        <form onSubmit={handleSubmit((data) => onSubmit(data, false))}>
          <NewsEditorHeader
            wordCount={wordCount}
            characterCount={characterCount}
            previewMode={previewMode}
            setPreviewMode={setPreviewMode}
            onSave={handleSubmit((data) => onSubmit(data, false))}
            onPublish={handlePublish}
            loading={saveLoading}
          />

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8'>
            <div className='order-1 space-y-6 lg:col-span-8'>
              <div className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 px-8 py-4 border border-gray-100'>
                <input
                  {...register('title', { required: true })}
                  type='text'
                  placeholder={t('form.titlePlaceholder')}
                  className='w-full text-4xl font-bold border-none focus:outline-none focus:ring-0 placeholder-gray-300 text-gray-900'
                />
              </div>

              <div className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100'>
                {!previewMode ? (
                  <>
                    <NewsEditorMenuBar
                      editor={editor}
                      onSelectImage={() =>
                        contentImageInputRef.current?.click()
                      }
                      isUploadingImage={uploadingContentImage}
                    />
                    <div className='min-h-[320px] max-h-[60vh] overflow-y-auto'>
                      <EditorContent editor={editor} />
                    </div>
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

            <div className='order-2 space-y-4 lg:col-span-4'>
              <NewsMetaForm
                register={register}
                watch={watch}
                setValue={setValue}
                errors={errors}
                onThumbnailSelect={handleThumbnailSelect}
                isUploadingThumbnail={uploadingThumbnail}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewsEditor
