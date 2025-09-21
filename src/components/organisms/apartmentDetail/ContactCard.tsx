import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'
import { Avatar } from '@/components/atoms/avatar'
import { Typography } from '@/components/atoms/typography'
import { Phone, MessageCircle } from 'lucide-react'
import { HostInfo } from '@/types/apartmentDetail.types'
import Image from 'next/image'

interface ContactCardProps {
  host: HostInfo
  availability?: {
    status: 'available' | 'unavailable' | 'pending'
    message: string
  }
  onCall?: () => void
  onMessage?: () => void
}

const ContactCard: React.FC<ContactCardProps> = ({
  host,
  availability,
  onCall,
  onMessage,
}) => {
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'unavailable':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className='w-full'>
      <CardHeader className='pb-4'>
        <CardTitle className='text-lg font-semibold'>
          Thông tin liên hệ
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-5'>
        {/* Host Information */}
        <div className='flex items-center space-x-3.5'>
          <Avatar className='w-12 h-12'>
            {host.avatar ? (
              <Image
                src={host.avatar}
                alt={host.name}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold'>
                {getInitials(host.name)}
              </div>
            )}
          </Avatar>
          <div className='flex-1'>
            <Typography
              variant='h6'
              className='font-semibold text-foreground mb-1'
            >
              {host.name}
            </Typography>
            <div className='flex items-center space-x-2.5'>
              <Typography variant='small' className='text-muted-foreground'>
                {host.role}
              </Typography>
              {host.isOnline && (
                <div className='flex items-center gap-1.5'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  <Typography
                    variant='small'
                    className='text-green-600 font-medium'
                  >
                    Online
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex space-x-3'>
          <Button
            className='flex-1 bg-black hover:bg-black/90 text-white h-10 font-medium'
            onClick={onCall}
          >
            <Phone className='w-4 h-4 mr-2.5' />
            Call
          </Button>
          <Button
            variant='outline'
            className='flex-1 h-10 font-medium'
            onClick={onMessage}
          >
            <MessageCircle className='w-4 h-4 mr-2.5' />
            Message
          </Button>
        </div>

        {/* Phone Number */}
        <div className='bg-gray-50 rounded-lg p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <Typography variant='small' className='font-semibold mb-1'>
                {host.maskedPhone}
              </Typography>
              <Typography
                variant='small'
                className='text-muted-foreground text-xs leading-relaxed'
              >
                {`Press 'Call' to see full number`}
              </Typography>
            </div>
            <Phone className='w-4 h-4 text-muted-foreground' />
          </div>
        </div>

        {/* Availability Status */}
        {availability && (
          <Badge
            className={`w-full justify-center py-3 px-4 text-sm font-medium border-2 ${getAvailabilityColor(availability.status)}`}
          >
            {availability.message}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

export default ContactCard
