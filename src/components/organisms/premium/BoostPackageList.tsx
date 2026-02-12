import React from 'react'
import { Pencil, Trash2, Zap } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import { Card } from '@/components/atoms/card'
import { useTranslations } from 'next-intl'
import { BoostPackage } from '@/types/premium.type'

interface BoostPackageListProps {
  boostPackages: BoostPackage[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export const BoostPackageList: React.FC<BoostPackageListProps> = ({
  boostPackages,
  onEdit,
  onDelete,
}) => {
  const t = useTranslations('premium')

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {boostPackages.map((boost) => (
        <Card key={boost.id} className='p-6'>
          <div className='flex items-start justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100'>
                <Zap className='h-6 w-6 text-orange-600' />
              </div>
              <div>
                <h4 className='font-semibold text-gray-900'>{boost.name}</h4>
                <p className='text-xs text-gray-500'>{boost.id}</p>
              </div>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                className='sr-only peer'
                checked={boost.isActive}
                readOnly
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          <div className='space-y-3'>
            <div className='flex items-baseline gap-1'>
              <span className='text-3xl font-bold text-gray-900'>
                {boost.price}
              </span>
            </div>

            <div className='rounded-lg bg-gray-50 p-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>
                  {t('postBoosts.boostsPerDay')}
                </span>
                <span className='font-semibold text-gray-900'>
                  {boost.boostsPerDay}x
                </span>
              </div>
            </div>

            <p className='text-sm text-gray-600'>{boost.description}</p>

            <div className='flex gap-2 pt-2'>
              <Button
                variant='outline'
                className='flex-1'
                onClick={() => onEdit(boost.id)}
              >
                <Pencil className='h-4 w-4 mr-1' />
                {t('postBoosts.edit')}
              </Button>
              <Button
                variant='outline'
                className='border-red-300 text-red-600 hover:bg-red-50'
                onClick={() => onDelete(boost.id)}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
