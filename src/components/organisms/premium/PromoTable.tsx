import React from 'react'
import { Tag, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { Card } from '@/components/atoms/card'
import { useTranslations } from 'next-intl'
import { PromotionalCode } from '@/types/premium.type'
import { cn } from '@/lib/utils'
import { getPromoStatusColor } from '@/utils/premium.utils'

interface PromoTableProps {
  promotions: PromotionalCode[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export const PromoTable: React.FC<PromoTableProps> = ({
  promotions,
  onEdit,
  onDelete,
}) => {
  const t = useTranslations('premium')

  return (
    <Card className='overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[900px]'>
          <thead className='bg-gray-50 border-b border-gray-200'>
            <tr>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                {t('promotions.table.code')}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                {t('promotions.table.type')}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                {t('promotions.table.target')}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                {t('promotions.table.usage')}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                {t('promotions.table.validUntil')}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                {t('promotions.table.status')}
              </th>
              <th className='px-6 py-4 text-center text-sm font-semibold text-gray-700'>
                {t('promotions.table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {promotions.map((promo) => (
              <tr key={promo.id} className='hover:bg-gray-50'>
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100'>
                      <Tag className='h-5 w-5 text-purple-600' />
                    </div>
                    <div>
                      <div className='font-mono font-semibold text-gray-900'>
                        {promo.code}
                      </div>
                      <div className='text-sm font-medium text-blue-600'>
                        {promo.discount}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4'>
                  <Badge variant='outline' className='text-xs'>
                    {t(`promotions.types.${promo.type}`)}
                  </Badge>
                </td>
                <td className='px-6 py-4'>
                  <span className='text-sm text-gray-700'>
                    {t(`promotions.targets.${promo.target}`)}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <div>
                    <div className='text-sm font-semibold text-gray-900'>
                      {promo.usage.current} / {promo.usage.limit}
                    </div>
                    <div className='mt-1 w-32 h-2 bg-gray-200 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-blue-600 rounded-full'
                        style={{
                          width: `${(promo.usage.current / promo.usage.limit) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4'>
                  <span className='text-sm text-gray-700'>
                    {promo.validUntil}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <Badge
                    variant='outline'
                    className={cn('text-xs', getPromoStatusColor(promo.status))}
                  >
                    {t(`promotions.statuses.${promo.status}`)}
                  </Badge>
                </td>
                <td className='px-6 py-4'>
                  <div className='flex items-center justify-center gap-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-8 w-8 p-0'
                      onClick={() => onEdit(promo.id)}
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50'
                      onClick={() => onDelete(promo.id)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
