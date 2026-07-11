import { ApiResponse } from '@/configs/axios/types'

export type AdminMediaType = 'IMAGE' | 'VIDEO'
export type AdminMediaSourceType = 'UPLOAD' | 'YOUTUBE' | 'TIKTOK'
export type AdminMediaStatus = 'PENDING' | 'ACTIVE' | 'ARCHIVED' | 'DELETED'

export interface AdminMediaResponse {
  mediaId: number
  listingId: number | null
  userId: string
  mediaType: AdminMediaType
  sourceType: AdminMediaSourceType
  status: AdminMediaStatus
  url: string
  thumbnailUrl: string | null
  title: string | null
  description: string | null
  altText: string | null
  isPrimary: boolean
  sortOrder: number
  fileSize: number | null
  mimeType: string | null
  originalFilename: string | null
  durationSeconds: number | null
  uploadConfirmed: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminUploadMediaRequest {
  file: File
  mediaType: AdminMediaType
  listingId?: number
  title?: string
  description?: string
  altText?: string
  isPrimary?: boolean
  sortOrder?: number
}

export interface AdminMediaListFilter {
  status?: AdminMediaStatus
  page?: number
  size?: number
}

export interface AdminCreateUploadUrlRequest {
  mediaType: AdminMediaType
  filename: string
  contentType: string
  fileSize: number
  listingId?: number
  title?: string
  description?: string
  altText?: string
  isPrimary?: boolean
  sortOrder?: number
}

export interface AdminCreateUploadUrlResponse {
  mediaId: number
  uploadUrl: string
  expiresIn: number
  storageKey: string
  message: string
}

export interface AdminConfirmUploadRequest {
  checksum?: string
  contentType?: string
}

export type AdminMediaApiResponse = ApiResponse<AdminMediaResponse>
export type AdminMediaListApiResponse = ApiResponse<AdminMediaResponse[]>
export type AdminCreateUploadUrlApiResponse =
  ApiResponse<AdminCreateUploadUrlResponse>
