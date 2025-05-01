import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const relevantEvents = new Set([
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
]);
export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature")!;

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Webhook error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log(`🔔 Webhook type: ${event.type}`);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Debugging logs
    console.log("Payment status:", session.payment_status);
    console.log("Session metadata:", session.metadata);

    if (!session.metadata?.orderId) {
      console.warn("⚠️ No orderId in metadata - this is expected for test triggers");
      console.log("For testing, you can manually handle this case");
      return NextResponse.json({ received: true, warning: "No orderId in metadata" }, { status: 200 });
    }

    // Actual order processing
    try {
      await prismadb.order.update({
        where: { id: session.metadata.orderId },
        data: {
          isPaid: true,
          address: session.customer_details?.address 
            ? `${session.customer_details.address.line1}, ${session.customer_details.address.city}`
            : null,
          phone: session.customer_details?.phone || null,
        },
      });
      console.log(`✅ Updated order ${session.metadata.orderId}`);
    } catch (error) {
      console.error("❌ Order update failed:", error);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}