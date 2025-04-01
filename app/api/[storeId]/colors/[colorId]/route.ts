import prismadb from "@/lib/prismadb";
import { auth } from '@clerk/nextjs/server';
import { Label } from "@radix-ui/react-label";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { colorId: string } }
) {
    try {
       

        if (!params.colorId) {
            return new NextResponse("Size id is required", { status: 400 });
        }

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId,
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.log('[COLORS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, colorId: string } }
) {
    try {
        const user = await auth(); 
        const { userId } = user; 

        const body = await req.json();
        const { name, value } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Size name is required", { status: 400 });
        }
        if (!value) {
            return new NextResponse("Size value is required", { status: 400 });
        }

        if (!params.colorId) {
            return new NextResponse("Color id is required", { status: 400 });
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


        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
                
            },
            data: {
               name,
               value
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.log('[COLOR_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, colorId: string } }
) {
    try {
        const user = await auth();
        const { userId } = user; 


        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }


        if (!params.colorId) {
            return new NextResponse("Color id is required", { status: 400 });
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

        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId,
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.log('[COLOR_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};
