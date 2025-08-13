import * as React from 'react'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { Button } from '@/components/atoms/button'
import { cn } from '@/lib/utils'

// Simple eye icons as SVG components
const EyeIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
    <circle cx='12' cy='12' r='3' />
  </svg>
)

const EyeOffIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='m1 1 22 22' />
    <path d='M6.71 6.71C4.22 8.04 2.59 10.78 1 12c1.59 2.22 3.22 4.96 5.71 6.29' />
    <path d='M12 7c2.76 0 5 2.24 5 5 0 .55-.09 1.08-.26 1.57' />
    <path d='M16.71 16.71C15.68 17.5 14.38 18 13 18c-2.76 0-5-2.24-5-5 0-.55.09-1.08.26-1.57' />
    <path d='M19 12c-.77-1.08-1.61-2.07-2.49-2.93' />
  </svg>
)

interface PasswordFieldProps
  extends Omit<React.ComponentProps<'input'>, 'type'> {
  label?: string
  error?: string
  required?: boolean
  description?: string
  showToggle?: boolean
}

function PasswordField({
  label,
  error,
  required,
  description,
  showToggle = true,
  className,
  id,
  ...props
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-') || 'password'

  const togglePassword = () => setShowPassword(!showPassword)

  return (
    <div className='space-y-2'>
      {label && (
        <Label
          htmlFor={fieldId}
          className={
            required
              ? 'after:content-["*"] after:ml-1 after:text-destructive'
              : ''
          }
        >
          {label}
        </Label>
      )}

      <div className='relative'>
        <Input
          id={fieldId}
          type={showPassword ? 'text' : 'password'}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${fieldId}-error`
              : description
                ? `${fieldId}-description`
                : undefined
          }
          className={cn(
            error && 'border-destructive focus-visible:border-destructive',
            showToggle && 'pr-10',
            className,
          )}
          {...props}
        />

        {showToggle && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='absolute right-0 top-0 h-9 w-10 hover:bg-transparent'
            onClick={togglePassword}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
        )}
      </div>

      {description && !error && (
        <p
          id={`${fieldId}-description`}
          className='text-sm text-muted-foreground'
        >
          {description}
        </p>
      )}

      {error && (
        <p
          id={`${fieldId}-error`}
          className='text-sm text-destructive'
          role='alert'
        >
          {error}
        </p>
      )}
    </div>
  )
}

export { PasswordField }
