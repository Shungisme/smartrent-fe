export const formatCurrency = (amount: number): string => {
  const formatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount)
  return formatted.replace('₫', '').trim() + '₫'
}
