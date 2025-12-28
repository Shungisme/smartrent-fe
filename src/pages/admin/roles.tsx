import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/layouts/AdminLayout'
import Breadcrumb from '@/components/molecules/breadcrumb'
import { DataTable, Column } from '@/components/organisms/DataTable'
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

type RoleRow = {
  id: string
  name: string
}

const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState<Role | null>(null)
  const [showDelete, setShowDelete] = useState<Role | null>(null)
  const [form, setForm] = useState({ roleId: '', roleName: '' })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true)
      try {
        const resp = await getRoles()
        if (resp.success && resp.data) {
          setRoles(resp.data.data || resp.data)
        }
      } catch (err: unknown) {
        console.error('Error loading roles:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRoles()
  }, [])

  const columns: Column<RoleRow>[] = [
    {
      id: 'id',
      header: 'Role ID',
      accessor: 'id',
      render: (value) => (
        <span className='font-mono'>{value as React.ReactNode}</span>
      ),
    },
    {
      id: 'name',
      header: 'Role Name',
      accessor: 'name',
      render: (value) => <span>{value as React.ReactNode}</span>,
    },
    {
      id: 'actions',
      header: 'Actions',
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
            Edit
          </button>
          <button
            className='px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200'
            onClick={() => {
              const role = roles.find((r) => r.roleId === row.id)
              if (role) setShowDelete(role)
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  const transformedRoles: RoleRow[] = roles.map((role) => ({
    id: role.roleId,
    name: role.roleName,
  }))

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Admin Dashboard', href: '/admin' },
          { label: 'Role Management' },
        ]}
      />
      <div className='space-y-6'>
        <div className='flex items-center justify-end'>
          <Button
            className='bg-blue-600 hover:bg-blue-700 text-white'
            onClick={() => {
              setShowCreate(true)
              setForm({ roleId: '', roleName: '' })
              setFormError(null)
            }}
          >
            + Create Role
          </Button>
        </div>
        <DataTable
          data={transformedRoles}
          columns={columns}
          filters={[]}
          filterMode='frontend'
          pagination
          itemsPerPage={10}
          itemsPerPageOptions={[10, 20, 50]}
          sortable
          defaultSort={{ key: 'id', direction: 'asc' }}
          emptyMessage={loading ? 'Loading roles...' : 'No roles found'}
          getRowKey={(row) => row.id}
        />
        {/* Create Role Modal */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle>Create Role</DialogTitle>
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
                    setRoles((prev) => [resp.data, ...prev])
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
              <div>
                <Label htmlFor='roleId'>Role ID *</Label>
                <Input
                  id='roleId'
                  placeholder='Role ID'
                  value={form.roleId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, roleId: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor='roleName'>Role Name *</Label>
                <Input
                  id='roleName'
                  placeholder='Role Name'
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
              <div className='flex gap-3 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setShowCreate(false)}
                  disabled={formLoading}
                  className='flex-1'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={formLoading}
                  className='flex-1 bg-blue-600 hover:bg-blue-700'
                >
                  {formLoading ? 'Creating...' : 'Create'}
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
              <DialogTitle>Edit Role</DialogTitle>
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
                    setRoles((prev) =>
                      prev.map((r) =>
                        r.roleId === resp.data.roleId ? resp.data : r,
                      ),
                    )
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
              <div>
                <Label htmlFor='editRoleId'>Role ID</Label>
                <Input id='editRoleId' value={form.roleId} disabled />
              </div>
              <div>
                <Label htmlFor='editRoleName'>Role Name *</Label>
                <Input
                  id='editRoleName'
                  placeholder='Role Name'
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
              <div className='flex gap-3 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setShowEdit(null)}
                  disabled={formLoading}
                  className='flex-1'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={formLoading}
                  className='flex-1 bg-blue-600 hover:bg-blue-700'
                >
                  {formLoading ? 'Saving...' : 'Save'}
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
              <DialogTitle>Delete Role</DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <p>
                Are you sure you want to delete this role?
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
                  Cancel
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
                        setRoles((prev) =>
                          prev.filter((r) => r.roleId !== showDelete!.roleId),
                        )
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
                  {formLoading ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

RoleManagement.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout activeItem='roles'>{page}</AdminLayout>
}

export default RoleManagement
