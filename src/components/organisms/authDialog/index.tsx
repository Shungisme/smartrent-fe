import React, { ReactNode, useCallback, useState, lazy, Suspense } from 'react'
import { NextPage } from 'next'
import { Dialog, DialogContent } from '@/components/atoms/dialog'
import { Skeleton } from '@/components/atoms/skeleton'
import ImageAtom from '@/components/atoms/imageAtom'
import { basePath, DEFAULT_IMAGE } from '@/constants'

const LoginForm = lazy(() => import('@/components/molecules/loginForm'))
const RegisterForm = lazy(() => import('@/components/molecules/registerForm'))
const ForgotPasswordForm = lazy(
  () => import('@/components/molecules/forgotPasswordForm'),
)

export type AuthType = 'login' | 'register' | 'forgotPassword'

type AuthDialogProps = {
  type?: AuthType
  open?: boolean
  handleOpen?: () => void
  handleClose?: () => void
}

const AuthDialog: NextPage<AuthDialogProps> = (props) => {
  const { open = false, type = 'login', handleClose } = props
  const [authType, setAuthType] = useState<AuthType>(type)

  const switchTo = useCallback((type: AuthType) => {
    setAuthType(type)
  }, [])

  const getAuthComponent = (type: AuthType): ReactNode | null => {
    const FormComponent = () => {
      switch (type) {
        case 'login':
          return <LoginForm switchTo={switchTo} />
        case 'register':
          return <RegisterForm switchTo={switchTo} />
        case 'forgotPassword':
          return <ForgotPasswordForm switchTo={switchTo} />
        default:
          return null
      }
    }

    return (
      <Suspense
        fallback={
          <div className='space-y-4'>
            <div className='space-y-2 text-center'>
              <Skeleton className='h-8 w-48 mx-auto' />
              <Skeleton className='h-4 w-64 mx-auto' />
            </div>
            <div className='space-y-4'>
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
            </div>
          </div>
        }
      >
        <FormComponent />
      </Suspense>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='overflow-y-auto max-md:min-h-dvh max-md:min-w-dvw rounded-none md:rounded-xl md:max-w-4xl md:max-h-[80vh]'>
        <div className='max-md:absolute max-md:top-1/2 max-md:left-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2'>
          <div className='flex flex-col md:flex-row max-md:gap-5 h-full'>
            <div className='flex justify-center items-center h-full'>
              <ImageAtom
                src={`${basePath}/images/rental-auth-bg.jpg`}
                defaultImage={DEFAULT_IMAGE}
                alt='bg_in_auth'
                className='aspect-square w-[12rem] h[12rem] md:h-auto md:min-w-[25rem] rounded-lg'
                priority={true}
              />
            </div>
            <div className='flex-1 flex justify-center md:overflow-y-auto'>
              <div className='w-full max-w-xs p-4 md:p-6 py-6 md:py-8'>
                {getAuthComponent(authType)}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AuthDialog
