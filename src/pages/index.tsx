import { Button } from '@/components/atoms/button'
import LanguageSwitch from '@/components/molecules/languageSwitch'
import ThemeSwitch from '@/components/molecules/themeSwitch'

import { useEffect, useState } from 'react'
import { useDialog } from '@/hooks/useDialog'
import { useTranslations } from 'next-intl'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import dynamic from 'next/dynamic'

const AuthDialog = dynamic(() => import('@/components/organisms/authDialog'), {
  ssr: false,
  loading: () => null,
})

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [loadedItems, setLoadedItems] = useState<number[]>([])
  const { open, handleOpen, handleClose } = useDialog()
  const t = useTranslations('homePage.buttons')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Test component for useIntersectionObserver
  const TestItem = ({ id }: { id: number }) => {
    const { ref, inView } = useIntersectionObserver({
      onIntersect: () => {
        console.log(`Item ${id} entered viewport!`)
        setLoadedItems((prev) => [...new Set([...prev, id])])
      },
      options: {
        threshold: 0.3,
        rootMargin: '100px',
      },
    })

    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`
          h-40 mb-6 p-6 rounded-xl border-2 transition-all duration-700 ease-out flex items-center justify-center font-semibold text-lg relative overflow-hidden
          ${
            inView
              ? 'bg-gradient-to-br from-emerald-50 to-teal-100 border-emerald-500 text-emerald-800 transform scale-105 shadow-xl shadow-emerald-200/50'
              : 'bg-gradient-to-br from-gray-50 to-slate-100 border-gray-300 text-gray-600 hover:border-gray-400 hover:shadow-md'
          }
        `}
        style={{
          transform: inView
            ? 'translateY(-8px) scale(1.02)'
            : 'translateY(0) scale(1)',
          boxShadow: inView
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(16, 185, 129, 0.1)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Animated background shimmer */}
        {inView && (
          <div
            className='absolute inset-0 opacity-20'
            style={{
              background:
                'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
              animation: 'shimmer 2s ease-in-out infinite',
            }}
          />
        )}

        <div className='text-center z-10'>
          <div className='mb-2'>
            {inView ? '🌟' : '💤'} Test Item #{id}
          </div>
          <div
            className={`text-sm transition-all duration-500 ${inView ? 'animate-pulse' : ''}`}
          >
            {inView ? '✨ In Viewport!' : '� Scrolling...'}
          </div>
          {loadedItems.includes(id) && (
            <div className='text-xs mt-2 px-2 py-1 bg-emerald-200 text-emerald-800 rounded-full inline-block animate-bounce'>
              🎯 Loaded!
            </div>
          )}
        </div>
      </div>
    )
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <AuthDialog
        open={open}
        handleClose={handleClose}
        handleOpen={handleOpen}
      />
      <div className='min-h-screen p-4'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8 sticky top-4 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50'>
          <div className='flex gap-2'>
            <LanguageSwitch />
            <ThemeSwitch />
          </div>
          <div className='flex items-center gap-4'>
            <Button onClick={() => handleOpen()}>{t('openAuth')}</Button>
            <div className='text-sm font-semibold px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full animate-pulse'>
              📊 Loaded: {loadedItems.length}/12
            </div>
          </div>
        </div>

        {/* Test Section */}
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4'>
              🧪 Intersection Observer Demo
            </h1>
            <p className='text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
              Scroll down to watch items animate as they enter the viewport.
              Each item triggers only once with smooth transitions.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {Array.from({ length: 12 }, (_, index) => (
              <TestItem key={index + 1} id={index + 1} />
            ))}
          </div>

          {/* Auto-scroll buttons */}
          <div className='flex justify-center gap-4 mt-12 mb-8'>
            <Button
              variant='outline'
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className='hover:scale-105 transition-transform'
            >
              🔝 Scroll to Top
            </Button>
            <Button
              variant='outline'
              onClick={() =>
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: 'smooth',
                })
              }
              className='hover:scale-105 transition-transform'
            >
              🔽 Scroll to Bottom
            </Button>
          </div>

          <div className='mt-12 p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl shadow-lg'>
            <h2 className='text-2xl font-bold text-indigo-800 dark:text-indigo-200 mb-4 flex items-center'>
              <span className='animate-bounce mr-2'>🎯</span>
              Interactive Test Features:
            </h2>
            <div className='grid md:grid-cols-2 gap-6 text-indigo-700 dark:text-indigo-300'>
              <ul className='space-y-3'>
                <li className='flex items-center'>
                  <span className='mr-2'>🔄</span>
                  <span>Smooth scroll animations with 700ms transitions</span>
                </li>
                <li className='flex items-center'>
                  <span className='mr-2'>✨</span>
                  <span>Gradient backgrounds and shimmer effects</span>
                </li>
                <li className='flex items-center'>
                  <span className='mr-2'>📊</span>
                  <span>Real-time counter in sticky header</span>
                </li>
              </ul>
              <ul className='space-y-3'>
                <li className='flex items-center'>
                  <span className='mr-2'>🎨</span>
                  <span>Scale, shadow, and transform animations</span>
                </li>
                <li className='flex items-center'>
                  <span className='mr-2'>⚡</span>
                  <span>30% threshold with 100px early detection</span>
                </li>
                <li className='flex items-center'>
                  <span className='mr-2'>🌟</span>
                  <span>Bounce animation for loaded state</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
