import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import Plan from '@/models/Plan';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Get user ID from auth token
    const token = request.cookies.get('auth')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { cartItems, billingPeriod = 'monthly' } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Fetch all plans and create line items
    const lineItems = [];
    let totalPrice = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const plan = await Plan.findById(item.planId);
      if (!plan) {
        return NextResponse.json(
          { success: false, error: `Plan ${item.planId} not found` },
          { status: 404 }
        );
      }

      let price: number;
      let description: string;

      if (billingPeriod === 'yearly') {
        price = Math.round((plan.basePricePerMonth || plan.monthlyPrice) * 12 * 0.8 * 100);
        description = `${plan.name} - Annual Billing (20% discount)`;
      } else {
        price = Math.round((plan.basePricePerMonth || plan.monthlyPrice) * 100);
        description = `${plan.name} - Monthly Billing`;
      }

      totalPrice += price / 100; // Add to total in dollars

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: plan.name,
            description: description,
            metadata: {
              planId: plan._id.toString(),
              billingPeriod: billingPeriod,
            },
          },
          unit_amount: price,
          recurring: {
            interval: billingPeriod === 'yearly' ? 'year' : 'month',
          },
        },
        quantity: item.quantity || 1,
      });

      orderItems.push({
        planId: plan._id.toString(),
        quantity: item.quantity || 1,
        price: price / 100,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
    });

    // Create order in database with status 'pending'
    const orderNumber = `ORD-${Date.now()}`;
    const order = await Order.create({
      userId: decoded.userId,
      orderNumber,
      items: orderItems,
      totalPrice,
      status: 'pending',
      stripeSessionId: session.id,
      billingInfo: {
        billingPeriod,
      },
    });

    return NextResponse.json(
      { success: true, data: { sessionId: session.id, url: session.url, orderId: order._id } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
