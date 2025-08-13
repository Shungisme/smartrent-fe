import ThemeDataProvider from '@/contexts/useTheme'
import '@/styles/globals.css'
import '@/styles/reset.scss'
import type { AppProps } from 'next/app'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='light'
      enableSystem={false}
      disableTransitionOnChange
    >
      <ThemeDataProvider>
        <Component {...pageProps} />
      </ThemeDataProvider>
    </NextThemesProvider>
  )
}
