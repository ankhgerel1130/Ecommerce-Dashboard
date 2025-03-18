import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb"; // Import hiih

export async function POST(req: Request) {
    try {
        const authData = await auth(); 
        const userId = authData.userId; 
      
        // Hereglech burtgeltei eseh
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name } = body; // Store name body goor yvulah

        if (!name) {
            return new NextResponse("Store name is required", { status: 400 });
        }

        // Store databased hadgalah
        const store = await prismadb.store.create({
            data: {
                name,
                userId,
            },
        });

        return NextResponse.json(store, { status: 201 });

    } catch (error) {
        console.error("[STORES_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
