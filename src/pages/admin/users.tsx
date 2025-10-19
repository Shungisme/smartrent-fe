import React, { useState } from 'react'
import AdminLayout from '@/components/layouts/AdminLayout'
import Breadcrumb from '@/components/molecules/breadcrumb'
import UserTable, { UserData } from '@/components/molecules/userTable'
import Pagination from '@/components/molecules/pagination'
import { Input } from '@/components/atoms/input'
import type { NextPageWithLayout } from '@/types/next-page'
import { useTranslations } from 'next-intl'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const breadcrumbItems = [
    { label: t('breadcrumb.menu') },
    { label: t('breadcrumb.dashboard') },
    { label: `${mockUsers.length} ${t('breadcrumb.usersCount')}` },
  ]

  // Filter and search logic
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.includes(searchQuery)
    const matchesFilter = filterType === 'all' || user.type === filterType
    return matchesSearch && matchesFilter
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />

      <div className='space-y-6'>
        {/* Search and Filters */}
        <div className='flex items-center gap-4'>
          <div className='flex-1 max-w-md'>
            <Input
              type='text'
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full'
            />
          </div>

          <select
            className='px-3 py-2 border border-gray-300 rounded-md bg-white text-sm'
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value='all'>{t('filters.allUsers')}</option>
            <option value='landlord'>{t('filters.landlord')}</option>
            <option value='tenant'>{t('filters.tenant')}</option>
          </select>

          <select
            className='px-3 py-2 border border-gray-300 rounded-md bg-white text-sm'
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={5}>5 {t('perPage')}</option>
            <option value={10}>10 {t('perPage')}</option>
            <option value={20}>20 {t('perPage')}</option>
          </select>
        </div>

        {/* User Table */}
        <UserTable users={currentUsers} />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

UserManagement.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout activeItem='users'>{page}</AdminLayout>
}

export default UserManagement
