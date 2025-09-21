import { useContext } from 'react'
import { ListContext } from './index.context'
import { ListContextType } from './index.type'

export const useListContext = <T = unknown,>(): ListContextType<T> => {
  const context = useContext(ListContext)

  if (!context) {
    throw new Error('useListContext must be used within a ListProvider')
  }

  return context as ListContextType<T>
}
