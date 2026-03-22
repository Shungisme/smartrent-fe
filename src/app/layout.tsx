import '@/styles/globals.css'
import '@/styles/reset.scss'
import type { Metadata } from 'next'
import { Manrope, JetBrains_Mono } from 'next/font/google'
import { Providers } from './providers'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--app-font-sans',
  display: 'swap',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--app-font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SmartRent Admin',
  description: 'SmartRent admin dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${manrope.variable} ${jetBrainsMono.variable}`}
    >
      <body className='app-shell'>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
