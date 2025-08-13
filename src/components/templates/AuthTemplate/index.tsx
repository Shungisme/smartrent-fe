import * as React from 'react'
import { cn } from '@/lib/utils'
import { LoginForm } from '@/components/organisms/loginForm'
import { RegisterForm } from '@/components/organisms/registerForm'

interface User {
  id: number
  name: string
  email: string
}

interface AuthTemplateProps {
  className?: string
  onAuthSuccess?: (user: User) => void
  defaultMode?: 'login' | 'register'
}

function AuthTemplate({
  className,
  onAuthSuccess,
  defaultMode = 'login',
}: AuthTemplateProps) {
  const [mode, setMode] = React.useState<'login' | 'register'>(defaultMode)
  const [loading, setLoading] = React.useState(false)

  // Mock API functions - replace with real API calls
  const mockLogin = async (data: { email: string; password: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API delay

    // Mock successful response
    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      email: data.email,
    }

    console.log('Login successful:', mockUser)
    onAuthSuccess?.(mockUser)
    return mockUser
  }

  const mockRegister = async (data: {
    name: string
    email: string
    password: string
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API delay

    // Mock successful response
    const mockUser: User = {
      id: 2,
      name: data.name,
      email: data.email,
    }

    console.log('Register successful:', mockUser)
    onAuthSuccess?.(mockUser)
    return mockUser
  }

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setLoading(true)
      await mockLogin(data)
    } catch (error) {
      console.error('Login failed:', error)
      throw error // Re-throw so form can handle error
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (data: {
    name: string
    email: string
    password: string
  }) => {
    try {
      setLoading(true)
      await mockRegister(data)
    } catch (error) {
      console.error('Register failed:', error)
      throw error // Re-throw so form can handle error
    } finally {
      setLoading(false)
    }
  }

  const switchToRegister = () => setMode('register')
  const switchToLogin = () => setMode('login')

  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center p-4',
        className,
      )}
    >
      <div className='w-full max-w-md'>
        {mode === 'login' ? (
          <LoginForm
            onSubmit={handleLogin}
            onRegisterClick={switchToRegister}
            loading={loading}
          />
        ) : (
          <RegisterForm
            onSubmit={handleRegister}
            onLoginClick={switchToLogin}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}

export { AuthTemplate }
