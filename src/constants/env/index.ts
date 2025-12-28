import { PATHS } from '@/api/paths'

export const ENV = {
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',

  // API Configuration
  URL_API_BASE:
    process.env.NEXT_PUBLIC_URL_API_BASE || 'http://localhost:8080/',
  API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),

  // Cookie Configuration
  ACCESS_TOKEN_COOKIE:
    process.env.NEXT_PUBLIC_ACCESS_TOKEN_COOKIE || 'access_token',
  REFRESH_TOKEN_COOKIE:
    process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE || 'refresh_token',
  ACCESS_TOKEN_EXPIRES: parseInt(
    process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRES || '7',
    10,
  ),
  REFRESH_TOKEN_EXPIRES: parseInt(
    process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRES || '30',
    10,
  ),
  COOKIE_SECURE: process.env.NEXT_PUBLIC_COOKIE_SECURE !== 'false',
  COOKIE_SAME_SITE:
    (process.env.NEXT_PUBLIC_COOKIE_SAME_SITE as
      | 'strict'
      | 'lax'
      | 'none'
      | undefined) || 'strict',
  COOKIE_DOMAIN: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || '',

  // Application Configuration
  BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || '',
  DEFAULT_IMAGE:
    process.env.NEXT_PUBLIC_DEFAULT_IMAGE || '/images/default-image.jpg',
  DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'vi',

  // Feature Flags
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG_MODE: process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE === 'true',

  // API endpoints
  API: PATHS,

  // API response codes
  API_CODES: {
    SUCCESS: '999999',
    INVALID_EMAIL: '2001',
    INVALID_PASSWORD: '2002',
    FIELD_REQUIRED: '2004',
    INVALID_PHONE: '2005',
    EMAIL_EXISTS: '3001',
    PHONE_EXISTS: '3002',
    DOCUMENT_EXISTS: '3003',
    TAX_NUMBER_EXISTS: '3004',
    INVALID_CREDENTIALS: '5002',
    INVALID_TOKEN: '5003',
  },
}
