import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { productIds } = await req.json();
        const { storeId } = params;

        if (!productIds?.length) {
            return new NextResponse("Product IDs are required", { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: { id: { in: productIds } },
        });

        if (products.length !== productIds.length) {
            return new NextResponse("Some products not found", { status: 404 });
        }

        const line_items = products.map(product => ({
            quantity: 1,
            price_data: {
                currency: 'usd',
                product_data: { name: product.name },
                unit_amount: Math.round(product.price * 100),
            },
        }));

        const order = await prismadb.order.create({
            data: {
                storeId,
                isPaid: false,
                orderItems: {
                    create: productIds.map((productId: string) => ({
                        product: { connect: { id: productId } }
                    }))
                }
            }
        });

        // Create checkout session with proper metadata
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            billing_address_collection: 'required',
            phone_number_collection: { enabled: true },
            success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
            cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
            metadata: {
              orderId: order.id,
              storeId: storeId,
            },
          });
        return NextResponse.json({ url: session.url }, { headers: corsHeaders });

    } catch (error) {
        console.error('[CHECKOUT_ERROR]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}