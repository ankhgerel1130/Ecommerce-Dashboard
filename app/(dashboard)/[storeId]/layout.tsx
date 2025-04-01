import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import Navbar from '@/components/navbar';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId?: string }; 
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
    return null;
  }

  if (!params?.storeId) {
    redirect('/');
    return null;
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect('/');
    return null;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
