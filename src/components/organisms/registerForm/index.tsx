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

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface RegisterFormProps {
  onSubmit?: (data: Omit<RegisterFormData, 'confirmPassword'>) => Promise<void>
  onLoginClick?: () => void
  className?: string
  loading?: boolean
}

function RegisterForm({
  onSubmit,
  onLoginClick,
  className,
  loading: externalLoading,
}: RegisterFormProps) {
  const [formData, setFormData] = React.useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = React.useState<Partial<RegisterFormData>>({})
  const [isLoading, setIsLoading] = React.useState(false)

  const loading = externalLoading || isLoading

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Họ tên là bắt buộc'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Họ tên phải có ít nhất 2 ký tự'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        'Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange =
    (field: keyof RegisterFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === 'name' ? e.target.value.replace(/^\s+/, '') : e.target.value

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }))
      }

      // Also clear confirmPassword error if password changes
      if (field === 'password' && errors.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: undefined,
        }))
      }
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsLoading(true)
      await onSubmit?.({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
    } catch (error) {
      console.error('Register error:', error)
      // Handle API errors - could set form-level error here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl'>Đăng ký</CardTitle>
        <CardDescription>Tạo tài khoản mới để bắt đầu sử dụng</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className='space-y-4'>
          <FormField
            label='Họ tên'
            placeholder='Nhập họ tên của bạn'
            value={formData.name}
            onChange={handleInputChange('name')}
            error={errors.name}
            required
            disabled={loading}
          />

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
            description='Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số'
            required
            disabled={loading}
          />

          <PasswordField
            label='Xác nhận mật khẩu'
            placeholder='Nhập lại mật khẩu'
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            error={errors.confirmPassword}
            required
            disabled={loading}
          />
        </CardContent>

        <CardFooter className='flex flex-col space-y-4'>
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>

          {onLoginClick && (
            <div className='text-center text-sm'>
              <span className='text-muted-foreground'>Đã có tài khoản? </span>
              <Button
                type='button'
                variant='link'
                className='h-auto p-0 font-normal'
                onClick={onLoginClick}
                disabled={loading}
              >
                Đăng nhập
              </Button>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}

export { RegisterForm }
