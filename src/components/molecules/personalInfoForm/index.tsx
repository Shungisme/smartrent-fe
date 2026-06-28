import * as React from 'react'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/atoms/button'
import { Card } from '@/components/atoms/card'
import { Typography } from '@/components/atoms/typography'
import { EmailField } from '../emailField'
import { PhoneField } from '../phoneField'
import { FormField } from '../formField'
import { AvatarUpload } from '../avatarUpload'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { VALIDATION_PATTERNS } from '@/api/types/auth.type'

type PersonalInfoFormData = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  idDocument: string
  taxNumber?: string
  avatar?: File
  address?: string
}

type PersonalInfoFormProps = {
  initialData?: Partial<PersonalInfoFormData>
  onSubmit?: (data: PersonalInfoFormData) => void
  loading?: boolean
  className?: string
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
  className,
}) => {
  const t = useTranslations()

  const validationSchema = z.object({
    firstName: z
      .string()
      .trim()
      .min(1, t('homePage.auth.validation.firstNameRequired'))
      .min(2, t('homePage.auth.validation.firstNameMinLength')),
    lastName: z
      .string()
      .trim()
      .min(1, t('homePage.auth.validation.lastNameRequired'))
      .min(2, t('homePage.auth.validation.lastNameMinLength')),
    email: z
      .string()
      .trim()
      .min(1, t('homePage.auth.validation.emailRequired'))
      .regex(
        VALIDATION_PATTERNS.EMAIL,
        t('homePage.auth.validation.emailInvalid'),
      ),
    phoneNumber: z
      .string()
      .trim()
      .min(1, t('homePage.auth.validation.phoneNumberRequired'))
      .regex(/^[0-9+\-\s()]+$/, t('homePage.auth.validation.phoneInvalid')),
    idDocument: z
      .string()
      .trim()
      .min(1, t('homePage.auth.validation.idDocumentRequired'))
      .min(9, t('homePage.auth.validation.idDocumentMinLength')),
    taxNumber: z
      .string()
      .regex(/^[0-9\-]*$/, t('homePage.auth.validation.taxNumberInvalid'))
      .optional()
      .or(z.literal('')),
    avatar: z.any().optional(),
    address: z.string().optional(),
  })

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      phoneNumber: initialData?.phoneNumber || '',
      idDocument: initialData?.idDocument || '',
      taxNumber: initialData?.taxNumber || '',
      address: initialData?.address || '',
    },
    mode: 'onChange',
  })

  const firstNameController = useController({ name: 'firstName', control })
  const lastNameController = useController({ name: 'lastName', control })
  const idDocumentController = useController({ name: 'idDocument', control })
  const taxNumberController = useController({ name: 'taxNumber', control })
  const addressController = useController({ name: 'address', control })

  const watchedValues = watch()
  const fullName = `${watchedValues.firstName} ${watchedValues.lastName}`.trim()

  const handleAvatarChange = (file: File | null) => {
    setValue('avatar', file || undefined)
  }

  const handleFormSubmit = (data: PersonalInfoFormData) => {
    onSubmit?.(data)
  }

  return (
    <Card className={cn('p-6', className)}>
      <div className='space-y-6'>
        <div className='flex items-center gap-3'>
          <User className='h-5 w-5 text-primary' />
          <Typography variant='h3' className='text-lg font-semibold'>
            {t('homePage.auth.accountManagement.personalInfo.title')}
          </Typography>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
          <div className='flex justify-center'>
            <AvatarUpload
              name={fullName}
              onImageChange={handleAvatarChange}
              size='lg'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              label={t(
                'homePage.auth.accountManagement.personalInfo.firstName',
              )}
              placeholder={t('homePage.auth.register.firstNamePlaceholder')}
              error={errors.firstName?.message}
              {...firstNameController.field}
            />
            <FormField
              label={t('homePage.auth.accountManagement.personalInfo.lastName')}
              placeholder={t('homePage.auth.register.lastNamePlaceholder')}
              error={errors.lastName?.message}
              {...lastNameController.field}
            />
          </div>

          <div className='space-y-4'>
            <Typography variant='h4' className='font-medium text-foreground'>
              {t('homePage.auth.accountManagement.personalInfo.contactInfo')}
            </Typography>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <PhoneField
                name='phoneNumber'
                control={control}
                label={t(
                  'homePage.auth.accountManagement.personalInfo.phoneNumber',
                )}
                placeholder={t('homePage.auth.common.phoneNumberPlaceholder')}
                error={errors.phoneNumber?.message}
              />
              <EmailField
                name='email'
                control={control}
                label={t('homePage.auth.accountManagement.personalInfo.email')}
                placeholder={t('homePage.auth.common.emailPlaceholder')}
                error={errors.email?.message}
              />
            </div>
          </div>

          <div className='space-y-4'>
            <Typography variant='h4' className='font-medium text-foreground'>
              {t('homePage.auth.accountManagement.personalInfo.businessInfo')}
            </Typography>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label={t(
                  'homePage.auth.accountManagement.personalInfo.idDocument',
                )}
                placeholder={t('homePage.auth.register.idDocumentPlaceholder')}
                error={errors.idDocument?.message}
                {...idDocumentController.field}
              />
              <FormField
                label={t(
                  'homePage.auth.accountManagement.personalInfo.taxNumber',
                )}
                placeholder={t('homePage.auth.register.taxNumberPlaceholder')}
                error={errors.taxNumber?.message}
                {...taxNumberController.field}
              />
            </div>

            <FormField
              label={t('homePage.auth.accountManagement.personalInfo.address')}
              placeholder='Việt Nam'
              className='md:col-span-2'
              {...addressController.field}
            />
          </div>

          <div className='flex justify-end pt-4'>
            <Button
              type='submit'
              disabled={!isValid || loading}
              className='min-w-[120px]'
            >
              {loading
                ? t('homePage.auth.accountManagement.personalInfo.saving')
                : t('homePage.auth.accountManagement.personalInfo.saveChanges')}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}

export { PersonalInfoForm }
