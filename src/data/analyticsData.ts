// Mock data for Analytics Dashboard
// Date range: Sept 6 - Oct 5, 2025 (30 days)

export type TimeRange = 'today' | 'week' | 'month'
export type ChartType = 'line' | 'bar' | 'area'

// Helper function to generate date range
export const generateDateRange = (days: number): string[] => {
  const dates: string[] = []
  const endDate = new Date('2025-10-05')

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(endDate)
    date.setDate(date.getDate() - i)
    dates.push(
      date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
    )
  }

  return dates
}

// Format currency in VND
export const formatCurrency = (amount: number): string => {
  const formatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount)
  return formatted.replace('₫', '').trim() + '₫'
}

// Calculate percentage
export const calculatePercentage = (value: number, total: number): number => {
  return Math.round((value / total) * 100)
}

// Filter data by time range
export const filterByTimeRange = <T>(data: T[], timeRange: TimeRange): T[] => {
  switch (timeRange) {
    case 'today':
      return data.slice(-1)
    case 'week':
      return data.slice(-7)
    case 'month':
    default:
      return data
  }
}

// ============================================
// USER ANALYTICS DATA
// ============================================

export const userGrowthData = [
  { date: '6/9', newUsers: 32, totalUsers: 1192 },
  { date: '7/9', newUsers: 28, totalUsers: 1220 },
  { date: '8/9', newUsers: 35, totalUsers: 1255 },
  { date: '9/9', newUsers: 41, totalUsers: 1296 },
  { date: '10/9', newUsers: 38, totalUsers: 1334 },
  { date: '11/9', newUsers: 45, totalUsers: 1379 },
  { date: '12/9', newUsers: 52, totalUsers: 1431 },
  { date: '13/9', newUsers: 48, totalUsers: 1479 },
  { date: '14/9', newUsers: 39, totalUsers: 1518 },
  { date: '15/9', newUsers: 42, totalUsers: 1560 },
  { date: '16/9', newUsers: 36, totalUsers: 1596 },
  { date: '17/9', newUsers: 44, totalUsers: 1640 },
  { date: '18/9', newUsers: 38, totalUsers: 1678 },
  { date: '19/9', newUsers: 47, totalUsers: 1725 },
  { date: '20/9', newUsers: 51, totalUsers: 1776 },
  { date: '21/9', newUsers: 43, totalUsers: 1819 },
  { date: '22/9', newUsers: 37, totalUsers: 1856 },
  { date: '23/9', newUsers: 49, totalUsers: 1905 },
  { date: '24/9', newUsers: 46, totalUsers: 1951 },
  { date: '25/9', newUsers: 40, totalUsers: 1991 },
  { date: '26/9', newUsers: 44, totalUsers: 2035 },
  { date: '27/9', newUsers: 38, totalUsers: 2073 },
  { date: '28/9', newUsers: 42, totalUsers: 2115 },
  { date: '29/9', newUsers: 35, totalUsers: 2150 },
  { date: '30/9', newUsers: 48, totalUsers: 2198 },
  { date: '1/10', newUsers: 52, totalUsers: 2250 },
  { date: '2/10', newUsers: 45, totalUsers: 2295 },
  { date: '3/10', newUsers: 41, totalUsers: 2336 },
  { date: '4/10', newUsers: 39, totalUsers: 2375 },
  { date: '5/10', newUsers: 37, totalUsers: 2412 },
]

export const userTypeDistribution = [
  { label: 'Chủ Nhà', value: 680, color: '#2563EB', percentage: 40 },
  { label: 'Người Thuê', value: 1240, color: '#22C55E', percentage: 74 },
]

export const userStats = {
  totalUsers: 1685,
  newUsersThisPeriod: 493,
  landlords: 680,
  tenants: 1240,
}

// ============================================
// POST ANALYTICS DATA
// ============================================

export const postActivityData = [
  { date: '6/9', newPosts: 18, totalPosts: 811 },
  { date: '7/9', newPosts: 15, totalPosts: 826 },
  { date: '8/9', newPosts: 22, totalPosts: 848 },
  { date: '9/9', newPosts: 19, totalPosts: 867 },
  { date: '10/9', newPosts: 24, totalPosts: 891 },
  { date: '11/9', newPosts: 21, totalPosts: 912 },
  { date: '12/9', newPosts: 28, totalPosts: 940 },
  { date: '13/9', newPosts: 25, totalPosts: 965 },
  { date: '14/9', newPosts: 20, totalPosts: 985 },
  { date: '15/9', newPosts: 23, totalPosts: 1008 },
  { date: '16/9', newPosts: 17, totalPosts: 1025 },
  { date: '17/9', newPosts: 26, totalPosts: 1051 },
  { date: '18/9', newPosts: 22, totalPosts: 1073 },
  { date: '19/9', newPosts: 29, totalPosts: 1102 },
  { date: '20/9', newPosts: 31, totalPosts: 1133 },
  { date: '21/9', newPosts: 27, totalPosts: 1160 },
  { date: '22/9', newPosts: 19, totalPosts: 1179 },
  { date: '23/9', newPosts: 24, totalPosts: 1203 },
  { date: '24/9', newPosts: 21, totalPosts: 1224 },
  { date: '25/9', newPosts: 26, totalPosts: 1250 },
  { date: '26/9', newPosts: 23, totalPosts: 1273 },
  { date: '27/9', newPosts: 20, totalPosts: 1293 },
  { date: '28/9', newPosts: 25, totalPosts: 1318 },
  { date: '29/9', newPosts: 18, totalPosts: 1336 },
  { date: '30/9', newPosts: 22, totalPosts: 1358 },
  { date: '1/10', newPosts: 28, totalPosts: 1386 },
  { date: '2/10', newPosts: 24, totalPosts: 1410 },
  { date: '3/10', newPosts: 21, totalPosts: 1431 },
  { date: '4/10', newPosts: 19, totalPosts: 1450 },
  { date: '5/10', newPosts: 17, totalPosts: 1467 },
]

export const postViewsClicksData = [
  { date: '6/9', views: 342, clicks: 68 },
  { date: '7/9', views: 389, clicks: 79 },
  { date: '8/9', views: 412, clicks: 85 },
  { date: '9/9', views: 445, clicks: 91 },
  { date: '10/9', views: 478, clicks: 98 },
  { date: '11/9', views: 501, clicks: 104 },
  { date: '12/9', views: 534, clicks: 112 },
  { date: '13/9', views: 498, clicks: 103 },
  { date: '14/9', views: 456, clicks: 94 },
  { date: '15/9', views: 489, clicks: 101 },
  { date: '16/9', views: 423, clicks: 87 },
  { date: '17/9', views: 512, clicks: 106 },
  { date: '18/9', views: 487, clicks: 100 },
  { date: '19/9', views: 543, clicks: 113 },
  { date: '20/9', views: 578, clicks: 120 },
  { date: '21/9', views: 532, clicks: 110 },
  { date: '22/9', views: 467, clicks: 96 },
  { date: '23/9', views: 501, clicks: 104 },
  { date: '24/9', views: 489, clicks: 101 },
  { date: '25/9', views: 523, clicks: 108 },
  { date: '26/9', views: 498, clicks: 103 },
  { date: '27/9', views: 445, clicks: 92 },
  { date: '28/9', views: 512, clicks: 106 },
  { date: '29/9', views: 434, clicks: 89 },
  { date: '30/9', views: 478, clicks: 99 },
  { date: '1/10', views: 545, clicks: 113 },
  { date: '2/10', views: 512, clicks: 106 },
  { date: '3/10', views: 489, clicks: 101 },
  { date: '4/10', views: 467, clicks: 96 },
  { date: '5/10', views: 434, clicks: 90 },
]

export const postStatusDistribution = [
  { label: 'Hoạt động', value: 756, color: '#22C55E', percentage: 89 },
  { label: 'Chờ duyệt', value: 67, color: '#EAB308', percentage: 8 },
  { label: 'Bị từ chối', value: 23, color: '#EF4444', percentage: 3 },
]

export const postStats = {
  totalPosts: 1082,
  newPostsThisPeriod: 271,
  pendingPosts: 67,
  totalViews: 14469,
  totalClicks: 3105,
  ctr: 21, // Click-through rate percentage
}

// ============================================
// REVENUE ANALYTICS DATA
// ============================================

export const revenueOverTimeData = [
  { date: '6/9', revenue: 982000 },
  { date: '7/9', revenue: 1250000 },
  { date: '8/9', revenue: 1180000 },
  { date: '9/9', revenue: 1520000 },
  { date: '10/9', revenue: 1340000 },
  { date: '11/9', revenue: 1680000 },
  { date: '12/9', revenue: 1890000 },
  { date: '13/9', revenue: 1750000 },
  { date: '14/9', revenue: 1420000 },
  { date: '15/9', revenue: 1560000 },
  { date: '16/9', revenue: 1290000 },
  { date: '17/9', revenue: 1720000 },
  { date: '18/9', revenue: 1580000 },
  { date: '19/9', revenue: 1840000 },
  { date: '20/9', revenue: 2100000 },
  { date: '21/9', revenue: 1950000 },
  { date: '22/9', revenue: 1380000 },
  { date: '23/9', revenue: 1670000 },
  { date: '24/9', revenue: 1520000 },
  { date: '25/9', revenue: 1790000 },
  { date: '26/9', revenue: 1640000 },
  { date: '27/9', revenue: 1480000 },
  { date: '28/9', revenue: 1720000 },
  { date: '29/9', revenue: 1350000 },
  { date: '30/9', revenue: 1590000 },
  { date: '1/10', revenue: 1920000 },
  { date: '2/10', revenue: 1780000 },
  { date: '3/10', revenue: 1650000 },
  { date: '4/10', revenue: 1490000 },
  { date: '5/10', revenue: 1560000 },
]

export const revenueByPackage = [
  {
    package: 'Basic',
    revenue: 4455000,
    percentage: 22,
    sales: 45,
    color: '#3B82F6',
  },
  {
    package: 'Standard',
    revenue: 8372000,
    percentage: 42,
    sales: 28,
    color: '#6366F1',
  },
  {
    package: 'Premium',
    revenue: 7188000,
    percentage: 36,
    sales: 12,
    color: '#8B5CF6',
  },
]

export const revenueStats = {
  totalRevenue: 43218346,
  packagesSold: 144,
  avgRevenuePerDay: 1440612,
  avgRevenuePerPackage: 300127,
}

// ============================================
// REPORTS ANALYTICS DATA
// ============================================

export const reportsOverTimeData = [
  { date: '6/9', reports: 1 },
  { date: '7/9', reports: 2 },
  { date: '8/9', reports: 3 },
  { date: '9/9', reports: 1 },
  { date: '10/9', reports: 2 },
  { date: '11/9', reports: 4 },
  { date: '12/9', reports: 3 },
  { date: '13/9', reports: 2 },
  { date: '14/9', reports: 1 },
  { date: '15/9', reports: 2 },
  { date: '16/9', reports: 1 },
  { date: '17/9', reports: 3 },
  { date: '18/9', reports: 2 },
  { date: '19/9', reports: 4 },
  { date: '20/9', reports: 5 },
  { date: '21/9', reports: 3 },
  { date: '22/9', reports: 2 },
  { date: '23/9', reports: 3 },
  { date: '24/9', reports: 2 },
  { date: '25/9', reports: 4 },
  { date: '26/9', reports: 3 },
  { date: '27/9', reports: 1 },
  { date: '28/9', reports: 2 },
  { date: '29/9', reports: 1 },
  { date: '30/9', reports: 3 },
  { date: '1/10', reports: 4 },
  { date: '2/10', reports: 3 },
  { date: '3/10', reports: 2 },
  { date: '4/10', reports: 2 },
  { date: '5/10', reports: 1 },
]

export const reportTypeDistribution = [
  { label: 'Spam/Trùng lặp', value: 24, color: '#EF4444', percentage: 31 },
  {
    label: 'Nội dung không phù hợp',
    value: 18,
    color: '#F97316',
    percentage: 23,
  },
  { label: 'Tin đăng giả', value: 12, color: '#EAB308', percentage: 16 },
  { label: 'Vấn đề giá cả', value: 8, color: '#3B82F6', percentage: 10 },
  { label: 'Khác', value: 15, color: '#6B7280', percentage: 19 },
]

export const reportStats = {
  totalReports: 68,
  pendingReports: 20,
  resolvedReports: 47,
  resolvedPercentage: 70,
  avgResolutionTime: 18, // hours
}
