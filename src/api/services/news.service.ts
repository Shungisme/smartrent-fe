import { apiRequest } from '@/configs/axios/axiosClient'
import { PATHS } from '@/api/paths'
import {
  NewsApiResponse,
  NewsListApiResponse,
  NewsDetailApiResponse,
  NewsFilterRequest,
  NewsCreateRequest,
  NewsUpdateRequest,
  NewestNewsApiResponse,
} from '@/api/types/news.type'
import { ApiResponse } from '@/configs/axios/types'
import { AdminMediaService } from '@/api/services/admin-media.service'

const replacePathParam = (path: string, key: string, value: string | number) =>
  path.replace(`:${key}`, String(value))

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }
    query.set(key, String(value))
  })

  return query.toString()
}

export class NewsService {
  static async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
    const response = await AdminMediaService.uploadMedia({
      file,
      mediaType: 'IMAGE',
      title: file.name,
      altText: file.name,
    })

    return {
      ...response,
      data: response.data?.url ? { url: response.data.url } : null,
    }
  }

  static async getNewsList(
    filter?: NewsFilterRequest,
  ): Promise<NewsListApiResponse> {
    const query = buildQuery({
      page: filter?.page,
      size: filter?.size,
      status: filter?.status,
      category: filter?.category,
      keyword: filter?.keyword,
      tag: filter?.tag,
    })

    const url = query
      ? `${PATHS.NEWS.ADMIN_LIST}?${query}`
      : PATHS.NEWS.ADMIN_LIST

    return apiRequest({
      method: 'GET',
      url,
    })
  }

  static async getNewsById(id: number): Promise<NewsApiResponse> {
    return apiRequest({
      method: 'GET',
      url: replacePathParam(PATHS.NEWS.ADMIN_DETAIL, 'id', id),
    })
  }

  static async createNews(
    request: NewsCreateRequest,
  ): Promise<NewsApiResponse> {
    return apiRequest({
      method: 'POST',
      url: PATHS.NEWS.ADMIN_CREATE,
      data: request,
    })
  }

  static async updateNews(
    id: number,
    request: NewsUpdateRequest,
  ): Promise<NewsApiResponse> {
    return apiRequest({
      method: 'PUT',
      url: replacePathParam(PATHS.NEWS.ADMIN_UPDATE, 'id', id),
      data: request,
    })
  }

  static async deleteNews(id: number): Promise<ApiResponse<null>> {
    return apiRequest({
      method: 'DELETE',
      url: replacePathParam(PATHS.NEWS.ADMIN_DELETE, 'id', id),
    })
  }

  static async publishNews(id: number): Promise<NewsApiResponse> {
    return apiRequest({
      method: 'POST',
      url: replacePathParam(PATHS.NEWS.ADMIN_PUBLISH, 'id', id),
    })
  }

  static async unpublishNews(id: number): Promise<NewsApiResponse> {
    return apiRequest({
      method: 'POST',
      url: replacePathParam(PATHS.NEWS.ADMIN_UNPUBLISH, 'id', id),
    })
  }

  static async archiveNews(id: number): Promise<NewsApiResponse> {
    return apiRequest({
      method: 'POST',
      url: replacePathParam(PATHS.NEWS.ADMIN_ARCHIVE, 'id', id),
    })
  }

  static async getPublishedNews(
    filter?: NewsFilterRequest,
  ): Promise<NewsListApiResponse> {
    const query = buildQuery({
      page: filter?.page,
      size: filter?.size,
      category: filter?.category,
      keyword: filter?.keyword,
      tag: filter?.tag,
    })

    const url = query
      ? `${PATHS.NEWS.PUBLIC_LIST}?${query}`
      : PATHS.NEWS.PUBLIC_LIST

    return apiRequest({
      method: 'GET',
      url,
      skipAuth: true,
    })
  }

  static async getNewestNews(limit = 10): Promise<NewestNewsApiResponse> {
    return apiRequest({
      method: 'GET',
      url: `${PATHS.NEWS.NEWEST}?limit=${limit}`,
      skipAuth: true,
    })
  }

  static async getNewsDetail(slug: string): Promise<NewsDetailApiResponse> {
    return apiRequest({
      method: 'GET',
      url: replacePathParam(PATHS.NEWS.PUBLIC_DETAIL, 'slug', slug),
      skipAuth: true,
    })
  }
}
