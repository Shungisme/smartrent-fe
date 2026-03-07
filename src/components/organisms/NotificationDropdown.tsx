import React from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/atoms/button'
import { NotificationItem } from '@/components/molecules/NotificationItem'
import { Notification } from '@/api/types/notification.type'
import { Loader2, CheckCheck, Bell } from 'lucide-react'
import classNames from 'classnames'

interface NotificationDropdownProps {
  notifications: Notification[]
  loading: boolean
  unreadCount: number
  onMarkAsRead: (id: number) => Promise<void>
  onMarkAllAsRead: () => Promise<void>
  onClose?: () => void
}

/**
 * NotificationDropdown Component
 * Displays a dropdown panel with notification list
 */
export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  loading,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}) => {
  const t = useTranslations('notifications')

  const hasNotifications = notifications.length > 0
  const hasUnread = unreadCount > 0

  return (
    <div className='w-96 max-h-[600px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col'>
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b border-gray-200'>
        <h3 className='text-lg font-semibold text-gray-900'>
          {t('title', { defaultValue: 'Notifications' })}
        </h3>
        {hasUnread && (
          <Button
            variant='ghost'
            size='sm'
            onClick={onMarkAllAsRead}
            className='text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50'
          >
            <CheckCheck className='h-4 w-4 mr-1' />
            {t('markAllRead', { defaultValue: 'Mark all as read' })}
          </Button>
        )}
      </div>

      {/* Content */}
      <div className='flex-1 overflow-y-auto'>
        {loading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-6 w-6 animate-spin text-gray-400' />
          </div>
        ) : !hasNotifications ? (
          <div className='flex flex-col items-center justify-center py-12 px-4'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3'>
              <Bell className='h-8 w-8 text-gray-400' />
            </div>
            <p className='text-sm text-gray-500 text-center'>
              {t('empty', { defaultValue: 'No notifications yet' })}
            </p>
          </div>
        ) : (
          <div className='divide-y divide-gray-100'>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onClick={onClose}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer - optional, can add "View all" link */}
      {hasNotifications && (
        <div className='p-3 border-t border-gray-200 bg-gray-50'>
          <Button
            variant='ghost'
            size='sm'
            className='w-full text-sm text-gray-600 hover:text-gray-900'
            onClick={onClose}
          >
            {t('viewAll', { defaultValue: 'View all notifications' })}
          </Button>
        </div>
      )}
    </div>
  )
}
