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

type PageKey =
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
      analyticsUsers: 'Users',
      analyticsPosts: 'Posts',
      analyticsRevenue: 'Revenue',
      analyticsReports: 'Reports',
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
      analyticsUsers: 'Người dùng',
      analyticsPosts: 'Tin đăng',
      analyticsRevenue: 'Doanh thu',
      analyticsReports: 'Báo cáo',
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

export const getSidebarNavigationGroups = (language: string) => {
  const locale = normalizeLanguage(language)
  const dictionary = LABELS[locale]

  return (Object.keys(CATEGORY_ROUTES) as CategoryKey[]).map((categoryKey) => ({
    key: categoryKey,
    label: dictionary.categories[categoryKey],
    items: CATEGORY_ROUTES[categoryKey].map((route) => {
      const routeMeta = ROUTE_META[route]
      return {
        key: routeMeta.page,
        href: route,
        label: dictionary.pages[routeMeta.page],
      }
    }),
  }))
}
