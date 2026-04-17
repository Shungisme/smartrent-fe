'use client'

import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { useNotifications } from '@/hooks/useNotifications'
import { useAuth } from '@/hooks/useAuth'
import { cookieManager } from '@/utils/cookies'
import { Notification, NotificationType } from '@/api/types/notification.type'

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  isConnected: boolean
  markAsRead: (id: number) => Promise<void>
  markAllAsRead: () => Promise<void>
  refetch: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
)

/**
 * Notification Provider - Provides realtime notifications globally
 *
 * This provider should be placed inside AuthProvider as it requires
 * authenticated admin user information.
 */
export const NotificationProvider = ({ children }: PropsWithChildren) => {
  const { user, isAuthenticated } = useAuth()
  const tokens = cookieManager.getAuthTokens()

  // Get admin ID from user (normalized admin data)
  const adminId = user?.id || null
  const token = tokens?.accessToken || null

  // Initialize notifications hook
  const notificationData = useNotifications({
    adminId,
    token,
    enabled: isAuthenticated && !!adminId,
    onNotificationReceived: (notification) => {
      if (notification.type === NotificationType.BROKER_REGISTRATION_RECEIVED) {
        window.dispatchEvent(new CustomEvent('broker-pending-refresh'))
      }
      console.log('[NotificationProvider] New notification:', notification)
    },
  })

  const value = useMemo(() => notificationData, [notificationData])

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

/**
 * Hook to access notification context
 *
 * @throws Error if used outside NotificationProvider
 */
export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error(
      'useNotificationContext must be used within NotificationProvider',
    )
  }

  return context
}

export default NotificationProvider
