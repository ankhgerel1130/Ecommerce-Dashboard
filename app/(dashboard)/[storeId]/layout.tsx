import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import Navbar from '@/components/navbar';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  // Await auth() to get userId
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
    return null; // Prevent further rendering after redirect
  }

  // Await the params storeId (params is passed directly into the layout, so we use it directly)
  const { storeId } = params;

  // Fetch the store associated with the storeId and userId
  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  // If no store is found, redirect to home
  if (!store) {
    redirect('/');
    return null; // Prevent further rendering after redirect
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
