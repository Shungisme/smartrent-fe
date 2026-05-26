import React from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/atoms/button'
import { NotificationItem } from '@/components/molecules/NotificationItem'
import { Notification } from '@/api/types/notification.type'
import { Loader2, CheckCheck, Bell } from 'lucide-react'

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
    <div className='w-full max-h-[min(70vh,600px)] sm:w-96 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border/70 flex flex-col'>
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b border-border/70'>
        <h3 className='text-lg font-semibold text-foreground'>
          {t('title', { defaultValue: 'Notifications' })}
        </h3>
        {hasUnread && (
          <Button
            variant='ghost'
            size='sm'
            onClick={onMarkAllAsRead}
            className='text-xs text-primary hover:text-primary hover:bg-primary/10'
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
            <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
          </div>
        ) : !hasNotifications ? (
          <div className='flex flex-col items-center justify-center py-12 px-4'>
            <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-3'>
              <Bell className='h-8 w-8 text-muted-foreground' />
            </div>
            <p className='text-sm text-muted-foreground text-center'>
              {t('empty', { defaultValue: 'No notifications yet' })}
            </p>
          </div>
        ) : (
          <div className='divide-y divide-border/60'>
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
        <div className='p-3 border-t border-border/70 bg-muted/50'>
          <Button
            variant='ghost'
            size='sm'
            className='w-full text-sm text-muted-foreground hover:text-foreground'
            onClick={onClose}
          >
            {t('viewAll', { defaultValue: 'View all notifications' })}
          </Button>
        </div>
      )}
    </div>
  )
}
