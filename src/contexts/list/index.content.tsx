import { ReactNode } from 'react'
import { useListContext } from './useListContext'
import classNames from 'classnames'

type ListContentProps<T = unknown> = {
  Item: (item: T) => ReactNode
  skeleton: ReactNode
  notFound: ReactNode
  className?: string
  gridClassName?: string
}

const ListContent = <T,>(props: ListContentProps<T>) => {
  const { Item, skeleton, notFound, className, gridClassName } = props

  const { itemsData, isLoading } = useListContext<T>()

  if (isLoading) {
    return <>{skeleton}</>
  }

  if (!itemsData || itemsData.length === 0) {
    return <>{notFound}</>
  }

  return (
    <div className={classNames(className)}>
      <div
        className={classNames(
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6',
          gridClassName,
        )}
      >
        {itemsData.map((item, index) => (
          <div key={index}>{Item(item)}</div>
        ))}
      </div>
    </div>
  )
}

export default ListContent
