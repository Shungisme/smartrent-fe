import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { useTranslations } from 'next-intl'
import { createAdmin } from '@/api/services/admin.service'
import { getRoles } from '@/api/services/role.service'
import { Role } from '@/api/types/role.type'
import { AdminProfile } from '@/api/types/admin.type'

interface AdminCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (admin: AdminProfile) => void
}

export const AdminCreateDialog: React.FC<AdminCreateDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const t = useTranslations('admin.admins')
  const [formData, setFormData] = useState({
    phoneCode: '+84',
    phoneNumber: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    roles: [] as string[],
  })
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [rolesLoading, setRolesLoading] = useState(true)

  // Fetch roles on mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles()
        if (response.success) {
          setRoles(response.data?.data || [])
        }
      } catch (error) {
        console.error('Failed to fetch roles:', error)
      } finally {
        setRolesLoading(false)
      }
    }
    fetchRoles()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await createAdmin(formData)
      if (response.success && response.data) {
        alert(
          `Admin created successfully!\nTemporary Password: ${response.data.password}\n\nPlease save this password securely.`,
        )
        // Map CreateAdminResponse to AdminProfile shape for state
        const newAdmin: AdminProfile = {
          adminId: response.data.adminId,
          phoneCode: response.data.phoneCode,
          phoneNumber: response.data.phoneNumber,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          roles: response.data.roles,
          idDocument: null,
          taxNumber: null,
        }
        onSuccess(newAdmin)
        onOpenChange(false)
        setFormData({
          phoneCode: '+84',
          phoneNumber: '',
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          roles: [],
        })
      } else {
        alert(`Error: ${response.message}`)
      }
    } catch (error: unknown) {
      const err = error as { message?: string }
      alert(`Failed to create admin: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-[20vw] max-w-md max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t('create.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-2'>
          <div className='space-y-2'>
            <Label htmlFor='firstName'>{t('create.firstName')} *</Label>
            <Input
              id='firstName'
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='lastName'>{t('create.lastName')} *</Label>
            <Input
              id='lastName'
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>{t('create.email')} *</Label>
            <Input
              id='email'
              type='email'
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className='grid grid-cols-3 gap-2'>
            <div className='space-y-2'>
              <Label htmlFor='phoneCode'>{t('create.phoneCode')} *</Label>
              <Input
                id='phoneCode'
                value={formData.phoneCode}
                onChange={(e) =>
                  setFormData({ ...formData, phoneCode: e.target.value })
                }
                required
              />
            </div>
            <div className='col-span-2 space-y-2'>
              <Label htmlFor='phoneNumber'>{t('create.phoneNumber')} *</Label>
              <Input
                id='phoneNumber'
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>{t('create.password')} *</Label>
            <Input
              id='password'
              type='password'
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              minLength={8}
            />
          </div>

          <div className='space-y-2'>
            <Label>
              {t('create.roles')} * ({t('create.selectRoles')})
            </Label>
            {rolesLoading ? (
              <p className='text-sm text-gray-500'>Loading roles...</p>
            ) : (
              <div className='space-y-2 mt-2'>
                {roles.map((role) => (
                  <label key={role.roleId} className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={formData.roles.includes(role.roleId)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            roles: [...formData.roles, role.roleId],
                          })
                        } else {
                          setFormData({
                            ...formData,
                            roles: formData.roles.filter(
                              (r) => r !== role.roleId,
                            ),
                          })
                        }
                      }}
                      className='rounded border-gray-300'
                    />
                    <span className='text-sm'>{role.roleName}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className='flex gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className='flex-1'
            >
              {t('create.cancel')}
            </Button>
            <Button
              type='submit'
              disabled={loading || formData.roles.length === 0}
              className='flex-1 bg-blue-600 hover:bg-blue-700'
            >
              {loading ? t('create.creating') : t('create.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
