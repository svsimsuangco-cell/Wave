import { NextRequest, NextResponse } from 'next/server';
import { JwtPayload } from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Plan from '@/models/Plan';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/auth';
import { createPayPalOrder } from '@/lib/paypal';

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

    const decoded = await verifyToken(token) as JwtPayload;
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

    // Fetch all plans and calculate total
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

      if (billingPeriod === 'yearly') {
        price = Math.round((plan.basePricePerMonth || plan.monthlyPrice) * 12 * 0.8 * 100) / 100;
      } else {
        price = Math.round((plan.basePricePerMonth || plan.monthlyPrice) * 100) / 100;
      }

      totalPrice += price * (item.quantity || 1);

      orderItems.push({
        planId: plan._id.toString(),
        quantity: item.quantity || 1,
        price,
      });
    }

    // Create PayPal order
    const paypalOrder = await createPayPalOrder(totalPrice.toFixed(2));

    // Create order in database with status 'pending'
    const orderNumber = `ORD-${Date.now()}`;
    const order = await Order.create({
      userId: decoded.userId,
      orderNumber,
      items: orderItems,
      totalPrice,
      status: 'pending',
      paymentMethod: 'paypal',
      paypalOrderId: paypalOrder.id,
      billingInfo: {
        billingPeriod,
      },
    });

    // Find the approval link
    const approvalLink = paypalOrder.links.find(link => link.rel === 'approve')?.href;

    return NextResponse.json(
      { 
        success: true, 
        data: { 
          orderId: paypalOrder.id,
          approvalUrl: approvalLink,
          dbOrderId: order._id
        } 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PayPal checkout error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
