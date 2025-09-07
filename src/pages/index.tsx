import HomepageTemplate from '@/components/templates/homepage'

export default function Home() {
  const handlePropertyClick = (property: any) => {
    console.log('Property clicked:', property)
  }

  return <HomepageTemplate onPropertyClick={handlePropertyClick} />
}
