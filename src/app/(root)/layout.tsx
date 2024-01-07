import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './../globals.css'
import SessionProvider from '@/components/providers/SessionProvider';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Header from '@/components/header';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Page Trail',
  description: 'PageTrails is designed to enhance productivity by tracking time spent on various websites',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getServerSession();

  if (!session)
    redirect('/api/auth/signin');

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body className={inter.className}>
          <Header />
          <main className="container mx-auto px-4 py-2">
            {children}
          </main>
        </body>
      </SessionProvider>
    </html>
  )
}