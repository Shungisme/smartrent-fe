export type TierVisualStyle = {
  chip: string
  icon: string
  badge: string
}

export const TIER_STYLES: Record<string, TierVisualStyle> = {
  NORMAL: {
    chip: 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300',
    icon: 'text-slate-500',
    badge:
      'border-slate-200/70 bg-slate-50 text-slate-700 dark:border-slate-500/30 dark:bg-slate-500/10 dark:text-slate-300',
  },
  SILVER: {
    chip: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    icon: 'text-sky-500',
    badge:
      'border-sky-200/70 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300',
  },
  GOLD: {
    chip: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    icon: 'text-amber-500',
    badge:
      'border-amber-200/70 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300',
  },
  DIAMOND: {
    chip: 'bg-gradient-to-br from-rose-100 to-orange-100 text-rose-700 dark:from-rose-500/15 dark:to-orange-500/15 dark:text-rose-300',
    icon: 'text-rose-500',
    badge:
      'border-transparent bg-gradient-to-r from-rose-500 to-orange-500 text-white',
  },
}

export const FALLBACK_TIER_STYLE = TIER_STYLES.NORMAL

export type TierStyle = {
  accent: string
  ring: string
  title: string
  price: string
  badge: string
}

export const tierStyles: Record<string, TierStyle> = {
  NORMAL: {
    accent: 'bg-slate-400',
    ring: 'ring-slate-200',
    title: 'text-slate-700',
    price: 'text-slate-900',
    badge: 'bg-slate-100 text-slate-700',
  },
  SILVER: {
    accent: 'bg-sky-500',
    ring: 'ring-sky-200',
    title: 'text-sky-700',
    price: 'text-sky-700',
    badge: 'bg-sky-100 text-sky-700',
  },
  GOLD: {
    accent: 'bg-amber-500',
    ring: 'ring-amber-200',
    title: 'text-amber-700',
    price: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
  },
  DIAMOND: {
    accent: 'bg-gradient-to-r from-rose-500 to-orange-500',
    ring: 'ring-rose-200',
    title: 'text-rose-700',
    price: 'text-rose-600',
    badge:
      'bg-gradient-to-r from-rose-500 to-orange-500 text-white border-transparent',
  },
}

export const fallbackStyle: TierStyle = {
  accent: 'bg-slate-400',
  ring: 'ring-slate-200',
  title: 'text-slate-700',
  price: 'text-slate-900',
  badge: 'bg-slate-100 text-slate-700',
}
