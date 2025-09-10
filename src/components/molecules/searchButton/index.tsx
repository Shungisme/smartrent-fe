import React from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/atoms/button'
import { Typography } from '@/components/atoms/typography'
import { Search } from 'lucide-react'

interface SearchButtonProps {
  onClick: () => void
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  showText?: boolean
}

const SearchButton: React.FC<SearchButtonProps> = ({
  onClick,
  className = '',
  variant = 'default',
  size = 'default',
  showText = true,
}) => {
  const t = useTranslations('homePage.buttons')

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={`flex items-center gap-2 ${className}`}
    >
      <Search className='h-4 w-4' />
      {showText && (
        <Typography variant='small' className='text-sm'>
          {t('search')}
        </Typography>
      )}
    </Button>
  )
}

export default SearchButton
