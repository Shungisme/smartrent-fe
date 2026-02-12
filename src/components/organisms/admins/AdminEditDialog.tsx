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
import { updateAdmin } from '@/api/services/admin.service'
import { getRoles } from '@/api/services/role.service'
import { Role } from '@/api/types/role.type'
import { AdminProfile, UpdateAdminRequest } from '@/api/types/admin.type'

interface AdminEditDialogProps {
  admin: AdminProfile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (admin: AdminProfile) => void
}

export const AdminEditDialog: React.FC<AdminEditDialogProps> = ({
  admin,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const t = useTranslations('admin.admins')
  const [form, setForm] = useState<Partial<UpdateAdminRequest>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  useEffect(() => {
    if (admin) {
      setForm({
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        phoneCode: admin.phoneCode,
        phoneNumber: admin.phoneNumber,
        roles: admin.roles,
      })
    }
  }, [admin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!admin) return

    setLoading(true)
    setError(null)
    try {
      const resp = await updateAdmin(admin.adminId, form)
      if (resp.success && resp.data) {
        onSuccess(resp.data)
        onOpenChange(false)
      } else {
        setError(resp.message || 'Failed to update admin')
      }
    } catch (err: unknown) {
      const error = err as { message?: string }
      setError(error.message || 'Error updating admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-[20vw] max-w-md max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t('edit.title') || 'Edit Admin'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-2'>
          <div className='space-y-2'>
            <Label htmlFor='editEmail'>{t('edit.email') || 'Email'} *</Label>
            <Input
              id='editEmail'
              type='email'
              placeholder='Email'
              value={form.email || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='editFirstName'>
              {t('edit.firstName') || 'First Name'} *
            </Label>
            <Input
              id='editFirstName'
              placeholder='First Name'
              value={form.firstName || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, firstName: e.target.value }))
              }
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='editLastName'>
              {t('edit.lastName') || 'Last Name'} *
            </Label>
            <Input
              id='editLastName'
              placeholder='Last Name'
              value={form.lastName || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, lastName: e.target.value }))
              }
              required
            />
          </div>
          <div className='grid grid-cols-3 gap-2'>
            <div className='space-y-2'>
              <Label htmlFor='editPhoneCode'>
                {t('edit.phoneCode') || 'Code'} *
              </Label>
              <Input
                id='editPhoneCode'
                placeholder='Code'
                value={form.phoneCode || ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phoneCode: e.target.value }))
                }
                required
              />
            </div>
            <div className='col-span-2 space-y-2'>
              <Label htmlFor='editPhoneNumber'>
                {t('edit.phoneNumber') || 'Phone Number'} *
              </Label>
              <Input
                id='editPhoneNumber'
                placeholder='Phone Number'
                value={form.phoneNumber || ''}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    phoneNumber: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label>{t('edit.roles') || 'Roles'}</Label>
            {rolesLoading ? (
              <p className='text-sm text-gray-500'>Loading roles...</p>
            ) : (
              <div className='space-y-2 mt-2'>
                {roles.map((role) => (
                  <label key={role.roleId} className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={form.roles?.includes(role.roleId) || false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm((f) => ({
                            ...f,
                            roles: [...(f.roles || []), role.roleId],
                          }))
                        } else {
                          setForm((f) => ({
                            ...f,
                            roles: (f.roles || []).filter(
                              (r) => r !== role.roleId,
                            ),
                          }))
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
          {error && <div className='text-red-600 text-sm'>{error}</div>}
          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t('edit.cancel') || 'Cancel'}
            </Button>
            <Button
              type='submit'
              disabled={loading}
              className='bg-blue-600 hover:bg-blue-700'
            >
              {loading
                ? t('edit.saving') || 'Saving...'
                : t('edit.save') || 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
