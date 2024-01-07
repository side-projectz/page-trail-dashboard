import Header from '@/components/header';
import { getServerSession } from 'next-auth';

export default async function Home() {

  const session= await getServerSession();

  return (
    <>
      <h1>Home</h1>
    </>
  )
}
