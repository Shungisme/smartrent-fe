import { NewsCategory, NewsStatus } from '@/api/types/news.type'

export const getCategoryBadgeClass = (category: NewsCategory): string => {
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

export const getStatusBadgeClass = (status: NewsStatus): string => {
  const colors: Record<NewsStatus, string> = {
    DRAFT: 'border-warning/30 bg-warning/15 text-warning-foreground',
    PUBLISHED: 'border-success/30 bg-success/12 text-success-foreground',
    ARCHIVED: 'border-border bg-muted text-foreground/70',
  }
  return colors[status]
}

/** Matches fe's `Typography variant='pageTitle'` (text-title / md:text-title-lg). */
export const ARTICLE_TITLE_CLASS =
  'text-[1.375rem] leading-[1.75rem] md:text-[1.625rem] md:leading-[2rem] font-bold tracking-tight text-foreground'

/** Matches fe's featured-image container in NewsDetailContent. */
export const ARTICLE_IMAGE_CONTAINER_CLASS =
  'relative aspect-video w-full overflow-hidden rounded-2xl shadow-sm ring-1 ring-border/10'

export const isValidImageSrc = (src: unknown): src is string => {
  if (typeof src !== 'string') return false
  const normalized = src.trim()
  return normalized.startsWith('/') || /^https?:\/\//i.test(normalized)
}
