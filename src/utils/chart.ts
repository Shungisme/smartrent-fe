export const formatChartXLabel = (
  label: string,
  granularity: 'DAY' | 'MONTH',
): string => {
  if (granularity === 'MONTH') {
    const [year, month] = label.split('-')
    return `T${month}/${year}`
  }
  return label.length > 5 ? label.slice(5) : label
}

export const formatChartTick = (value: string | number): string => {
  if (typeof value !== 'number') return String(value)
  if (Math.abs(value) < 1000) return value.toLocaleString('vi-VN')
  return new Intl.NumberFormat('vi-VN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}
