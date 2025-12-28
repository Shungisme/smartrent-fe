import { useState } from 'react'
import { UserService } from '@/api/services/user.service'
import { UserUpdateRequest } from '@/api/types/user.type'
import { useAuth } from './index'

interface UpdateProfileResult {
  success: boolean
  message?: string
  error?: string
}

/**
 * Hook for updating admin profile
 * Handles profile update for admin users
 */
export const useUpdateProfile = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { updateUser } = useAuth()

  /**
   * Update admin profile
   * @param userId - Admin user ID
   * @param data - Profile data to update
   * @returns Result object with success status
   */
  const updateProfile = async (
    userId: string,
    data: Partial<UserUpdateRequest>,
  ): Promise<UpdateProfileResult> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await UserService.updateUser(userId, data)

      if (response.data) {
        // Update auth context with new user data
        updateUser(response.data)

        return {
          success: true,
          message: 'Profile updated successfully',
        }
      }

      return {
        success: false,
        error: 'Failed to update profile',
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateProfile,
    isLoading,
    error,
  }
}
