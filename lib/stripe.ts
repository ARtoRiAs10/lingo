import Stripe from "stripe";


export const stripe = new Stripe(process.env.STRIPE_API_KEY!,{
    apiVersion : "2025-03-31.basil",
    typescript: true,
});



// async function getSubscriptionPeriodEnd(subscriptionId: string) {
//     try {
//       // Retrieve the subscription from Stripe
//       const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
//       // Use billing_cycle_anchor or calculate from subscription data
//       const billingCycleAnchor = subscription.billing_cycle_anchor;
  
//       if (billingCycleAnchor) {
//         // Convert to JavaScript Date
//         const currentPeriodEnd = new Date(billingCycleAnchor * 1000); // Stripe uses UNIX timestamp in seconds
//         console.log('Billing period ends on:', currentPeriodEnd.toISOString());
//         return currentPeriodEnd;
//       } else {
//         console.warn('No billing_cycle_anchor found on subscription.');
//         return null;
//       }
//     } catch (error) {
//       console.error('Error retrieving subscription:', error);
//       return null;
//     }
//   }