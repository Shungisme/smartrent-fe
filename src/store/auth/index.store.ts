import { UserApi, AdminApi } from '@/api/types/user.type'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AuthTokens } from '@/configs/axios/types'
import { cookieManager } from '@/utils/cookies'

// Unified user interface that works with both User and Admin
interface User extends Omit<UserApi, 'id'> {
  id: string
  roles?: string[]
}

// Helper function to normalize admin data to user format
function normalizeAdminToUser(admin: AdminApi): User {
  return {
    id: admin.adminId,
    phoneCode: admin.phoneCode,
    phoneNumber: admin.phoneNumber,
    email: admin.email,
    password: '', // Not available in JWT
    firstName: admin.firstName,
    lastName: admin.lastName,
    idDocument: admin.idDocument,
    taxNumber: admin.taxNumber,
    roles: admin.roles,
  }
}

// Helper function to normalize regular user data
function normalizeUserToUser(user: UserApi): User {
  return {
    ...user,
    roles: [],
  }
}

interface AuthState {
  // State
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  login: (user: User, tokens: AuthTokens) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  clearError: () => void

  // Token management
  getStoredTokens: () => AuthTokens | null
  refreshTokens: (tokens: AuthTokens) => void
  clearTokens: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      login: (user, tokens) => {
        // Store tokens using cookie utility
        cookieManager.setAuthTokens(tokens)

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      },

      logout: () => {
        // Clear tokens using cookie utility
        cookieManager.clearAuthTokens()

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },

      updateUser: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } })
        }
      },

      clearError: () => set({ error: null }),

      getStoredTokens: () => {
        return cookieManager.getAuthTokens()
      },

      refreshTokens: (tokens) => {
        cookieManager.setAuthTokens(tokens)
      },

      clearTokens: () => {
        cookieManager.clearAuthTokens()
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist user data, not tokens (tokens are in cookies)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

// Export helper functions for normalizing user data
export { normalizeAdminToUser, normalizeUserToUser }
export type { User }
