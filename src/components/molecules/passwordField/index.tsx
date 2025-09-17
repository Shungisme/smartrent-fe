import * as React from 'react'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { Button } from '@/components/atoms/button'
import { Typography } from '@/components/atoms/typography'
import { cn } from '@/lib/utils'
import { PASSWORD_STRENGTH_REGEX } from '@/constants/regex'
import { useTranslations } from 'next-intl'
import { useController, Control } from 'react-hook-form'
import { Eye, EyeOff, Lock } from 'lucide-react'

type PasswordFieldProps = {
  label?: string
  error?: string
  description?: string
  showToggle?: boolean
  showIcon?: boolean
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  className?: string
  placeholder?: string
  id?: string
  required?: boolean
}

const PasswordField = (props: PasswordFieldProps) => {
  const {
    control,
    name,
    description,
    error,
    label,
    showIcon = true,
    showToggle = true,
    className,
    placeholder,
    id,
    required = false,
  } = props
  const [showPassword, setShowPassword] = React.useState(false)
  const t = useTranslations()
  const fieldId = id || `password-field-${name}`

  const {
    field,
    fieldState: { error: fieldError },
  } = useController({
    name,
    control,
    rules: {
      required: t('homePage.auth.validation.passwordRequired'),
      minLength: {
        value: 8,
        message: t('homePage.auth.validation.passwordMinLength'),
      },
      pattern: {
        value: PASSWORD_STRENGTH_REGEX,
        message: t('homePage.auth.validation.passwordPattern'),
      },
    },
  })

  const togglePassword = () => setShowPassword(!showPassword)

  const displayError = fieldError?.message || error

  return (
    <div>
      {label && (
        <Label
          className={cn(
            'mb-2',
            required && 'after:content-["*"] after:ml-1 after:text-destructive',
          )}
          htmlFor={fieldId}
        >
          {label}
        </Label>
      )}

      <div className='relative'>
        <Input
          {...field}
          id={fieldId}
          type={showPassword ? 'text' : 'password'}
          placeholder={
            placeholder || t('homePage.auth.common.passwordPlaceholder')
          }
          aria-invalid={displayError ? 'true' : 'false'}
          aria-describedby={
            displayError
              ? `${fieldId}-error`
              : description
                ? `${fieldId}-description`
                : undefined
          }
          className={cn(
            'h-10 md:h-12',
            showIcon && 'pl-10',
            showToggle && 'pr-10',
            displayError &&
              'border-destructive focus-visible:border-destructive',
            className,
          )}
        />

        {showIcon && (
          <div className='absolute left-3 top-1/2 -translate-y-1/2'>
            <Lock
              className={cn(
                'h-4 w-4 text-muted-foreground',
                displayError && 'text-destructive',
              )}
            />
          </div>
        )}

        {showToggle && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='absolute right-0 top-0 h-10 w-10 md:h-12 md:w-12 hover:bg-transparent'
            onClick={togglePassword}
            aria-label={
              showPassword
                ? t('homePage.auth.common.hidePassword')
                : t('homePage.auth.common.showPassword')
            }
          >
            {showPassword ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )}
          </Button>
        )}
      </div>

      {description && !displayError && (
        <Typography
          variant='muted'
          id={`${fieldId}-description`}
          className='mt-2'
        >
          {description}
        </Typography>
      )}

      {displayError && (
        <Typography
          variant='small'
          id={`${fieldId}-error`}
          className='text-destructive mt-2'
        >
          {displayError}
        </Typography>
      )}
    </div>
  )
}

export { PasswordField }
