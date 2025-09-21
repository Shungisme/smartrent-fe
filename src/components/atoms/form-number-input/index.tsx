import React from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'
import NumberInput from '../number-input'

export interface FormNumberInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  // Form control
  name: TName
  control: Control<TFieldValues>

  // Basic props
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

const FormNumberInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  min = 0,
  max = 999999,
  step = 1,
  disabled,
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
  placeholder = '0',
}: FormNumberInputProps<TFieldValues, TName>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <NumberInput
          value={field.value}
          onChange={field.onChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          variant={variant}
          size={size}
          className={className}
          label={label}
          error={fieldState.error?.message}
          helperText={helperText}
          icon={icon}
          iconPosition={iconPosition}
          fullWidth={fullWidth}
          unit={unit}
          unitPosition={unitPosition}
          placeholder={placeholder}
        />
      )}
    />
  )
}

export default FormNumberInput
