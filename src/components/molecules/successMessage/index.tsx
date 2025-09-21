import { NextPage } from 'next'
import { Button } from '@/components/atoms/button'
import { Typography } from '@/components/atoms/typography'
import { useTranslations } from 'next-intl'
import { CheckCircle } from 'lucide-react'

type SuccessMessageProps = {
  onClick: () => void
  email?: string
  title: string
  description: string
  buttonText: string
  showButton: boolean
}

const SuccessMessage: NextPage<SuccessMessageProps> = (props) => {
  const { onClick, title, description, buttonText, showButton = true } = props
  const t = useTranslations()

  return (
    <div className='space-y-6 text-center'>
      <div className='flex justify-center'>
        <CheckCircle className='w-16 h-16 text-green-500' />
      </div>

      <div className='space-y-3'>
        <Typography variant='h3' className='!mb-2'>
          {title}
        </Typography>
        <Typography variant='muted'>{description}</Typography>
      </div>

      {showButton && (
        <Button onClick={onClick} className='w-full'>
          {buttonText || t('homePage.auth.success.backToLogin')}
        </Button>
      )}
    </div>
  )
}

export default SuccessMessage
