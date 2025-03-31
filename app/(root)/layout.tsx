import { auth } from '@clerk/nextjs/server'; // Correct import for server-side auth
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth(); 

  // Auth hiigegu bl sign in ruu yvulah
  if (!userId) {
    redirect('/sign-in');
    return null; 
  }



  // Hereglegchid bga store iig shalgah
  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  // Store bvl dashboard ruu yvulah
  if (store) {
    redirect(`/${store.id}`);
    return null; 
  }

  return (
    <>
      <div>This will be Nav</div>
      {children}
    </>
  );
}
