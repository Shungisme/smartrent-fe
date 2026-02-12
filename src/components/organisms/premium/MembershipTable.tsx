import React from 'react'
import { Crown, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { Card } from '@/components/atoms/card'
import { useTranslations } from 'next-intl'
import { MembershipPackage } from '@/types/premium.type'

interface MembershipTableProps {
  memberships: MembershipPackage[]
  loading: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string, currentStatus: string) => void
}

export const MembershipTable: React.FC<MembershipTableProps> = ({
  memberships,
  loading,
  onEdit,
  onDelete,
}) => {
  const t = useTranslations('premium')

  return (
    <Card className='overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[800px]'>
          <thead className='bg-gray-50 border-b border-gray-200'>
            <tr>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                {t('membership.table.package')}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                {t('membership.table.price')}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                {t('membership.table.features')}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                {t('membership.table.discount')}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                {t('membership.table.status')}
              </th>
              <th className='px-6 py-4 text-center text-sm font-semibold text-gray-700'>
                {t('membership.table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {loading ? (
              <tr>
                <td colSpan={6} className='px-6 py-12 text-center'>
                  <div className='flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                    <span className='ml-3 text-gray-600'>
                      Loading packages...
                    </span>
                  </div>
                </td>
              </tr>
            ) : memberships.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className='px-6 py-12 text-center text-gray-500'
                >
                  No membership packages found
                </td>
              </tr>
            ) : (
              memberships.map((pkg) => (
                <tr key={pkg.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100'>
                        <Crown className='h-5 w-5 text-blue-600' />
                      </div>
                      <div>
                        <div className='font-semibold text-gray-900'>
                          {pkg.name}
                        </div>
                        <div className='text-xs text-gray-500'>{pkg.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='font-semibold text-gray-900'>
                      {pkg.price}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {pkg.activeUsers} {t('membership.table.activeUsers')}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex flex-wrap gap-1'>
                      {pkg.features.slice(0, 2).map((feature, idx) => (
                        <Badge key={idx} variant='outline' className='text-xs'>
                          {feature}
                        </Badge>
                      ))}
                      {pkg.features.length > 2 && (
                        <Badge variant='outline' className='text-xs'>
                          {t('membership.table.moreFeatures', {
                            count: pkg.features.length - 2,
                          })}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    {pkg.discount > 0 ? (
                      <Badge className='bg-green-100 text-green-800'>
                        {pkg.discount}%
                      </Badge>
                    ) : (
                      <span className='text-sm text-gray-400'>
                        {t('membership.table.noDiscount')}
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4'>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        className='sr-only peer'
                        checked={pkg.status === 'active'}
                        readOnly
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center justify-center gap-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-8 w-8 p-0'
                        onClick={() => onEdit(pkg.id)}
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50'
                        onClick={() => onDelete(pkg.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
