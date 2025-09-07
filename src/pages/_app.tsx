import '@/styles/globals.css'
import '@/styles/reset.scss'
import '@/components/molecules/desktop-navigation/navigation.css'
import ThemeDataProvider from '@/contexts/theme'
import AuthProvider from '@/contexts/auth'
import type { AppProps } from 'next/app'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { NextIntlClientProvider } from 'next-intl'
import SwitchLanguageProvider from '@/contexts/switchLanguage'
import { Locale } from '@/types'
import vi from '@/messages/vi.json'
import en from '@/messages/en.json'
import { Toaster } from '@/components/atoms/sonner'
import { useSwitchLanguage } from '@/contexts/switchLanguage/index.context'

const messages = {
  vi,
  en,
}

function AppContent({ Component, pageProps }: AppProps) {
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
            <Component {...pageProps} />
            <Toaster />
          </AuthProvider>
        </ThemeDataProvider>
      </NextThemesProvider>
    </NextIntlClientProvider>
  )
}

export default function App(props: AppProps) {
  return (
    <SwitchLanguageProvider>
      <AppContent {...props} />
    </SwitchLanguageProvider>
  )
}
