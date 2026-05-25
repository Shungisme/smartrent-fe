'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeSwitchProps {
  className?: string
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ className }) => {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR we don't know the theme; render a neutral placeholder.
  if (!mounted) {
    return (
      <button
        type='button'
        aria-label='Toggle theme'
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-muted-foreground/60 transition-colors',
          className,
        )}
      >
        <Sun className='h-4 w-4' />
      </button>
    )
  }

  const isDark = (theme === 'system' ? resolvedTheme : theme) === 'dark'

  const toggle = () => setTheme(isDark ? 'light' : 'dark')

  return (
    <button
      type='button'
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      className={cn(
        'group inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-foreground/70 transition-all hover:border-border/70 hover:bg-accent hover:text-foreground',
        className,
      )}
    >
      <span className='relative block h-4 w-4'>
        <Sun
          className={cn(
            'absolute inset-0 h-4 w-4 transition-all',
            isDark
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100',
          )}
        />
        <Moon
          className={cn(
            'absolute inset-0 h-4 w-4 transition-all',
            isDark
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0',
          )}
        />
      </span>
    </button>
  )
}

export default ThemeSwitch
