import * as React from 'react'
import type { NextPage } from 'next'
import { AuthTemplate } from '@/components/templates/AuthTemplate'

const AuthDemoPage: NextPage = () => {
  const handleAuthSuccess = (user: {
    id: number
    name: string
    email: string
  }) => {
    alert(`Thành công! Chào mừng ${user.name} (${user.email})`)
  }

  return (
    <AuthTemplate
      onAuthSuccess={handleAuthSuccess}
      defaultMode='login'
      className='bg-gray-50 dark:bg-gray-900'
    />
  )
}

export default AuthDemoPage
