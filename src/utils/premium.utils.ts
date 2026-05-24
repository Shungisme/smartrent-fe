export const getTierColor = (tierCode: string): string => {
  const colors: Record<string, string> = {
    NORMAL: 'bg-gray-100 text-gray-700',
    SILVER: 'bg-blue-100 text-blue-700',
    GOLD: 'bg-purple-100 text-purple-700',
    DIAMOND: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
  }
  return colors[tierCode] || 'bg-gray-100 text-gray-700'
}
