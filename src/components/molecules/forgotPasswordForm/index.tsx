import { NextPage } from 'next'
import { AuthType } from '@/components/organisms/authDialog'
import { EmailField } from '../emailField'
import { Button } from '@/components/atoms/button'
import { Typography } from '@/components/atoms/typography'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AuthService } from '@/api/services/auth.service'
import { toast } from 'sonner'
import { VALIDATION_PATTERNS } from '@/api/types/auth.type'

type ForgotPasswordFormProps = {
  switchTo: (type: AuthType) => void
  onSuccess?: (email: string) => void
}

type ForgotPasswordFormData = {
  email: string
}

const ForgotPasswordForm: NextPage<ForgotPasswordFormProps> = (props) => {
  const { onSuccess } = props
  const t = useTranslations()

  const forgotSchema = z.object({
    email: z
      .string()
      .trim()
      .min(1, t('homePage.auth.validation.emailRequired'))
      .regex(
        VALIDATION_PATTERNS.EMAIL,
        t('homePage.auth.validation.emailInvalid'),
      ),
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await AuthService.resendOtp(data.email)

      if (response.success) {
        onSuccess?.(data.email)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Forgot password error:', error)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(onSubmit)(e)
  }

  return (
    <div className='space-y-4 md:space-y-5'>
      <div className='space-y-2 text-center'>
        <Typography variant='h3' className='!mb-2'>
          {t('homePage.auth.forgotPassword.title')}
        </Typography>
        <Typography variant='muted'>
          {t('homePage.auth.forgotPassword.description')}
        </Typography>
      </div>

      <form onSubmit={handleFormSubmit} className='space-y-4'>
        <EmailField
          name='email'
          control={control}
          label={t('homePage.auth.common.email')}
          error={errors.email?.message}
        />

        <Button type='submit' disabled={isSubmitting} className='w-full'>
          {isSubmitting
            ? t('homePage.auth.forgotPassword.submittingButton')
            : t('homePage.auth.forgotPassword.submitButton')}
        </Button>
      </form>

      <div className='text-center'>
        <button
          type='button'
          className='transition-colors cursor-pointer'
          onClick={() => props.switchTo('login')}
        >
          {t.rich('homePage.auth.forgotPassword.switchToLogin', {
            u: (chunks) => <u className='underline text-primary'>{chunks}</u>,
          })}
        </button>
      </div>
    </div>
  )
}

export default ForgotPasswordForm
