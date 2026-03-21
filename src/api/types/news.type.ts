import { ApiResponse } from '@/configs/axios/types'

export type NewsCategory =
  | 'NEWS'
  | 'BLOG'
  | 'POLICY'
  | 'MARKET'
  | 'PROJECT'
  | 'INVESTMENT'
  | 'GUIDE'

export type NewsStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface NewsCreateRequest {
  title: string
  summary?: string
  content: string
  category: NewsCategory
  tags?: string
  thumbnailUrl?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
}

export interface NewsUpdateRequest {
  title?: string
  summary?: string
  content?: string
  category?: NewsCategory
  tags?: string
  thumbnailUrl?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
}

export interface NewsResponse {
  newsId: number
  title: string
  slug: string
  summary: string
  content: string
  category: NewsCategory
  tags: string[]
  thumbnailUrl: string
  status: NewsStatus
  publishedAt: string | null
  authorId: string
  authorName: string
  viewCount: number
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  createdAt: string
  updatedAt: string
}

export interface NewsSummaryResponse {
  newsId: number
  title: string
  slug: string
  summary: string
  category: NewsCategory
  tags: string[]
  thumbnailUrl: string
  status?: NewsStatus
  publishedAt: string | null
  authorName: string
  viewCount: number
  createdAt: string
}

export interface NewsDetailResponse {
  newsId: number
  title: string
  slug: string
  summary: string
  content: string
  category: NewsCategory
  tags: string[]
  thumbnailUrl: string
  publishedAt: string | null
  authorName: string
  viewCount: number
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  createdAt: string
  updatedAt: string
  relatedNews: NewsSummaryResponse[]
}

export interface NewsListResponse {
  news: NewsSummaryResponse[]
  totalItems: number
  currentPage: number
  pageSize: number
  totalPages: number
}

export interface NewsStatistics {
  totalNews: number
  totalPublished: number
  totalDrafts: number
  totalArchived: number
  totalBlogs: number
}

export interface NewsFilterRequest {
  page?: number
  size?: number
  status?: NewsStatus
  category?: NewsCategory
  keyword?: string
  tag?: string
}

export type NewsApiResponse = ApiResponse<NewsResponse>
export type NewsListApiResponse = ApiResponse<NewsListResponse>
export type NewsDetailApiResponse = ApiResponse<NewsDetailResponse>
export type NewestNewsApiResponse = ApiResponse<NewsSummaryResponse[]>
