export type BreadcrumbItem = {
  label: string
  href?: string
  disabled?: boolean
}

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
  | 'brokerPending'
  | 'premiumOverview'
  | 'premiumMembership'
  | 'premiumPromotions'
  | 'premiumListingTypes'
  | 'premiumPostBoosts'
  | 'analyticsOverview'
  | 'analyticsUsers'
  | 'analyticsPosts'
  | 'analyticsRevenue'
  | 'analyticsReports'
  | 'posts'
  | 'news'
  | 'newsEditor'
  | 'reports'

const ROUTE_META: Record<string, { category: CategoryKey; page: PageKey }> = {
  '/management/users': { category: 'management', page: 'users' },
  '/management/admins': { category: 'management', page: 'admins' },
  '/management/roles': { category: 'management', page: 'roles' },
  '/moderation/broker-pending': {
    category: 'moderation',
    page: 'brokerPending',
  },
  '/monetization/overview': {
    category: 'monetization',
    page: 'premiumOverview',
  },
  '/monetization/membership': {
    category: 'monetization',
    page: 'premiumMembership',
  },
  '/monetization/promotions': {
    category: 'monetization',
    page: 'premiumPromotions',
  },
  '/monetization/listing-types': {
    category: 'monetization',
    page: 'premiumListingTypes',
  },
  '/monetization/post-boosts': {
    category: 'monetization',
    page: 'premiumPostBoosts',
  },
  '/insights/overview': {
    category: 'insights',
    page: 'analyticsOverview',
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
}

const CATEGORY_ROUTES: Record<CategoryKey, string[]> = {
  management: ['/management/users', '/management/admins', '/management/roles'],
  monetization: [
    '/monetization/overview',
    '/monetization/membership',
    '/monetization/promotions',
    '/monetization/listing-types',
    '/monetization/post-boosts',
  ],
  insights: [
    '/insights/overview',
    '/insights/users',
    '/insights/posts',
    '/insights/revenue',
    '/insights/reports',
  ],
  content: ['/content/posts', '/content/news'],
  moderation: ['/moderation/reports', '/moderation/broker-pending'],
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
      brokerPending: 'Pending Broker Applications',
      premiumOverview: 'Overview',
      premiumMembership: 'Membership',
      premiumPromotions: 'Promotions',
      premiumListingTypes: 'Listing Types',
      premiumPostBoosts: 'Post Boosts',
      analyticsOverview: 'Overview',
      analyticsUsers: 'Users',
      analyticsPosts: 'Posts',
      analyticsRevenue: 'Revenue',
      analyticsReports: 'Reports',
      posts: 'Posts',
      news: 'News',
      newsEditor: 'Editor',
      reports: 'Reports',
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
      brokerPending: 'Đơn đăng ký môi giới chờ duyệt',
      premiumOverview: 'Tổng quan',
      premiumMembership: 'Thành viên',
      premiumPromotions: 'Khuyến mãi',
      premiumListingTypes: 'Loại tin đăng',
      premiumPostBoosts: 'Đẩy tin',
      analyticsOverview: 'Tổng quan',
      analyticsUsers: 'Người dùng',
      analyticsPosts: 'Tin đăng',
      analyticsRevenue: 'Doanh thu',
      analyticsReports: 'Báo cáo',
      posts: 'Tin đăng',
      news: 'Tin tức',
      newsEditor: 'Trình biên tập',
      reports: 'Báo cáo',
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
      { label: dictionary.home, href: '/management/users' },
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
      { label: dictionary.home, href: '/management/users' },
      { label: dictionary.fallbackDashboard },
    ]
  }

  const fallbackItems: BreadcrumbItem[] = [
    { label: dictionary.home, href: '/management/users' },
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
