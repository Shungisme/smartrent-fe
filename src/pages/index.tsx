import HomepageTemplate from '@/components/templates/homepage'
import { getInitialProperties } from '@/api/services/property.service'
import { GetServerSideProps } from 'next'

export default function Home({
  initialProperties,
}: {
  initialProperties: any[]
}) {
  const handlePropertyClick = (property: any) => {
    console.log('Property clicked:', property)
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
