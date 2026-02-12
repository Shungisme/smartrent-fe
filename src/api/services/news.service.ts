import { apiRequest } from '@/configs/axios/axiosClient'
import { PATHS } from '@/api/paths'
import {
  News,
  NewsListResponse,
  NewsFilterRequest,
  CreateNewsRequest,
  UpdateNewsRequest,
  NewsApiResponse,
  NewsListApiResponse,
  NewsCategory,
  NewsStatus,
} from '@/api/types/news.type'

/**
 * Mock data storage key
 */
const MOCK_NEWS_STORAGE_KEY = 'mock_news_data'
const MOCK_NEWS_ID_COUNTER_KEY = 'mock_news_id_counter'

/**
 * Get mock news data from localStorage
 */
const getMockNewsData = (): News[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(MOCK_NEWS_STORAGE_KEY)
  return data ? JSON.parse(data) : generateInitialMockData()
}

/**
 * Save mock news data to localStorage
 */
const saveMockNewsData = (data: News[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(MOCK_NEWS_STORAGE_KEY, JSON.stringify(data))
}

/**
 * Get and increment news ID counter
 */
const getNextNewsId = (): number => {
  if (typeof window === 'undefined') return 1
  const counter = localStorage.getItem(MOCK_NEWS_ID_COUNTER_KEY)
  const currentId = counter ? parseInt(counter, 10) : 1
  localStorage.setItem(MOCK_NEWS_ID_COUNTER_KEY, String(currentId + 1))
  return currentId
}

/**
 * Generate initial mock data
 */
const generateInitialMockData = (): News[] => {
  const now = new Date().toISOString()
  const mockData: News[] = [
    {
      news_id: 1,
      title: 'Thị trường bất động sản 2026: Xu hướng và dự báo',
      slug: 'thi-truong-bat-dong-san-2026-xu-huong-va-du-bao',
      summary:
        'Phân tích các xu hướng chính của thị trường bất động sản trong năm 2026 và những dự báo cho tương lai.',
      content:
        '<h1>Thị trường bất động sản 2026</h1><p>Thị trường bất động sản Việt Nam đang chứng kiến nhiều thay đổi tích cực...</p><h2>Xu hướng nổi bật</h2><ul><li>Tăng trưởng của căn hộ thông minh</li><li>Phát triển bền vững</li><li>Công nghệ trong quản lý tài sản</li></ul>',
      category: 'NEWS',
      tags: 'bất động sản, xu hướng, 2026',
      thumbnail_url: 'https://picsum.photos/seed/news1/800/600',
      status: 'PUBLISHED',
      published_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      author_id: 'admin-001',
      author_name: 'Nguyễn Văn A',
      view_count: 1234,
      meta_title: 'Thị trường bất động sản 2026 - Xu hướng và dự báo',
      meta_description:
        'Cập nhật các xu hướng mới nhất của thị trường bất động sản năm 2026',
      meta_keywords: 'bất động sản, xu hướng 2026, thị trường',
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      news_id: 2,
      title: 'Hướng dẫn cho thuê căn hộ hiệu quả',
      slug: 'huong-dan-cho-thue-can-ho-hieu-qua',
      summary:
        'Những mẹo và chiến lược giúp bạn cho thuê căn hộ nhanh chóng với giá tốt nhất.',
      content:
        '<h1>Cho thuê căn hộ hiệu quả</h1><p>Việc cho thuê căn hộ đòi hỏi nhiều chiến lược và kỹ năng...</p><h2>Các bước cơ bản</h2><ol><li>Chuẩn bị căn hộ</li><li>Chụp ảnh chuyên nghiệp</li><li>Đăng tin đúng cách</li></ol>',
      category: 'BLOG',
      tags: 'cho thuê, căn hộ, hướng dẫn',
      thumbnail_url: 'https://picsum.photos/seed/news2/800/600',
      status: 'PUBLISHED',
      published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      author_id: 'admin-001',
      author_name: 'Nguyễn Văn A',
      view_count: 856,
      meta_title: 'Hướng dẫn cho thuê căn hộ hiệu quả',
      meta_description: 'Mẹo và chiến lược cho thuê căn hộ nhanh chóng',
      meta_keywords: 'cho thuê căn hộ, hướng dẫn, bất động sản',
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      news_id: 3,
      title: 'Cập nhật chính sách thuế bất động sản mới',
      slug: 'cap-nhat-chinh-sach-thue-bat-dong-san-moi',
      summary:
        'Tổng hợp các chính sách thuế bất động sản mới có hiệu lực từ Q2/2026.',
      content:
        '<h1>Chính sách thuế mới</h1><p>Chính phủ vừa công bố các chính sách thuế mới...</p>',
      category: 'NEWS',
      tags: 'thuế, chính sách, quy định',
      thumbnail_url: 'https://picsum.photos/seed/news3/800/600',
      status: 'DRAFT',
      published_at: null,
      author_id: 'admin-002',
      author_name: 'Trần Thị B',
      view_count: 0,
      meta_title: null,
      meta_description: null,
      meta_keywords: null,
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
  ]

  saveMockNewsData(mockData)
  localStorage.setItem(MOCK_NEWS_ID_COUNTER_KEY, '4')
  return mockData
}

/**
 * Mock delay to simulate API call
 */
const mockDelay = (ms = 300): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * News Service for Admin Portal
 * Currently using mock data stored in localStorage
 * Will be replaced with real API calls when backend is ready
 */
export class NewsService {
  /**
   * Get paginated news list with filters
   * POST /v1/news/list
   */
  static async getNewsList(
    filter?: NewsFilterRequest,
  ): Promise<NewsListApiResponse> {
    await mockDelay()

    const allNews = getMockNewsData()
    let filteredNews = [...allNews]

    // Apply filters
    if (filter?.keyword) {
      const keyword = filter.keyword.toLowerCase()
      filteredNews = filteredNews.filter(
        (news) =>
          news.title.toLowerCase().includes(keyword) ||
          news.summary?.toLowerCase().includes(keyword) ||
          news.content.toLowerCase().includes(keyword),
      )
    }

    if (filter?.category) {
      filteredNews = filteredNews.filter(
        (news) => news.category === filter.category,
      )
    }

    if (filter?.status) {
      filteredNews = filteredNews.filter(
        (news) => news.status === filter.status,
      )
    }

    if (filter?.author_id) {
      filteredNews = filteredNews.filter(
        (news) => news.author_id === filter.author_id,
      )
    }

    // Apply sorting
    const sortBy = filter?.sortBy || 'NEWEST'
    switch (sortBy) {
      case 'NEWEST':
        filteredNews.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        break
      case 'OLDEST':
        filteredNews.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )
        break
      case 'MOST_VIEWED':
        filteredNews.sort((a, b) => b.view_count - a.view_count)
        break
      case 'TITLE_ASC':
        filteredNews.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'TITLE_DESC':
        filteredNews.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    // Pagination
    const page = filter?.page || 0
    const size = filter?.size || 20
    const totalCount = filteredNews.length
    const totalPages = Math.ceil(totalCount / size)
    const startIndex = page * size
    const endIndex = startIndex + size
    const paginatedNews = filteredNews.slice(startIndex, endIndex)

    // Calculate statistics
    const statistics = {
      totalNews: allNews.length,
      totalPublished: allNews.filter((n) => n.status === 'PUBLISHED').length,
      totalDrafts: allNews.filter((n) => n.status === 'DRAFT').length,
      totalArchived: allNews.filter((n) => n.status === 'ARCHIVED').length,
      totalBlogs: allNews.filter((n) => n.category === 'BLOG').length,
    }

    return {
      code: '1000',
      message: 'Success',
      success: true,
      data: {
        news: paginatedNews,
        totalCount,
        totalPages,
        currentPage: page,
        pageSize: size,
        statistics,
      },
    }
  }

  /**
   * Get single news by ID
   * GET /v1/news/:id
   */
  static async getNewsById(id: number): Promise<NewsApiResponse> {
    await mockDelay()

    const allNews = getMockNewsData()
    const news = allNews.find((n) => n.news_id === id)

    if (!news) {
      return {
        code: '9999',
        message: 'News not found',
        success: false,
        data: null,
      }
    }

    return {
      code: '1000',
      message: 'Success',
      success: true,
      data: news,
    }
  }

  /**
   * Create new news
   * POST /v1/news
   */
  static async createNews(
    request: CreateNewsRequest,
  ): Promise<NewsApiResponse> {
    await mockDelay()

    const allNews = getMockNewsData()

    // Check if slug already exists
    const slugExists = allNews.some((n) => n.slug === request.slug)
    if (slugExists) {
      return {
        code: '9999',
        message: 'Slug already exists',
        success: false,
        data: null,
      }
    }

    const now = new Date().toISOString()
    const newNews: News = {
      news_id: getNextNewsId(),
      title: request.title,
      slug: request.slug,
      summary: request.summary || null,
      content: request.content,
      category: request.category,
      tags: request.tags || null,
      thumbnail_url: request.thumbnail_url || null,
      status: request.status || 'DRAFT',
      published_at: request.published_at || null,
      author_id: 'admin-001', // Mock admin ID
      author_name: request.author_name || 'Admin User',
      view_count: 0,
      meta_title: request.meta_title || null,
      meta_description: request.meta_description || null,
      meta_keywords: request.meta_keywords || null,
      created_at: now,
      updated_at: now,
    }

    allNews.push(newNews)
    saveMockNewsData(allNews)

    return {
      code: '1000',
      message: 'News created successfully',
      success: true,
      data: newNews,
    }
  }

  /**
   * Update existing news
   * PUT /v1/news/:id
   */
  static async updateNews(
    id: number,
    request: UpdateNewsRequest,
  ): Promise<NewsApiResponse> {
    await mockDelay()

    const allNews = getMockNewsData()
    const newsIndex = allNews.findIndex((n) => n.news_id === id)

    if (newsIndex === -1) {
      return {
        code: '9999',
        message: 'News not found',
        success: false,
        data: null,
      }
    }

    // Check if new slug already exists (if slug is being updated)
    if (request.slug && request.slug !== allNews[newsIndex].slug) {
      const slugExists = allNews.some((n) => n.slug === request.slug)
      if (slugExists) {
        return {
          code: '9999',
          message: 'Slug already exists',
          success: false,
          data: null,
        }
      }
    }

    const updatedNews: News = {
      ...allNews[newsIndex],
      ...request,
      updated_at: new Date().toISOString(),
    }

    allNews[newsIndex] = updatedNews
    saveMockNewsData(allNews)

    return {
      code: '1000',
      message: 'News updated successfully',
      success: true,
      data: updatedNews,
    }
  }

  /**
   * Delete news
   * DELETE /v1/news/:id
   */
  static async deleteNews(id: number): Promise<NewsApiResponse> {
    await mockDelay()

    const allNews = getMockNewsData()
    const newsIndex = allNews.findIndex((n) => n.news_id === id)

    if (newsIndex === -1) {
      return {
        code: '9999',
        message: 'News not found',
        success: false,
        data: null,
      }
    }

    const deletedNews = allNews[newsIndex]
    allNews.splice(newsIndex, 1)
    saveMockNewsData(allNews)

    return {
      code: '1000',
      message: 'News deleted successfully',
      success: true,
      data: deletedNews,
    }
  }

  /**
   * Publish a draft news
   * PUT /v1/news/:id/publish
   */
  static async publishNews(id: number): Promise<NewsApiResponse> {
    await mockDelay()

    const allNews = getMockNewsData()
    const newsIndex = allNews.findIndex((n) => n.news_id === id)

    if (newsIndex === -1) {
      return {
        code: '9999',
        message: 'News not found',
        success: false,
        data: null,
      }
    }

    const now = new Date().toISOString()
    allNews[newsIndex] = {
      ...allNews[newsIndex],
      status: 'PUBLISHED',
      published_at: now,
      updated_at: now,
    }

    saveMockNewsData(allNews)

    return {
      code: '1000',
      message: 'News published successfully',
      success: true,
      data: allNews[newsIndex],
    }
  }
}
