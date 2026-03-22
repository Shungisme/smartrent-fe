'use client'

import React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import ThemeDataProvider from '@/contexts/theme'
import AuthProvider from '@/contexts/auth'
import NotificationProvider from '@/contexts/notification'
import { AuthDialogProvider } from '@/contexts/authDialog'
import SwitchLanguageProvider from '@/contexts/switchLanguage'
import { useSwitchLanguage } from '@/contexts/switchLanguage/index.context'
import ToastProvider from '@/contexts/toast'
import { Toaster } from '@/components/atoms/sonner'
import { Locale } from '@/types'
import vi from '@/messages/vi.json'
import en from '@/messages/en.json'

const messages = {
  vi,
  en,
}

function ProvidersContent({ children }: { children: React.ReactNode }) {
  const { language } = useSwitchLanguage()

  return (
    <NextIntlClientProvider
      locale={language}
      messages={messages[language as Locale]}
    >
      <NextThemesProvider
        attribute='class'
        defaultTheme='light'
        enableSystem={false}
        disableTransitionOnChange
      >
        <ThemeDataProvider>
          <AuthProvider>
            <ToastProvider>
              <NotificationProvider>
                <AuthDialogProvider>
                  {children}
                  <Toaster />
                </AuthDialogProvider>
              </NotificationProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeDataProvider>
      </NextThemesProvider>
    </NextIntlClientProvider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SwitchLanguageProvider>
      <ProvidersContent>{children}</ProvidersContent>
    </SwitchLanguageProvider>
  )
}
