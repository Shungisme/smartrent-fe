import { useMemo } from 'react'
import { useAuthStore } from '@/store/auth/index.store'
import { canWritePage, toRoleIds, type PageKey } from '@/constants/navigation'

/**
 * Whether the current admin's roles may perform mutating actions (create / edit
 * / delete / toggle) on the given page. Use it to hide write-only controls for
 * read-only roles; the backend still enforces the same rule on its endpoints.
 */
export const useCanWrite = (page: PageKey): boolean => {
  const roles = useAuthStore((state) => state.user?.roles)
  return useMemo(() => canWritePage(page, toRoleIds(roles)), [page, roles])
}
