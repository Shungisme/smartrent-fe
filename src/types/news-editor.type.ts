import { NewsStatus } from '@/api/types/news.type'
import { NewsCategory } from '@/api/types/news.type'

export interface EditorFormData {
  title: string
  slug: string
  summary: string
  category: NewsCategory
  tags: string
  thumbnailUrl: string
  status: NewsStatus
  metaTitle: string
  metaDescription: string
  metaKeywords: string
}
