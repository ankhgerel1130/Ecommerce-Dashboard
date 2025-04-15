import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const relevantEvents = new Set([
  "checkout.session.completed",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`[STRIPE_WEBHOOK_ERROR]`, err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        // Check if orderId is attached to metadata
        const orderId = session.metadata?.orderId;

        if (!orderId) {
          console.error("Missing orderId in metadata");
          return new NextResponse("Missing orderId", { status: 400 });
        }

        await prismadb.order.update({
          where: {
            id: orderId,
          },
          data: {
            isPaid: true,
          },
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        });

        console.log(`✅ Order ${orderId} marked as paid.`);
      }
    } catch (error) {
      console.error(`[WEBHOOK_HANDLER_ERROR]`, error);
      return new NextResponse("Webhook handler failed", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
