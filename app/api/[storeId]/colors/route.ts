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
        const { name, value } = body; // Store name body goor yvulah

        if (!name) {
            return new NextResponse("name is required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("value is required", { status: 400 });
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
        const color = await prismadb.color.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        });

        return NextResponse.json(color, { status: 201 });

    } catch (error) {
        console.error("[COLORS_POST]", error);
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
        const colors = await prismadb.color.findMany({
            where: {
               storeId: params.storeId,
            }
        });

        return NextResponse.json(colors);

    } catch (error) {
        console.error("[COLORS_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};
