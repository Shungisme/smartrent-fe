import { useContext } from 'react'
import { SwitchLanguageContext } from '.'

export const useSwitchLanguage = () => {
  const context = useContext(SwitchLanguageContext)
  if (!context) {
    throw new Error(
      'useSwitchLanguage must be used within a SwitchLanguageProvider',
    )
  }

  return context
}
