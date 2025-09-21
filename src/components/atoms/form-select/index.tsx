import React from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'
import SelectDropdown, { SelectOption } from '../select-dropdown'

export interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  // Form control
  name: TName
  control: Control<TFieldValues>

  // Basic props
  options: SelectOption[]
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
}

const FormSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  options,
  placeholder,
  disabled,
  variant = 'default',
  size = 'md',
  className,
  label,
  helperText,
  icon,
  iconPosition = 'left',
  fullWidth = true,
}: FormSelectProps<TFieldValues, TName>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <SelectDropdown
          value={field.value}
          onValueChange={field.onChange}
          placeholder={placeholder}
          disabled={disabled}
          options={options}
          variant={variant}
          size={size}
          className={className}
          label={label}
          error={fieldState.error?.message}
          helperText={helperText}
          icon={icon}
          iconPosition={iconPosition}
          fullWidth={fullWidth}
        />
      )}
    />
  )
}

export default FormSelect
