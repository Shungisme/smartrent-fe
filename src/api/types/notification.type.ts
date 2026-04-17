import { ApiResponse } from '@/configs/axios/types'
import { PaginatedResponse } from './pagination.type'

// Notification types from backend
export enum NotificationType {
  NEW_REPORT = 'NEW_REPORT',
  LISTING_RESUBMITTED = 'LISTING_RESUBMITTED',
  BROKER_REGISTRATION_RECEIVED = 'BROKER_REGISTRATION_RECEIVED',
}

export enum ReferenceType {
  REPORT = 'REPORT',
  LISTING = 'LISTING',
}

// Notification interface
export interface Notification {
  id: number
  type: NotificationType
  title: string
  message: string
  referenceId: number | null
  referenceType: ReferenceType | null
  isRead: boolean
  createdAt: string // ISO 8601 format
}

// API request/response types
export interface NotificationsParams {
  page?: number
  size?: number
}

export interface UnreadCountResponse {
  unreadCount: number
}

// API response types
export type NotificationsResponse = ApiResponse<PaginatedResponse<Notification>>
export type UnreadCountApiResponse = ApiResponse<UnreadCountResponse>
export type MarkAsReadResponse = ApiResponse<void>
