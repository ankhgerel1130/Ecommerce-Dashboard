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
        const { label, imageUrl } = body; // Store name body goor yvulah

        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse("ImageUrl is required", { status: 400 });
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
        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboard, { status: 201 });

    } catch (error) {
        console.error("[BILLBOARDS_POST]", error);
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
        const billboards = await prismadb.billboard.findMany({
            where: {
               storeId: params.storeId,
            }
        });

        return NextResponse.json(billboards);

    } catch (error) {
        console.error("[BILLBOARDS_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};
