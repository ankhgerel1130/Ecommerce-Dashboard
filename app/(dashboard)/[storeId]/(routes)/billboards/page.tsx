import prismadb from "@/lib/prismadb";
import { BillboardClient } from "./components/client";

const BillboardPage = () => {


    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
               <BillboardClient />
            </div>
        </div>
    )
}

export default BillboardPage;