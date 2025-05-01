"use client";

import { Billboard } from "@prisma/client";
import { Heading } from "@/components/ui/Heading";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/date-table";
import { ApiList } from "@/components/ui/api-list";


interface CategoryClientProps{
    data?: CategoryColumn[]
}
export const CategoryClient: React.FC<CategoryClientProps> = ({
    
    data = []}) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Categories (${data.length})`} 
                    description="Category management"
                />
                <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Нэмэх
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data}/>
            <Heading title="API" description="Category Api" />
            <Separator />
            <ApiList entityName="categories" entityIdName="categoryId"/>
        </>
    );
};
