'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  DataTable,
  Column,
  FilterConfig,
} from '@/components/organisms/DataTable'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Label } from '@/components/atoms/label'
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from '@/api/services/role.service'
import { Role } from '@/api/types/role.type'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'

type RoleRow = {
  id: string
  name: string
}

const RoleManagement = () => {
  const t = useTranslations('admin.roles')
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({
    page: 1,
    pageSize: 10,
  })
  const [totalItems, setTotalItems] = useState(0)
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState<Role | null>(null)
  const [showDelete, setShowDelete] = useState<Role | null>(null)
  const [form, setForm] = useState({ roleId: '', roleName: '' })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const fetchRoles = useCallback(async () => {
    setLoading(true)
    try {
      // Build filter array from filterValues (filter=key:value format)
      const filterArray: string[] = []

      if (filterValues.roleId) {
        filterArray.push(`roleId:${filterValues.roleId}`)
      }
      if (filterValues.roleName) {
        filterArray.push(`roleName:${filterValues.roleName}`)
      }

      const resp = await getRoles({
        page: filterValues.page ? Number(filterValues.page) : 1,
        size: filterValues.pageSize ? Number(filterValues.pageSize) : 10,
        filter: filterArray.length > 0 ? filterArray : undefined,
      })

      if (resp.success && resp.data) {
        const list = Array.isArray(resp.data)
          ? (resp.data as Role[])
          : resp.data.data || []
        setRoles(list)
        setTotalItems(
          Array.isArray(resp.data)
            ? list.length
            : (resp.data.totalElements ?? list.length),
        )
      }
    } catch (err: unknown) {
      console.error('Error loading roles:', err)
    } finally {
      setLoading(false)
    }
  }, [filterValues])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    setFilterValues(newFilters)
  }

  const columns: Column<RoleRow>[] = [
    {
      id: 'id',
      header: t('table.headers.roleId'),
      accessor: 'id',
      render: (value) => (
        <span className='font-mono'>{value as React.ReactNode}</span>
      ),
    },
    {
      id: 'name',
      header: t('table.headers.roleName'),
      accessor: 'name',
      render: (value) => <span>{value as React.ReactNode}</span>,
    },
    {
      id: 'actions',
      header: t('table.headers.actions'),
      accessor: () => '',
      render: (_, row) => (
        <div className='flex gap-2'>
          <button
            className='px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200'
            onClick={() => {
              const role = roles.find((r) => r.roleId === row.id)
              if (role) {
                setShowEdit(role)
                setForm({ roleId: role.roleId, roleName: role.roleName })
                setFormError(null)
              }
            }}
          >
            {t('table.actions.edit')}
          </button>
          <button
            className='px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200'
            onClick={() => {
              const role = roles.find((r) => r.roleId === row.id)
              if (role) setShowDelete(role)
            }}
          >
            {t('table.actions.delete')}
          </button>
        </div>
      ),
    },
  ]

  const transformedRoles: RoleRow[] = roles.map((role) => ({
    id: role.roleId,
    name: role.roleName,
  }))

  const filterConfig: FilterConfig[] = [
    {
      id: 'roleId',
      type: 'search',
      label: t('table.headers.roleId') || 'Role ID',
      placeholder: 'e.g. ADMIN',
      isFilterField: true,
    },
    {
      id: 'roleName',
      type: 'search',
      label: t('table.headers.roleName') || 'Role Name',
      placeholder: 'e.g. Administrator',
      isFilterField: true,
    },
  ]

  return (
    <div>
      <div className='space-y-6'>
        <div className='flex items-center justify-stretch sm:justify-end'>
          <Button
            className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white'
            onClick={() => {
              setShowCreate(true)
              setForm({ roleId: '', roleName: '' })
              setFormError(null)
            }}
          >
            <Plus className='h-4 w-4' />
            {t('createNewRole')}
          </Button>
        </div>
        <DataTable
          data={transformedRoles}
          columns={columns}
          filters={filterConfig}
          filterMode='api'
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          totalItems={totalItems}
          itemsPerPageOptions={[10, 20, 50]}
          sortable
          defaultSort={{ key: 'id', direction: 'asc' }}
          loading={loading}
          emptyMessage={loading ? 'Loading roles...' : 'No roles found'}
          getRowKey={(row) => row.id}
        />
        {/* Create Role Modal */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle>{t('create.title')}</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setFormLoading(true)
                setFormError(null)
                try {
                  const resp = await createRole(form)
                  if (resp.success && resp.data) {
                    setShowCreate(false)
                    await fetchRoles()
                  } else {
                    setFormError(resp.message || 'Failed to create role')
                  }
                } catch (err: unknown) {
                  const error = err as { message?: string }
                  setFormError(error.message || 'Error creating role')
                } finally {
                  setFormLoading(false)
                }
              }}
              className='space-y-4'
            >
              <div className='space-y-2'>
                <Label htmlFor='roleId'>{t('create.roleId')} *</Label>
                <Input
                  id='roleId'
                  placeholder={t('create.roleId')}
                  value={form.roleId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, roleId: e.target.value }))
                  }
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='roleName'>{t('create.roleName')} *</Label>
                <Input
                  id='roleName'
                  placeholder={t('create.roleName')}
                  value={form.roleName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, roleName: e.target.value }))
                  }
                  required
                />
              </div>
              {formError && (
                <div className='text-red-600 text-sm'>{formError}</div>
              )}
              <div className='flex gap-3'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setShowCreate(false)}
                  disabled={formLoading}
                  className='flex-1'
                >
                  {t('create.cancel')}
                </Button>
                <Button
                  type='submit'
                  disabled={formLoading}
                  className='flex-1 bg-blue-600 hover:bg-blue-700'
                >
                  {formLoading ? t('create.creating') : t('create.create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        {/* Edit Role Modal */}
        <Dialog
          open={!!showEdit}
          onOpenChange={(open) => !open && setShowEdit(null)}
        >
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle>{t('edit.title')}</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setFormLoading(true)
                setFormError(null)
                try {
                  const resp = await updateRole(showEdit!.roleId, {
                    roleName: form.roleName,
                  })
                  if (resp.success && resp.data) {
                    setShowEdit(null)
                    await fetchRoles()
                  } else {
                    setFormError(resp.message || 'Failed to update role')
                  }
                } catch (err: unknown) {
                  const error = err as { message?: string }
                  setFormError(error.message || 'Error updating role')
                } finally {
                  setFormLoading(false)
                }
              }}
              className='space-y-4'
            >
              <div className='space-y-2'>
                <Label htmlFor='editRoleId'>{t('create.roleId')}</Label>
                <Input id='editRoleId' value={form.roleId} disabled />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='editRoleName'>{t('create.roleName')} *</Label>
                <Input
                  id='editRoleName'
                  placeholder={t('create.roleName')}
                  value={form.roleName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, roleName: e.target.value }))
                  }
                  required
                />
              </div>
              {formError && (
                <div className='text-red-600 text-sm'>{formError}</div>
              )}
              <div className='flex gap-3'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setShowEdit(null)}
                  disabled={formLoading}
                  className='flex-1'
                >
                  {t('edit.cancel')}
                </Button>
                <Button
                  type='submit'
                  disabled={formLoading}
                  className='flex-1 bg-blue-600 hover:bg-blue-700'
                >
                  {formLoading ? t('edit.saving') : t('edit.save')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        {/* Delete Role Modal */}
        <Dialog
          open={!!showDelete}
          onOpenChange={(open) => !open && setShowDelete(null)}
        >
          <DialogContent className='max-w-sm'>
            <DialogHeader>
              <DialogTitle>{t('delete.title')}</DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <p>
                {t('delete.confirm')}
                <br />
                <span className='font-semibold'>{showDelete?.roleName}</span>
              </p>
              {formError && (
                <div className='text-red-600 text-sm'>{formError}</div>
              )}
              <div className='flex gap-3 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setShowDelete(null)}
                  disabled={formLoading}
                  className='flex-1'
                >
                  {t('delete.cancel')}
                </Button>
                <Button
                  disabled={formLoading}
                  onClick={async () => {
                    setFormLoading(true)
                    setFormError(null)
                    try {
                      const resp = await deleteRole(showDelete!.roleId)
                      if (resp.success) {
                        setShowDelete(null)
                        await fetchRoles()
                      } else {
                        setFormError(resp.message || 'Failed to delete role')
                      }
                    } catch (err: unknown) {
                      const error = err as { message?: string }
                      setFormError(error.message || 'Error deleting role')
                    } finally {
                      setFormLoading(false)
                    }
                  }}
                  className='flex-1 bg-red-600 hover:bg-red-700'
                >
                  {formLoading ? t('delete.deleting') : t('delete.delete')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default RoleManagement
