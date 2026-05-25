'use client'

import React, { useRef, useEffect } from 'react'

export interface PopoverProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'start' | 'end' | 'center'
  contentClassName?: string
  /** When true, the trigger wrapper fills its parent's width. Default: false. */
  fullWidth?: boolean
}

export function Popover({
  isOpen,
  onOpenChange,
  trigger,
  children,
  align = 'start',
  contentClassName,
  fullWidth = false,
}: PopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onOpenChange])

  return (
    <div
      ref={containerRef}
      className={`relative ${fullWidth ? 'w-full' : 'inline-block'}`}
    >
      <div
        onClick={() => onOpenChange(!isOpen)}
        className={fullWidth ? 'w-full' : 'inline-flex'}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={contentRef}
          className={`
            absolute z-50 mt-1.5 rounded-xl border border-border/70 bg-popover text-popover-foreground shadow-lg
            ${align === 'end' ? 'right-0' : 'left-0'}
            max-h-[80vh] overflow-y-auto
            ${contentClassName ?? 'min-w-[380px] max-w-[calc(100vw-1rem)]'}
          `}
        >
          {children}
        </div>
      )}
    </div>
  )
}
