import axios from 'axios'
import { apiRequest } from '@/configs/axios/axiosClient'
import { ApiResponse } from '@/configs/axios/types'
import { PATHS } from '@/api/paths'
import {
  AdminConfirmUploadRequest,
  AdminCreateUploadUrlApiResponse,
  AdminCreateUploadUrlRequest,
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

  static async createUploadUrl(
    request: AdminCreateUploadUrlRequest,
  ): Promise<AdminCreateUploadUrlApiResponse> {
    return apiRequest({
      method: 'POST',
      url: PATHS.ADMIN_MEDIA.UPLOAD_URL,
      data: request,
    })
  }

  static async confirmUpload(
    mediaId: number,
    request: AdminConfirmUploadRequest,
  ): Promise<AdminMediaApiResponse> {
    return apiRequest<AdminMediaResponse>({
      method: 'POST',
      url: replacePathParam(PATHS.ADMIN_MEDIA.CONFIRM, 'mediaId', mediaId),
      data: request,
    })
  }

  /**
   * Upload a file directly to R2 via a presigned URL instead of proxying
   * the bytes through the backend: request a presigned PUT URL, upload the
   * file straight to R2, then confirm so the backend flips the media record
   * to ACTIVE.
   */
  static async uploadViaPresign(
    request: Omit<
      AdminCreateUploadUrlRequest,
      'filename' | 'contentType' | 'fileSize'
    > & {
      file: File
    },
  ): Promise<AdminMediaApiResponse> {
    const { file, ...rest } = request

    const presignResponse = await AdminMediaService.createUploadUrl({
      ...rest,
      filename: file.name,
      contentType: file.type,
      fileSize: file.size,
    })

    if (!presignResponse.success || !presignResponse.data) {
      return presignResponse as unknown as AdminMediaApiResponse
    }

    const { mediaId, uploadUrl } = presignResponse.data

    // Raw axios (not the app's client): must skip the Bearer token,
    // baseURL, and response interceptors, or R2 rejects the signed request.
    await axios.put(uploadUrl, file, {
      headers: { 'Content-Type': file.type },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    })

    return AdminMediaService.confirmUpload(mediaId, { contentType: file.type })
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
