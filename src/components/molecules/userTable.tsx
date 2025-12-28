import React from 'react'
import Image from 'next/image'
import { Avatar } from '@/components/atoms/avatar'
import { Badge } from '@/components/atoms/badge'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

export type UserData = {
  id: string
  name: string
  avatar?: string
  type: 'landlord' | 'tenant'
  joinDate: string
  lastOnline: string
  posts: number | null
  status: 'normal' | 'banned'
}

type UserTableProps = {
  users: UserData[]
}

type UserRowProps = {
  user: UserData
}

const UserRow: React.FC<UserRowProps> = ({ user }) => {
  const t = useTranslations('admin.users.table')

  return (
    <tr className='border-b border-gray-200 hover:bg-gray-50'>
      <td className='px-6 py-4 text-sm font-medium text-gray-900'>{user.id}</td>
      <td className='px-6 py-4'>
        <div className='flex items-center gap-3'>
          <Avatar className='w-10 h-10'>
            <Image
              src={user.avatar || '/images/default-image.jpg'}
              alt={user.name}
              width={40}
              height={40}
              className='w-full h-full object-cover'
            />
          </Avatar>
          <span className='font-medium text-gray-900'>{user.name}</span>
        </div>
      </td>
      <td className='px-6 py-4'>
        <Badge
          variant={user.type === 'landlord' ? 'default' : 'secondary'}
          className={cn(
            'px-3 py-1',
            user.type === 'landlord'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800',
          )}
        >
          {t(`userTypes.${user.type}`)}
        </Badge>
      </td>
      <td className='px-6 py-4 text-sm text-gray-900'>{user.joinDate}</td>
      <td className='px-6 py-4 text-sm text-gray-900'>{user.lastOnline}</td>
      <td className='px-6 py-4'>
        {user.posts !== null ? (
          <Badge
            variant='outline'
            className='bg-green-50 text-green-800 border-green-200'
          >
            {user.posts} {t('postsBadge')}
          </Badge>
        ) : (
          <Badge
            variant='outline'
            className='bg-gray-50 text-gray-500 border-gray-200'
          >
            {t('notApplicable')}
          </Badge>
        )}
      </td>
      <td className='px-6 py-4'>
        <Badge
          className={cn(
            'px-3 py-1',
            user.status === 'normal'
              ? 'bg-black text-white'
              : 'bg-red-600 text-white',
          )}
        >
          {t(`statuses.${user.status}`)}
        </Badge>
      </td>
    </tr>
  )
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const t = useTranslations('admin.users.table.headers')

  return (
    <div className='bg-white rounded-2xl border border-gray-200 overflow-hidden'>
      <table className='w-full'>
        <thead className='bg-gray-50 border-b border-gray-200'>
          <tr>
            <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>
              {t('userId')}
            </th>
            <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>
              {t('user')}
            </th>
            <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>
              {t('type')}
            </th>
            <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>
              {t('joinDate')}
            </th>
            <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>
              {t('lastOnline')}
            </th>
            <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>
              {t('posts')}
            </th>
            <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>
              {t('status')}
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable
