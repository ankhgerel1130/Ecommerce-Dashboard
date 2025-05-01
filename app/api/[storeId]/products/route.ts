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
        const { 
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            description,
            quality,
            isFeatured,
            isArchived
        } = body; //  body goor yvulah

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }
        if (!images || !images.length) {

            return new NextResponse("ImageUrl is required", { status: 400 });
        }
        if (!categoryId) {
            return new NextResponse("Category is required", { status: 400 });
        }
        if (!sizeId) {
            return new NextResponse("Size is required", { status: 400 });
        }
        if (!colorId) {
            return new NextResponse("Color is required", { status: 400 });
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
        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                colorId,
                sizeId,
                description,
                quality,
                
                storeId: params.storeId,
                images: {
                    createMany:{
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product, { status: 201 });

    } catch (error) {
        console.error("[PRODUCTS_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};


export async function GET(
    req: Request,
    { params }: {params: {storeId: string}}
    ) {
    try {

        const {searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured") || undefined;
        const excludeId = searchParams.get("excludeId") || undefined;
        
         if(!params.storeId){
            return new NextResponse("Store id is required", { status: 400 });
        }

        // Store databased hadgalah
        const products = await prismadb.product.findMany({
            where: {
               storeId: params.storeId,
               categoryId,
               colorId,
               sizeId,
               isFeatured: isFeatured ? true : undefined,
               isArchived: false,
               NOT: excludeId ? { id: excludeId } : undefined
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true

            },

            orderBy: {
                createdAt: 'desc'
            }

        });

        return NextResponse.json(products);

    } catch (error) {
        console.error("[PRODUCTS_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};
