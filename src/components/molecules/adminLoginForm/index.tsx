import { NextPage } from 'next'
import { PasswordField } from '../passwordField'
import { EmailField } from '../emailField'
import { Button } from '@/components/atoms/button'
import { Typography } from '@/components/atoms/typography'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAdminLogin } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { VALIDATION_PATTERNS } from '@/api/types/auth.type'
import { useRouter } from 'next/router'

type AdminLoginFormProps = {
  onSuccess?: () => void
}

type AdminLoginFormData = {
  email: string
  password: string
}

const AdminLoginForm: NextPage<AdminLoginFormProps> = (props) => {
  const t = useTranslations()
  const router = useRouter()
  const { loginAdmin } = useAdminLogin()
  const { onSuccess } = props

  const loginSchema = yup.object({
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
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<AdminLoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      const result = await loginAdmin(data)

      if (result.success) {
        toast.success(t('homePage.auth.login.successMessage'))
        onSuccess?.()
        // Redirect to users page
        router.push('/users')
      } else {
        toast.error(result.message || t('homePage.auth.login.errorMessage'))
      }
    } catch (error) {
      console.error('Admin login error:', error)
      toast.error(t('homePage.auth.login.errorMessage'))
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(onSubmit)(e)
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-3 text-center'>
        <Typography variant='h2' className='!mb-2'>
          Admin Login
        </Typography>
        <Typography variant='muted'>
          Sign in to access the admin dashboard
        </Typography>
      </div>

      <form onSubmit={handleFormSubmit} className='space-y-4'>
        <EmailField
          name='email'
          control={control}
          label={t('homePage.auth.common.email')}
          error={errors.email?.message}
        />

        <PasswordField
          name='password'
          control={control}
          label={t('homePage.auth.common.password')}
          error={errors.password?.message}
        />

        <Button type='submit' disabled={isSubmitting} className='w-full'>
          {isSubmitting
            ? t('homePage.auth.login.submittingButton')
            : t('homePage.auth.login.submitButton')}
        </Button>
      </form>
    </div>
  )
}

export default AdminLoginForm
