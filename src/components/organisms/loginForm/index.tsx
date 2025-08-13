import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card'
import { Button } from '@/components/atoms/button'
import { cn } from '@/lib/utils'
import { FormField } from '@/components/molecules/formField'
import { PasswordField } from '@/components/molecules/passwordField'

interface LoginFormData {
  email: string
  password: string
}

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => Promise<void>
  onRegisterClick?: () => void
  className?: string
  loading?: boolean
}

function LoginForm({
  onSubmit,
  onRegisterClick,
  className,
  loading: externalLoading,
}: LoginFormProps) {
  const [formData, setFormData] = React.useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = React.useState<Partial<LoginFormData>>({})
  const [isLoading, setIsLoading] = React.useState(false)

  const loading = externalLoading || isLoading

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {}

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange =
    (field: keyof LoginFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }))

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }))
      }
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsLoading(true)
      await onSubmit?.(formData)
    } catch (error) {
      console.error('Login error:', error)
      // Handle API errors - could set form-level error here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl'>Đăng nhập</CardTitle>
        <CardDescription>
          Nhập email và mật khẩu để truy cập tài khoản
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className='space-y-4'>
          <FormField
            label='Email'
            type='email'
            placeholder='your@email.com'
            value={formData.email}
            onChange={handleInputChange('email')}
            error={errors.email}
            required
            disabled={loading}
          />

          <PasswordField
            label='Mật khẩu'
            placeholder='Nhập mật khẩu'
            value={formData.password}
            onChange={handleInputChange('password')}
            error={errors.password}
            required
            disabled={loading}
          />
        </CardContent>

        <CardFooter className='flex flex-col space-y-4'>
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>

          {onRegisterClick && (
            <div className='text-center text-sm'>
              <span className='text-muted-foreground'>Chưa có tài khoản? </span>
              <Button
                type='button'
                variant='link'
                className='h-auto p-0 font-normal'
                onClick={onRegisterClick}
                disabled={loading}
              >
                Đăng ký ngay
              </Button>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}

export { LoginForm }
