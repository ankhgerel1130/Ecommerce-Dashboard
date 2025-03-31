import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb"; // Import hiih

export async function POST(
    req: Request,
    { params }: {params: {storeId: string}}
    ) {
    try {
        const authData = await auth(); 
        const userId = authData.userId; 
      
        // Hereglech burtgeltei eseh
        if (!userId) {
            return new NextResponse("Unathent", { status: 401 });
        }

        const body = await req.json();
        const { name, billboardId } = body; // Store name body goor yvulah

        if (!name) {
            return new NextResponse("name is required", { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse("billboardId is required", { status: 400 });
        }

         if(!params.storeId){
            return new NextResponse("Store id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });
        if(!storeByUserId){
            return new NextResponse("Unauth", {status: 403});

        }
         

        // Store databased hadgalah
        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId
            }
        });

        return NextResponse.json(category, { status: 201 });

    } catch (error) {
        console.error("[CATEGORIES_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};


export async function GET(
    req: Request,
    { params }: {params: {storeId: string}}
    ) {
    try {
        
         if(!params.storeId){
            return new NextResponse("Store id is required", { status: 400 });
        }

        // Store databased hadgalah
        const categories = await prismadb.category.findMany({
            where: {
               storeId: params.storeId,
            }
        });

        return NextResponse.json(categories);

    } catch (error) {
        console.error("[CATEGORIES_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};
