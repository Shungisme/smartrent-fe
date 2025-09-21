import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import dynamic from 'next/dynamic'
import type { AuthType } from '@/components/organisms/authDialog'

const AuthDialog = dynamic(() => import('@/components/organisms/authDialog'), {
  ssr: false,
  loading: () => null,
})

type AuthDialogContextType = {
  open: boolean
  type: AuthType
  openAuth: (type?: AuthType) => void
  closeAuth: () => void
}

const AuthDialogContext = createContext<AuthDialogContextType | undefined>(
  undefined,
)

export const AuthDialogProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<AuthType>('login')

  const openAuth = useCallback((t: AuthType = 'login') => {
    setType(t)
    setOpen(true)
  }, [])

  const closeAuth = useCallback(() => setOpen(false), [])

  const value = useMemo(
    () => ({ open, type, openAuth, closeAuth }),
    [open, type, openAuth, closeAuth],
  )

  return (
    <AuthDialogContext.Provider value={value}>
      {children}
      <AuthDialog open={open} type={type} handleClose={closeAuth} />
    </AuthDialogContext.Provider>
  )
}

export const useAuthDialog = () => {
  const ctx = useContext(AuthDialogContext)
  if (!ctx)
    throw new Error('useAuthDialog must be used within AuthDialogProvider')
  return ctx
}
