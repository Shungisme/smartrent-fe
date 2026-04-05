import { apiRequest } from '@/configs/axios/axiosClient'
import { ApiResponse } from '@/configs/axios/types'
import { PATHS } from '@/api/paths'
import {
  AdminMediaApiResponse,
  AdminMediaListApiResponse,
  AdminMediaListFilter,
  AdminMediaResponse,
  AdminUploadMediaRequest,
} from '@/api/types/admin-media.type'

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

export class AdminMediaService {
  static async uploadMedia(
    request: AdminUploadMediaRequest,
  ): Promise<AdminMediaApiResponse> {
    const formData = new FormData()
    formData.append('file', request.file)
    formData.append('mediaType', request.mediaType)

    if (request.listingId !== null && request.listingId !== undefined) {
      formData.append('listingId', String(request.listingId))
    }
    if (request.title) {
      formData.append('title', request.title)
    }
    if (request.description) {
      formData.append('description', request.description)
    }
    if (request.altText) {
      formData.append('altText', request.altText)
    }
    if (request.isPrimary !== null && request.isPrimary !== undefined) {
      formData.append('isPrimary', String(request.isPrimary))
    }
    if (request.sortOrder !== null && request.sortOrder !== undefined) {
      formData.append('sortOrder', String(request.sortOrder))
    }

    return apiRequest<AdminMediaResponse>({
      method: 'POST',
      url: PATHS.ADMIN_MEDIA.UPLOAD,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  static async getAllMedia(
    filter?: AdminMediaListFilter,
  ): Promise<AdminMediaListApiResponse> {
    const query = buildQuery({
      status: filter?.status,
      page: filter?.page ?? 0,
      size: filter?.size ?? 20,
    })

    const url = query
      ? `${PATHS.ADMIN_MEDIA.LIST}?${query}`
      : PATHS.ADMIN_MEDIA.LIST

    return apiRequest<AdminMediaResponse[]>({
      method: 'GET',
      url,
    })
  }

  static async getMediaById(
    mediaId: number | string,
  ): Promise<AdminMediaApiResponse> {
    return apiRequest<AdminMediaResponse>({
      method: 'GET',
      url: replacePathParam(PATHS.ADMIN_MEDIA.DETAIL, 'mediaId', mediaId),
    })
  }

  static async deleteMedia(
    mediaId: number | string,
  ): Promise<ApiResponse<void>> {
    return apiRequest<void>({
      method: 'DELETE',
      url: replacePathParam(PATHS.ADMIN_MEDIA.DELETE, 'mediaId', mediaId),
    })
  }
}
