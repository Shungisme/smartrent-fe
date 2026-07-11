'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  DataTable,
  Column,
  FilterConfig,
} from '@/components/organisms/DataTable'
import { Button } from '@/components/atoms/button'
import { getRoles } from '@/api/services/role.service'
import { Role } from '@/api/types/role.type'
import { useTranslations } from 'next-intl'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { RoleCreateDialog } from '@/components/organisms/roles/RoleCreateDialog'
import { RoleEditDialog } from '@/components/organisms/roles/RoleEditDialog'
import { RoleDeleteDialog } from '@/components/organisms/roles/RoleDeleteDialog'

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
    pageSize: 20,
  })
  const [totalItems, setTotalItems] = useState(0)
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState<Role | null>(null)
  const [showDelete, setShowDelete] = useState<Role | null>(null)

  const fetchRoles = useCallback(async () => {
    setLoading(true)
    try {
      const filterArray: string[] = []

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
      defaultHidden: true,
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
  ]

  const transformedRoles: RoleRow[] = roles.map((role) => ({
    id: role.roleId,
    name: role.roleName,
  }))

  const filterConfig: FilterConfig[] = [
    {
      id: 'roleName',
      type: 'search',
      label: t('table.headers.roleName'),
      placeholder: t('table.roleNamePlaceholder'),
      isFilterField: true,
    },
  ]

  return (
    <div>
      <div className='space-y-6'>
        <DataTable
          data={transformedRoles}
          columns={columns}
          filters={filterConfig}
          toolbarActions={
            <Button size='sm' onClick={() => setShowCreate(true)}>
              <Plus className='h-4 w-4' />
              {t('createNewRole')}
            </Button>
          }
          filterMode='api'
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          totalItems={totalItems}
          itemsPerPageOptions={[10, 20, 50]}
          sortable
          defaultSort={{ key: 'id', direction: 'asc' }}
          loading={loading}
          emptyMessage={loading ? t('table.loading') : t('table.empty')}
          getRowKey={(row) => row.id}
          actions={(row) => (
            <div className='flex items-center justify-center gap-0.5'>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground'
                title={t('table.actions.edit')}
                onClick={() => {
                  const role = roles.find((r) => r.roleId === row.id)
                  if (role) setShowEdit(role)
                }}
              >
                <Pencil className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                title={t('table.actions.delete')}
                onClick={() => {
                  const role = roles.find((r) => r.roleId === row.id)
                  if (role) setShowDelete(role)
                }}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          )}
        />

        <RoleCreateDialog
          open={showCreate}
          onOpenChange={setShowCreate}
          onSuccess={fetchRoles}
        />

        <RoleEditDialog
          role={showEdit}
          open={!!showEdit}
          onOpenChange={(open) => !open && setShowEdit(null)}
          onSuccess={fetchRoles}
        />

        <RoleDeleteDialog
          role={showDelete}
          open={!!showDelete}
          onOpenChange={(open) => !open && setShowDelete(null)}
          onSuccess={fetchRoles}
        />
      </div>
    </div>
  )
}

export default RoleManagement
