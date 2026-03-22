import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { toast as sonnerToast } from 'sonner'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => string | number
  dismiss: (id?: string | number) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const value = useMemo<ToastContextValue>(
    () => ({
      toast: (message, variant = 'info') => {
        const fn = sonnerToast[variant] ?? sonnerToast
        return fn(message)
      },
      dismiss: (id) => {
        sonnerToast.dismiss(id)
      },
    }),
    [],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export const useToastContext = (): ToastContextValue => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider')
  }
  return context
}

export default ToastProvider
