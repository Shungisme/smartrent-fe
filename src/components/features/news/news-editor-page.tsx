'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
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
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { TableKitPlus } from 'tiptap-table-plus'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import slugify from 'react-slugify'
import { Loader2 } from 'lucide-react'
import { NewsService } from '@/api/services/news.service'
import { NewsCreateRequest, NewsUpdateRequest } from '@/api/types/news.type'
import { EditorFormData } from '@/types/news-editor.type'
import type { Resolver } from 'react-hook-form'
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

  const newsEditorSchema = useMemo(
    () =>
      z.object({
        title: z.string().trim().min(1, t('validation.titleRequired')),
        slug: z.string(),
        summary: z.string(),
        category: z.enum([
          'NEWS',
          'BLOG',
          'POLICY',
          'MARKET',
          'PROJECT',
          'INVESTMENT',
          'GUIDE',
        ]),
        tags: z.string(),
        thumbnailUrl: z.string(),
        status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
        metaTitle: z.string(),
        metaDescription: z.string(),
        metaKeywords: z.string(),
      }),
    [t],
  )

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<EditorFormData>({
    resolver: zodResolver(newsEditorSchema) as Resolver<EditorFormData>,
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
      TextStyle,
      Color,
      Highlight,
      Subscript,
      Superscript,
      TableKitPlus.configure({
        table: {
          resizable: true,
          lastColumnResizable: true,
          allowTableNodeSelection: true,
          cellMinWidth: 80,
        },
      }),
      // extend image to be a block/atom node, allow selection and textAlign attribute
      Image.extend({
        inline: false,
        group: 'block',
        draggable: true,
        addAttributes() {
          return {
            ...this.parent?.(),
            textAlign: {
              default: null,
              parseHTML: (element) => element.style?.textAlign || null,
              renderHTML: (attributes) => {
                if (!attributes.textAlign) return {}
                return { style: `text-align: ${attributes.textAlign};` }
              },
            },
          }
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
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
        class:
          'prose prose-sm max-w-none focus:outline-none min-h-[420px] p-6 text-foreground dark:prose-invert',
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
        router.push('/content/news')
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
        const updateData = buildPayload(data, content) as NewsUpdateRequest
        const updateResponse = await NewsService.updateNews(
          newsId as number,
          updateData,
        )

        if (updateResponse.code !== SUCCESS_CODE) {
          toast.error(updateResponse.message || t('messages.updateError'))
          return
        }

        const targetNewsId = updateResponse.data?.newsId ?? (newsId as number)

        if (data.status === 'PUBLISHED') {
          const publishResponse = await NewsService.publishNews(targetNewsId)
          if (publishResponse.code !== SUCCESS_CODE) {
            toast.error(publishResponse.message || t('messages.updateError'))
            return
          }
        }

        if (data.status === 'DRAFT') {
          const unpublishResponse =
            await NewsService.unpublishNews(targetNewsId)
          if (unpublishResponse.code !== SUCCESS_CODE) {
            toast.error(unpublishResponse.message || t('messages.updateError'))
            return
          }
        }

        if (data.status === 'ARCHIVED') {
          const archiveResponse = await NewsService.archiveNews(targetNewsId)
          if (archiveResponse.code !== SUCCESS_CODE) {
            toast.error(archiveResponse.message || t('messages.updateError'))
            return
          }
        }

        toast.success(t('messages.updateSuccess'))
        router.push('/content/news')
      } else {
        const createData = buildPayload(data, content) as NewsCreateRequest
        const createResponse = await NewsService.createNews(createData)

        if (createResponse.code !== SUCCESS_CODE || !createResponse.data) {
          toast.error(createResponse.message || t('messages.createError'))
          return
        }

        const targetNewsId = createResponse.data.newsId

        if (data.status === 'PUBLISHED') {
          const publishResponse = await NewsService.publishNews(targetNewsId)
          if (publishResponse.code !== SUCCESS_CODE) {
            toast.error(publishResponse.message || t('messages.createError'))
            return
          }
        }

        if (data.status === 'ARCHIVED') {
          const archiveResponse = await NewsService.archiveNews(targetNewsId)
          if (archiveResponse.code !== SUCCESS_CODE) {
            toast.error(archiveResponse.message || t('messages.createError'))
            return
          }
        }

        toast.success(t('messages.createSuccess'))
        router.push('/content/news')
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
      toast.success(t('messages.imageInserted'))
    } catch (error) {
      console.error('Error uploading content image:', error)
      toast.error(t('messages.uploadImageFailed'))
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
      toast.success(t('messages.uploadThumbnailSuccess'))
    } catch (error) {
      console.error('Error uploading thumbnail:', error)
      toast.error(t('messages.uploadThumbnailFailed'))
    } finally {
      setUploadingThumbnail(false)
    }
  }

  if (loading) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    )
  }

  return (
    <div>
      <input
        ref={contentImageInputRef}
        type='file'
        accept='image/*'
        onChange={handleContentImageSelected}
        className='hidden'
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <NewsEditorHeader
          wordCount={wordCount}
          characterCount={characterCount}
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
          onSave={handleSubmit(onSubmit)}
          loading={saveLoading}
        />

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
          <div className='order-1 space-y-4 lg:col-span-8'>
            <div className='rounded-xl border border-border/70 bg-card px-6 py-4 shadow-sm transition-shadow hover:shadow-md'>
              <input
                {...register('title', { required: true })}
                type='text'
                placeholder={t('form.titlePlaceholder')}
                className='w-full border-none bg-transparent text-3xl font-semibold tracking-tight text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-0 sm:text-4xl'
              />
            </div>

            <div className='overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md'>
              {!previewMode ? (
                <>
                  <NewsEditorMenuBar
                    editor={editor}
                    onSelectImage={() => contentImageInputRef.current?.click()}
                    isUploadingImage={uploadingContentImage}
                  />
                  <div className='min-h-[50vh] max-h-[50vh] overflow-y-auto'>
                    <EditorContent editor={editor} />
                  </div>
                </>
              ) : (
                <div className='bg-muted/40 p-6 sm:p-10'>
                  <div className='mx-auto max-w-4xl rounded-xl border border-border/60 bg-card p-8 shadow-sm sm:p-12'>
                    <h2 className='mb-6 inline-block border-b-2 border-primary pb-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl'>
                      {watch('title')}
                    </h2>
                    <div
                      className='news-editor-preview prose prose-lg mt-6 max-w-none dark:prose-invert'
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
  )
}

export default NewsEditor
