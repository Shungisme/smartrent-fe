import { ApiResponse } from './api.type'

/**
 * News Status Enum
 * Maps to database ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED')
 */
export type NewsStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

/**
 * News Category Enum
 * Maps to database ENUM('NEWS', 'BLOG')
 */
export type NewsCategory = 'NEWS' | 'BLOG'

/**
 * News Entity
 * Maps to the news table in database
 */
export interface News {
  news_id: number
  title: string
  slug: string
  summary: string | null
  content: string // HTML content
  category: NewsCategory
  tags: string | null // Comma-separated tags
  thumbnail_url: string | null
  status: NewsStatus
  published_at: string | null // ISO datetime string
  author_id: string | null // Admin ID
  author_name: string | null // Display name
  view_count: number
  meta_title: string | null // SEO meta title
  meta_description: string | null // SEO meta description
  meta_keywords: string | null // SEO keywords
  created_at: string // ISO datetime string
  updated_at: string // ISO datetime string
}

/**
 * Create News Request DTO
 */
export interface CreateNewsRequest {
  title: string
  slug: string
  summary?: string
  content: string
  category: NewsCategory
  tags?: string
  thumbnail_url?: string
  status?: NewsStatus
  published_at?: string
  author_name?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
}

/**
 * Update News Request DTO
 */
export interface UpdateNewsRequest {
  title?: string
  slug?: string
  summary?: string
  content?: string
  category?: NewsCategory
  tags?: string
  thumbnail_url?: string
  status?: NewsStatus
  published_at?: string
  author_name?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
}

/**
 * News Filter Request
 * For searching and filtering news list
 */
export interface NewsFilterRequest {
  page?: number // 0-indexed
  size?: number // Page size
  keyword?: string // Search in title, summary, content
  category?: NewsCategory
  status?: NewsStatus
  author_id?: string
  sortBy?: 'NEWEST' | 'OLDEST' | 'MOST_VIEWED' | 'TITLE_ASC' | 'TITLE_DESC'
}

/**
 * News List Response
 * Paginated response for news list
 */
export interface NewsListResponse {
  news: News[]
  totalCount: number
  totalPages: number
  currentPage: number
  pageSize: number
  statistics: NewsStatistics
}

/**
 * News Statistics
 */
export interface NewsStatistics {
  totalNews: number
  totalPublished: number
  totalDrafts: number
  totalArchived: number
  totalBlogs: number
}

/**
 * API Response wrapper for News
 */
export type NewsApiResponse = ApiResponse<News>
export type NewsListApiResponse = ApiResponse<NewsListResponse>
