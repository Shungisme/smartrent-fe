import React from 'react'
import Image from 'next/image'
import { Avatar } from '@/components/atoms/avatar'
import { User } from 'lucide-react'

interface AvatarUploadProps {
  name: string
  onImageChange?: (file: File | null) => void
  size?: 'sm' | 'md' | 'lg'
  avatar?: string
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  name,
  onImageChange,
  size = 'md',
  avatar,
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }

  const sizeValues = {
    sm: 64,
    md: 96,
    lg: 128,
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onImageChange) {
      onImageChange(file)
    }
  }

  return (
    <div className='relative group'>
      <Avatar className={`${sizeClasses[size]} cursor-pointer`}>
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            width={sizeValues[size]}
            height={sizeValues[size]}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
            <User className='w-1/2 h-1/2 text-gray-400' />
          </div>
        )}
      </Avatar>
      <input
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
      />
    </div>
  )
}
