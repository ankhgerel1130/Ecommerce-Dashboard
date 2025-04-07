"use client";

import { Billboard } from "@prisma/client";
import { Heading } from "@/components/ui/Heading";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/date-table";
import { ApiList } from "@/components/ui/api-list";


interface OrderClientProps{
    data?: OrderColumn[]
}
export const OrderClient: React.FC<OrderClientProps> = ({
    
    data = []}) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
                <Heading 
                    title={`Orders (${data.length})`} 
                    description="Orders management"
                />

            <Separator />
            <DataTable searchKey="products" columns={columns} data={data}/>
         
        </>
    );
};
