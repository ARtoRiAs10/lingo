import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";

import db from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
    return new NextResponse(`Webhook error ${JSON.stringify(error)}`, {
      status: 400,
    });
  }

  console.log("Event type:", event.type);

  // checkout.session.completed → initial subscription created
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (!session?.metadata?.userId || !session?.subscription) {
      return new NextResponse("Missing required session metadata or subscription.", { status: 400 });
    }

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    let currentPeriodEnd: Date | null = null;

    if (subscription.latest_invoice) {
      const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);
      currentPeriodEnd = new Date(invoice.period_end * 1000);
    } else if (subscription.billing_cycle_anchor) {
      currentPeriodEnd = new Date(subscription.billing_cycle_anchor * 1000);
    }

    if (!currentPeriodEnd || isNaN(currentPeriodEnd.getTime())) {
      console.error("Invalid currentPeriodEnd on checkout:", currentPeriodEnd);
      return new NextResponse("Invalid currentPeriodEnd", { status: 400 });
    }

    await db.insert(userSubscription).values({
      userId: session.metadata.userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: currentPeriodEnd,
    });
  }

  // invoice.payment_succeeded → subscription renewal
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;

    if (!invoice.subscription) {
      return new NextResponse("Subscription ID missing in invoice.", { status: 400 });
    }

    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);

    let currentPeriodEnd: Date | null = null;

    if (invoice.period_end) {
      currentPeriodEnd = new Date(invoice.period_end * 1000);
    } else if (subscription.billing_cycle_anchor) {
      currentPeriodEnd = new Date(subscription.billing_cycle_anchor * 1000);
    }

    if (!currentPeriodEnd || isNaN(currentPeriodEnd.getTime())) {
      console.error("Invalid currentPeriodEnd on invoice:", currentPeriodEnd);
      return new NextResponse("Invalid currentPeriodEnd", { status: 400 });
    }

    await db
      .update(userSubscription)
      .set({
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: currentPeriodEnd,
      })
      .where(eq(userSubscription.stripeSubscriptionId, subscription.id));
  }

  return new NextResponse(null, { status: 200 });
}
