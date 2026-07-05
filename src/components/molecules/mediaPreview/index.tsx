import Image from 'next/image'
import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getMediaKind,
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
} from '@/utils/media'

const PlayBadge = () => (
  <div className='pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20'>
    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white'>
      <Play className='h-4 w-4 fill-current' />
    </div>
  </div>
)

interface MediaThumbnailProps {
  src: string
  alt: string
  className?: string
}

/**
 * Small preview tile for a media URL — used for grid/table thumbnails.
 * Must be placed inside a `relative`, explicitly-sized parent (it fills it).
 * Images render as-is; direct video files show their first frame; YouTube
 * links show the official YouTube thumbnail. Video/YouTube get a play badge.
 */
export const MediaThumbnail: React.FC<MediaThumbnailProps> = ({
  src,
  alt,
  className,
}) => {
  const kind = getMediaKind(src)

  if (kind === 'youtube') {
    const thumbnailUrl = getYouTubeThumbnailUrl(src) ?? src
    return (
      <>
        <Image
          src={thumbnailUrl}
          alt={alt}
          fill
          className={cn('object-cover', className)}
        />
        <PlayBadge />
      </>
    )
  }

  if (kind === 'video') {
    return (
      <>
        <video
          src={src}
          muted
          playsInline
          preload='metadata'
          className={cn('h-full w-full object-cover', className)}
        />
        <PlayBadge />
      </>
    )
  }

  return (
    <Image src={src} alt={alt} fill className={cn('object-cover', className)} />
  )
}

interface MediaPlayerProps {
  src: string
  alt: string
  className?: string
}

/**
 * Full-size media viewer — used by the post lightbox. Renders an image,
 * a playable `<video>` for direct video files, or an embedded YouTube player.
 */
export const MediaPlayer: React.FC<MediaPlayerProps> = ({
  src,
  alt,
  className,
}) => {
  const kind = getMediaKind(src)

  if (kind === 'youtube') {
    const embedUrl = getYouTubeEmbedUrl(src)
    if (embedUrl) {
      return (
        <iframe
          src={embedUrl}
          title={alt}
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          className={cn(
            'aspect-video w-full max-w-full max-h-full rounded-lg',
            className,
          )}
        />
      )
    }
  }

  if (kind === 'video') {
    return (
      <video
        src={src}
        controls
        className={cn('max-h-full max-w-full', className)}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={1920}
      height={1080}
      className={cn('max-h-full max-w-full object-contain', className)}
    />
  )
}
