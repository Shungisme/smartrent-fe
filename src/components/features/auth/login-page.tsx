'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Building2, Languages } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import AdminLoginForm from '@/components/molecules/adminLoginForm'
import { Skeleton } from '@/components/atoms/skeleton'
import ThemeSwitch from '@/components/molecules/themeSwitch'
import { useSwitchLanguage } from '@/contexts/switchLanguage/index.context'
import { cn } from '@/lib/utils'

const LoginPage = () => {
  const router = useRouter()
  const t = useTranslations('homePage.auth.login')
  const tBrand = useTranslations('homePage.auth.brand')
  const { isAuthenticated, isLoading } = useAuth()
  const { language, updateLanguage } = useSwitchLanguage()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/management/users')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background p-4'>
        <div className='w-full max-w-md rounded-2xl border border-border/70 bg-card p-8 shadow-sm'>
          <div className='space-y-4'>
            <Skeleton className='h-8 w-3/4 mx-auto' />
            <Skeleton className='h-4 w-1/2 mx-auto' />
            <Skeleton className='h-12 w-full mt-6' />
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
          </div>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  const isVi = language === 'vi'

  return (
    <div className='relative min-h-screen bg-background text-foreground'>
      {/* Background ornament: subtle radial + grid, theme-aware */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 overflow-hidden'
      >
        <div className='absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl' />
        <div className='absolute -bottom-32 -left-32 h-[24rem] w-[24rem] rounded-full bg-chart-3/10 blur-3xl' />
        <div
          className='absolute inset-0 opacity-[0.035] dark:opacity-[0.07]'
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage:
              'radial-gradient(ellipse at center, black 0%, transparent 75%)',
          }}
        />
      </div>

      {/* Top utility bar */}
      <div className='relative z-10 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-2'>
          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm'>
            <Building2 className='h-4 w-4' />
          </div>
          <div className='hidden text-sm font-semibold tracking-tight text-foreground sm:block'>
            SmartRent
          </div>
        </div>
        <div className='flex items-center gap-1'>
          <button
            type='button'
            onClick={() => updateLanguage(isVi ? 'en' : 'vi')}
            className='inline-flex h-8 items-center gap-1.5 rounded-lg border border-transparent px-2.5 text-xs font-medium text-foreground/70 transition-colors hover:border-border/70 hover:bg-accent hover:text-foreground'
            aria-label='Toggle language'
          >
            <Languages className='h-3.5 w-3.5' />
            {isVi ? 'VI' : 'EN'}
          </button>
          <ThemeSwitch />
        </div>
      </div>

      <div className='relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center px-4 pb-10 sm:px-6 lg:px-8'>
        <div className='grid w-full grid-cols-1 overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-lg backdrop-blur-sm lg:grid-cols-[1.05fr_1fr]'>
          {/* Left: brand side (hidden on small screens) */}
          <div className='relative hidden flex-col items-center justify-center gap-6 overflow-hidden p-12 lg:flex'>
            <div
              aria-hidden
              className={cn(
                'absolute inset-0 -z-10',
                'bg-gradient-to-br from-primary/10 via-card to-card',
                'dark:from-primary/20 dark:via-card dark:to-card',
              )}
            />
            <div
              aria-hidden
              className='absolute -top-32 -left-32 -z-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl dark:bg-primary/30'
            />

            <div className='text-center'>
              <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg mx-auto mb-4'>
                <Building2 className='h-7 w-7' />
              </div>
              <h2 className='text-2xl font-semibold tracking-tight text-foreground'>
                SmartRent
              </h2>
              <p className='mt-2 text-sm text-muted-foreground'>
                {tBrand('subtitle')}
              </p>
            </div>

            <div className='text-xs text-muted-foreground/70 text-center'>
              © {new Date().getFullYear()} SmartRent
            </div>
          </div>

          {/* Right: form side */}
          <div className='flex flex-col justify-center p-6 sm:p-10'>
            <div className='mx-auto w-full max-w-md'>
              <div className='flex items-center gap-2 lg:hidden'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm'>
                  <Building2 className='h-4 w-4' />
                </div>
                <div className='text-base font-semibold tracking-tight'>
                  SmartRent
                </div>
              </div>

              <div className='mt-6 lg:mt-0'>
                <h1 className='text-2xl font-semibold tracking-tight text-foreground'>
                  {t('subtitle')}
                </h1>
                <p className='mt-1.5 text-sm text-muted-foreground'>
                  {t('description')}
                </p>
              </div>

              <div className='mt-6'>
                <AdminLoginForm />
              </div>

              <div className='mt-6 text-center text-xs text-muted-foreground'>
                SmartRent Admin · v1.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
