import { UserButton } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-swticher";
import { redirect } from "next/navigation"; // Assuming you're using Next.js 13+
import { auth } from '@clerk/nextjs/server';
import prismadb from "@/lib/prismadb";

const Navbar = async () => {
  // Await auth() to get the user data
  const { userId } = await auth();

  if (!userId) {
    // Redirect if userId is not found
    redirect("/sign-in");
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
    
      <div className="flex h-16 items-center px-4 justify-between">
        {/* Store Swticher */}
        <div className="flex items-center">
          <StoreSwitcher items={stores} /> {/*Storeg Storeswitcher ruu yvulj bn */}
        </div>

        {/* Route heseg */}
        <div className="flex items-center space-x-4">

        </div>
        
        <MainNav className="mx-6" />
        
    
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSwitchSessionUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
