import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/layouts/AdminLayout'
import Breadcrumb from '@/components/molecules/breadcrumb'
import { DataTable, Column } from '@/components/organisms/DataTable'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const t = useTranslations('admin.roles')
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState<Role | null>(null)
  const [showDelete, setShowDelete] = useState<Role | null>(null)
  const [form, setForm] = useState({ roleId: '', roleName: '' })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true)
      setError(null)
      try {
        const resp = await getRoles()
        if (resp.success && resp.data) {
          setRoles(resp.data.data || resp.data)
        } else {
          setError(resp.message || 'Failed to load roles')
        }
      } catch (err: any) {
        setError(err.message || 'Error loading roles')
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
      render: (value) => <span className='font-mono'>{value}</span>,
    },
    {
      id: 'name',
      header: 'Role Name',
      accessor: 'name',
      render: (value) => <span>{value}</span>,
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
        {showCreate && (
          <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'>
              <h2 className='text-lg font-semibold mb-4'>Create Role</h2>
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
                  } catch (err: any) {
                    setFormError(err.message || 'Error creating role')
                  } finally {
                    setFormLoading(false)
                  }
                }}
              >
                <div className='space-y-3'>
                  <Input
                    placeholder='Role ID'
                    value={form.roleId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, roleId: e.target.value }))
                    }
                    required
                  />
                  <Input
                    placeholder='Role Name'
                    value={form.roleName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, roleName: e.target.value }))
                    }
                    required
                  />
                  {formError && (
                    <div className='text-red-600 text-sm'>{formError}</div>
                  )}
                </div>
                <div className='flex justify-end gap-2 mt-6'>
                  <button
                    type='button'
                    className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
                    onClick={() => setShowCreate(false)}
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                    disabled={formLoading}
                  >
                    {formLoading ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Edit Role Modal */}
        {showEdit && (
          <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'>
              <h2 className='text-lg font-semibold mb-4'>Edit Role</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  setFormLoading(true)
                  setFormError(null)
                  try {
                    const resp = await updateRole(showEdit.roleId, {
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
                  } catch (err: any) {
                    setFormError(err.message || 'Error updating role')
                  } finally {
                    setFormLoading(false)
                  }
                }}
              >
                <div className='space-y-3'>
                  <Input placeholder='Role ID' value={form.roleId} disabled />
                  <Input
                    placeholder='Role Name'
                    value={form.roleName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, roleName: e.target.value }))
                    }
                    required
                  />
                  {formError && (
                    <div className='text-red-600 text-sm'>{formError}</div>
                  )}
                </div>
                <div className='flex justify-end gap-2 mt-6'>
                  <button
                    type='button'
                    className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
                    onClick={() => setShowEdit(null)}
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                    disabled={formLoading}
                  >
                    {formLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Delete Role Modal */}
        {showDelete && (
          <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-sm'>
              <h2 className='text-lg font-semibold mb-4'>Delete Role</h2>
              <p className='mb-4'>
                Are you sure you want to delete this role?
                <br />
                <span className='font-semibold'>{showDelete.roleName}</span>
              </p>
              {formError && (
                <div className='text-red-600 text-sm mb-2'>{formError}</div>
              )}
              <div className='flex justify-end gap-2'>
                <button
                  className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
                  onClick={() => setShowDelete(null)}
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
                  disabled={formLoading}
                  onClick={async () => {
                    setFormLoading(true)
                    setFormError(null)
                    try {
                      const resp = await deleteRole(showDelete.roleId)
                      if (resp.success) {
                        setShowDelete(null)
                        setRoles((prev) =>
                          prev.filter((r) => r.roleId !== showDelete.roleId),
                        )
                      } else {
                        setFormError(resp.message || 'Failed to delete role')
                      }
                    } catch (err: any) {
                      setFormError(err.message || 'Error deleting role')
                    } finally {
                      setFormLoading(false)
                    }
                  }}
                >
                  {formLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

RoleManagement.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout activeItem='roles'>{page}</AdminLayout>
}

export default RoleManagement
