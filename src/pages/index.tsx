import { GetServerSideProps } from 'next'

// Redirect root to admin dashboard
export default function Home() {
  return null
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/admin',
      permanent: false,
    },
  }
}
