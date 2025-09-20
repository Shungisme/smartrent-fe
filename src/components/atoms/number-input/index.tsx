import React, { useState, useEffect } from 'react'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NumberInputProps {
  // Basic props
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean

  // Styling
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string

  // Label and error
  label?: string
  error?: string
  helperText?: string

  // Icon
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'

  // Layout
  fullWidth?: boolean

  // Unit
  unit?: string
  unitPosition?: 'left' | 'right'

  // Placeholder
  placeholder?: string
}

const NumberInput: React.FC<NumberInputProps> = ({
  value = 0,
  onChange,
  min = 0,
  max = 999999,
  step = 1,
  disabled = false,
  variant = 'default',
  size = 'md',
  className,
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  unit,
  unitPosition = 'right',
  placeholder = '0',
}) => {
  const [inputValue, setInputValue] = useState<string>(value.toString())

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value.toString())
  }, [value])

  const sizeClasses = {
    sm: 'h-10 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-lg',
  }

  const buttonSizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  }

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const variantClasses = {
    default:
      'border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500',
    outline:
      'border-2 border-gray-300 dark:border-gray-600 bg-transparent hover:border-gray-400 dark:hover:border-gray-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500',
    ghost:
      'border-0 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus-within:ring-2 focus-within:ring-blue-500',
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value

    // Allow empty string, numbers, and decimal point
    if (inputVal === '' || /^\d*\.?\d*$/.test(inputVal)) {
      setInputValue(inputVal)

      // Convert to number and validate
      const numValue = parseFloat(inputVal)
      if (!isNaN(numValue)) {
        const clampedValue = Math.min(Math.max(numValue, min), max)
        onChange?.(clampedValue)
      } else if (inputVal === '') {
        onChange?.(min)
      }
    }
  }

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max)
    onChange?.(newValue)
    setInputValue(newValue.toString())
  }

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min)
    onChange?.(newValue)
    setInputValue(newValue.toString())
  }

  const handleBlur = () => {
    // Ensure value is within bounds on blur
    const numValue = parseFloat(inputValue)
    if (isNaN(numValue) || numValue < min) {
      const clampedValue = min
      onChange?.(clampedValue)
      setInputValue(clampedValue.toString())
    } else if (numValue > max) {
      const clampedValue = max
      onChange?.(clampedValue)
      setInputValue(clampedValue.toString())
    }
  }

  return (
    <div className={cn('space-y-2', fullWidth && 'w-full', className)}>
      {/* Label */}
      {label && (
        <label
          className={cn(
            'text-sm font-semibold text-gray-700 dark:text-gray-300',
            error && 'text-red-600 dark:text-red-400',
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
                'text-gray-400 group-focus-within:text-blue-500 transition-colors',
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
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              {unit}
            </span>
          </div>
        )}

        {/* Input Field with Buttons */}
        <div
          className={cn(
            'flex items-center rounded-xl transition-all duration-200 shadow-sm',
            sizeClasses[size],
            variantClasses[variant],
            icon && iconPosition === 'left' && 'pl-10',
            icon && iconPosition === 'right' && 'pr-10',
            unit && unitPosition === 'left' && 'pl-12',
            unit && unitPosition === 'right' && 'pr-12',
            error &&
              'border-red-500 focus-within:ring-red-500 focus-within:border-red-500',
            disabled && 'opacity-50 cursor-not-allowed',
            fullWidth && 'w-full',
          )}
        >
          {/* Decrement Button */}
          <button
            type='button'
            className={cn(
              'hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-xl transition-colors flex items-center justify-center',
              buttonSizeClasses[size],
              disabled && 'cursor-not-allowed opacity-50',
            )}
            onClick={handleDecrement}
            disabled={disabled || value <= min}
          >
            <Minus className={iconSizeClasses[size]} />
          </button>

          {/* Input Field */}
          <input
            type='text'
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'flex-1 h-full px-3 border-0 focus:ring-0 bg-transparent text-center text-gray-900 dark:text-gray-100 font-medium',
              'focus:outline-none',
            )}
          />

          {/* Increment Button */}
          <button
            type='button'
            className={cn(
              'hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-xl transition-colors flex items-center justify-center',
              buttonSizeClasses[size],
              disabled && 'cursor-not-allowed opacity-50',
            )}
            onClick={handleIncrement}
            disabled={disabled || value >= max}
          >
            <Plus className={iconSizeClasses[size]} />
          </button>
        </div>

        {/* Unit on the right */}
        {unit && unitPosition === 'right' && (
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2 z-10'>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              {unit}
            </span>
          </div>
        )}

        {/* Right Icon */}
        {icon && iconPosition === 'right' && (
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2 z-10'>
            <div
              className={cn(
                'text-gray-400 group-focus-within:text-blue-500 transition-colors',
                iconSizeClasses[size],
              )}
            >
              {icon}
            </div>
          </div>
        )}
      </div>

      {/* Helper Text or Error */}
      {(error || helperText) && (
        <p
          className={cn(
            'text-xs',
            error
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-500 dark:text-gray-400',
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  )
}

export default NumberInput
