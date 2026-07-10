'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: React.ReactNode
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void | Promise<void>
  loading?: boolean
  destructive?: boolean
}

/**
 * Reusable confirmation modal that replaces native `window.confirm`. Callers
 * own the open state and provide already-translated labels/description.
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  loading = false,
  destructive = false,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Prevent dismissing while the confirm action is in flight.
        if (!loading) onOpenChange(next)
      }}
    >
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className='flex-1 sm:flex-none'
          >
            {cancelLabel}
          </Button>
          <Button
            type='button'
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'flex-1 sm:flex-none',
              destructive && 'bg-red-600 hover:bg-red-700',
            )}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmDialog
