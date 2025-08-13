import { createContext, useState, ReactNode, useContext } from 'react'

interface CounterContextType {
  count: number
  setCount: (value: number) => void
}

export const CounterContext = createContext<CounterContextType | null>(null)

export const CounterProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState(0)

  return (
    <CounterContext.Provider value={{ count, setCount }}>
      {children}
    </CounterContext.Provider>
  )
}

export const useCounter = () => {
  const context = useContext(CounterContext)
  if (!context)
    throw new Error('useCounter must be used within CounterProvider')
  return context
}
