import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json(
      { error: 'Missing stripe-signature' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  await dbConnect();

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutComplete(session);
      break;

    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdate(subscription);
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(deletedSubscription);
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  try {
    // Find order by Stripe session ID and update status to completed
    const order = await Order.findOneAndUpdate(
      { stripeSessionId: session.id },
      {
        status: 'completed',
        billingInfo: {
          email: session.customer_email || '',
        },
      },
      { new: true }
    );

    if (order) {
      console.log('Order updated to completed:', order._id);
    } else {
      console.log('No order found for session:', session.id);
    }
  } catch (error) {
    console.error('Error handling checkout complete:', error);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  try {
    console.log('Subscription updated:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    console.log('Subscription deleted:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}
