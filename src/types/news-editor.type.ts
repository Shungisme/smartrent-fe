import { NewsCategory, NewsStatus } from '@/api/types/news.type'

export interface EditorFormData {
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
