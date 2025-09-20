import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card'
import { User, Mail, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ContactInfoFormProps {
  className?: string
}

const ContactInfoForm: React.FC<ContactInfoFormProps> = ({ className }) => {
  const t = useTranslations('createPost.sections.contactInfo')

  return (
    <div className={className}>
      {/* Contact Information Card - Mobile First */}
      <Card className='mb-4 sm:mb-6'>
        <CardHeader className='pb-4 sm:pb-6'>
          <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
            <User className='w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground' />
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3 sm:space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>{t('fullName')}</label>
            <div className='relative'>
              <User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <input
                type='text'
                className='w-full h-10 sm:h-12 pl-10 pr-4 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring text-sm sm:text-base'
                placeholder='Nhập họ và tên'
                defaultValue='Nguyễn Văn A'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>{t('email')}</label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <input
                type='email'
                className='w-full h-10 sm:h-12 pl-10 pr-4 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring text-sm sm:text-base'
                placeholder='Nhập email'
                defaultValue='nguyenvana@example.com'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>{t('phoneNumber')}</label>
            <div className='relative'>
              <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <input
                type='tel'
                className='w-full h-10 sm:h-12 pl-10 pr-4 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring text-sm sm:text-base'
                placeholder='Nhập số điện thoại'
                defaultValue='+84 123 456 789'
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { ContactInfoForm }
export type { ContactInfoFormProps }
