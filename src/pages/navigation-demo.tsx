import React from 'react'
import { NextPage } from 'next'
import Navigation from '@/components/organisms/navigation'
import { Button } from '@/components/atoms/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/atoms/dialog'
import { NavigationItemData } from '@/components/atoms/navigation-item'

const NavigationDemo: NextPage = () => {
  // Sample navigation items for demo
  const navigationItems: NavigationItemData[] = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      isActive: true,
    },
    {
      id: 'about',
      label: 'About',
      href: '/about',
      isActive: false,
    },
    {
      id: 'services',
      label: 'Services',
      href: '/services',
      isActive: false,
      children: [
        {
          id: 'service1',
          label: 'Service 1',
          href: '/services/1',
          isActive: false,
        },
        {
          id: 'service2',
          label: 'Service 2',
          href: '/services/2',
          isActive: false,
        },
      ],
    },
  ]

  return (
    <div className='min-h-screen bg-background'>
      <Navigation items={navigationItems} />
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-6'>Navigation Demo</h1>

        {/* Test Dialog Buttons */}
        <div className='space-y-4 mb-8'>
          <h2 className='text-xl font-semibold'>Test Dialogs</h2>
          <div className='flex flex-wrap gap-4'>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='default'>Full Screen Mobile Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <div className='p-4'>
                  <h3 className='text-lg font-semibold mb-4'>
                    Full Screen Mobile Dialog
                  </h3>
                  <p>This dialog will be full screen on mobile devices.</p>
                  <p className='mt-4'>
                    Try resizing your browser window to see the responsive
                    behavior.
                  </p>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline'>Centered Mobile Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <div className='p-4'>
                  <h3 className='text-lg font-semibold mb-4'>
                    Centered Mobile Dialog
                  </h3>
                  <p>This dialog will be centered on mobile devices.</p>
                  <p className='mt-4'>
                    Try resizing your browser window to see the responsive
                    behavior.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <div className='p-6 border rounded-lg'>
            <h3 className='text-lg font-semibold mb-2'>Feature 1</h3>
            <p className='text-muted-foreground'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div className='p-6 border rounded-lg'>
            <h3 className='text-lg font-semibold mb-2'>Feature 2</h3>
            <p className='text-muted-foreground'>
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className='p-6 border rounded-lg'>
            <h3 className='text-lg font-semibold mb-2'>Feature 3</h3>
            <p className='text-muted-foreground'>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavigationDemo
