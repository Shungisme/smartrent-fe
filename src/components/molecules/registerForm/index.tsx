import { NextPage } from 'next'
import { AuthType } from '@/components/organisms/authDialog'
import { PhoneField } from '../phoneField'
import { FormField } from '../formField'
import { Button } from '@/components/atoms/button'
import { Typography } from '@/components/atoms/typography'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import dynamic from 'next/dynamic'
import SeparatorOr from '@/components/atoms/separatorOr'
import { useRegister } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { VALIDATION_PATTERNS } from '@/api/types/auth.type'

const ImageAtom = dynamic(() => import('@/components/atoms/imageAtom'), {
  ssr: false,
  loading: () => <div className='w-4 h-4 bg-muted animate-pulse rounded' />,
})

type RegisterFormProps = {
  switchTo: (type: AuthType) => void
  onSuccess?: () => void
}

type RegisterFormData = {
  phoneNumber: string
  phoneCode: string
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  idDocument: string
  taxNumber: string
}

const RegisterForm: NextPage<RegisterFormProps> = (props) => {
  const t = useTranslations()
  const { registerUser } = useRegister()

  // Validation schema with Vietnamese messages
  const registerSchema = yup.object({
    phoneCode: yup
      .string()
      .required(t('homePage.auth.validation.phoneCodeRequired'))
      .matches(
        VALIDATION_PATTERNS.PHONE_CODE,
        t('homePage.auth.validation.phoneCodeInvalid'),
      ),
    phoneNumber: yup
      .string()
      .required(t('homePage.auth.validation.phoneNumberRequired'))
      .matches(
        VALIDATION_PATTERNS.PHONE_NUMBER,
        t('homePage.auth.validation.phoneNumberInvalid'),
      ),
    firstName: yup
      .string()
      .required(t('homePage.auth.validation.firstNameRequired')),
    lastName: yup
      .string()
      .required(t('homePage.auth.validation.lastNameRequired')),
    email: yup
      .string()
      .required(t('homePage.auth.validation.emailRequired'))
      .matches(
        VALIDATION_PATTERNS.EMAIL,
        t('homePage.auth.validation.emailInvalid'),
      ),
    password: yup
      .string()
      .required(t('homePage.auth.validation.passwordRequired'))
      .matches(
        VALIDATION_PATTERNS.PASSWORD,
        t('homePage.auth.validation.passwordPattern'),
      ),
    confirmPassword: yup
      .string()
      .required(t('homePage.auth.validation.confirmPasswordRequired'))
      .oneOf(
        [yup.ref('password')],
        t('homePage.auth.validation.confirmPasswordMatch'),
      ),
    idDocument: yup
      .string()
      .required(t('homePage.auth.validation.idDocumentRequired')),
    taxNumber: yup
      .string()
      .required(t('homePage.auth.validation.taxNumberRequired')),
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      phoneNumber: '',
      phoneCode: '+84',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      idDocument: '',
      taxNumber: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await registerUser({
        phoneCode: data.phoneCode,
        phoneNumber: data.phoneNumber,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        idDocument: data.idDocument,
        taxNumber: data.taxNumber,
      })

      if (result.success) {
        toast.success(t('homePage.auth.register.successMessage'))
      } else {
        toast.error(result.error || t('homePage.auth.register.errorMessage'))
      }
    } catch (error) {
      console.error('Register error:', error)
      toast.error(t('homePage.auth.register.errorMessage'))
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(onSubmit)(e)
  }

  return (
    <div className='space-y-3 md:space-y-5'>
      <div className='space-y-3 text-center'>
        <Typography variant='h3' className='!mb-2'>
          {t('homePage.auth.register.title')}
        </Typography>
        <Typography variant='muted'>
          {t('homePage.auth.register.description')}
        </Typography>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className='space-y-6'>
          {/* Personal Information Section */}
          <div className='space-y-4'>
            <div className='mb-2'>
              <Typography
                variant='small'
                className='text-sm font-medium text-muted-foreground'
              >
                {t('homePage.auth.register.sections.personalInfo')}
              </Typography>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                {...control.register('firstName')}
                label={t('homePage.auth.register.firstName')}
                required
                placeholder={t('homePage.auth.register.firstNamePlaceholder')}
                error={errors.firstName?.message}
              />
              <FormField
                {...control.register('lastName')}
                label={t('homePage.auth.register.lastName')}
                required
                placeholder={t('homePage.auth.register.lastNamePlaceholder')}
                error={errors.lastName?.message}
              />
            </div>
          </div>

          {/* Contact Information Section */}
          <div className='space-y-4'>
            <div className='mb-2'>
              <Typography
                variant='small'
                className='text-sm font-medium text-muted-foreground'
              >
                {t('homePage.auth.register.sections.contactInfo')}
              </Typography>
            </div>

            <PhoneField
              name='phoneNumber'
              control={control}
              label={t('homePage.auth.common.phoneNumber')}
              error={errors.phoneNumber?.message}
            />

            <FormField
              type='email'
              {...control.register('email')}
              label={t('homePage.auth.common.email')}
              required
              placeholder={t('homePage.auth.common.emailPlaceholder')}
              error={errors.email?.message}
            />
          </div>

          {/* Security Section */}
          <div className='space-y-4'>
            <div className='mb-2'>
              <Typography
                variant='small'
                className='text-sm font-medium text-muted-foreground'
              >
                {t('homePage.auth.register.sections.security')}
              </Typography>
            </div>

            <FormField
              type='password'
              {...control.register('password')}
              label={t('homePage.auth.common.password')}
              required
              placeholder={t('homePage.auth.common.passwordPlaceholder')}
              error={errors.password?.message}
            />

            <FormField
              type='password'
              {...control.register('confirmPassword')}
              label={t('homePage.auth.register.confirmPassword')}
              required
              placeholder={t(
                'homePage.auth.register.confirmPasswordPlaceholder',
              )}
              error={errors.confirmPassword?.message}
            />
          </div>

          {/* Legal Information Section */}
          <div className='space-y-4'>
            <div className='mb-2'>
              <Typography
                variant='small'
                className='text-sm font-medium text-muted-foreground'
              >
                {t('homePage.auth.register.sections.legalInfo')}
              </Typography>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                {...control.register('idDocument')}
                label={t('homePage.auth.register.idDocument')}
                required
                placeholder={t('homePage.auth.register.idDocumentPlaceholder')}
                error={errors.idDocument?.message}
              />
              <FormField
                {...control.register('taxNumber')}
                label={t('homePage.auth.register.taxNumber')}
                required
                placeholder={t('homePage.auth.register.taxNumberPlaceholder')}
                error={errors.taxNumber?.message}
              />
            </div>
          </div>
        </div>

        <Button type='submit' disabled={isSubmitting} className='w-full mt-6'>
          {isSubmitting
            ? t('homePage.auth.register.submittingButton')
            : t('homePage.auth.register.submitButton')}
        </Button>
      </form>

      <SeparatorOr />

      <Button
        type='button'
        variant='outline'
        className='w-full'
        onClick={() => {
          // TODO: Implement Google OAuth
          console.log('Google register clicked')
        }}
      >
        <ImageAtom
          src='/svg/google.svg'
          alt='Google'
          width={16}
          height={16}
          className='mr-2'
        />
        {t('homePage.auth.register.googleButton')}
      </Button>

      <div className='text-center pb-10 md:pb-0'>
        <Typography variant='p' className='text-sm text-muted-foreground'>
          {t('homePage.auth.register.haveAccount')}{' '}
          <Typography
            as='span'
            className='text-sm underline cursor-pointer text-primary'
            onClick={() => props.switchTo('login')}
          >
            {t('homePage.auth.register.loginLink')}
          </Typography>
        </Typography>
      </div>
    </div>
  )
}

export default RegisterForm
