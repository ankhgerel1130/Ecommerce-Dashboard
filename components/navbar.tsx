import { UserButton } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-swticher";
import { redirect } from "next/navigation";
import { auth } from '@clerk/nextjs/server';
import prismadb from "@/lib/prismadb";
import { ThemeToggle } from "@/components/theme-toggle";

const Navbar = async () => {

  const { userId } = await auth();

  if (!userId) {
 
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
          <StoreSwitcher items={stores} /> {/*Storeg Storeswitcher ruu yvulah*/}
        </div>

        {/* Route heseg */}
        <div className="flex items-center space-x-4">

        </div>
        
        <MainNav className="mx-6" />
        
    
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle/>
          <UserButton afterSwitchSessionUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
