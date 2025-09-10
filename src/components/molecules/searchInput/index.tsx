import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/atoms/input'
import { Search, X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchInputProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  debounceMs?: number
}

const SearchInput: React.FC<SearchInputProps> = ({
  value = '',
  onChange,
  placeholder,
  className = '',
  debounceMs = 300,
}) => {
  const t = useTranslations('homePage.buttons')
  const [localValue, setLocalValue] = useState(value)
  const debouncedValue = useDebounce(localValue, debounceMs)

  useEffect(() => {
    onChange(debouncedValue)
  }, [debouncedValue, onChange])

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  return (
    <div className={`relative ${className}`}>
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input
          type='text'
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder || t('search')}
          className='pl-10 pr-10 h-9'
        />
        {localValue && (
          <button
            type='button'
            onClick={handleClear}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors'
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchInput
