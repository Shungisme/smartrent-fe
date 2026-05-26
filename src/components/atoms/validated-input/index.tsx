import React from 'react'
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form'
import { cn } from '@/lib/utils'

export interface ValidatedInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  // Form control
  name: TName
  control: Control<TFieldValues>

  // Basic props
  type?: 'text' | 'number' | 'email' | 'tel'
  placeholder?: string
  disabled?: boolean

  // Styling
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string

  // Label and error
  label?: string
  helperText?: string

  // Icon
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'

  // Layout
  fullWidth?: boolean

  // Unit
  unit?: string
  unitPosition?: 'left' | 'right'

  // Validation
  validation?: RegisterOptions<TFieldValues, TName>

  // Number specific
  min?: number
  max?: number
  step?: number
  allowDecimals?: boolean

  // Mobile optimization
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url'
  pattern?: string
}

const ValidatedInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  type = 'text',
  placeholder,
  disabled = false,
  variant = 'default',
  size = 'md',
  className,
  label,
  helperText,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  unit,
  unitPosition = 'right',
  validation,
  min,
  max,
  step,
  allowDecimals = true,
  inputMode,
  pattern,
}: ValidatedInputProps<TFieldValues, TName>) => {
  const sizeClasses = {
    sm: 'h-10 text-sm px-3',
    md: 'h-12 text-base px-4',
    lg: 'h-14 text-lg px-5',
  }

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const iconPaddingClasses = {
    sm: iconPosition === 'left' ? 'pl-10' : 'pr-10',
    md: iconPosition === 'left' ? 'pl-12' : 'pr-12',
    lg: iconPosition === 'left' ? 'pl-14' : 'pr-14',
  }

  const unitPaddingClasses = {
    sm: unitPosition === 'left' ? 'pl-8' : 'pr-8',
    md: unitPosition === 'left' ? 'pl-10' : 'pr-10',
    lg: unitPosition === 'left' ? 'pl-12' : 'pr-12',
  }

  const variantClasses = {
    default:
      'border border-input bg-card text-foreground hover:border-border focus:ring-2 focus:ring-ring focus:border-primary/60',
    outline:
      'border border-border bg-transparent text-foreground hover:border-border focus:ring-2 focus:ring-ring focus:border-primary/60',
    ghost:
      'border-0 bg-muted text-foreground hover:bg-accent focus:ring-2 focus:ring-ring',
  }

  // Auto-determine inputMode based on type
  const getInputMode = () => {
    if (inputMode) return inputMode
    if (type === 'number') return allowDecimals ? 'decimal' : 'numeric'
    if (type === 'tel') return 'tel'
    if (type === 'email') return 'email'
    return 'text'
  }

  // Auto-generate pattern for number validation
  const getPattern = () => {
    if (pattern) return pattern
    if (type === 'number') {
      if (allowDecimals) {
        return min !== undefined && max !== undefined
          ? `^[${min}-${max}](\\.[0-9]+)?$`
          : '^[0-9]+(\\.[0-9]+)?$'
      }
      return min !== undefined && max !== undefined
        ? `^[${min}-${max}]+$`
        : '^[0-9]+$'
    }
    return undefined
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={validation}
      render={({ field, fieldState }) => (
        <div className={cn('space-y-2', fullWidth && 'w-full', className)}>
          {/* Label */}
          {label && (
            <label
              className={cn(
                'text-sm font-semibold text-foreground',
                fieldState.error && 'text-destructive',
              )}
            >
              {label}
            </label>
          )}

          {/* Input Container */}
          <div className='relative group'>
            {/* Left Icon */}
            {icon && iconPosition === 'left' && (
              <div className='absolute left-3 top-1/2 transform -translate-y-1/2 z-10'>
                <div
                  className={cn(
                    'text-muted-foreground group-focus-within:text-primary transition-colors',
                    iconSizeClasses[size],
                  )}
                >
                  {icon}
                </div>
              </div>
            )}

            {/* Unit on the left */}
            {unit && unitPosition === 'left' && (
              <div className='absolute left-3 top-1/2 transform -translate-y-1/2 z-10'>
                <span className='text-sm text-muted-foreground font-medium'>
                  {unit}
                </span>
              </div>
            )}

            {/* Input Field */}
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              inputMode={getInputMode()}
              pattern={getPattern()}
              min={min}
              max={max}
              step={step}
              className={cn(
                'w-full rounded-xl transition-all duration-200 shadow-sm focus:outline-none',
                sizeClasses[size],
                variantClasses[variant],
                icon && iconPosition === 'left' && iconPaddingClasses[size],
                icon && iconPosition === 'right' && iconPaddingClasses[size],
                unit && unitPosition === 'left' && unitPaddingClasses[size],
                unit && unitPosition === 'right' && unitPaddingClasses[size],
                fieldState.error &&
                  'border-destructive focus:ring-destructive/30 focus:border-destructive',
                disabled && 'opacity-50 cursor-not-allowed',
                // Mobile optimizations
                'text-base', // Prevents zoom on iOS
                'touch-manipulation', // Improves touch response
              )}
            />

            {/* Unit on the right */}
            {unit && unitPosition === 'right' && (
              <div className='absolute right-3 top-1/2 transform -translate-y-1/2 z-10'>
                <span className='text-sm text-muted-foreground font-medium'>
                  {unit}
                </span>
              </div>
            )}

            {/* Right Icon */}
            {icon && iconPosition === 'right' && (
              <div className='absolute right-3 top-1/2 transform -translate-y-1/2 z-10'>
                <div
                  className={cn(
                    'text-muted-foreground group-focus-within:text-primary transition-colors',
                    iconSizeClasses[size],
                  )}
                >
                  {icon}
                </div>
              </div>
            )}
          </div>

          {/* Helper Text or Error */}
          {(fieldState.error?.message || helperText) && (
            <p
              className={cn(
                'text-xs',
                fieldState.error?.message
                  ? 'text-destructive'
                  : 'text-muted-foreground',
              )}
            >
              {fieldState.error?.message || helperText}
            </p>
          )}
        </div>
      )}
    />
  )
}

export default ValidatedInput
