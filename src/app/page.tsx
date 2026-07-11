import { redirect } from 'next/navigation'
import { DEFAULT_HOME_ROUTE } from '@/constants/navigation'

export default function HomePage() {
  redirect(DEFAULT_HOME_ROUTE)
}
