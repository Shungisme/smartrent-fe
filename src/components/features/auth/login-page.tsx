'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  Building2,
  ShieldCheck,
  Sparkles,
  LineChart,
  Languages,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import AdminLoginForm from '@/components/molecules/adminLoginForm'
import { Skeleton } from '@/components/atoms/skeleton'
import ThemeSwitch from '@/components/molecules/themeSwitch'
import { useSwitchLanguage } from '@/contexts/switchLanguage/index.context'
import { cn } from '@/lib/utils'

const FEATURES = [
  {
    icon: ShieldCheck,
    titleKey: 'features.security.title',
    descKey: 'features.security.desc',
  },
  {
    icon: LineChart,
    titleKey: 'features.insights.title',
    descKey: 'features.insights.desc',
  },
  {
    icon: Sparkles,
    titleKey: 'features.automation.title',
    descKey: 'features.automation.desc',
  },
] as const

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
          {/* Left: brand / feature side (hidden on small screens) */}
          <div className='relative hidden flex-col justify-between gap-10 overflow-hidden p-10 lg:flex'>
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

            <div>
              <span className='inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur'>
                <span className='inline-block h-1.5 w-1.5 rounded-full bg-primary' />
                {tBrand('badge')}
              </span>
              <h2 className='mt-6 max-w-md text-3xl font-semibold leading-tight tracking-tight text-foreground'>
                {tBrand('headline')}
              </h2>
              <p className='mt-3 max-w-md text-sm leading-relaxed text-muted-foreground'>
                {tBrand('subheadline')}
              </p>
            </div>

            <ul className='space-y-4'>
              {FEATURES.map((feature) => {
                const Icon = feature.icon
                return (
                  <li
                    key={feature.titleKey}
                    className='flex items-start gap-3 rounded-xl border border-border/60 bg-card/60 p-3 backdrop-blur-sm'
                  >
                    <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                      <Icon className='h-4 w-4' />
                    </span>
                    <div className='space-y-0.5'>
                      <div className='text-sm font-medium text-foreground'>
                        {tBrand(feature.titleKey)}
                      </div>
                      <div className='text-xs leading-relaxed text-muted-foreground'>
                        {tBrand(feature.descKey)}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className='text-xs text-muted-foreground/80'>
              © {new Date().getFullYear()} SmartRent. {tBrand('rights')}
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

              <div className='mt-6 flex items-center justify-between text-xs text-muted-foreground'>
                <span>SmartRent Admin · v1.0</span>
                <span className='inline-flex items-center gap-1'>
                  <ShieldCheck className='h-3 w-3' />
                  {tBrand('secure')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
