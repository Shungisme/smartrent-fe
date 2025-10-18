import React from 'react'
import { Avatar } from '@/components/atoms/avatar'
import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu'
import { cn } from '@/lib/utils'

export type AdminRole = 'support' | 'moderator' | 'admin' | 'super_admin'
export type AdminStatus = 'active' | 'inactive'

export type AdminData = {
  id: string
  name: string
  email: string
  avatar?: string
  role: AdminRole
  joinDate: string
  lastOnline: string
  status: AdminStatus
}

type AdminTableProps = {
  admins: AdminData[]
  onSort?: (field: 'joinDate' | 'lastOnline', direction: 'asc' | 'desc') => void
  sortField?: 'joinDate' | 'lastOnline' | null
  sortDirection?: 'asc' | 'desc'
}

const getRoleLabel = (role: AdminRole): string => {
  const labels: Record<AdminRole, string> = {
    support: 'Hỗ Trợ',
    moderator: 'Điều Hành Viên',
    admin: 'Admin',
    super_admin: 'Siêu Admin',
  }
  return labels[role]
}

const getRoleBadgeClass = (role: AdminRole): string => {
  const classes: Record<AdminRole, string> = {
    support: 'bg-blue-100 text-blue-800 border-blue-200',
    moderator: 'bg-purple-100 text-purple-800 border-purple-200',
    admin: 'bg-orange-100 text-orange-800 border-orange-200',
    super_admin: 'bg-red-100 text-red-800 border-red-200',
  }
  return classes[role]
}

type AdminRowProps = {
  admin: AdminData
}

const AdminRow: React.FC<AdminRowProps> = ({ admin }) => {
  return (
    <tr className='border-b border-gray-200 hover:bg-gray-50'>
      <td className='px-6 py-4 text-sm font-medium text-gray-900'>
        {admin.id}
      </td>
      <td className='px-6 py-4'>
        <div className='flex items-center gap-3'>
          <Avatar className='w-10 h-10'>
            <img
              src={admin.avatar || '/images/default-image.jpg'}
              alt={admin.name}
              className='w-full h-full object-cover'
            />
          </Avatar>
          <div className='flex flex-col'>
            <span className='font-medium text-gray-900'>{admin.name}</span>
            <span className='text-sm text-gray-500'>{admin.email}</span>
          </div>
        </div>
      </td>
      <td className='px-6 py-4'>
        <Badge
          variant='outline'
          className={cn('px-3 py-1 font-medium', getRoleBadgeClass(admin.role))}
        >
          {getRoleLabel(admin.role)}
        </Badge>
      </td>
      <td className='px-6 py-4 text-sm text-gray-900'>{admin.joinDate}</td>
      <td className='px-6 py-4 text-sm text-gray-900'>{admin.lastOnline}</td>
      <td className='px-6 py-4'>
        <Badge
          className={cn(
            'px-3 py-1',
            admin.status === 'active'
              ? 'bg-green-100 text-green-800 border-green-200'
              : 'bg-gray-100 text-gray-800 border-gray-200',
          )}
        >
          {admin.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Badge>
      </td>
      <td className='px-6 py-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
              <span className='text-gray-500'>⋮</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
            <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
            <DropdownMenuItem>Thay đổi vai trò</DropdownMenuItem>
            <DropdownMenuItem className='text-red-600'>
              Vô hiệu hóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}

const AdminTable: React.FC<AdminTableProps> = ({
  admins,
  onSort,
  sortField,
  sortDirection,
}) => {
  const renderSortIcon = (field: 'joinDate' | 'lastOnline') => {
    if (sortField !== field) {
      return <span className='text-gray-400 ml-1'>↕</span>
    }
    return sortDirection === 'asc' ? (
      <span className='text-blue-600 ml-1'>↑</span>
    ) : (
      <span className='text-blue-600 ml-1'>↓</span>
    )
  }

  return (
    <div className='bg-white rounded-2xl border border-gray-200 overflow-hidden'>
      <table className='w-full'>
        <thead className='bg-gray-50 border-b border-gray-200'>
          <tr>
            <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>
              ID Admin
            </th>
            <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>
              Admin
            </th>
            <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>
              Vai Trò
            </th>
            <th
              className='px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100'
              onClick={() =>
                onSort?.('joinDate', sortDirection === 'asc' ? 'desc' : 'asc')
              }
            >
              <div className='flex items-center'>
                Ngày Tham Gia
                {renderSortIcon('joinDate')}
              </div>
            </th>
            <th
              className='px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100'
              onClick={() =>
                onSort?.('lastOnline', sortDirection === 'asc' ? 'desc' : 'asc')
              }
            >
              <div className='flex items-center'>
                Lần Online Cuối
                {renderSortIcon('lastOnline')}
              </div>
            </th>
            <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>
              Trạng Thái
            </th>
            <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>
              Thao Tác
            </th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <AdminRow key={admin.id} admin={admin} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminTable
