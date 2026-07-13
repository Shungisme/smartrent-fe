export type BreadcrumbItem = {
  label: string
  href?: string
  disabled?: boolean
}

/** Landing page after login and the sidebar logo's "home" link. */
export const DEFAULT_HOME_ROUTE = '/insights/users'

type CategoryKey =
  | 'management'
  | 'monetization'
  | 'insights'
  | 'content'
  | 'moderation'

export type PageKey =
  | 'users'
  | 'admins'
  | 'roles'
  | 'transactions'
  | 'brokerPending'
  | 'premiumMembership'
  | 'premiumListingTypes'
  | 'analyticsUsers'
  | 'analyticsPosts'
  | 'analyticsRevenue'
  | 'analyticsReports'
  | 'posts'
  | 'news'
  | 'newsEditor'
  | 'reports'
  | 'authors'

const ROUTE_META: Record<string, { category: CategoryKey; page: PageKey }> = {
  '/management/users': { category: 'management', page: 'users' },
  '/management/admins': { category: 'management', page: 'admins' },
  '/management/roles': { category: 'management', page: 'roles' },
  '/management/transactions': { category: 'management', page: 'transactions' },
  '/moderation/broker-pending': {
    category: 'moderation',
    page: 'brokerPending',
  },
  '/monetization/membership': {
    category: 'monetization',
    page: 'premiumMembership',
  },
  '/monetization/listing-types': {
    category: 'monetization',
    page: 'premiumListingTypes',
  },
  '/insights/users': {
    category: 'insights',
    page: 'analyticsUsers',
  },
  '/insights/posts': {
    category: 'insights',
    page: 'analyticsPosts',
  },
  '/insights/revenue': {
    category: 'insights',
    page: 'analyticsRevenue',
  },
  '/insights/reports': {
    category: 'insights',
    page: 'analyticsReports',
  },
  '/content/posts': { category: 'content', page: 'posts' },
  '/content/news': { category: 'content', page: 'news' },
  '/content/news-editor': { category: 'content', page: 'newsEditor' },
  '/moderation/reports': { category: 'moderation', page: 'reports' },
  '/moderation/authors': { category: 'moderation', page: 'authors' },
}

const CATEGORY_ROUTES: Record<CategoryKey, string[]> = {
  insights: [
    '/insights/users',
    '/insights/posts',
    '/insights/revenue',
    '/insights/reports',
  ],
  management: [
    '/management/users',
    '/management/admins',
    '/management/roles',
    '/management/transactions',
  ],
  content: ['/content/posts', '/content/news'],
  moderation: [
    '/moderation/reports',
    '/moderation/authors',
    '/moderation/broker-pending',
  ],
  monetization: ['/monetization/membership', '/monetization/listing-types'],
}

// ── Role-based access control ──────────────────────────────────────────────
// role_id values match the `role_id` column in the backend `roles` table.
export const ROLE = {
  SUPER_ADMIN: 'SA',
  USER_ADMIN: 'UA',
  CONTENT_MODERATOR: 'CM',
  SUPPORT_ADMIN: 'SPA',
  FINANCE_ADMIN: 'FA',
  MARKETING_ADMIN: 'MA',
} as const

// The backend returns roles as role_NAME (e.g. "Super Admin") in the JWT `user`
// claim, but access rules key off role_id. Normalize names → ids; pass unknown
// values through untouched (already an id, or a role we don't gate on).
const ROLE_NAME_TO_ID: Record<string, string> = {
  'Super Admin': ROLE.SUPER_ADMIN,
  'User Admin': ROLE.USER_ADMIN,
  'Content Moderator': ROLE.CONTENT_MODERATOR,
  'Support Admin': ROLE.SUPPORT_ADMIN,
  'Finance Admin': ROLE.FINANCE_ADMIN,
  'Marketing Admin': ROLE.MARKETING_ADMIN,
}

export const toRoleIds = (roles: string[] | undefined | null): string[] =>
  (roles ?? []).map((role) => ROLE_NAME_TO_ID[role] ?? role)

// Which role_ids may see each page. SA is granted everything via canAccessPage,
// but is listed explicitly so the map reads as the source of truth.
const PAGE_ROLES: Record<PageKey, string[]> = {
  analyticsUsers: ['SA', 'UA', 'SPA', 'MA'],
  analyticsPosts: ['SA', 'CM', 'MA'],
  analyticsRevenue: ['SA', 'FA', 'MA'],
  analyticsReports: ['SA', 'FA', 'MA'],
  users: ['SA', 'UA', 'SPA'],
  admins: ['SA', 'UA'],
  roles: ['SA', 'UA'],
  transactions: ['SA', 'SPA', 'FA'],
  posts: ['SA', 'CM'],
  news: ['SA', 'CM', 'MA'],
  newsEditor: ['SA', 'CM', 'MA'],
  reports: ['SA', 'CM', 'SPA'],
  authors: ['SA', 'CM', 'SPA'],
  brokerPending: ['SA', 'CM', 'SPA'],
  premiumMembership: ['SA', 'SPA', 'FA', 'MA'],
  premiumListingTypes: ['SA', 'FA', 'MA'],
}

export const canAccessPage = (page: PageKey, roleIds: string[]): boolean =>
  roleIds.includes(ROLE.SUPER_ADMIN) ||
  roleIds.some((role) => PAGE_ROLES[page].includes(role))

// Roles allowed to perform mutating actions (create/edit/delete/toggle) on a
// page. Only pages with a read-only (○) role differ from PAGE_ROLES; a page not
// listed here lets every role that can see it also act. Mirrors the backend
// @PreAuthorize on the mutating endpoints.
const PAGE_WRITE_ROLES: Partial<Record<PageKey, string[]>> = {
  roles: [ROLE.SUPER_ADMIN], // User Admin is read-only
  users: [ROLE.SUPER_ADMIN, ROLE.USER_ADMIN], // Support Admin is read-only
  premiumMembership: [
    ROLE.SUPER_ADMIN,
    ROLE.FINANCE_ADMIN,
    ROLE.MARKETING_ADMIN,
  ], // Support Admin is read-only
}

export const canWritePage = (page: PageKey, roleIds: string[]): boolean => {
  if (roleIds.includes(ROLE.SUPER_ADMIN)) return true
  const writeRoles = PAGE_WRITE_ROLES[page] ?? PAGE_ROLES[page]
  return roleIds.some((role) => writeRoles.includes(role))
}

// First landing route the given roles can actually open. Used for post-login
// redirect and the sidebar "home" link, since the static DEFAULT_HOME_ROUTE
// (/insights/users) is off-limits to Content Moderator and Finance Admin.
const HOME_ROUTE_PRIORITY = [
  '/insights/users',
  '/content/posts',
  '/insights/revenue',
  '/moderation/reports',
  '/management/users',
]

export const resolveHomeRoute = (roleIds: string[]): string =>
  HOME_ROUTE_PRIORITY.find((route) =>
    canAccessPage(ROUTE_META[route].page, roleIds),
  ) ?? DEFAULT_HOME_ROUTE

type NavigationLabels = {
  home: string
  fallbackDashboard: string
  categories: Record<CategoryKey, string>
  pages: Record<PageKey, string>
}

const LABELS = {
  en: {
    home: 'Home',
    fallbackDashboard: 'Dashboard',
    categories: {
      management: 'Management',
      monetization: 'Monetization',
      insights: 'Insights',
      content: 'Content',
      moderation: 'Moderation',
    } as Record<CategoryKey, string>,
    pages: {
      users: 'Users',
      admins: 'Admins',
      roles: 'Roles',
      transactions: 'Transactions',
      brokerPending: 'Pending Broker Applications',
      premiumMembership: 'Membership',
      premiumListingTypes: 'Listing Types',
      analyticsUsers: 'User Analytics',
      analyticsPosts: 'Post Analytics',
      analyticsRevenue: 'Revenue',
      analyticsReports: 'Report Analytics',
      posts: 'Posts',
      news: 'News',
      newsEditor: 'Editor',
      reports: 'Reports',
      authors: 'Post Authors',
    } as Record<PageKey, string>,
  } satisfies NavigationLabels,
  vi: {
    home: 'Trang chủ',
    fallbackDashboard: 'Tổng quan',
    categories: {
      management: 'Quản trị',
      monetization: 'Thương mại',
      insights: 'Phân tích',
      content: 'Nội dung',
      moderation: 'Kiểm duyệt',
    } as Record<CategoryKey, string>,
    pages: {
      users: 'Người dùng',
      admins: 'Quản trị viên',
      roles: 'Vai trò',
      transactions: 'Giao dịch',
      brokerPending: 'Đơn đăng ký môi giới chờ duyệt',
      premiumMembership: 'Thành viên',
      premiumListingTypes: 'Loại tin đăng',
      analyticsUsers: 'Thống kê người dùng',
      analyticsPosts: 'Thống kê tin đăng',
      analyticsRevenue: 'Doanh thu',
      analyticsReports: 'Thống kê báo cáo',
      posts: 'Tin đăng',
      news: 'Tin tức',
      newsEditor: 'Trình biên tập',
      reports: 'Báo cáo',
      authors: 'Người đăng tin',
    } as Record<PageKey, string>,
  } satisfies NavigationLabels,
}

const toTitleCase = (value: string) =>
  value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const normalizeLanguage = (language: string) =>
  language === 'vi' ? 'vi' : ('en' as const)

const getMetaFromPath = (pathname: string) => {
  if (ROUTE_META[pathname]) {
    return ROUTE_META[pathname]
  }

  const exactPrefix = Object.keys(ROUTE_META).find(
    (route) => route !== '/' && pathname.startsWith(`${route}/`),
  )

  return exactPrefix ? ROUTE_META[exactPrefix] : undefined
}

// Whether the given roles may open the page a path belongs to. Unknown paths
// (no ROUTE_META match) are treated as allowed so non-page routes aren't blocked.
export const canAccessPath = (pathname: string, roleIds: string[]): boolean => {
  const meta = getMetaFromPath(pathname)
  return meta ? canAccessPage(meta.page, roleIds) : true
}

export const getBreadcrumbItems = (
  pathname: string,
  language: string,
): BreadcrumbItem[] => {
  const locale = normalizeLanguage(language)
  const dictionary = LABELS[locale]
  const meta = getMetaFromPath(pathname)

  if (meta) {
    const categoryRoot = CATEGORY_ROUTES[meta.category][0]
    const breadcrumb: BreadcrumbItem[] = [
      { label: dictionary.home, href: DEFAULT_HOME_ROUTE },
      {
        label: dictionary.categories[meta.category],
        href: categoryRoot,
      },
    ]

    if (meta.page === 'newsEditor') {
      breadcrumb.push({
        label: dictionary.pages.news,
        href: '/content/news',
      })
      breadcrumb.push({ label: dictionary.pages.newsEditor })
      return breadcrumb
    }

    breadcrumb.push({ label: dictionary.pages[meta.page] })
    return breadcrumb
  }

  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) {
    return [
      { label: dictionary.home, href: DEFAULT_HOME_ROUTE },
      { label: dictionary.fallbackDashboard },
    ]
  }

  const fallbackItems: BreadcrumbItem[] = [
    { label: dictionary.home, href: DEFAULT_HOME_ROUTE },
  ]
  let cumulativePath = ''

  segments.forEach((segment, index) => {
    cumulativePath += `/${segment}`
    fallbackItems.push({
      label: toTitleCase(segment),
      href: index === segments.length - 1 ? undefined : cumulativePath,
    })
  })

  return fallbackItems
}

export const getCategoryNavigation = (pathname: string, language: string) => {
  const locale = normalizeLanguage(language)
  const dictionary = LABELS[locale]
  const meta = getMetaFromPath(pathname)

  if (!meta) {
    return null
  }

  const routes = CATEGORY_ROUTES[meta.category]

  return {
    categoryLabel: dictionary.categories[meta.category],
    items: routes.map((route) => {
      const routeMeta = ROUTE_META[route]
      return {
        href: route,
        label: dictionary.pages[routeMeta.page],
      }
    }),
  }
}

// When roleIds is omitted, every group/item is returned (unchanged behavior).
// When provided, items the roles can't open are hidden and empty groups dropped.
export const getSidebarNavigationGroups = (
  language: string,
  roleIds?: string[],
) => {
  const locale = normalizeLanguage(language)
  const dictionary = LABELS[locale]

  return (Object.keys(CATEGORY_ROUTES) as CategoryKey[])
    .map((categoryKey) => ({
      key: categoryKey,
      label: dictionary.categories[categoryKey],
      items: CATEGORY_ROUTES[categoryKey]
        .filter(
          (route) => !roleIds || canAccessPage(ROUTE_META[route].page, roleIds),
        )
        .map((route) => {
          const routeMeta = ROUTE_META[route]
          return {
            key: routeMeta.page,
            href: route,
            label: dictionary.pages[routeMeta.page],
          }
        }),
    }))
    .filter((group) => group.items.length > 0)
}
