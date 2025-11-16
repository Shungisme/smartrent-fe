import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/layouts/AdminLayout'
import Breadcrumb from '@/components/molecules/breadcrumb'
import {
  DataTable,
  Column,
  FilterConfig,
} from '@/components/organisms/DataTable'
import { Avatar } from '@/components/atoms/avatar'
import { Badge } from '@/components/atoms/badge'
import { cn } from '@/lib/utils'
import type { NextPageWithLayout } from '@/types/next-page'
import { useTranslations } from 'next-intl'
import { getUserList } from '@/api/services/user.service'
import { UserProfile } from '@/api/types/user.type'

type UserData = {
  id: string
  name: string
  avatar?: string
  type: 'landlord' | 'tenant'
  joinDate: string
  lastOnline: string
  posts: number | null
  status: 'normal' | 'banned'
}

const UserManagement: NextPageWithLayout = () => {
  const t = useTranslations('admin.users')

  // State for API data
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentPage, setCurrentPage] = useState(0)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalPages, setTotalPages] = useState(0)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageSize, setPageSize] = useState(10)

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        // API uses 1-indexed pages, frontend uses 0-indexed
        const response = await getUserList(currentPage + 1, pageSize)
        if (response.success && response.data) {
          setUsers(response.data.data)
          setTotalPages(response.data.totalPages)
        } else {
          setError(response.message || 'Failed to load users')
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading users')
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [currentPage, pageSize])

  const breadcrumbItems = [
    { label: 'Admin Dashboard', href: '/admin' },
    { label: t('breadcrumb.dashboard') }, // Current page
  ]

  // Transform API data to match UI format
  const transformedUsers: UserData[] = users.map((user) => ({
    id: user.userId,
    name: `${user.firstName} ${user.lastName}`,
    avatar: undefined, // API doesn't return avatar yet
    type: 'tenant', // API doesn't specify type yet, default to tenant
    joinDate: new Date(user.userId).toLocaleDateString('vi-VN'), // Temporary until API provides join date
    lastOnline: new Date().toLocaleDateString('vi-VN'), // Temporary until API provides last online
    posts: null, // API doesn't return posts count yet
    status: 'normal', // API doesn't return status yet, default to normal
  }))

  // Define columns for DataTable
  const columns: Column<UserData>[] = [
    {
      id: 'id',
      header: t('table.headers.userId'),
      accessor: 'id',
      render: (value) => (
        <div className='text-sm font-medium text-gray-900'>{value}</div>
      ),
    },
    {
      id: 'user',
      header: t('table.headers.user'),
      accessor: (row) => row.name,
      sortable: true,
      render: (_, row) => (
        <div className='flex items-center gap-3'>
          <Avatar className='w-10 h-10'>
            <img
              src={row.avatar || '/images/default-image.jpg'}
              alt={row.name}
              className='w-full h-full object-cover'
            />
          </Avatar>
          <span className='font-medium text-gray-900'>{row.name}</span>
        </div>
      ),
    },
    {
      id: 'type',
      header: t('table.headers.type'),
      accessor: 'type',
      render: (value) => (
        <Badge
          variant={value === 'landlord' ? 'default' : 'secondary'}
          className={cn(
            'px-3 py-1',
            value === 'landlord'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800',
          )}
        >
          {t(`table.userTypes.${value}`)}
        </Badge>
      ),
    },
    {
      id: 'joinDate',
      header: t('table.headers.joinDate'),
      accessor: 'joinDate',
      sortable: true,
      render: (value) => <div className='text-sm text-gray-900'>{value}</div>,
    },
    {
      id: 'lastOnline',
      header: t('table.headers.lastOnline'),
      accessor: 'lastOnline',
      sortable: true,
      render: (value) => <div className='text-sm text-gray-900'>{value}</div>,
    },
    {
      id: 'posts',
      header: t('table.headers.posts'),
      accessor: 'posts',
      render: (value) =>
        value !== null ? (
          <Badge
            variant='outline'
            className='bg-green-50 text-green-800 border-green-200'
          >
            {value} {t('table.postsBadge')}
          </Badge>
        ) : (
          <Badge
            variant='outline'
            className='bg-gray-50 text-gray-500 border-gray-200'
          >
            {t('table.notApplicable')}
          </Badge>
        ),
    },
    {
      id: 'status',
      header: t('table.headers.status'),
      accessor: 'status',
      render: (value) => (
        <Badge
          className={cn(
            'px-3 py-1',
            value === 'normal'
              ? 'bg-black text-white'
              : 'bg-red-600 text-white',
          )}
        >
          {t(`table.statuses.${value}`)}
        </Badge>
      ),
    },
  ]

  // Define filters for DataTable
  const filters: FilterConfig[] = [
    {
      id: 'search',
      type: 'search',
      label: t('search.placeholder'),
      placeholder: t('search.placeholder'),
    },
    {
      id: 'type',
      type: 'select',
      label: t('filters.allUsers'),
      options: [
        { value: 'landlord', label: t('filters.landlord') },
        { value: 'tenant', label: t('filters.tenant') },
      ],
    },
  ]

  // Show loading state
  if (loading && users.length === 0) {
    return (
      <div>
        <Breadcrumb items={breadcrumbItems} />
        <div className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-4 text-gray-600'>Loading users...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div>
        <Breadcrumb items={breadcrumbItems} />
        <div className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <p className='text-red-600 mb-4'>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />

      <div className='space-y-6'>
        {/* DataTable Component */}
        <DataTable
          data={transformedUsers}
          columns={columns}
          filters={filters}
          filterMode='frontend'
          pagination
          itemsPerPage={pageSize}
          itemsPerPageOptions={[5, 10, 20, 50]}
          sortable
          defaultSort={{ key: 'joinDate', direction: 'desc' }}
          emptyMessage={loading ? 'Loading users...' : 'No users found'}
          getRowKey={(row) => row.id}
        />
      </div>
    </div>
  )
}

UserManagement.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout activeItem='users'>{page}</AdminLayout>
}

export default UserManagement
