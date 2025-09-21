import * as React from 'react'
import { NextPage } from 'next'
import AccountManagementTemplate from '@/components/templates/accountManagementTemplate'

const AccountManagePage: NextPage = () => {
  const handlePersonalInfoUpdate = async (): Promise<boolean> => {
    try {
      // TODO Call updateUser from useAuth hook

      return false
    } catch (error) {
      console.error('Failed to update personal info:', error)
      return false
    }
  }

  return (
    <AccountManagementTemplate
      onPersonalInfoUpdate={handlePersonalInfoUpdate}
    />
  )
}

export default AccountManagePage
