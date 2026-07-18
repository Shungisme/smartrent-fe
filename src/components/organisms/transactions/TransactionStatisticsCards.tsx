'use client'

import {
  Wallet,
  ArrowLeftRight,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Coins,
  type LucideIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { StatCard } from '@/components/molecules/statCard'
import { TransactionStatistics } from '@/types/transaction.type'
import { formatCurrency } from '@/utils/format'

interface TransactionStatisticsCardsProps {
  statistics: TransactionStatistics | undefined
  isLoading?: boolean
}

export const TransactionStatisticsCards = ({
  statistics,
}: TransactionStatisticsCardsProps) => {
  const t = useTranslations('transactions')

  if (!statistics) return null

  const cards: Array<{
    label: string
    value: string | number
    icon: LucideIcon
  }> = [
    {
      label: t('stats.totalRevenue'),
      value: formatCurrency(statistics.totalRevenue),
      icon: Wallet,
    },
    {
      label: t('stats.totalTransactions'),
      value: statistics.totalTransactions,
      icon: ArrowLeftRight,
    },
    {
      label: t('stats.successful'),
      value: statistics.successfulPayments,
      icon: CheckCircle2,
    },
    {
      label: t('stats.failed'),
      value: statistics.failedPayments,
      icon: XCircle,
    },
    {
      label: t('stats.pending'),
      value: statistics.pendingPayments,
      icon: Clock,
    },
    {
      label: t('stats.successRate'),
      value: `${statistics.successRate.toFixed(2)}%`,
      icon: TrendingUp,
    },
    {
      label: t('stats.average'),
      value: formatCurrency(statistics.averageSuccessfulAmount),
      icon: Coins,
    },
  ]

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {cards.map((card) => (
        <StatCard
          key={card.label}
          label={card.label}
          value={card.value}
          icon={card.icon}
          intent='neutral'
        />
      ))}
    </div>
  )
}
