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
  title: 'Thuê Nhà Trọ Admin',
  description: 'Bảng điều khiển quản trị Thuê Nhà Trọ',
  icons: {
    icon: '/images/logo-smartrent.jpg',
    shortcut: '/images/logo-smartrent.jpg',
    apple: '/images/logo-smartrent.jpg',
  },
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
