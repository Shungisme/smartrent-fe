'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import SockJS from 'sockjs-client'
import { Client, IFrame } from '@stomp/stompjs'
import { NotificationService } from '@/api/services/notification.service'
import { Notification } from '@/api/types/notification.type'
import { ENV } from '@/constants/env'
import { toast } from 'sonner'

interface UseNotificationsOptions {
  adminId?: string | null
  token?: string | null
  enabled?: boolean
  onNotificationReceived?: (notification: Notification) => void
}

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  isConnected: boolean
  markAsRead: (id: number) => Promise<void>
  markAllAsRead: () => Promise<void>
  refetch: () => Promise<void>
}

/**
 * Hook for managing admin notifications with WebSocket (realtime) + REST API
 *
 * Features:
 * - WebSocket connection to receive realtime notifications
 * - Auto-reconnection on disconnect
 * - REST API for notification management
 * - Auto-fetch initial notifications on mount
 * - Toast notifications for new realtime events
 *
 * @param options - Configuration options
 * @returns Notification state and management functions
 */
export function useNotifications(
  options: UseNotificationsOptions = {},
): UseNotificationsReturn {
  const { adminId, token, enabled = true, onNotificationReceived } = options

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)

  const clientRef = useRef<Client | null>(null)
  const isInitialMount = useRef(true)

  /**
   * Fetch initial notifications from REST API
   */
  const fetchNotifications = useCallback(async () => {
    if (!enabled || !token) return

    try {
      setLoading(true)
      setError(null)

      const [notificationsRes, unreadCountRes] = await Promise.all([
        NotificationService.fetchNotifications({ page: 0, size: 20 }),
        NotificationService.getUnreadCount(),
      ])

      if (notificationsRes.success && notificationsRes.data) {
        setNotifications(notificationsRes.data.data || [])
      }

      if (unreadCountRes.success && unreadCountRes.data) {
        setUnreadCount(unreadCountRes.data.unreadCount || 0)
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to fetch notifications'
      setError(errorMsg)
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [enabled, token])

  /**
   * Mark a notification as read
   */
  const markAsRead = useCallback(async (id: number) => {
    try {
      const response = await NotificationService.markAsRead(id)

      if (response.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }, [])

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await NotificationService.markAllAsRead()

      if (response.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        setUnreadCount(0)
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }, [])

  /**
   * Setup WebSocket connection for realtime notifications
   */
  useEffect(() => {
    // Only connect if enabled and we have adminId
    if (!enabled || !adminId) {
      return
    }

    // Clean up any existing connection
    if (clientRef.current) {
      clientRef.current.deactivate()
    }

    // Get base URL without trailing slash
    const baseUrl = ENV.URL_API_BASE.replace(/\/$/, '')

    // Create WebSocket client
    const client = new Client({
      webSocketFactory: () => new SockJS(`${baseUrl}/ws`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log('[Notifications] WebSocket connected')
        setIsConnected(true)

        // Subscribe to admin's notification channel
        client.subscribe(`/topic/notifications/${adminId}`, (message) => {
          try {
            const notification: Notification = JSON.parse(message.body)

            // Add to notifications list
            setNotifications((prev) => [notification, ...prev])
            setUnreadCount((prev) => prev + 1)

            // Show toast notification
            toast.info(notification.title, {
              description: notification.message,
              duration: 5000,
            })

            // Call custom callback if provided
            if (onNotificationReceived) {
              onNotificationReceived(notification)
            }
          } catch (err) {
            console.error('[Notifications] Error parsing message:', err)
          }
        })
      },

      onDisconnect: () => {
        console.log('[Notifications] WebSocket disconnected')
        setIsConnected(false)
      },

      onStompError: (frame: IFrame) => {
        console.error('[Notifications] STOMP error:', frame.headers['message'])
        setError(frame.headers['message'] || 'WebSocket connection error')
        setIsConnected(false)
      },

      onWebSocketError: (event: Event) => {
        console.error('[Notifications] WebSocket error:', event)
        setIsConnected(false)
      },
    })

    // Activate the client
    client.activate()
    clientRef.current = client

    // Cleanup on unmount
    return () => {
      client.deactivate()
      clientRef.current = null
      setIsConnected(false)
    }
  }, [enabled, adminId, onNotificationReceived])

  /**
   * Fetch initial data on mount
   */
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      fetchNotifications()
    }
  }, [fetchNotifications])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    isConnected,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  }
}
