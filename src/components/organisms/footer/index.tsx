import React from 'react'
import { Typography } from '@/components/atoms/typography'
import { useTranslations } from 'next-intl'
import {
  Building2,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react'

const Footer: React.FC = () => {
  const t = useTranslations()

  return (
    <footer className='bg-muted/50 border-t border-border'>
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='py-8 sm:py-12'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8'>
            {/* Company Info */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
                  <Building2 className='h-5 w-5 text-primary-foreground' />
                </div>
                <Typography variant='h5' className='text-foreground font-bold'>
                  SmartRent
                </Typography>
              </div>
              <Typography variant='muted' className='text-sm'>
                {t('footer.description')}
              </Typography>
              <div className='flex space-x-4'>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  <Facebook className='h-5 w-5' />
                </a>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  <Instagram className='h-5 w-5' />
                </a>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  <Twitter className='h-5 w-5' />
                </a>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  <Youtube className='h-5 w-5' />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className='space-y-4'>
              <Typography
                variant='h6'
                className='text-foreground font-semibold'
              >
                {t('footer.quickLinks')}
              </Typography>
              <div className='space-y-2'>
                <a
                  href='#'
                  className='block text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  <Typography
                    variant='small'
                    className='text-sm text-muted-foreground hover:text-primary transition-colors'
                  >
                    {t('footer.aboutUs')}
                  </Typography>
                </a>
                <a
                  href='#'
                  className='block text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  <Typography
                    variant='small'
                    className='text-sm text-muted-foreground hover:text-primary transition-colors'
                  >
                    {t('footer.properties')}
                  </Typography>
                </a>
                <a
                  href='#'
                  className='block text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  <Typography
                    variant='small'
                    className='text-sm text-muted-foreground hover:text-primary transition-colors'
                  >
                    {t('footer.services')}
                  </Typography>
                </a>
                <a
                  href='#'
                  className='block text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  <Typography
                    variant='small'
                    className='text-sm text-muted-foreground hover:text-primary transition-colors'
                  >
                    {t('footer.contact')}
                  </Typography>
                </a>
              </div>
            </div>

            {/* Support */}
            <div className='space-y-4'>
              <Typography
                variant='h6'
                className='text-foreground font-semibold'
              >
                {t('footer.support')}
              </Typography>
              <div className='space-y-2'>
                <a
                  href='#'
                  className='block text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  <Typography
                    variant='small'
                    className='text-sm text-muted-foreground hover:text-primary transition-colors'
                  >
                    {t('footer.helpCenter')}
                  </Typography>
                </a>
                <a
                  href='#'
                  className='block text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  <Typography
                    variant='small'
                    className='text-sm text-muted-foreground hover:text-primary transition-colors'
                  >
                    {t('footer.privacyPolicy')}
                  </Typography>
                </a>
                <a
                  href='#'
                  className='block text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  <Typography
                    variant='small'
                    className='text-sm text-muted-foreground hover:text-primary transition-colors'
                  >
                    {t('footer.termsOfService')}
                  </Typography>
                </a>
                <a
                  href='#'
                  className='block text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  <Typography
                    variant='small'
                    className='text-sm text-muted-foreground hover:text-primary transition-colors'
                  >
                    {t('footer.faq')}
                  </Typography>
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className='space-y-4'>
              <Typography
                variant='h6'
                className='text-foreground font-semibold'
              >
                {t('footer.contactInfo')}
              </Typography>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <MapPin className='h-4 w-4 text-muted-foreground' />
                  <Typography
                    variant='small'
                    className='text-sm text-muted-foreground'
                  >
                    {t('footer.address')}
                  </Typography>
                </div>
                <div className='flex items-center gap-2'>
                  <Phone className='h-4 w-4 text-muted-foreground' />
                  <Typography
                    variant='small'
                    className='text-sm text-muted-foreground'
                  >
                    {t('footer.phone')}
                  </Typography>
                </div>
                <div className='flex items-center gap-2'>
                  <Mail className='h-4 w-4 text-muted-foreground' />
                  <Typography
                    variant='small'
                    className='text-sm text-muted-foreground'
                  >
                    {t('footer.email')}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className='mt-8 pt-6 border-t border-border'>
            <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
              <Typography
                variant='small'
                className='text-muted-foreground text-center sm:text-left'
              >
                {t('footer.copyright')}
              </Typography>
              <div className='flex items-center gap-4'>
                <a
                  href='#'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  <Typography
                    variant='small'
                    className='text-sm text-muted-foreground hover:text-primary transition-colors'
                  >
                    {t('footer.privacy')}
                  </Typography>
                </a>
                <a
                  href='#'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  <Typography
                    variant='small'
                    className='text-sm text-muted-foreground hover:text-primary transition-colors'
                  >
                    {t('footer.terms')}
                  </Typography>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
