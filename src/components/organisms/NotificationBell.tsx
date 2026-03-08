import React, { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import { NotificationDropdown } from './NotificationDropdown'
import { useNotificationContext } from '@/contexts/notification'
import classNames from 'classnames'

/**
 * NotificationBell Component
 * Bell icon button with badge showing unread count
 * Opens dropdown panel when clicked
 */
export const NotificationBell: React.FC = () => {
  const {
    notifications,
    unreadCount,
    loading,
    isConnected,
    markAsRead,
    markAllAsRead,
  } = useNotificationContext()

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <div className='relative'>
      {/* Bell Button */}
      <Button
        ref={buttonRef}
        variant='ghost'
        size='sm'
        onClick={toggleDropdown}
        className={classNames(
          'relative p-2 hover:bg-gray-100 transition-colors',
          {
            'bg-gray-100': isOpen,
          },
        )}
      >
        <Bell className='h-5 w-5 text-gray-700' />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className='absolute -top-1 -right-1 h-5 min-w-[20px] px-1 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center'>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Connection Indicator */}
        {isConnected && (
          <span className='absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white' />
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className='absolute right-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200'
        >
          <NotificationDropdown
            notifications={notifications}
            loading={loading}
            unreadCount={unreadCount}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onClose={handleClose}
          />
        </div>
      )}
    </div>
  )
}
