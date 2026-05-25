import * as React from 'react'
import { Avatar } from '@/components/atoms/avatar'
import { cn } from '@/lib/utils'

interface InitialsAvatarProps {
  name: string
  /** Optional image src. If provided and loads successfully, image is shown. */
  src?: string | null
  className?: string
  /** Visual size variant. */
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_MAP = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
} as const

// Deterministic palette derived from name → stable colors per identity.
const GRADIENTS = [
  'from-violet-500 to-fuchsia-500',
  'from-sky-500 to-blue-600',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-indigo-500 to-purple-500',
  'from-cyan-500 to-sky-500',
  'from-lime-500 to-emerald-500',
] as const

function hash(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0
  }
  return h
}

function initialsFrom(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return '?'
  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function InitialsAvatar({
  name,
  src,
  className,
  size = 'md',
}: InitialsAvatarProps) {
  const [imgFailed, setImgFailed] = React.useState(false)
  const initials = initialsFrom(name)
  const gradient = GRADIENTS[hash(name || 'unknown') % GRADIENTS.length]
  const showImage = !!src && !imgFailed && !src.includes('default-image')

  return (
    <Avatar className={cn(SIZE_MAP[size], 'shrink-0', className)}>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt={name}
          onError={() => setImgFailed(true)}
          className='h-full w-full object-cover'
        />
      ) : (
        <div
          aria-hidden
          className={cn(
            'flex h-full w-full items-center justify-center bg-gradient-to-br font-semibold text-white',
            gradient,
          )}
        >
          {initials}
        </div>
      )}
    </Avatar>
  )
}

export default InitialsAvatar
