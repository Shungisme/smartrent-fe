import { UserApi } from '@/api/types/user.type'
import { createContext, PropsWithChildren, useContext, useEffect } from 'react'
import { useAuthStore } from '@/store/auth/index.store'
import { AuthTokens } from '@/configs/axios/types'

interface User extends UserApi {}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (user: User, tokens: AuthTokens) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider = ({ children }: PropsWithChildren) => {
  // Get state from Zustand store
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateUser,
    clearError,
    getStoredTokens,
  } = useAuthStore()

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const tokens = getStoredTokens()
        if (tokens?.accessToken) {
          // TODO: Verify token with API and get user data
          // For now, we'll just check if token exists
          // In real implementation, you'd call API to verify token and get user
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        logout()
      }
    }

    initializeAuth()
  }, [])

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateUser,
    clearError,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

export default AuthProvider
