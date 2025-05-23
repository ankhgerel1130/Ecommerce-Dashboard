"use client";

import { Billboard } from "@prisma/client";
import { Heading } from "@/components/ui/Heading";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { ColorColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/date-table";
import { ApiList } from "@/components/ui/api-list";


interface ColorsClientProps{
    data?: ColorColumn[]
}
export const ColorsClient: React.FC<ColorsClientProps> = ({
    
    data = []}) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Colors (${data.length})`} 
                    description="Colors management"
                />
                <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Нэмэх
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data}/>
            <Heading title="API" description="Colors Api" />
            <Separator />
            <ApiList entityName="colors" entityIdName="colorId"/>
        </>
    );
};
