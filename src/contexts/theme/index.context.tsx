import { useContext } from 'react'
import { ThemeContext } from '.'

export function useCustomTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeDataProvider')
  }
  return context
}
