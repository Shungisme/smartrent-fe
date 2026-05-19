'use client'

import React, { useRef, useEffect } from 'react'

export interface PopoverProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'start' | 'end' | 'center'
}

export function Popover({
  isOpen,
  onOpenChange,
  trigger,
  children,
  align = 'start',
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
    <div ref={containerRef} className='relative w-full'>
      <div onClick={() => onOpenChange(!isOpen)} className='w-full'>
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={contentRef}
          className={`
            absolute z-50 mt-1 rounded-lg border border-gray-200 bg-white shadow-md
            ${align === 'end' ? 'right-0' : 'left-0'}
            min-w-[380px] max-h-[400px] overflow-y-auto
          `}
        >
          {children}
        </div>
      )}
    </div>
  )
}
