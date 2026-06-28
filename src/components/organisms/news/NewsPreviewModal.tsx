import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Badge } from '@/components/atoms/badge'
import { Calendar, User, Eye, Tag, ImageOff } from 'lucide-react'
import { NewsResponse, NewsStatus, NewsCategory } from '@/api/types/news.type'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/utils/format'

interface NewsPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  news: NewsResponse | null
}

const getStatusClass = (status: NewsStatus): string => {
  const colors: Record<NewsStatus, string> = {
    DRAFT: 'border-warning/30 bg-warning/15 text-warning-foreground',
    PUBLISHED: 'border-success/30 bg-success/12 text-success-foreground',
    ARCHIVED: 'border-border bg-muted text-foreground/70',
  }
  return colors[status]
}

const getCategoryClass = (category: NewsCategory): string => {
  const colors: Record<NewsCategory, string> = {
    NEWS: 'border-blue-200/70 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300',
    BLOG: 'border-purple-200/70 bg-purple-50 text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300',
    POLICY:
      'border-orange-200/70 bg-orange-50 text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300',
    MARKET:
      'border-emerald-200/70 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
    PROJECT:
      'border-cyan-200/70 bg-cyan-50 text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300',
    INVESTMENT:
      'border-indigo-200/70 bg-indigo-50 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300',
    GUIDE:
      'border-pink-200/70 bg-pink-50 text-pink-700 dark:border-pink-500/30 dark:bg-pink-500/10 dark:text-pink-300',
  }
  return colors[category]
}

const isValidImageSrc = (src: unknown): src is string => {
  if (typeof src !== 'string') return false
  const normalized = src.trim()
  return normalized.startsWith('/') || /^https?:\/\//i.test(normalized)
}

const MetaItem: React.FC<{
  icon: React.ElementType
  children: React.ReactNode
}> = ({ icon: Icon, children }) => (
  <span className='inline-flex items-center gap-1.5 text-xs text-muted-foreground'>
    <Icon className='h-3.5 w-3.5' />
    {children}
  </span>
)

export const NewsPreviewModal: React.FC<NewsPreviewModalProps> = ({
  open,
  onOpenChange,
  news,
}) => {
  const t = useTranslations('news')

  const safeThumbnailSrc = isValidImageSrc(news?.thumbnailUrl)
    ? news.thumbnailUrl
    : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex w-[80vw] max-w-[1200px] max-h-[90vh] flex-col p-0 gap-0 overflow-hidden'>
        <DialogHeader className='shrink-0 border-b border-border/60 px-6 py-4'>
          <DialogTitle className='text-base font-semibold'>
            {t('previewModal.title')}
          </DialogTitle>
        </DialogHeader>

        {news && (
          <div className='min-h-0 flex-1 overflow-y-auto'>
            {/* Thumbnail or placeholder */}
            <div className='relative h-56 w-full overflow-hidden bg-muted sm:h-64'>
              {safeThumbnailSrc ? (
                <Image
                  src={safeThumbnailSrc}
                  alt={news.title}
                  fill
                  className='object-cover'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center text-muted-foreground/60'>
                  <ImageOff className='h-10 w-10' />
                </div>
              )}
              <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent p-5'>
                <div className='flex flex-wrap items-center gap-1.5'>
                  <Badge
                    variant='outline'
                    className={cn(
                      'border-transparent backdrop-blur',
                      getCategoryClass(news.category),
                    )}
                  >
                    {t(`category.${news.category}`)}
                  </Badge>
                  <Badge
                    variant='outline'
                    className={cn(
                      'border-transparent backdrop-blur',
                      getStatusClass(news.status),
                    )}
                  >
                    {t(`status.${news.status}`)}
                  </Badge>
                </div>
              </div>
            </div>

            <article className='space-y-5 px-6 py-6'>
              <header className='space-y-3'>
                <h2 className='text-2xl font-semibold leading-tight tracking-tight text-foreground'>
                  {news.title}
                </h2>
                <div className='flex flex-wrap gap-x-4 gap-y-1.5'>
                  <MetaItem icon={User}>
                    {news.authorName || t('notAvailable')}
                  </MetaItem>
                  <MetaItem icon={Calendar}>
                    {formatDateTime(news.createdAt)}
                  </MetaItem>
                  <MetaItem icon={Eye}>
                    {news.viewCount.toLocaleString()} {t('table.views')}
                  </MetaItem>
                </div>
              </header>

              {news.summary && (
                <blockquote className='rounded-lg border-l-2 border-primary/60 bg-muted/40 px-4 py-3 text-sm italic leading-relaxed text-foreground/80'>
                  {news.summary}
                </blockquote>
              )}

              <div
                className='news-editor-preview prose prose-sm max-w-none dark:prose-invert'
                dangerouslySetInnerHTML={{ __html: news.content }}
              />

              {news.tags && news.tags.length > 0 && (
                <div className='flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-4'>
                  <Tag className='h-3.5 w-3.5 text-muted-foreground' />
                  {news.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant='secondary' className='text-xs'>
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}

              {(news.metaTitle ||
                news.metaDescription ||
                news.metaKeywords) && (
                <section className='space-y-3 rounded-lg border border-border/70 bg-muted/30 p-4'>
                  <h3 className='text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
                    {t('previewModal.seoTitle')}
                  </h3>
                  <dl className='space-y-2 text-sm'>
                    {news.metaTitle && (
                      <div className='flex flex-col gap-0.5 sm:flex-row sm:gap-2'>
                        <dt className='text-xs font-medium text-muted-foreground sm:w-32 sm:shrink-0'>
                          {t('previewModal.metaTitleLabel')}
                        </dt>
                        <dd className='text-foreground'>{news.metaTitle}</dd>
                      </div>
                    )}
                    {news.metaDescription && (
                      <div className='flex flex-col gap-0.5 sm:flex-row sm:gap-2'>
                        <dt className='text-xs font-medium text-muted-foreground sm:w-32 sm:shrink-0'>
                          {t('previewModal.metaDescriptionLabel')}
                        </dt>
                        <dd className='text-foreground'>
                          {news.metaDescription}
                        </dd>
                      </div>
                    )}
                    {news.metaKeywords && (
                      <div className='flex flex-col gap-0.5 sm:flex-row sm:gap-2'>
                        <dt className='text-xs font-medium text-muted-foreground sm:w-32 sm:shrink-0'>
                          {t('previewModal.metaKeywordsLabel')}
                        </dt>
                        <dd className='text-foreground'>{news.metaKeywords}</dd>
                      </div>
                    )}
                  </dl>
                </section>
              )}
            </article>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
