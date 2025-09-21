import HomepageTemplate from '@/components/templates/homepage'
import { getInitialProperties } from '@/api/services/property.service'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { PropertyCard } from '@/api/types/property.type'

export default function Home({
  initialProperties,
}: {
  initialProperties: any[]
}) {
  const router = useRouter()

  const handlePropertyClick = (property: PropertyCard) => {
    console.log('Property clicked:', property)
    // Navigate to apartment detail page with property ID
    router.push(`/apartment-detail/123`)
  }

  return (
    <HomepageTemplate
      onPropertyClick={handlePropertyClick}
      initialProperties={initialProperties}
    />
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const initialProperties = await getInitialProperties()

    return {
      props: {
        initialProperties,
      },
    }
  } catch (error) {
    console.error('Error fetching initial properties:', error)

    return {
      props: {
        initialProperties: [],
      },
    }
  }
}
