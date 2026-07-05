export type MediaKind = 'image' | 'video' | 'youtube'

const VIDEO_EXTENSIONS = [
  '.mp4',
  '.webm',
  '.ogg',
  '.ogv',
  '.mov',
  '.m4v',
  '.avi',
  '.mkv',
  '.3gp',
]

const YOUTUBE_ID_PATTERN =
  /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/i

export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null
  const match = url.match(YOUTUBE_ID_PATTERN)
  return match ? match[1] : null
}

export function isYouTubeUrl(url: string): boolean {
  return getYouTubeVideoId(url) !== null
}

export function isVideoFileUrl(url: string): boolean {
  if (!url) return false
  const clean = url.split('?')[0].split('#')[0].toLowerCase()
  return VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext))
}

export function getMediaKind(url: string): MediaKind {
  if (!url) return 'image'
  if (isYouTubeUrl(url)) return 'youtube'
  if (isVideoFileUrl(url)) return 'video'
  return 'image'
}

/** Public YouTube thumbnail image for a video/shorts/embed URL, or null if not YouTube. */
export function getYouTubeThumbnailUrl(url: string): string | null {
  const id = getYouTubeVideoId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

/** Embeddable player URL for a YouTube video/shorts/embed URL, or null if not YouTube. */
export function getYouTubeEmbedUrl(url: string): string | null {
  const id = getYouTubeVideoId(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}
