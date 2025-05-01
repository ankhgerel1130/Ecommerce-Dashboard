"use client";

import { Billboard } from "@prisma/client";
import { Heading } from "@/components/ui/Heading";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { SizeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/date-table";
import { ApiList } from "@/components/ui/api-list";


interface SizesClientProps{
    data?: SizeColumn[]
}
export const SizesClient: React.FC<SizesClientProps> = ({
    
    data = []}) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Sizes (${data.length})`} 
                    description="Sizes management"
                />
                <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Нэмэх
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data}/>
            <Heading title="API" description="Sizes Api" />
            <Separator />
            <ApiList entityName="sizes" entityIdName="sizeId"/>
        </>
    );
};
