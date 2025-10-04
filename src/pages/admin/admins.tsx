import React, { useState, useMemo } from 'react'
import AdminLayout from '@/components/layouts/AdminLayout'
import Breadcrumb from '@/components/molecules/breadcrumb'
import AdminTable, { AdminData } from '@/components/molecules/adminTable'
import Pagination from '@/components/molecules/pagination'
import { Input } from '@/components/atoms/input'
import { Button } from '@/components/atoms/button'
import type { NextPageWithLayout } from '@/types/next-page'

// Mock data for 5 admins
const mockAdmins: AdminData[] = [
  {
    id: 'a004',
    name: 'David Rodriguez',
    email: 'david.rodriguez@smartrent.com',
    avatar: '/images/default-image.jpg',
    role: 'support',
    joinDate: '05/01/2024',
    lastOnline: '18/01/2025',
    status: 'active',
  },
  {
    id: 'a003',
    name: 'Emma Thompson',
    email: 'emma.thompson@smartrent.com',
    avatar: '/images/default-image.jpg',
    role: 'moderator',
    joinDate: '10/11/2023',
    lastOnline: '19/01/2025',
    status: 'active',
  },
  {
    id: 'a005',
    name: 'Lisa Park',
    email: 'lisa.park@smartrent.com',
    avatar: '/images/default-image.jpg',
    role: 'moderator',
    joinDate: '18/03/2024',
    lastOnline: '15/01/2025',
    status: 'inactive',
  },
  {
    id: 'a002',
    name: 'Michael Chen',
    email: 'michael.chen@smartrent.com',
    avatar: '/images/default-image.jpg',
    role: 'admin',
    joinDate: '22/08/2023',
    lastOnline: '20/01/2025',
    status: 'active',
  },
  {
    id: 'a001',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@smartrent.com',
    avatar: '/images/default-image.jpg',
    role: 'super_admin',
    joinDate: '15/06/2023',
    lastOnline: '20/01/2025',
    status: 'active',
  },
]

// Helper function to parse date from dd/mm/yyyy format
const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/').map(Number)
  return new Date(year, month - 1, day)
}

const AdminManagement: NextPageWithLayout = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortField, setSortField] = useState<'joinDate' | 'lastOnline' | null>(
    null,
  )
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const breadcrumbItems = [
    { label: 'Thực Đơn Điều Hướng' },
    { label: 'Bảng Điều Khiển Quản Lý Admin' },
    { label: `${mockAdmins.length} admin` },
  ]

  // Filter, search and sort logic
  const filteredAndSortedAdmins = useMemo(() => {
    let result = [...mockAdmins]

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      result = result.filter(
        (admin) =>
          admin.name.toLowerCase().includes(searchLower) ||
          admin.id.toLowerCase().includes(searchLower) ||
          admin.email.toLowerCase().includes(searchLower),
      )
    }

    // Role filter
    if (filterRole !== 'all') {
      result = result.filter((admin) => admin.role === filterRole)
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter((admin) => admin.status === filterStatus)
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        const dateA = parseDate(a[sortField])
        const dateB = parseDate(b[sortField])
        return sortDirection === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime()
      })
    }

    return result
  }, [searchQuery, filterRole, filterStatus, sortField, sortDirection])

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedAdmins.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAdmins = filteredAndSortedAdmins.slice(startIndex, endIndex)

  const handleSort = (
    field: 'joinDate' | 'lastOnline',
    direction: 'asc' | 'desc',
  ) => {
    setSortField(field)
    setSortDirection(direction)
  }

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />

      <div className='space-y-6'>
        {/* Search and Filters */}
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-4 flex-1'>
            <div className='flex-1 max-w-md'>
              <Input
                type='text'
                placeholder='Tìm kiếm theo tên, ID hoặc email...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full'
              />
            </div>

            <select
              className='px-3 py-2 border border-gray-300 rounded-md bg-white text-sm'
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value='all'>Tất Cả Vai Trò</option>
              <option value='support'>Hỗ Trợ</option>
              <option value='moderator'>Điều Hành Viên</option>
              <option value='admin'>Admin</option>
              <option value='super_admin'>Siêu Admin</option>
            </select>

            <select
              className='px-3 py-2 border border-gray-300 rounded-md bg-white text-sm'
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value='all'>Tất Cả Trạng Thái</option>
              <option value='active'>Hoạt động</option>
              <option value='inactive'>Không hoạt động</option>
            </select>

            <select
              className='px-3 py-2 border border-gray-300 rounded-md bg-white text-sm'
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={10}>10 mỗi trang</option>
              <option value={20}>20 mỗi trang</option>
              <option value={50}>50 mỗi trang</option>
            </select>
          </div>

          <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
            + Tạo Admin Mới
          </Button>
        </div>

        {/* Admin Table */}
        <AdminTable
          admins={currentAdmins}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredAndSortedAdmins.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

AdminManagement.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout activeItem='admin'>{page}</AdminLayout>
}

export default AdminManagement
