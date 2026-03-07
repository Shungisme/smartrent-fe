import { apiRequest } from '@/configs/axios/axiosClient'
import { PATHS } from '@/api/paths'
import {
  Notification,
  NotificationsParams,
  NotificationsResponse,
  UnreadCountApiResponse,
  MarkAsReadResponse,
} from '@/api/types/notification.type'
import { PaginatedResponse } from '@/api/types/pagination.type'

/**
 * Notification Service - Admin
 * Handles notification-related API calls for admin dashboard
 */
export const NotificationService = {
  /**
   * Fetch paginated notifications
   */
  fetchNotifications: async (
    params: NotificationsParams = { page: 0, size: 20 },
  ): Promise<NotificationsResponse> => {
    return apiRequest<PaginatedResponse<Notification>>({
      url: PATHS.NOTIFICATION.LIST,
      method: 'GET',
      params,
    })
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (): Promise<UnreadCountApiResponse> => {
    return apiRequest({
      url: PATHS.NOTIFICATION.UNREAD_COUNT,
      method: 'GET',
    })
  },

  /**
   * Mark a single notification as read
   */
  markAsRead: async (id: number): Promise<MarkAsReadResponse> => {
    return apiRequest({
      url: PATHS.NOTIFICATION.MARK_AS_READ.replace(':id', String(id)),
      method: 'PATCH',
    })
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<MarkAsReadResponse> => {
    return apiRequest({
      url: PATHS.NOTIFICATION.MARK_ALL_AS_READ,
      method: 'PATCH',
    })
  },
}
