import React from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import { Notification, NotificationType } from '@/api/types/notification.type'
import { Bell, FileText, RefreshCw } from 'lucide-react'
import classNames from 'classnames'

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: number) => void
  onClick?: () => void
}

/**
 * Helper function to format date to relative time
 * Falls back to simple implementation if date utility doesn't exist
 */
function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  } catch {
    return dateString
  }
}

/**
 * Get notification icon based on type
 */
function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case NotificationType.NEW_REPORT:
      return FileText
    case NotificationType.LISTING_RESUBMITTED:
      return RefreshCw
    default:
      return Bell
  }
}

/**
 * Get notification color based on type
 */
function getNotificationColor(type: NotificationType) {
  switch (type) {
    case NotificationType.NEW_REPORT:
      return 'text-red-600 bg-red-100'
    case NotificationType.LISTING_RESUBMITTED:
      return 'text-blue-600 bg-blue-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

/**
 * NotificationItem Component
 * Displays a single notification with icon, message, and time
 */
export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onClick,
}) => {
  const router = useRouter()
  const t = useTranslations('notifications')

  const Icon = getNotificationIcon(notification.type)
  const colorClasses = getNotificationColor(notification.type)

  const handleClick = () => {
    // Mark as read
    if (!notification.isRead) {
      onMarkAsRead(notification.id)
    }

    // Navigate based on notification type
    if (notification.referenceId) {
      switch (notification.type) {
        case NotificationType.NEW_REPORT:
          router.push(`/reports?id=${notification.referenceId}`)
          break
        case NotificationType.LISTING_RESUBMITTED:
          router.push(`/posts?id=${notification.referenceId}`)
          break
        default:
          break
      }
    }

    // Call custom onClick if provided
    onClick?.()
  }

  return (
    <div
      onClick={handleClick}
      className={classNames(
        'flex items-start gap-3 p-4 cursor-pointer transition-colors',
        'hover:bg-gray-50 border-b border-gray-100 last:border-b-0',
        {
          'bg-blue-50/30': !notification.isRead,
        },
      )}
    >
      {/* Icon */}
      <div
        className={classNames('p-2 rounded-full flex-shrink-0', colorClasses)}
      >
        <Icon className='h-4 w-4' />
      </div>

      {/* Content */}
      <div className='flex-1 min-w-0'>
        <div className='flex items-start justify-between gap-2'>
          <h4
            className={classNames('text-sm font-medium text-gray-900', {
              'font-semibold': !notification.isRead,
            })}
          >
            {notification.title}
          </h4>
          {!notification.isRead && (
            <div className='w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5' />
          )}
        </div>
        <p className='text-sm text-gray-600 mt-0.5 line-clamp-2'>
          {notification.message}
        </p>
        <span className='text-xs text-gray-400 mt-1 block'>
          {formatRelativeTime(notification.createdAt)}
        </span>
      </div>
    </div>
  )
}
