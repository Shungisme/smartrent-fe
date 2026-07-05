import { NextPage } from 'next'
import { PasswordField } from '../passwordField'
import { EmailField } from '../emailField'
import { Button } from '@/components/atoms/button'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAdminLogin } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { VALIDATION_PATTERNS } from '@/api/types/auth.type'
import { useRouter } from 'next/navigation'
import { DEFAULT_HOME_ROUTE } from '@/constants/navigation'

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

  const loginSchema = z.object({
    email: z
      .string()
      .trim()
      .min(1, t('homePage.auth.validation.emailRequired'))
      .regex(
        VALIDATION_PATTERNS.EMAIL,
        t('homePage.auth.validation.emailInvalid'),
      ),
    password: z
      .string()
      .min(1, t('homePage.auth.validation.passwordRequired'))
      .regex(
        VALIDATION_PATTERNS.PASSWORD,
        t('homePage.auth.validation.passwordPattern'),
      ),
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(loginSchema),
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
        router.push(DEFAULT_HOME_ROUTE)
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
    <form onSubmit={handleFormSubmit} className='space-y-5'>
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

      <Button
        type='submit'
        disabled={isSubmitting}
        className='h-11 w-full text-sm font-medium'
      >
        {isSubmitting ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            {t('homePage.auth.login.submittingButton')}
          </>
        ) : (
          t('homePage.auth.login.submitButton')
        )}
      </Button>
    </form>
  )
}

export default AdminLoginForm
