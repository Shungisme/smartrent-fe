'use client'
import { Geist, Geist_Mono } from 'next/font/google'
import { Button } from '@/components/atoms/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card'
import { Badge } from '@/components/atoms/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/atoms/alert'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { Separator } from '@/components/atoms/separator'
import {
  AlertCircle,
  CheckCircle2,
  Info,
  Palette,
  Sparkles,
  ExternalLink,
  FileText,
  Monitor,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useCustomTheme } from '@/contexts/useTheme'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function Home() {
  const { themeMode, setThemeMode } = useCustomTheme()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    if (newTheme === 'system') {
      setTheme('system')
    } else {
      setTheme(newTheme)
      setThemeMode(newTheme)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen bg-background text-foreground`}
    >
      {/* Header with Theme Toggle */}
      <header className='border-b bg-card'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
                <Palette className='h-5 w-5' />
              </div>
              <div>
                <h1 className='text-xl font-semibold'>Color System Demo</h1>
                <p className='text-sm text-muted-foreground'>
                  Shadcn/UI với Blue Primary Theme
                </p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Badge variant='secondary' className='gap-1'>
                <Sparkles className='h-3 w-3' />
                v1.0.0
              </Badge>

              {/* Theme Toggle */}
              <div className='flex items-center gap-1 border rounded-lg p-1'>
                <Button
                  variant={theme === 'light' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => handleThemeChange('light')}
                  className='h-8 w-8 p-0'
                >
                  <Sun className='h-4 w-4' />
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => handleThemeChange('dark')}
                  className='h-8 w-8 p-0'
                >
                  <Moon className='h-4 w-4' />
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => handleThemeChange('system')}
                  className='h-8 w-8 p-0'
                >
                  <Laptop className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className='container mx-auto px-6 py-8 space-y-8'>
        {/* Welcome Section */}
        <div className='text-center space-y-4'>
          <h2 className='text-3xl font-bold tracking-tight'>
            Welcome to Next.js
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Đây là demo showcasing bộ màu Blue Primary (#007BFF) được áp dụng
            cho Shadcn/UI components
          </p>
        </div>

        {/* Theme Test Section */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <div className='h-4 w-4 rounded-full bg-primary'></div>
              Theme Test
            </CardTitle>
            <CardDescription>
              Test current theme: <Badge variant='outline'>{theme}</Badge> |
              Active mode: <Badge variant='outline'>{themeMode}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='p-4 rounded-lg bg-background border text-center'>
                <div className='text-sm font-medium'>Background</div>
                <div className='text-xs text-muted-foreground mt-1'>
                  bg-background
                </div>
              </div>
              <div className='p-4 rounded-lg bg-primary text-primary-foreground text-center'>
                <div className='text-sm font-medium'>Primary</div>
                <div className='text-xs mt-1 opacity-90'>bg-primary</div>
              </div>
              <div className='p-4 rounded-lg bg-secondary text-secondary-foreground text-center'>
                <div className='text-sm font-medium'>Secondary</div>
                <div className='text-xs mt-1 opacity-90'>bg-secondary</div>
              </div>
              <div className='p-4 rounded-lg bg-muted text-muted-foreground text-center'>
                <div className='text-sm font-medium'>Muted</div>
                <div className='text-xs mt-1'>bg-muted</div>
              </div>
            </div>

            <Separator />

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='p-4 rounded-lg bg-card border text-center'>
                <div className='text-sm font-medium text-card-foreground'>
                  Card
                </div>
                <div className='text-xs text-muted-foreground mt-1'>
                  bg-card
                </div>
              </div>
              <div className='p-4 rounded-lg bg-accent text-accent-foreground text-center'>
                <div className='text-sm font-medium'>Accent</div>
                <div className='text-xs mt-1 opacity-90'>bg-accent</div>
              </div>
              <div className='p-4 rounded-lg bg-destructive text-destructive-foreground text-center'>
                <div className='text-sm font-medium'>Destructive</div>
                <div className='text-xs mt-1 opacity-90'>bg-destructive</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons Section */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <div className='h-4 w-4 rounded-full bg-primary'></div>
              Button Variants
            </CardTitle>
            <CardDescription>
              Các kiểu button với primary color là Blue
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-wrap gap-3'>
              <Button>Primary Button</Button>
              <Button variant='secondary'>Secondary</Button>
              <Button variant='destructive'>Destructive</Button>
              <Button variant='outline'>Outline</Button>
              <Button variant='ghost'>Ghost</Button>
              <Button variant='link'>Link</Button>
            </div>

            <Separator />

            <div className='flex flex-wrap gap-3'>
              <Button size='sm'>Small</Button>
              <Button size='default'>Default</Button>
              <Button size='lg'>Large</Button>
              <Button size='icon'>
                <ExternalLink className='h-4 w-4' />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Section */}
        <div className='grid gap-4'>
          <Alert>
            <Info className='h-4 w-4' />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              Đây là alert thông tin sử dụng primary blue color scheme.
            </AlertDescription>
          </Alert>

          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Có lỗi xảy ra khi xử lý yêu cầu của bạn.
            </AlertDescription>
          </Alert>

          <Alert className='border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200'>
            <CheckCircle2 className='h-4 w-4' />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Thao tác đã được thực hiện thành công!
            </AlertDescription>
          </Alert>
        </div>

        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>
              Input và form elements với blue theme
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' placeholder='your@email.com' />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='message'>Message</Label>
              <Input id='message' placeholder='Nhập tin nhắn của bạn...' />
            </div>

            <Button className='w-full'>Submit Form</Button>
          </CardContent>
        </Card>

        {/* Color Showcase */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>
              Bộ màu Blue primary được sử dụng trong system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
              {[
                { name: 'Blue 50', color: 'bg-blue-50', text: 'text-blue-900' },
                {
                  name: 'Blue 100',
                  color: 'bg-blue-100',
                  text: 'text-blue-900',
                },
                {
                  name: 'Blue 200',
                  color: 'bg-blue-200',
                  text: 'text-blue-900',
                },
                {
                  name: 'Blue 300',
                  color: 'bg-blue-300',
                  text: 'text-blue-900',
                },
                { name: 'Blue 400', color: 'bg-blue-400', text: 'text-white' },
                { name: 'Blue 500', color: 'bg-blue-500', text: 'text-white' },
                { name: 'Blue 600', color: 'bg-blue-600', text: 'text-white' },
                { name: 'Blue 700', color: 'bg-blue-700', text: 'text-white' },
                { name: 'Blue 800', color: 'bg-blue-800', text: 'text-white' },
                { name: 'Blue 900', color: 'bg-blue-900', text: 'text-white' },
              ].map((item) => (
                <div
                  key={item.name}
                  className={`${item.color} ${item.text} p-3 rounded-lg text-center text-sm font-medium`}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Colors Test */}
        <Card>
          <CardHeader>
            <CardTitle>Sidebar Colors Test</CardTitle>
            <CardDescription>Test sidebar color variables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='p-4 rounded-lg bg-sidebar text-sidebar-foreground border'>
                <div className='text-sm font-medium'>Sidebar Background</div>
                <div className='text-xs text-muted-foreground mt-1'>
                  bg-sidebar
                </div>
              </div>
              <div className='p-4 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                <div className='text-sm font-medium'>Sidebar Primary</div>
                <div className='text-xs mt-1 opacity-90'>
                  bg-sidebar-primary
                </div>
              </div>
              <div className='p-4 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground'>
                <div className='text-sm font-medium'>Sidebar Accent</div>
                <div className='text-xs mt-1 opacity-90'>bg-sidebar-accent</div>
              </div>
              <div className='p-4 rounded-lg border-2 border-sidebar-border bg-background'>
                <div className='text-sm font-medium'>Sidebar Border</div>
                <div className='text-xs text-muted-foreground mt-1'>
                  border-sidebar-border
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className='grid md:grid-cols-3 gap-4'>
          <Card className='hover:shadow-md transition-shadow cursor-pointer'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
                  <FileText className='h-5 w-5' />
                </div>
                <div>
                  <h3 className='font-semibold'>Documentation</h3>
                  <p className='text-sm text-muted-foreground'>Read our docs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='hover:shadow-md transition-shadow cursor-pointer'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground'>
                  <Monitor className='h-5 w-5' />
                </div>
                <div>
                  <h3 className='font-semibold'>Examples</h3>
                  <p className='text-sm text-muted-foreground'>
                    View templates
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='hover:shadow-md transition-shadow cursor-pointer'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground'>
                  <ExternalLink className='h-5 w-5' />
                </div>
                <div>
                  <h3 className='font-semibold'>Deploy</h3>
                  <p className='text-sm text-muted-foreground'>
                    Deploy on Vercel
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className='border-t bg-muted/50 mt-12'>
        <div className='container mx-auto px-6 py-8'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <div className='flex items-center gap-4 text-sm text-muted-foreground'>
              <span>Built with Next.js & Shadcn/UI</span>
              <Separator orientation='vertical' className='h-4' />
              <span>Blue Primary Theme</span>
              <Separator orientation='vertical' className='h-4' />
              <span>Current: {theme}</span>
            </div>
            <div className='flex items-center gap-4'>
              <Button variant='ghost' size='sm' className='gap-2'>
                <ExternalLink className='h-3 w-3' />
                GitHub
              </Button>
              <Button variant='ghost' size='sm' className='gap-2'>
                <FileText className='h-3 w-3' />
                Docs
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
