import { HttpMethod } from '@/api/types/pagination.type'
import { instanceClientAxios } from '@/configs/axios/axiosClient'
import { CustomAxiosRequestConfig } from '@/configs/axios/types'
import { useEffect, useState, useMemo } from 'react'

export type FetchOptions = CustomAxiosRequestConfig & {
  url: string
  method?: HttpMethod
  headers?: Record<string, string>
  body?: any
}

function useApi<T>(fetchOptions: FetchOptions) {
  const {
    url,
    method = 'GET',
    headers = {},
    body,
    ...restConfig
  } = fetchOptions
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // Memoize the serialized values to prevent infinite re-renders
  const serializedHeaders = useMemo(() => JSON.stringify(headers), [headers])
  const serializedBody = useMemo(() => JSON.stringify(body), [body])
  const serializedRestConfig = useMemo(
    () => JSON.stringify(restConfig),
    [restConfig],
  )

  const fetchData = async (): Promise<T | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await instanceClientAxios({
        url,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        data: body,
        ...restConfig,
      })

      setLoading(false)
      return response.data as T
    } catch (err: any) {
      setLoading(false)
      setError(err.message)
      return null
    }
  }

  useEffect(() => {
    fetchData()
      .then((result) => {
        setData(result)
        setError(null)
      })
      .catch((err) => {
        setError(err.message)
        setData(null)
      })
  }, [url, method, serializedHeaders, serializedBody, serializedRestConfig])

  return {
    data,
    setData,
    error,
    loading,
    refetch: fetchData,
  }
}

export { useApi }
