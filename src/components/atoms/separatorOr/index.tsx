import { useTranslations } from 'next-intl'
import { Separator } from '../separator'
import { Typography } from '../typography'

const SeparatorOr = () => {
  const t = useTranslations()

  return (
    <div className='relative'>
      <div className='absolute inset-0 flex items-center'>
        <Separator className='w-full' />
      </div>
      <div className='relative flex justify-center'>
        <Typography
          variant='small'
          className='px-3 bg-background text-muted-foreground uppercase tracking-wider'
        >
          {t('common.or')}
        </Typography>
      </div>
    </div>
  )
}

export default SeparatorOr
