import React from 'react'
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

// Mock data for 12 users matching the requirements
const mockUsers: UserData[] = [
  {
    id: '001',
    name: 'Nguyễn Văn An',
    avatar: '/images/default-image.jpg',
    type: 'landlord',
    joinDate: '15/03/2024',
    lastOnline: '28/03/2024',
    posts: 3,
    status: 'normal',
  },
  {
    id: '002',
    name: 'Trần Thị Bình',
    avatar: '/images/default-image.jpg',
    type: 'tenant',
    joinDate: '20/03/2024',
    lastOnline: '27/03/2024',
    posts: null,
    status: 'normal',
  },
  {
    id: '003',
    name: 'Lê Hoàng Cường',
    avatar: '/images/default-image.jpg',
    type: 'landlord',
    joinDate: '10/03/2024',
    lastOnline: '29/03/2024',
    posts: 7,
    status: 'normal',
  },
  {
    id: '004',
    name: 'Phạm Mai Dung',
    avatar: '/images/default-image.jpg',
    type: 'tenant',
    joinDate: '25/02/2024',
    lastOnline: '26/03/2024',
    posts: null,
    status: 'banned',
  },
  {
    id: '005',
    name: 'Hoàng Minh Đức',
    avatar: '/images/default-image.jpg',
    type: 'landlord',
    joinDate: '05/03/2024',
    lastOnline: '28/03/2024',
    posts: 2,
    status: 'normal',
  },
  {
    id: '006',
    name: 'Vũ Thị Giang',
    avatar: '/images/default-image.jpg',
    type: 'tenant',
    joinDate: '18/03/2024',
    lastOnline: '29/03/2024',
    posts: null,
    status: 'normal',
  },
  {
    id: '007',
    name: 'Đỗ Văn Hải',
    avatar: '/images/default-image.jpg',
    type: 'landlord',
    joinDate: '12/03/2024',
    lastOnline: '27/03/2024',
    posts: 5,
    status: 'normal',
  },
  {
    id: '008',
    name: 'Ngô Thị Lan',
    avatar: '/images/default-image.jpg',
    type: 'tenant',
    joinDate: '22/03/2024',
    lastOnline: '28/03/2024',
    posts: null,
    status: 'normal',
  },
  {
    id: '009',
    name: 'Bùi Quang Minh',
    avatar: '/images/default-image.jpg',
    type: 'landlord',
    joinDate: '08/03/2024',
    lastOnline: '25/03/2024',
    posts: 1,
    status: 'banned',
  },
  {
    id: '010',
    name: 'Lương Thị Oanh',
    avatar: '/images/default-image.jpg',
    type: 'tenant',
    joinDate: '28/02/2024',
    lastOnline: '29/03/2024',
    posts: null,
    status: 'normal',
  },
  {
    id: '011',
    name: 'Trịnh Văn Phúc',
    avatar: '/images/default-image.jpg',
    type: 'landlord',
    joinDate: '14/03/2024',
    lastOnline: '26/03/2024',
    posts: 4,
    status: 'normal',
  },
  {
    id: '012',
    name: 'Cao Thị Quỳnh',
    avatar: '/images/default-image.jpg',
    type: 'tenant',
    joinDate: '16/03/2024',
    lastOnline: '28/03/2024',
    posts: null,
    status: 'normal',
  },
]

const UserManagement: NextPageWithLayout = () => {
  const t = useTranslations('admin.users')

  const breadcrumbItems = [
    { label: 'Admin Dashboard', href: '/admin' },
    { label: t('breadcrumb.dashboard') }, // Current page
  ]

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

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />

      <div className='space-y-6'>
        {/* DataTable Component */}
        <DataTable
          data={mockUsers}
          columns={columns}
          filters={filters}
          filterMode='frontend'
          pagination
          itemsPerPage={10}
          itemsPerPageOptions={[5, 10, 20]}
          sortable
          defaultSort={{ key: 'joinDate', direction: 'desc' }}
          emptyMessage='No users found'
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
