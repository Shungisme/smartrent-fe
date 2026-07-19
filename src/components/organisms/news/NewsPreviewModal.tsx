import React, { useMemo } from 'react'
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
import { NewsResponse } from '@/api/types/news.type'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/utils/format'
import { sanitizeHtml } from '@/utils/sanitize-html'
import {
  getCategoryBadgeClass,
  getStatusBadgeClass,
  ARTICLE_TITLE_CLASS,
  ARTICLE_IMAGE_CONTAINER_CLASS,
  isValidImageSrc,
} from '@/utils/news-style'

interface NewsPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  news: NewsResponse | null
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

  const sanitizedContent = useMemo(
    () => sanitizeHtml(news?.content || ''),
    [news?.content],
  )

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
            <article className='space-y-5 px-6 py-6'>
              <header className='space-y-3'>
                <div className='flex flex-wrap items-center gap-1.5'>
                  <Badge
                    variant='outline'
                    className={cn(
                      'border-transparent',
                      getCategoryBadgeClass(news.category),
                    )}
                  >
                    {t(`category.${news.category}`)}
                  </Badge>
                  <Badge
                    variant='outline'
                    className={cn(
                      'border-transparent',
                      getStatusBadgeClass(news.status),
                    )}
                  >
                    {t(`status.${news.status}`)}
                  </Badge>
                </div>

                <h2 className={ARTICLE_TITLE_CLASS}>{news.title}</h2>

                {news.summary && (
                  <p className='text-base leading-relaxed text-muted-foreground'>
                    {news.summary}
                  </p>
                )}

                <div className='flex flex-wrap gap-x-4 gap-y-1.5 border-y border-border/60 py-3'>
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

              {/* Featured Image */}
              <div className={cn(ARTICLE_IMAGE_CONTAINER_CLASS, 'bg-muted')}>
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
              </div>

              <div
                className='news-article-content max-w-none'
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
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
