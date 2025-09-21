import React from 'react'
import { Button } from '@/components/atoms/button'
import {
  ArrowLeft,
  Heart,
  BarChart3,
  Share,
  Download,
  MoreHorizontal,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu'

interface HeaderProps {
  onBack?: () => void
  onSave?: () => void
  onCompare?: () => void
  onShare?: () => void
  onExport?: () => void
  isSaved?: boolean
}

const Header: React.FC<HeaderProps> = ({
  onBack,
  onSave,
  onCompare,
  onShare,
  onExport,
  isSaved = false,
}) => {
  return (
    <div className='sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          {/* Left side - Back button */}
          <Button
            variant='ghost'
            className='flex items-center gap-2.5 hover:bg-accent/80 px-3 py-2.5 rounded-lg transition-all duration-200'
            onClick={onBack}
          >
            <ArrowLeft className='w-4 h-4' />
            <span className='hidden sm:inline font-medium'>Quay lại</span>
          </Button>

          {/* Right side - Action buttons */}
          <div className='flex items-center gap-3'>
            {/* Desktop buttons - visible on larger screens */}
            <div className='hidden md:flex items-center gap-2.5'>
              <Button
                variant='outline'
                size='sm'
                className={`flex items-center gap-2 px-3.5 py-2 h-9 rounded-lg border transition-all duration-200 ${isSaved ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'hover:bg-accent/50'}`}
                onClick={onSave}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                <span className='font-medium'>Lưu</span>
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-2 px-3.5 py-2 h-9 rounded-lg hover:bg-accent/50 transition-all duration-200'
                onClick={onCompare}
              >
                <BarChart3 className='w-4 h-4' />
                <span className='font-medium'>So sánh</span>
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-2 px-3.5 py-2 h-9 rounded-lg hover:bg-accent/50 transition-all duration-200'
                onClick={onShare}
              >
                <Share className='w-4 h-4' />
                <span className='font-medium'>Chia sẻ</span>
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-2 px-3.5 py-2 h-9 rounded-lg hover:bg-accent/50 transition-all duration-200'
                onClick={onExport}
              >
                <Download className='w-4 h-4' />
                <span className='font-medium'>Xuất file</span>
              </Button>
            </div>

            {/* Mobile dropdown - visible on smaller screens */}
            <div className='md:hidden'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='px-3 py-2.5 rounded-lg'
                  >
                    <MoreHorizontal className='w-4 h-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56 p-1'>
                  <DropdownMenuItem
                    onClick={onSave}
                    className='flex items-center gap-2.5 px-3 py-2.5 rounded-md'
                  >
                    <Heart
                      className={`w-4 h-4 ${isSaved ? 'fill-current text-red-600' : ''}`}
                    />
                    <span
                      className={`font-medium ${isSaved ? 'text-red-600' : ''}`}
                    >
                      Lưu
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onCompare}
                    className='flex items-center gap-2.5 px-3 py-2.5 rounded-md'
                  >
                    <BarChart3 className='w-4 h-4' />
                    <span className='font-medium'>So sánh</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onShare}
                    className='flex items-center gap-2.5 px-3 py-2.5 rounded-md'
                  >
                    <Share className='w-4 h-4' />
                    <span className='font-medium'>Chia sẻ</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onExport}
                    className='flex items-center gap-2.5 px-3 py-2.5 rounded-md'
                  >
                    <Download className='w-4 h-4' />
                    <span className='font-medium'>Xuất file</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
